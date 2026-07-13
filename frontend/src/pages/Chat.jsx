import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Chat() {
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

  const STORAGE_KEY = documentId
    ? `docmind_chat_${documentId}`
    : "docmind_chat";

  const loadMessages = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const [messages, setMessages] = useState(loadMessages);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const endRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Save chat automatically
  useEffect(() => {
    if (!documentId) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages)
    );
  }, [messages, STORAGE_KEY, documentId]);

  // Auto resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  }, [question]);

  const createMessage = (role, content) => ({
    id:
      Date.now().toString() +
      Math.random().toString(36).slice(2),

    role,

    content,

    timestamp: new Date().toISOString(),
  });

  const formatTime = (time) =>
    new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const copyMessage = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error(err);
    }
  };

  const clearConversation = () => {
    if (
      !window.confirm(
        "Clear this conversation?"
      )
    )
      return;

    setMessages([]);

    if (documentId) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };
    const ask = async () => {
    const q = question.trim();

    if (!documentId) {
      setError("Please upload a PDF first.");
      return;
    }

    if (!q || loading) return;

    setError("");

    const userMessage = createMessage("user", q);

    setMessages((prev) => [...prev, userMessage]);

    setQuestion("");

    setLoading(true);

    try {
      const res = await api.get("/chat", {
        params: {
          document_id: documentId,
          question: q,
        },
      });

      const aiMessage = createMessage(
        "assistant",
        res.data.answer || "No response received."
      );

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      ask();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}

      <header className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            DocMind AI
          </h1>

          <p className="text-gray-500 text-sm">
            {filename || "No document selected"}
          </p>
        </div>

        <div className="flex gap-3">

          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            Dashboard
          </Link>

          <button
            onClick={clearConversation}
            className="px-4 py-2 rounded-lg border text-red-600 hover:bg-red-50"
          >
            Clear Chat
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("currentDocument");
              navigate("/upload");
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Upload Another PDF
          </button>

        </div>

      </header>

      {/* Messages */}

      <main className="max-w-5xl mx-auto h-[calc(100vh-170px)] overflow-y-auto px-6 py-8">

        {messages.length === 0 && (

          <div className="text-center mt-24">

            <h2 className="text-3xl font-bold mb-4">
              Welcome to DocMind AI
            </h2>

            <p className="text-gray-500">
              Ask questions about your uploaded PDF.
            </p>

          </div>

        )}

        {messages.map((message) => (

          <div
            key={message.id}
            className={`mb-6 flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`max-w-[80%] rounded-2xl px-5 py-4 shadow ${
                message.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-white"
              }`}
            >

              <div className="flex justify-between items-center mb-2">

                <span className="font-semibold">
                  {message.role === "user"
                    ? "You"
                    : "DocMind AI"}
                </span>

                <span className="text-xs opacity-70">
                  {formatTime(message.timestamp)}
                </span>

              </div>

              <div className="whitespace-pre-wrap">
                {message.content}
              </div>

              <div className="flex justify-end mt-3">

                <button
                  onClick={() =>
                    copyMessage(message.content)
                  }
                  className="text-xs underline"
                >
                  Copy
                </button>

              </div>

            </div>

          </div>

        ))}

        {loading && (

          <div className="mb-6">

            <div className="bg-white inline-flex rounded-2xl px-5 py-4 shadow">

              <div className="flex gap-2 items-center">

                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>

                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: ".15s" }}
                ></span>

                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: ".3s" }}
                ></span>

                <span className="ml-2 text-gray-500">
                  Thinking...
                </span>

              </div>

            </div>

          </div>

        )}

        <div ref={endRef} />

      </main>
            {/* Error */}
      {error && (
        <div className="max-w-5xl mx-auto px-6 pb-2">
          <div className="rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-3">
            {error}
          </div>
        </div>
      )}

      {/* Input */}
      <footer className="bg-white border-t px-6 py-4">
        <div className="max-w-5xl mx-auto">

          <div className="flex gap-3 items-end">

            <textarea
              ref={textareaRef}
              value={question}
              rows={1}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your PDF..."
              disabled={loading || !documentId}
              className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-h-52 overflow-y-auto"
            />

            <button
              onClick={ask}
              disabled={
                loading ||
                !documentId ||
                !question.trim()
              }
              className="rounded-2xl bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Thinking..." : "Send"}
            </button>

          </div>

          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>
              Press Enter to send • Shift + Enter for new line
            </span>

            <span>
              {messages.length} messages
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}