from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import os

from utils import process_resume_file, analyze_match, generate_cover_letter

app = Flask(__name__)
CORS(app)  # Allow requests from React (localhost:3000 by default)

@app.route("/")
def home():
    return jsonify({"message": "✅ Local AI server running successfully."})


# -------------------------------
# 📄 1. AI Resume Parser Endpoint
# -------------------------------
@app.route("/aiResumeParser", methods=["POST"])
def ai_resume_parser():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        uploaded_file = request.files["file"]
        model_choice = request.form.get("model_choice", "Llama 3.1")
        original_filename = uploaded_file.filename  # ✅ capture original filename

        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            uploaded_file.save(tmp.name)
            tmp_path = tmp.name

        # Reopen the file in the format expected by process_resume_file
        with open(tmp_path, "rb") as f:
            result = process_resume_file(f, model_choice, original_filename)

        os.remove(tmp_path)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# 🧭 2. Job Matcher Endpoint
# -------------------------------
@app.route("/aiJobMatcher", methods=["POST"])
def ai_job_matcher():
    try:
        data = request.get_json()

        # ✅ Support both naming conventions
        resume_text = data.get("resume") or data.get("resume_text", "")
        jd_text = data.get("job_description") or data.get("jd_text", "")

        if not resume_text or not jd_text:
            return jsonify({"error": "Missing resume or job description"}), 400

        result = analyze_match(resume_text, jd_text)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# ✍️ 3. Cover Letter Generator
# -------------------------------
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


if __name__ == "__main__":
    # Runs on http://localhost:5000 by default 
    app.run(debug=True, port=5000)
