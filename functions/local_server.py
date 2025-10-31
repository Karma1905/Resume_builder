from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import os

from utils import process_resume_file, analyze_match, generate_cover_letter, critique_resume
import pytesseract
from pdf2image import convert_from_bytes
import pdfplumber
import docx
import cv2
import numpy as np


pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
POPPLER_PATH = r'D:\Projects\Release-25.07.0-0\poppler-25.07.0\Library\bin' # <-- Use your correct path here

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}, r"/*": {"origins": "*"}})

@app.route("/")
def home():
    return jsonify({"message": "✅ Local AI server running successfully."})


def preprocess_image_for_ocr(image):
    """
    Cleans up an image (from pdf2image) to improve OCR accuracy.
    """
    open_cv_image = np.array(image) 
    gray = cv2.cvtColor(open_cv_image, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    thresh = cv2.medianBlur(thresh, 3)
    return thresh

def extract_text_from_pdf(file_stream):
    """
    Robust PDF text extraction.
    Tries fast digital extraction first, then falls back to slow, preprocessed OCR.
    """
    text = ""
    try:
        file_stream.seek(0)
        with pdfplumber.open(file_stream) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        
        if text and len(text.strip()) > 20: 
            print("--- Extracted text with pdfplumber (fast mode) ---")
            return text
    except Exception as e:
        print(f"pdfplumber failed: {e}. Trying OCR.")

    print("--- pdfplumber returned no text. Attempting OCR (slower) ---")
    try:
        file_stream.seek(0)
        images = convert_from_bytes(file_stream.read(), poppler_path=POPPLER_PATH, dpi=300)
        ocr_text = ""
        for image in images:
            cleaned_image = preprocess_image_for_ocr(image)
            ocr_text += pytesseract.image_to_string(cleaned_image, config='--psm 6')
        
        if ocr_text and len(ocr_text.strip()) > 20:
            print("--- Extracted text with Tesseract OCR (Preprocessed) ---")
            return ocr_text
        else:
            print("--- OCR also returned no text ---")
            return None
    except Exception as ocr_error:
        print(f"--- Tesseract OCR error: {ocr_error} ---")
        return None

def extract_text_from_docx(file_stream):
    """Helper function to extract text from a DOCX."""
    try:
        doc = docx.Document(file_stream)
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    except Exception as e:
        print(f"Error reading DOCX: {e}")
        return None

# 1. AI Resume Parser Endpoint
@app.route("/aiResumeParser", methods=["POST"])
def ai_resume_parser():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        uploaded_file = request.files["file"]
        model_choice = request.form.get("model_choice", "Llama 3.1")
        original_filename = uploaded_file.filename
        
        raw_text = ""
        if original_filename.endswith('.pdf'):
            raw_text = extract_text_from_pdf(uploaded_file.stream)
        elif original_filename.endswith('.docx'):
            raw_text = extract_text_from_docx(uploaded_file.stream)
        elif original_filename.endswith('.txt'):
            raw_text = uploaded_file.stream.read().decode('utf-8')
        else:
            return jsonify({"error": "Unsupported file type."}), 400

        if raw_text is None or len(raw_text.strip()) < 20:
            return jsonify({"error": "Could not extract any text."}), 400

        
        tmp_path = ""
        with tempfile.NamedTemporaryFile(delete=False, mode='w', encoding='utf-8', suffix=".txt") as tmp:
            tmp.write(raw_text)
            tmp_path = tmp.name

        result = {}
        with open(tmp_path, "rb") as f:
            result = process_resume_file(f, model_choice, "resume.txt")

        os.remove(tmp_path)
        return jsonify(result)

    except Exception as e:
        print(f"Error in /aiResumeParser: {e}")
        return jsonify({"error": str(e)}), 500


# 2. Job Matcher Endpoint
@app.route("/aiJobMatcher", methods=["POST"])
def ai_job_matcher():
    try:
        data = request.get_json()
        resume_text = data.get("resume") or data.get("resume_text", "")
        jd_text = data.get("job_description") or data.get("jd_text", "")
        if not resume_text or not jd_text:
            return jsonify({"error": "Missing resume or job description"}), 400
        result = analyze_match(resume_text, jd_text)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ✍️ 3. Cover Letter Generator
@app.route("/aiCoverLetter", methods=["POST"])
def ai_cover_letter():
    try:
        data = request.get_json()
        resume_text = data.get("resume") or data.get("resume_text", "")
        jd_text = data.get("job_description") or data.get("jd_text", "")
        user_name = data.get("user_name", "the candidate")
        if not resume_text or not jd_text:
            return jsonify({"error": "Missing resume or job description"}), 400
        result = generate_cover_letter(resume_text, jd_text, user_name)
        return jsonify({"cover_letter": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#  extraction-only endpoint (for Job Matcher)
@app.route("/api/extract-text", methods=["POST"])
def extract_resume_text():
    """
    API endpoint to extract raw text from an uploaded resume file.
    """
    if 'resumeFile' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['resumeFile']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    text = ""
    filename = file.filename
    try:
        if filename.endswith('.pdf'):
            text = extract_text_from_pdf(file.stream)
        elif filename.endswith('.docx'):
            text = extract_text_from_docx(file.stream)
        else:
            return jsonify({"error": "Unsupported file type. Please upload a .pdf or .docx"}), 400
        if text is None or len(text.strip()) == 0:
            return jsonify({"error": "Could not extract any text from this file."}), 500
        return jsonify({"text": text})
    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({"error": "An internal error occurred"}), 500

# 🧐 6. NEW Resume Critique Endpoint
@app.route("/api/critique-resume", methods=["POST"])
def ai_resume_critique():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        uploaded_file = request.files["file"]
        original_filename = uploaded_file.filename

        raw_text = ""
        if original_filename.endswith('.pdf'):
            raw_text = extract_text_from_pdf(uploaded_file.stream)
        elif original_filename.endswith('.docx'):
            raw_text = extract_text_from_docx(uploaded_file.stream)
        elif original_filename.endswith('.txt'):
            raw_text = uploaded_file.stream.read().decode('utf-8')
        else:
            return jsonify({"error": "Unsupported file type."}), 400

        if raw_text is None or len(raw_text.strip()) < 20:
            return jsonify({"error": "Could not extract any text."}), 400

        result = critique_resume(raw_text)
        return jsonify(result)

    except Exception as e:
        print(f"Error in /api/critique-resume: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Runs on http://localhost:5000 by default 
    app.run(debug=True, port=5000)