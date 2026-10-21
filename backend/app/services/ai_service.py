import json
import logging
import re
from typing import Dict, Any, Optional
import httpx
from app.core.config import settings
from app.schemas.ai import AIItineraryResponse, AIDay
from app.prompts.itinerary_prompts import SYSTEM_PROMPT, build_itinerary_prompt, build_regenerate_day_prompt
from app.services.generator_fallback import generate_fallback_itinerary, generate_fallback_day

logger = logging.getLogger(__name__)

def extract_json_from_text(text: str) -> Optional[dict]:
    """Extract and parse json object from text even if enclosed in markdown code fences."""
    try:
        # First try direct parse
        return json.loads(text.strip())
    except Exception:
        pass
        
    # Try finding markdown ```json ... ```
    match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except Exception:
            pass
            
    # Try finding outermost braces { ... }
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        try:
            return json.loads(text[first_brace:last_brace + 1])
        except Exception as e:
            logger.warning(f"Failed to parse extracted braces JSON: {e}")
            
    return None

async def call_gemini_api(prompt: str) -> Optional[dict]:
    if not settings.GEMINI_API_KEY:
        return None
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": SYSTEM_PROMPT + "\n\n" + prompt}
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.7
        }
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            candidates = data.get("candidates", [])
            if candidates:
                content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                return extract_json_from_text(content)
        else:
            logger.warning(f"Gemini API error ({response.status_code}): {response.text}")
    return None

async def call_openai_api(prompt: str) -> Optional[dict]:
    if not settings.OPENAI_API_KEY:
        return None
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.7
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            data = response.json()
            choices = data.get("choices", [])
            if choices:
                content = choices[0].get("message", {}).get("content", "")
                return extract_json_from_text(content)
        else:
            logger.warning(f"OpenAI API error ({response.status_code}): {response.text}")
    return None

async def generate_itinerary(trip_data: Dict[str, Any]) -> AIItineraryResponse:
    prompt = build_itinerary_prompt(trip_data)
    parsed_json = None
    
    # Try configured provider
    try:
        if settings.AI_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
            parsed_json = await call_gemini_api(prompt)
        elif settings.AI_PROVIDER == "openai" and settings.OPENAI_API_KEY:
            parsed_json = await call_openai_api(prompt)
        elif settings.GEMINI_API_KEY:
            parsed_json = await call_gemini_api(prompt)
        elif settings.OPENAI_API_KEY:
            parsed_json = await call_openai_api(prompt)
    except Exception as e:
        logger.error(f"Error calling AI API: {e}. Falling back to rule-based engine.")

    if parsed_json:
        try:
            return AIItineraryResponse.model_validate(parsed_json)
        except Exception as e:
            logger.warning(f"AI response failed schema validation: {e}. Falling back to engine.")
            
    # Fallback to curated rule-based itinerary
    logger.info("Generating itinerary via TravelEase Curated Intelligence Engine.")
    return generate_fallback_itinerary(trip_data)

async def regenerate_day(trip_data: Dict[str, Any], day_number: int, guidance: str = "") -> AIDay:
    prompt = build_regenerate_day_prompt(trip_data, day_number, guidance)
    parsed_json = None
    
    try:
        if settings.GEMINI_API_KEY:
            parsed_json = await call_gemini_api(prompt)
        elif settings.OPENAI_API_KEY:
            parsed_json = await call_openai_api(prompt)
    except Exception as e:
        logger.error(f"Error calling AI API for day regeneration: {e}")

    if parsed_json:
        try:
            return AIDay.model_validate(parsed_json)
        except Exception as e:
            logger.warning(f"Day regeneration failed validation: {e}")

    return generate_fallback_day(trip_data, day_number, guidance)
