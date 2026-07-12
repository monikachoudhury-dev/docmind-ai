import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } =useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Welcome to DocMind AI
              </h1>

              <p className="text-gray-600 mt-3 max-w-2xl">
                Your personal AI-powered knowledge assistant.
                Upload PDF documents, generate intelligent embeddings,
                and chat with your documents using Retrieval-Augmented
                Generation (RAG).
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 transition text-white px-6 py-3 rounded-lg font-medium shadow"
            >
              Logout
            </button>

          </div>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Account Information
          </h2>

          <div className="space-y-2">
            <p className="text-gray-600">
              Logged in as
            </p>

            <p className="text-lg font-semibold text-indigo-600 break-all">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Main Features */}
        <div className="grid gap-8 md:grid-cols-2">

          <Link
            to="/upload"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-5xl mb-4">
              📄
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Upload PDF
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Upload PDF documents and automatically extract text,
              generate embeddings, and create a searchable AI knowledge base.
            </p>

            <div className="mt-6 text-indigo-600 font-semibold">
              Go to Upload →
            </div>
          </Link>

          <Link
            to="/chat"
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-5xl mb-4">
              💬
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Chat with Documents
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Ask natural language questions about your uploaded
              documents and receive AI-generated answers based only
              on your document content.
            </p>

            <div className="mt-6 text-indigo-600 font-semibold">
              Start Chatting →
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;