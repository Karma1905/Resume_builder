# utils.py
import os
import json
import google.generativeai as genai
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
# NOTE: Ensure OPENAI_API_KEY and GEMINI_API_KEY are set in your .env file
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize clients (Assuming Groq is used for Llama via OpenAI client)
openai_client = OpenAI(api_key=OPENAI_API_KEY, base_url="https://api.groq.com/openai/v1")
genai.configure(api_key=GEMINI_API_KEY)

# --- AI Helper Function (for JSON response) ---
def generate_llama_json(prompt):
    try:
        # Maintaining the system role to emphasize high quality and parsing standards
        response = openai_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are an expert resume parser and career coach. You MUST ensure the final 'summary' and all 'achievements' use strong action verbs and are quantified (X-Y-Z formula). Always provide responses in JSON format."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=4000, 
            response_format={"type": "json_object"},
        )
        result_text = response.choices[0].message.content.strip()
        return json.loads(result_text)
    except Exception as e:
        print(f"Error calling Llama (JSON): {e}")
        return {"error": "Failed to get a valid JSON response from the AI."}

# --- 1. AI Resume Parser (Takes RAW TEXT) ---
def process_resume_text(resume_text, model_choice):
    if not resume_text.strip():
        return {"error": "Could not extract any text."}

    prompt = f"""
Your task is to analyze and enhance the provided raw resume text into a structured JSON object (`resumeData`).

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

**Strict Instructions (Enhancement Quality Focus):**
1.  **Parse & Enhance `resumeData`:** Parse all sections into the `resumeData` object. You **must** enhance the 'summary' and all 'achievements' using **strong, professional action verbs** and **quantifiable results** (e.g., "Increased sales by 15%"). Fix grammar and flow.
2.  **Analyze and Suggest:** Determine the `detectedRole` and generate a list of 3-5 *important* skills that are MISSING from the `resumeData.skills` list.
3.  **Be Strict:** Do NOT mix information. "Design Studio" is a company, not a "Skill".
4.  **Fill Arrays:** Populate all arrays. If a section is not present, return an empty array `[]`.
5.  **Generate IDs:** Create unique string IDs for all items (e.g., `skill1`, `missingSkill1`, `exp1`).
---
RAW RESUME TEXT:
{resume_text}
---
"""
    return generate_llama_json(prompt)

# --- 2. AI Job Matcher ---
def analyze_match(resume_text, jd_text):
    prompt = f"""
You are an expert technical recruiter and job match analyzer. 
Your task is to compare a RESUME and a JOB DESCRIPTION and return a structured JSON response that includes:
1. A numeric `match_score` (0–100)
2. A short textual `summary`
3. Lists of `matching_keywords`, `missing_keywords`, and `tailoring_suggestions`

### Output format (JSON only)
Return a single valid JSON object like this:
{{
  "match_score": 85,
  "summary": "The resume aligns strongly with the job description in software development and JavaScript skills.",
  "matching_keywords": ["React", "Node.js", "APIs"],
  "missing_keywords": ["AWS", "GraphQL"],
  "tailoring_suggestions": [
    "Add experience with cloud technologies like AWS or Azure.",
    "Highlight teamwork and leadership in past roles."
  ]
}}

### Instructions
1. Analyze overlap between resume_text and jd_text to estimate a `match_score` between 0 and 100.
   - >90 = Excellent match
   - 70–89 = Good match
   - 50–69 = Moderate match
   - <50 = Poor match
2. Identify **skills, tools, or keywords** that appear in both (matching_keywords).
3. Identify important job-specific keywords missing from the resume (missing_keywords).
4. Suggest ways to tailor the resume for better alignment (tailoring_suggestions).

---
RESUME TEXT:
{resume_text}

---
JOB DESCRIPTION:
{jd_text}
---
"""
    return generate_llama_json(prompt)

# --- 3. AI Cover Letter ---
def generate_cover_letter(resume_text, jd_text, user_name):
    prompt = f"""
Act as a professional career coach. Your task is to generate a compelling and personalized cover letter based on the provided resume and job description.

**Instructions:**
1.  **Personalization:** Address the letter professionally (e.g., "Dear Hiring Team").
2.  **Match and Highlight:** Directly reference 2-3 key skills or experiences from the RESUME TEXT that directly match the requirements in the JOB DESCRIPTION.
3.  **Tone:** Maintain a confident, professional, and enthusiastic tone.
4.  **Format:** Output only the complete cover letter text. Do NOT include any JSON, markdown code blocks, or preamble/postamble text. The letter should be ready for the user to copy/paste.

---
CANDIDATE NAME: {user_name}

RESUME TEXT:
{resume_text}

JOB DESCRIPTION:
{jd_text}
---
"""
    try:
        response = openai_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a professional cover letter writer. Output only the letter text."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=2000, 
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error calling Llama for Cover Letter: {e}")
        return "Sorry, an error occurred while generating the cover letter."
    
# --- 4. AI Resume Critique (RESTORED TO TEXTUAL FEEDBACK ONLY) ---
def critique_resume(resume_text):
    prompt = f"""
You are an expert career coach and professional resume reviewer. Your task is to provide a constructive and detailed critique of the provided resume text.

**JSON Output Requirements (STRICT):**
You MUST return a single JSON object with the following keys. Do NOT include any 'auto_corrections' or other structured data.

The required structure is:
{{
  "overall_feedback": "string (A general, encouraging summary of the resume's strengths and one main area for improvement.)",
  "summary_suggestions": [
    "string (Detailed suggestion related to the professional summary, e.g., 'Ensure the summary highlights your most relevant quantifiable impact.')"
  ],
  "experience_suggestions": [
    "string (Detailed suggestion related to job bullet points, focusing on areas that lack metrics or strong action verbs.)"
  ],
  "skills_suggestions": [
    "string (Detailed suggestion related to missing, outdated, or poorly categorized skills, and skill relevance.)"
  ]
}}

**Critique Instructions:**
1.  **Overall Feedback:** Summarize the resume's current state and identify the single most critical area for immediate improvement.
2.  **Summary:** Evaluate the effectiveness and suggest improvements to make it concise, impactful, and results-oriented.
3.  **Experience:** Critically review the bullet points. Identify where the X-Y-Z formula (Achieved X as measured by Y, by doing Z) is missing and advise the user to add **quantification (metrics, numbers, percentages)**.
4.  **Skills:** Identify any potential gaps or areas where technical skills could be better emphasized or prioritized.

---
RAW RESUME TEXT:
{resume_text}
---
"""
    return generate_llama_json(prompt)