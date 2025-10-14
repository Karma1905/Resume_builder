# pages/AI_Powered_Builder.py
# This page is specifically for the AI-powered file upload.

import streamlit as st
from utils import process_resume_file

# --- AUTHENTICATION CHECK ---
if not st.session_state.get('logged_in', False):
    st.switch_page("Login.py")

st.set_page_config(
    page_title="AI Builder | HireMatch.AI",
    page_icon="⚡", # Changed icon
    layout="wide"
)

st.title("⚡ AI-Powered Resume Builder")
st.write("Upload your existing resume and let AI enhance its content.")

# Model selection - we'll stick with Llama for now as it's working
model_choice = st.selectbox(
    "Choose your AI Model",
    ("Llama 3.1", "Gemini 1.5"),
    index=0 # Default to Llama
)

# File uploader
uploaded_file = st.file_uploader(
    "Drag and drop your resume here (.pdf, .docx, .txt)",
    type=["pdf", "docx", "txt"],
    label_visibility="collapsed"
)

if uploaded_file is not None:
    with st.spinner(f"AI is enhancing your resume using {model_choice}..."):
        api_response = process_resume_file(uploaded_file, model_choice)

        # Store the response in session state to use on the editor page
        st.session_state.api_response = api_response

        # Check if the API call was successful before switching pages
        if "error" not in api_response:
            st.success("Enhancement successful! Redirecting to the editor...")
            st.switch_page("pages/3_📄_Resume_Editor.py")
        else:
            # If there's an error, display it here
            st.error(api_response["error"])

# If an API error occurred from a previous run, it might still be in session state
if "api_response" in st.session_state and "error" in st.session_state.api_response:
    st.error(st.session_state.api_response["error"])

st.markdown("---")
st.write("Prefer to start from scratch or choose a template?")
if st.button("Browse Templates"):
    st.switch_page("pages/1_🖼️_Template_Selection.py")