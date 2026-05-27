from fastapi import APIRouter, Depends
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

from app.utils.dependencies import get_current_user

router = APIRouter()

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise Exception("❌ Falta GEMINI_API_KEY")


class CoverLetterRequest(BaseModel):
    company: str
    position: str
    notes: str = ""


# ✅ CORREGIDO AQUÍ
@router.post("/cover-letter")
def generate_cover_letter(
    data: CoverLetterRequest,
    current_user=Depends(get_current_user)
):

    prompt = f"""
Write a professional cover letter.

Company: {data.company}
Position: {data.position}
Notes: {data.notes}

- 3 paragraphs
- professional tone
- max 250 words
- start with Dear Hiring Manager
"""

    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    try:
        res = requests.post(
            url,
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        if res.status_code != 200:
            return {
                "error": "Gemini API error",
                "details": res.text,
                "status_code": res.status_code
            }

        data = res.json()

        return {
            "letter": data["candidates"][0]["content"]["parts"][0]["text"]
        }

    except Exception as e:
        return {
            "error": str(e)
        }