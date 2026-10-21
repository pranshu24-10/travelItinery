from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/health")
def check_health():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "connected",
        "ai_provider": "gemini" if settings.GEMINI_API_KEY else ("openai" if settings.OPENAI_API_KEY else "curated_engine"),
        "version": "1.0.0"
    }
