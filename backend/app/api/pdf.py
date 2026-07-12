from pathlib import Path
import shutil

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.document import Document
from app.models.user import User
from app.services.pdf_service import process_pdf
from app.services.vector_store import create_vector_store

router = APIRouter(
    prefix="/pdf",
    tags=["PDF"]
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_pdf(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    print("\n========== PDF REQUEST ==========")
    print("Authorization Header:", request.headers.get("authorization"))
    print("=================================\n")

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document = Document(
        filename=file.filename,
        file_path=str(file_path),
        owner_id=current_user.id
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    result = process_pdf(file_path)

    vector_path = create_vector_store(
        result["chunks"],
        document.id
    )

    document.vector_store_path = vector_path
    db.commit()

    return {
        "message": "PDF uploaded successfully.",
        "document": {
            "id": document.id,
            "filename": document.filename,
        },
    }