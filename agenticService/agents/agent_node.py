from google import genai
from dotenv import load_dotenv
import os
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
def generate_ans():
    response = client.models.generate_content(model="gemini-3-flash-preview", contents="Tell me about yourself,and greet me")
    return response.text
