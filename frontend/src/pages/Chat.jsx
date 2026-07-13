import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();

  // document_id is passed from Dashboard
  const documentId = location.state?.documentId;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!documentId) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          No document selected.
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleAsk = async (e) => {
    e.preventDefault();

    setError("");
    setAnswer("");

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/chat", {
        params: {
          document_id: documentId,
          question: question,
        },
      });

      setAnswer(response.data.answer);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Failed to get response from server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">

      <div className="card shadow">

        <div className="card-header">
          <h3>Chat with PDF</h3>
        </div>

        <div className="card-body">

          <form onSubmit={handleAsk}>

            <div className="mb-3">

              <label className="form-label">
                Ask a question
              </label>

              <textarea
                rows="4"
                className="form-control"
                placeholder="Ask anything about your uploaded document..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />

            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Thinking..." : "Ask"}
            </button>

          </form>

          {error && (
            <div className="alert alert-danger mt-4">
              {error}
            </div>
          )}

          {answer && (
            <div className="card mt-4">

              <div className="card-header">
                Answer
              </div>

              <div className="card-body">
                <p style={{ whiteSpace: "pre-wrap" }}>
                  {answer}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}