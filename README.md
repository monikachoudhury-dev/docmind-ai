# DocMind AI 🧠📄

**AI-Powered PDF Question Answering System**

DocMind AI enables users to upload PDF documents and interact with their content through natural language conversation. Built on a Retrieval-Augmented Generation (RAG) architecture, it combines semantic retrieval with Google Gemini to deliver accurate, context-grounded answers — not hallucinations.

---

## 🚀 Live Demo

| | Link |
|---|---|
| **Frontend** | [https://docmind-ai-pied.vercel.app](https://docmind-ai-pied.vercel.app) |
| **Backend API** | [https://docmind-ai-backend-wjl0.onrender.com](https://docmind-ai-backend-wjl0.onrender.com) |

---

## 📌 Features

- 🔐 **JWT Authentication** — Secure registration, login, and per-user data isolation
- 📤 **PDF Upload** — Upload any PDF and have it processed automatically
- 🧩 **RAG Pipeline** — Text extraction → chunking → embedding → FAISS vector index
- 💬 **Natural Language Chat** — Ask questions, get context-grounded AI answers
- 🗃️ **Persistent Chat History** — All conversations stored in PostgreSQL per user
- ☁️ **Cloud Deployed** — Production-ready deployment on Vercel + Render
- 📱 **Responsive UI** — Works on desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite, React Router DOM, Axios, Tailwind CSS |
| **Backend** | FastAPI (Python 3.10+) |
| **Database** | PostgreSQL 14+ with SQLAlchemy ORM + Alembic Migrations |
| **Vector Store** | FAISS (Facebook AI Similarity Search) |
| **AI / LLM** | Google Gemini API |
| **Authentication** | JWT (JSON Web Tokens) + bcrypt password hashing |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |

---

## 🏗️ Architecture

DocMind AI follows a three-tier, decoupled architecture:

```
CLIENT BROWSER (React + Vite SPA)
        ↕ HTTPS / REST / JSON / JWT
FASTAPI APPLICATION SERVER
   ├── Auth Module
   ├── PDF Processing Module
   ├── Chunking + Embedding Module
   ├── Chat Module
   └── JWT Middleware + SQLAlchemy ORM
        ↕
PostgreSQL Database          FAISS Vector Store
(Users, Documents, Chats)    (per-document index)
        ↕
   Google Gemini API (LLM + Embeddings)
```

---

## ⚙️ How It Works

### Document Processing (One-time on upload)
1. User uploads a PDF through the React frontend
2. Backend extracts text using PyPDF / pdfplumber
3. Text is split into overlapping chunks (~800 chars, 100 overlap)
4. Each chunk is embedded via Google Gemini Embedding Model
5. Embeddings stored in a per-document FAISS index
6. Document metadata saved to PostgreSQL

### Question Answering (Every query)
1. User submits a natural language question
2. Backend embeds the question using the same embedding model
3. FAISS similarity search retrieves top-k most relevant chunks
4. Retrieved chunks + question sent to Google Gemini API
5. Gemini generates a context-grounded answer
6. Answer returned to user and saved to chat history

---

## 📁 Folder Structure

```
DocMind Ai/
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, ChatWindow, UploadBox, ProtectedRoute
│   │   ├── pages/            # Login, Register, Dashboard, ChatPage
│   │   ├── services/         # Axios instance, api.js
│   │   ├── context/          # AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/           # user.py, document.py, chat.py (SQLAlchemy)
│   │   ├── schemas/          # Pydantic request/response models
│   │   ├── routers/          # auth.py, documents.py, chat.py
│   │   ├── services/         # pdf_service.py, embedding_service.py,
│   │   │                     # vector_store.py, gemini_service.py
│   │   ├── core/             # config.py, security.py, dependencies.py
│   │   └── database.py
│   ├── alembic/
│   │   └── versions/
│   ├── requirements.txt
│   └── alembic.ini
│
└── README.md
```

---

## 🗄️ Database Schema

```
USERS                    DOCUMENTS                CHAT_MESSAGES
─────────────────────    ─────────────────────    ─────────────────────
id          UUID PK       id          UUID PK       id          UUID PK
email       VARCHAR UQ    user_id     UUID FK       document_id UUID FK
password_hash VARCHAR     filename    VARCHAR       sender      VARCHAR
created_at  TIMESTAMP     index_path  VARCHAR       message     TEXT
                          upload_date TIMESTAMP     created_at  TIMESTAMP
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and receive JWT | No |
| GET | `/documents/` | List uploaded documents | Yes |
| POST | `/documents/upload` | Upload a new PDF | Yes |
| DELETE | `/documents/{id}` | Delete a document | Yes |
| POST | `/chat/{document_id}` | Ask a question | Yes |
| GET | `/chat/{document_id}/history` | Get chat history | Yes |

---

## 🚦 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Google Gemini API Key

---

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/monikachoudhury-dev/DocMind-Ai.git
cd DocMind-Ai/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables (create .env file)
cp .env.example .env
# Fill in your values (see Environment Variables section below)

# Run database migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --reload --port 8000
```

---

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Add VITE_API_BASE_URL=http://localhost:8000

# Start development server
npm run dev
```

---

## 🔐 Environment Variables

### Backend `.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/docmind
JWT_SECRET_KEY=your-super-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🧩 Key Code Snippets

### JWT Token Creation

```python
def create_access_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
```

### Text Chunking

```python
def chunk_text(text: str, chunk_size: int = 800, overlap: int = 100) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks
```

### Axios Instance with JWT Interceptor

```javascript
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## 🧪 Testing

All core workflows were tested across unit, integration, and functional levels.

| Test ID | Description | Result |
|---|---|---|
| TC-01 | Register with valid credentials | ✅ Pass |
| TC-02 | Register with duplicate email | ✅ Pass |
| TC-03 | Login with correct credentials | ✅ Pass |
| TC-04 | Login with wrong password | ✅ Pass |
| TC-05 | Access protected route without token | ✅ Pass |
| TC-06 | Upload valid PDF | ✅ Pass |
| TC-07 | Upload non-PDF file | ✅ Pass |
| TC-08 | Ask question about uploaded PDF | ✅ Pass |
| TC-09 | Request with expired token | ✅ Pass |
| TC-10 | Retrieve chat history | ✅ Pass |
| TC-11 | Large PDF (100+ pages) processing | ✅ Pass |
| TC-12 | Concurrent requests from two users | ✅ Pass |

---

## 🔮 Future Scope

- 🔍 **OCR Support** — Handle scanned/image-based PDFs via Tesseract
- 📚 **Multi-document Chat** — Query across multiple uploaded files simultaneously
- 🎙️ **Voice Input** — Speech-to-text for hands-free question asking
- 🌙 **Dark Mode** — User-toggleable dark theme
- 📊 **Admin Dashboard** — Usage monitoring and user management
- ☁️ **Cloud Vector Storage** — Migrate FAISS to Pinecone, Weaviate, or pgvector for scale
- 💾 **AWS S3 Integration** — Store PDFs and indices in object storage

---

## 🙏 Acknowledgements

Built as a final year B.Tech capstone project at **Modern Institute of Engineering and Technology**, Bandel, Hooghly — affiliated to Maulana Abul Kalam Azad University of Technology, West Bengal — under the guidance of **Prof. Mr. Sandip Kumar Das**, Department of Computer Science & Engineering.

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📬 Contact

**Monika Choudhury**
B.Tech Computer Science & Engineering, 2026
Modern Institute of Engineering and Technology, Bandel, Hooghly

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin)](https://www.linkedin.com/in/monika-choudhury-543263407/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?logo=github)](https://github.com/monikachoudhury-dev)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit-green?logo=vercel)](https://docmind-ai-pied.vercel.app)
