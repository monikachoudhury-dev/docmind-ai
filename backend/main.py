from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.pdf import router as pdf_router
from app.api.chat import router as chat_router

app = FastAPI(
    title="DocMind AI",
    version="1.0.0",
    description="AI Personal Knowledge Assistant"
)

# CORS Configuration
origins = [
    # Local Development
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    # Vercel Production
    "https://docmind-ai-pied.vercel.app",

    # Vercel Preview Deployment
    "https://docmind-ai-7y092gz4u-monika17.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router)
app.include_router(pdf_router)
app.include_router(chat_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to DocMind AI API",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }