import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-pro')

def get_chat_response(prompt: str):
    response = model.generate_content(prompt)
    return response.text