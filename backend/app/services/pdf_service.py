from pathlib import Path
import fitz
from langchain_text_splitters import RecursiveCharacterTextSplitter


def extract_text_from_pdf(pdf_path: Path) -> str:
    document = fitz.open(pdf_path)

    text = ""

    for page in document:
        text += page.get_text()

    document.close()

    return text


def split_text_into_chunks(text: str):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    return splitter.split_text(text)


def process_pdf(pdf_path: Path):
    text = extract_text_from_pdf(pdf_path)

    chunks = split_text_into_chunks(text)

    return {
        "characters": len(text),
        "total_chunks": len(chunks),
        "first_chunk": chunks[0] if chunks else "",
        "chunks": chunks
    }