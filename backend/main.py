import os
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import engine, Base
import app.models  # Ensure all models are registered

# API Routers
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.profile import router as profile_router
from app.api.v1.trips import router as trips_router
from app.api.v1.activities import router as activities_router
from app.api.v1.sharing import router as sharing_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("travel_planner")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema initialized.")
    yield
    logger.info("Application shutdown.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-quality REST API for Personalized Travel Itinerary Planning with AI generation, multi-day scheduling, and budget analytics.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local dev & deployed frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router, tags=["Health"])
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(profile_router, prefix=f"{settings.API_V1_STR}/profile", tags=["User Profile"])
app.include_router(trips_router, prefix=f"{settings.API_V1_STR}/trips", tags=["Trips & Itineraries"])
app.include_router(activities_router, prefix=f"{settings.API_V1_STR}", tags=["Activities"])
app.include_router(sharing_router, prefix=f"{settings.API_V1_STR}", tags=["Sharing"])

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
