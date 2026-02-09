from google import genai
from google.genai import types
from dotenv import load_dotenv
from .state import State
import os
import json

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
CRISISLENS_PROMPT = """
You are CrisisLens, an explainable AI system for verifying disaster-related images during floods.

Your task:
Given:
1) An uploaded image claimed to show a flood,
2) The user-provided caption and claimed location,
3) Recent weather data (JSON),
4) Recent news/search context (JSON),

Determine whether the image is:
- Real (authentic flood imagery and likely from the claimed event/location),
- Misleading (real image but wrong time/location/context),
- Or Uncertain (insufficient evidence to verify).

Follow these steps internally and report them clearly:

1) Visual Assessment:
   - Does the image show flooding or water-related damage?
   - Describe severity and environment.

2) Weather Consistency Check:
   - Compare flood severity with recent rainfall/flood indicators.

3) News / Context Consistency Check:
   - Compare the claim with recent flood-related reports.

4) Recency & Location Plausibility:
   - Assess if the image plausibly represents a current flood event in the claimed location.

5) Uncertainty Handling:
   - If evidence is insufficient, state what is missing.

Final Output (STRICT JSON FORMAT):
{
  "disaster_type": "flood" | "not_flood" | "unclear",
  "verdict": "Real" | "Misleading" | "Uncertain",
  "confidence": <number between 0 and 100>,
  "analysis_steps": [
    "Step-by-step explanation of what was checked and why"
  ],
  "key_mismatches": [
    "List any major mismatches between the image and the provided context"
  ],
  "summary": "One short sentence summarizing the final judgment for a non-technical user"
}

Be cautious. Do NOT hallucinate facts. If unsure, choose 'Uncertain'.
"""

def generate_ans(state: State):
    print("AGEMT CALLED")
    if not hasattr(state, "image_bytes") or state.image_bytes is None:
        return {
            "verdict": "Uncertain",
            "prob": 0.0,
            "analysis_steps": ["No image provided to the verification agent."],
            "summary": "No image was available for verification."
        }
    image_part = types.Part.from_bytes(
        data=state.image_bytes,
        mime_type="image/jpeg"
    )
    user_context = f"""
Caption: {state.caption}
Claimed location: {state.location}

Recent weather data (JSON):
{json.dumps(state.weather or {}, indent=2)}

Recent news/search context (JSON):
{json.dumps(state.news or {}, indent=2)}
"""

    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=[
                image_part,
                CRISISLENS_PROMPT,
                user_context
            ],
            config=types.GenerateContentConfig(
                temperature=0.2,
                max_output_tokens=800
            )
        )
        text = response.text.strip()
        result = json.loads(text)
        return {
            "verdict": result.get("verdict"),
            "prob": result.get("confidence", 0) / 100.0,
            "analysis_steps": result.get("analysis_steps"),
            "summary": result.get("summary"),
            "raw": result
        }

    except Exception as e:
        print("Gemini error:", e)
        return {
            "verdict": "Uncertain",
            "prob": 0.0,
            "analysis_steps": ["The AI model failed to return a valid response."],
            "summary": "The system could not verify this image due to a processing error."
        }

