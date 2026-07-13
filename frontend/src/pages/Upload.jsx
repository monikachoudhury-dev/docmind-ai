import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

function Upload() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    setErrorMessage("");

    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];

    if (file.type !== "application/pdf") {
      setErrorMessage("Please select a PDF file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    if (!selectedFile) {
      setErrorMessage("Please select a PDF first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await api.post("/pdf/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Save uploaded document for Chat page
      localStorage.setItem(
        "currentDocument",
        JSON.stringify({
          document_id:
            response.data.document_id ??
            response.data.id ??
            response.data.document?.id,

          filename:
            response.data.filename ??
            response.data.document?.filename ??
            selectedFile.name,
        })
      );

      navigate("/chat");
    } catch (error) {
      console.error(error);

      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else if (Array.isArray(detail) && detail.length > 0) {
        setErrorMessage(detail[0].msg);
      } else {
        setErrorMessage("Failed to upload PDF.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Upload PDF
          </h1>

          <p className="text-gray-600 mb-8">
            Upload a PDF document to start chatting with AI.
          </p>

          <form onSubmit={handleUpload}>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full border border-gray-300 rounded-lg p-3 cursor-pointer"
            />

            {selectedFile && (
              <div className="mt-4 rounded-lg bg-indigo-50 border border-indigo-200 p-3">
                <p className="font-medium text-indigo-700">
                  Selected File
                </p>

                <p className="text-gray-700 break-all">
                  {selectedFile.name}
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 rounded-lg border border-red-300 bg-red-100 p-4 text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Uploading..." : "Upload PDF"}
            </button>

          </form>

          <div className="mt-8 flex justify-between">

            <Link
              to="/dashboard"
              className="text-indigo-600 hover:underline"
            >
              ← Dashboard
            </Link>

            <Link
              to="/chat"
              className="text-indigo-600 hover:underline"
            >
              Go to Chat →
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Upload;