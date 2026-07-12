from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.pdf import router as pdf_router
from app.api.chat import router as chat_router

app = FastAPI(
    title="DocMind AI"
)

app.include_router(auth_router)
app.include_router(pdf_router)
app.include_router(chat_router)