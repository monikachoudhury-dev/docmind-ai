from fastapi import APIRouter

from app.services.chat_service import ask_question

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.get("/")
def chat_with_document(
    document_id: int,
    question: str,
):
    """
    Chat with an uploaded PDF.
    """

    answer = ask_question(
        document_id=document_id,
        question=question,
    )

    return {
        "answer": answer
    }