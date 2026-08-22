from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.document import Document
from app.models.user import User
from app.services.chat_service import ask_question

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.get("/")
def chat_with_document(
    document_id: int,
    question: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Chat with an uploaded PDF.
    """

    document = db.query(Document).filter(
        Document.id == document_id,
        Document.owner_id == current_user.id,
    ).first()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    answer = ask_question(
        document_id=document_id,
        question=question,
    )

    return {
        "answer": answer
    }