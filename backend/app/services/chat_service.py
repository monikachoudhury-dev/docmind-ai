from app.core.ai import client
from app.services.vector_store import retrieve_relevant_chunks


def ask_question(
    document_id: int,
    question: str,
):
    """
    Ask a question about a document using RAG.
    """

    # Retrieve relevant chunks
    documents = retrieve_relevant_chunks(
        document_id=document_id,
        query=question,
        k=4,
    )

    # Combine retrieved chunks
    context = "\n\n".join(
        doc.page_content
        for doc in documents
    )

    prompt = f"""
You are DocMind AI.

Answer ONLY using the document context below.

If the answer is not found, reply exactly:

I couldn't find that information in the uploaded document.

Document Context:

{context}

Question:

{question}

Answer:
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt,
    )

    return response.text