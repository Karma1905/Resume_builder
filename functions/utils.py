import os
import json
import docx2txt
import PyPDF2
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

openai_client = OpenAI(api_key=OPENAI_API_KEY, base_url="https://api.groq.com/openai/v1")
genai.configure(api_key=GEMINI_API_KEY)

# -------------------------
#  Extract Text Functions
# -------------------------
def extract_text_from_pdf(file):
    text = ""
    reader = PyPDF2.PdfReader(file)
    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text() + "\n"
    return text.strip()


def extract_text_from_docx(file):
    return docx2txt.process(file)


# -------------------------
#  Llama JSON Generator
# -------------------------
def generate_llama_json(prompt):
    try:
        response = openai_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are an expert resume coach that provides responses in JSON format."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=2000,
            response_format={"type": "json_object"},
        )
        result_text = response.choices[0].message.content.strip()
        return json.loads(result_text)
    except Exception as e:
        print(f"Error calling Llama: {e}")
        return {"error": "Failed to get a valid response from Llama."}


# -------------------------
#  Resume Enhancer Logic
# -------------------------
def process_resume_file(uploaded_file, model_choice, original_filename=None):
    filename = (original_filename or getattr(uploaded_file, "name", "")).lower()

    if filename.endswith(".pdf"):
        resume_text = extract_text_from_pdf(uploaded_file)
    elif filename.endswith(".docx"):
        resume_text = extract_text_from_docx(uploaded_file)
    elif filename.endswith(".txt"):
        resume_text = uploaded_file.read().decode("utf-8")
    else:
        return {"error": f"Unsupported file type: {filename}"}

    if not resume_text.strip():
        return {"error": "Could not extract any text."}

    #  AI enhancement prompt
    prompt = f"""
You are an AI resume writing assistant.
Your job is to enhance the candidate’s resume text and return it in a structured JSON format.

Format the response with:
- "fullName"
- "email"
- "phone"
- "location"
- "summary"
- "skills"
- "experiences" (list of objects with id, title, company, startDate, endDate, description)
- "education" (list of objects with id, degree, school, year)

Enhance grammar, add action verbs, and make it more impactful without fabricating information.
---
RESUME TEXT:
{resume_text}
---
"""

    return generate_llama_json(prompt)


# -------------------------
#  Job Matcher Logic
# -------------------------
def analyze_match(resume_text, jd_text):
    prompt = f"""
You are an expert technical recruiter. Your task is to compare the provided RESUME with the JOB DESCRIPTION.
You must return a response in a valid JSON format. Do not add any text before or after the JSON object.

The JSON object must have the following keys:
- "match_score": An integer from 0 to 100.
- "matching_keywords": A list of strings.
- "missing_keywords": A list of strings.
- "summary": A brief one-paragraph analysis.
- "tailoring_suggestions": A list of 2-3 specific, actionable suggestions.

If you cannot find information for a key, return an empty list or an empty string.

---
RESUME:
{resume_text}
---
JOB DESCRIPTION:
{jd_text}
---
"""
    return generate_llama_json(prompt)


# -------------------------
#  Cover Letter Generator
# -------------------------
def generate_cover_letter(resume_text, jd_text, user_name):
    prompt = f"""
Act as a professional career coach. Your task is to write a compelling, professional, and concise cover letter.
The tone should be confident but not arrogant. The letter must be three paragraphs long.
Use the provided RESUME TEXT to understand the candidate's skills and experience.
Use the provided JOB DESCRIPTION TEXT to understand the employer's needs.
The candidate's name is {user_name}.
Do not use placeholders. The letter should be ready to use.

---
RESUME TEXT:
{resume_text}
---
JOB DESCRIPTION TEXT:
{jd_text}
---
"""
    try:
        response = openai_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are an expert career coach that writes professional cover letters."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.8,
            max_tokens=1000
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error calling Llama for Cover Letter: {e}")
        return "Sorry, an error occurred while generating the cover letter."