# functions/utils.py
import os
import json
import docx2txt
import PyPDF2
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
# ... (your API key setup remains the same) ...
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

openai_client = OpenAI(api_key=OPENAI_API_KEY, base_url="https://api.groq.com/openai/v1")
genai.configure(api_key=GEMINI_API_KEY)

# ... (extract_text_from_pdf and extract_text_from_docx remain the same) ...
def extract_text_from_pdf(file):
    text = ""
    reader = PyPDF2.PdfReader(file)
    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text() + "\n"
    return text.strip()

def extract_text_from_docx(file):
    return docx2txt.process(file)

def generate_llama_json(prompt):
    try:
        response = openai_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are an expert resume coach that provides responses in JSON format."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=4000, 
            response_format={"type": "json_object"},
        )
        result_text = response.choices[0].message.content.strip()
        return json.loads(result_text)
    except Exception as e:
        print(f"Error calling Llama: {e}")
        return {"error": "Failed to get a valid response from Llama."}

# --- THIS IS THE UPDATED FUNCTION ---
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

    # This prompt asks for the new, nested JSON structure
    prompt = f"""
You are an expert AI resume parser and career coach. Your task is to do two things:
1.  Analyze and enhance the provided raw resume text into a structured JSON object (`resumeData`).
2.  Based on that analysis, provide suggestions for missing skills (`analysis`).

**JSON Structure Rules:**
You MUST return a single JSON object with the following keys. Do NOT add any text before or after the JSON.
The required structure is:
{{
  "analysis": {{
    "detectedRole": "string (Your best guess for the user's job title, e.g., 'Data Analyst', 'UX Designer')",
    "missingSkills": [
       {{ "id": "string", "name": "string (e.g., Tableau)", "category": "string (e.g., Tool)" }},
       {{ "id": "string", "name": "string (e.g., Power BI)", "category": "string (e.g., Tool)" }}
    ]
  }},
  "resumeData": {{
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string (optional)",
    "github": "string (optional)",
    "portfolio": "string (optional)",
    "summary": "string",
    "skills": [
      {{ "id": "string", "name": "string", "category": "string" }}
    ],
    "experiences": [
      {{
        "id": "string",
        "title": "string",
        "company": "string",
        "location": "string (optional)",
        "startDate": "string",
        "endDate": "string",
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
        "startDate": "string",
        "endDate": "string"
      }}
    ],
    "projects": [
      {{
        "id": "string",
        "name": "string",
        "techStack": "string",
        "achievements": [
          {{ "id": "string", "description": "string" }}
        ]
      }}
    ],
    "certifications": [
      {{ "id": "string", "name": "string", "organization": "string", "date": "string" }}
    ],
    "languages": [
      {{ "id": "string", "name": "string", "proficiency": "string" }}
    ]
  }}
}}

**Strict Instructions:**
1.  **Parse `resumeData`:** First, parse all sections from the raw text into the `resumeData` object. Enhance the 'summary' and 'achievements' with action verbs. Fix grammar.
2.  **Analyze and Suggest:** After parsing, look at the `resumeData.skills` and `resumeData.experiences`.
    - Determine the `detectedRole`.
    - Based on that role, generate a list of 3-5 *common, important* skills that are MISSING from the `resumeData.skills` list.
3.  **Be Strict:** Do NOT mix information. "Design Studio" is a company, not a "Skill".
4.  **Fill Arrays:** Populate all arrays. If a section is not present, return an empty array `[]`.
5.  **Generate IDs:** Create unique string IDs for all items (e.g., `skill1`, `missingSkill1`, `exp1`).
---
RAW RESUME TEXT:
{resume_text}
---
"""
    return generate_llama_json(prompt)

# ... (Your analyze_match and generate_cover_letter functions remain the same) ...
def analyze_match(resume_text, jd_text):
    prompt = f"""
You are an expert technical recruiter...
---
"""
    return generate_llama_json(prompt)

def generate_cover_letter(resume_text, jd_text, user_name):
    prompt = f"""
Act as a professional career coach...
---
"""
    try:
        response = openai_client.chat.completions.create(
            # ... (Llama call) ...
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error calling Llama for Cover Letter: {e}")
        return "Sorry, an error occurred while generating the cover letter."
    
def critique_resume(resume_text):
    prompt = f"""
You are an expert career coach...
---
"""
    return generate_llama_json(prompt)