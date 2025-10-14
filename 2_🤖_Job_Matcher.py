# pages/2_🤖_Job_Matcher.py

import streamlit as st
from utils import analyze_match
import json

st.set_page_config(
    page_title="AI Job Matcher | HireMatch.AI",
    page_icon="🤖",
    layout="wide"
)

# --- AUTHENTICATION CHECK ---
if not st.session_state.get('logged_in', False):
    st.switch_page("Login.py")

st.title("🤖 AI Job Matcher")
st.write("Paste your resume and a job description below to see how well you match!")

# --- FUNCTION TO CONVERT RESUME DATA TO TEXT ---
def get_resume_text_from_state():
    """Converts the resume data from the editor into a plain text string."""
    # --- FIX: Check if editor_form_data is not None ---
    if st.session_state.get('editor_form_data'):
        data = st.session_state.editor_form_data
        lines = []
        lines.append(data.get('name', ''))
        contact = data.get('contact_info', {})
        lines.append(f"{contact.get('email', '')} | {contact.get('phone', '')} | {contact.get('address', '')}")
        lines.append("\nSUMMARY")
        lines.append(data.get('summary', ''))
        lines.append("\nEXPERIENCE")
        for exp in data.get('experience', []):
            lines.append(f"\n{exp.get('title', '')} at {exp.get('company', '')}")
            lines.append(f"{exp.get('dates', '')}")
            for resp in exp.get('responsibilities', []):
                lines.append(f"- {resp}")
        lines.append("\nEDUCATION")
        for edu in data.get('education', []):
            lines.append(f"{edu.get('degree', '')}, {edu.get('institution', '')} ({edu.get('year', '')})")
        lines.append("\nSKILLS")
        lines.append(', '.join(data.get('skills', [])))
        return "\n".join(lines)
    return ""

# --- UI LAYOUT ---
col1, col2 = st.columns(2, gap="large")

with col1:
    st.subheader("Your Resume")
    # Pre-fill the text area if the user has been to the editor
    resume_text = st.text_area("Paste your resume content here", height=400, value=get_resume_text_from_state(), key="resume_text_matcher")

with col2:
    st.subheader("Job Description")
    jd_text = st.text_area("Paste the job description here", height=400, key="jd_text_matcher")

if st.button("Analyze Match", type="primary", use_container_width=True):
    if 'cover_letter' in st.session_state: del st.session_state.cover_letter
    if resume_text.strip() and jd_text.strip():
        with st.spinner("AI is analyzing the match... This may take a moment."):
            analysis_result = analyze_match(resume_text, jd_text)
            st.session_state.analysis_result = analysis_result
    else:
        st.warning("Please paste both your resume and the job description.")

# --- DISPLAY RESULTS ---
if 'analysis_result' in st.session_state:
    result = st.session_state.analysis_result
    st.divider()
    st.subheader("Analysis Results")
    if "error" in result:
        st.error(f"An error occurred: {result['error']}")
    else:
        st.metric(label="**Match Score**", value=f"{result.get('match_score', 0)}%")
        st.markdown("##### Summary")
        st.write(result.get('summary', 'No summary provided.'))
        tab1, tab2, tab3 = st.tabs(["✅ Matching Keywords", "❌ Missing Keywords", "📝 Tailoring Suggestions"])
        with tab1:
            st.markdown("##### Keywords from the job description found in your resume:")
            for keyword in result.get('matching_keywords', []): st.markdown(f"- **{keyword}**")
        with tab2:
            st.markdown("##### Important keywords from the job description missing from your resume:")
            for keyword in result.get('missing_keywords', []): st.markdown(f"- {keyword}")
        with tab3:
            st.markdown("##### Here's how you can tailor your resume for this specific job:")
            for suggestion in result.get('tailoring_suggestions', []): st.info(suggestion)
        st.divider()
        st.subheader("Next Step: Generate Cover Letter")
        if st.button("✍️ Generate AI Cover Letter", use_container_width=True):
            with st.spinner("AI is writing your cover letter..."):
                user_name = st.session_state.get('username', '')
                if user_name == "Guest": user_name = "the candidate"
                cover_letter = generate_cover_letter(resume_text, jd_text, user_name)
                st.session_state.cover_letter = cover_letter

if 'cover_letter' in st.session_state:
    st.divider()
    st.subheader("Your AI-Generated Cover Letter")
    st.text_area("You can edit the text below and copy it for your application.", value=st.session_state.cover_letter, height=500)