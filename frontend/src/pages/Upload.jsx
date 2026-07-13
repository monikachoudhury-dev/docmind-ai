import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Chat() {
  const navigate = useNavigate();

  const currentDocument = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentDocument"));
    } catch {
      return null;
    }
  }, []);

  const documentId = currentDocument?.document_id;
  const filename = currentDocument?.filename;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAsk = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setAnswer("");

    if (!documentId) {
      setErrorMessage("Please upload a PDF before starting a chat.");
      return;
    }

    if (!question.trim()) {
      setErrorMessage("Please enter a question.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/chat", {
        params: {
          document_id: documentId,
          question: question.trim(),
        },
      });

      setAnswer(response.data.answer);
    } catch (error) {
      console.error(error);

      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else if (Array.isArray(detail) && detail.length > 0) {
        setErrorMessage(detail[0].msg);
      } else {
        setErrorMessage("Unable to get an answer. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewDocument = () => {
    localStorage.removeItem("currentDocument");
    navigate("/upload");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Chat with your PDF
          </h1>

          <p className="text-gray-600 mb-6">
            Ask questions about your uploaded document using AI.
          </p>

          {documentId ? (
            <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              <p className="font-semibold text-indigo-700">
                Current Document
              </p>

              <p className="text-gray-700 mt-1 break-all">
                {filename}
              </p>
            </div>
          ) : (
            <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
              <p className="text-yellow-800 font-medium">
                No document selected.
              </p>

              <p className="text-sm text-yellow-700 mt-1">
                Please upload a PDF before asking questions.
              </p>
            </div>
          )}

          <form onSubmit={handleAsk}>

            <textarea
              rows={5}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Example: Summarize this document in simple words."
              className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />

            <button
              type="submit"
              disabled={loading || !documentId}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Thinking..." : "Ask AI"}
            </button>

          </form>

          {errorMessage && (
            <div className="mt-6 rounded-lg border border-red-300 bg-red-100 p-4 text-red-700">
              {errorMessage}
            </div>
          )}

          {answer && (
            <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-xl font-semibold mb-4">
                AI Answer
              </h2>

              <div className="whitespace-pre-wrap text-gray-700 leading-7">
                {answer}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-10">

            <Link
              to="/dashboard"
              className="text-indigo-600 hover:underline"
            >
              ← Dashboard
            </Link>

            <button
              onClick={handleNewDocument}
              className="text-indigo-600 hover:underline"
            >
              Upload Another PDF →
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Chat;