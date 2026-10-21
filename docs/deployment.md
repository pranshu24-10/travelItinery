# Production Deployment Guide — TravelEase

This guide outlines deployment of the **TravelEase Personalized Travel Itinerary Planner** across standard modern hosting environments.

---

## 1. Environment Variables Checklist

### Backend Service (FastAPI)
| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://postgres:[PASS]@db.[REF].supabase.co:5432/postgres` |
| `SECRET_KEY` | Yes | 32+ character secure random secret | `openssl rand -hex 32` |
| `ALLOWED_ORIGINS` | Yes | Permitted frontend origins for CORS | `["https://your-frontend.vercel.app"]` |
| `AI_PROVIDER` | No | Model provider (`gemini`, `openai`, or `demo`) | `gemini` |
| `GEMINI_API_KEY` | Optional | Google Gemini Generative AI Key | `AIzaSy...` |
| `OPENAI_API_KEY` | Optional | OpenAI API Secret Key | `sk-proj-...` |

### Frontend Client (React + Vite)
| Variable | Required | Description | Example |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Yes | Base URL pointing to deployed FastAPI backend | `https://travelease-api.onrender.com` |

---

## 2. Database Setup (Supabase PostgreSQL)

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste and run the schema script located at `supabase/migrations/20260101000000_initial_schema.sql`.
4. Copy your project connection string from **Project Settings -> Database -> Connection String (URI)** and assign it as `DATABASE_URL` on the backend.

---

## 3. Backend Deployment (Render / Railway)

### Using Render:
1. Connect your GitHub repository to Render.
2. Select **New Web Service**.
3. Configure:
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add the backend environment variables under the **Environment** tab.
5. Deploy service and copy your public backend URL (e.g., `https://travelease-api.onrender.com`).

---

## 4. Frontend Deployment (Vercel / Netlify)

### Using Vercel:
1. Import repository in the Vercel Dashboard.
2. Set **Root Directory** to `frontend`.
3. Build Settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com`
5. Deploy and verify.

---

## 5. Troubleshooting & Verification

- **CORS Errors:** Ensure your deployed frontend URL is included in `ALLOWED_ORIGINS` in `backend/app/core/config.py` or configured via the environment variable.
- **AI Rate Limits:** TravelEase includes a resilient fallback intelligence engine that serves detailed, realistic itineraries even when LLM quotas or external network calls fail.
