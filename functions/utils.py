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

# Extract Text Functions
def extract_text_from_pdf(file):
    text = "" # This line was the source of the error
    reader = PyPDF2.PdfReader(file)
    for page in reader.pages:
        if page.extract_text():
            # These lines were also corrupted
            text += page.extract_text() + "\n"
    return text.strip()


def extract_text_from_docx(file):
    return docx2txt.process(file)


# Llama JSON Generator
def generate_llama_json(prompt):
    try:
        response = openai_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are an expert resume coach that provides responses in JSON format."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=4000, # Increased max tokens for larger JSON
            response_format={"type": "json_object"},
        )
        result_text = response.choices[0].message.content.strip()
        return json.loads(result_text)
    except Exception as e:
        print(f"Error calling Llama: {e}")
        return {"error": "Failed to get a valid response from Llama."}


# Resume Enhancer Logic
def process_resume_file(uploaded_file, model_choice, original_filename=None):
    filename = (original_filename or getattr(uploaded_file, "name", "")).lower()

    if filename.endswith(".pdf"):
        # This function is only called as a fallback now.
        # Our server's OCR logic bypasses this by sending a .txt file.
        resume_text = extract_text_from_pdf(uploaded_file)
    elif filename.endswith(".docx"):
        resume_text = extract_text_from_docx(uploaded_file)
    elif filename.endswith(".txt"):
        # This is the primary path our server now uses for ALL file types
        resume_text = uploaded_file.read().decode("utf-8")
    else:
        return {"error": f"Unsupported file type: {filename}"}

    if not resume_text.strip():
        return {"error": "Could not extract any text."}

    # --- THIS PROMPT IS NOW FULLY UPDATED ---
    prompt = f"""
You are an expert AI resume parser and enhancer. Your task is to analyze the provided raw resume text, which may be jumbled from an OCR scan, and extract all relevant information into a precise JSON format.

**JSON Structure Rules:**
You MUST return a single JSON object with the following keys. Do NOT add any text before or after the JSON.
The required structure is:
{{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string (optional)",
  "github": "string (optional)",
  "portfolio": "string (optional)",
  "summary": "string",
  "skills": [
    {{ "id": "string", "name": "string", "category": "string (e.g., Language, Framework/Library, Tool, Cloud, etc.)" }}
  ],
  "experiences": [
    {{
      "id": "string",
      "title": "string",
      "company": "string",
      "location": "string (optional)",
      "startDate": "string (e.g., YYYY-MM or Month YYYY)",
      "endDate": "string (e.g., YYYY-MM or Present)",
      "achievements": [
        {{ "id": "string", "description": "string" }}
      ]
    }}
  ],
  "education": [
    {{
      "id": "string",
      "degree": "string",
      "school": "string",
      "location": "string (optional)",
      "startDate": "string (e.g., YYYY-MM or Month YYYY)",
      "endDate": "string (e.g., YYYY-MM or Month YYYY)"
    }}
  ],
  "projects": [
    {{
      "id": "string",
      "name": "string",
      "techStack": "string (e.g., React, Node.js, Firebase)",
      "githubLink": "string (optional)",
      "liveLink": "string (optional)",
      "achievements": [
        {{ "id": "string", "description": "string" }}
      ]
    }}
  ],
  "certifications": [
    {{ "id": "string", "name": "string", "organization": "string", "date": "string" }}
  ],
  "languages": [
    {{ "id": "string", "name": "string", "proficiency": "string (e.g., Native, Fluent)" }}
  ]
}}

**Strict Instructions:**
1.  **Be Strict:** Do NOT mix information. For example, "Design Studio" is a company name from 'Experience', it is NOT a 'Skill'. Read the context.
2.  **Enhance:** Re-write the 'summary' and 'achievements' descriptions to be more professional and impactful. Use strong action verbs. Fix grammar and spelling.
3.  **Fill Arrays:** Populate all arrays. If a section is not present in the resume, return an empty array `[]`.
4.  **Generate IDs:** Create unique string IDs for all items, like `skill1`, `exp1`, `ach1`, etc.
5.  **Parse Jumbled Text:** The input text may be out of order from an OCR scan. Read the entire text to find all sections. For example, 'Skills' might appear next to 'Experience'.
---
RAW RESUME TEXT:
{resume_text}
---
"""

    return generate_llama_json(prompt)


# Job Matcher Logic
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


# Cover Letter Generator
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
    
# Resume Critique Logic
def critique_resume(resume_text):
    prompt = f"""
You are an expert career coach. Your task is to analyze the provided resume text.
The text may be jumbled from an OCR scan.
Return a JSON object with this *exact* structure:
{{
  "overall_feedback": "A brief, one-paragraph summary of the resume's strengths and weaknesses.",
  "summary_suggestions": [
    "Suggestion 1 for the 'Summary' section.",
    "Suggestion 2 for the 'Summary' section."
  ],
  "experience_suggestions": [
    "Suggestion 1 for the 'Experience' section (e.g., 'Use more action verbs like...')",
    "Suggestion 2 for the 'Experience' section."
  ],
  "skills_suggestions": [
    "Suggestion 1 for the 'Skills' section."
  ]
}}
---
RESUME TEXT:
{resume_text}
---
"""
    # This uses your existing function to call the Llama 3.1 model
    return generate_llama_json(prompt)