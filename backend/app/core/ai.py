from google import genai
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.core.config import settings


# -------------------------------
# Google GenAI Client
# -------------------------------
client = genai.Client(
    api_key=settings.GOOGLE_API_KEY
)


# -------------------------------
# Embedding Model (keep LangChain)
# -------------------------------
embedding_model = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=settings.GOOGLE_API_KEY,
)