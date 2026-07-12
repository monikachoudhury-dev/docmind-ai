from pathlib import Path

from langchain_community.vectorstores import FAISS

from app.core.ai import embedding_model
from app.core.config import settings

BASE_VECTOR_STORE = Path(settings.VECTOR_STORE_PATH)
BASE_VECTOR_STORE.mkdir(exist_ok=True)


def create_vector_store(chunks, document_id: int):
    """
    Create and save a FAISS vector store for a document.
    """

    document_folder = BASE_VECTOR_STORE / f"document_{document_id}"
    document_folder.mkdir(exist_ok=True)

    print(f"\nCreating vector store for document {document_id}")
    print(f"Saving to: {document_folder.resolve()}")
    print(f"Number of chunks: {len(chunks)}")

    vector_store = FAISS.from_texts(
        texts=chunks,
        embedding=embedding_model,
    )

    print("FAISS object created successfully.")

    vector_store.save_local(str(document_folder))

    print("FAISS saved successfully.")

    return str(document_folder)


def load_vector_store(document_id: int):
    """
    Load the FAISS vector store of a document.
    """

    document_folder = BASE_VECTOR_STORE / f"document_{document_id}"

    return FAISS.load_local(
        str(document_folder),
        embedding_model,
        allow_dangerous_deserialization=True,
    )


def retrieve_relevant_chunks(
    document_id: int,
    query: str,
    k: int = 4,
):
    """
    Retrieve the most relevant chunks from the document.
    """

    vector_store = load_vector_store(document_id)

    results = vector_store.similarity_search(
        query=query,
        k=k,
    )

    return results