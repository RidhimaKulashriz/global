from google import genai
from dotenv import load_dotenv
from .state import State
import os
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
def generate_ans(state: State):
    print("AGEMT CALLED")
    response = client.models.generate_content(model="gemini-3-flash-preview", contents="Tell me about yourself,and greet me")
    return {"verdict": response.text}
