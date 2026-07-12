import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setSuccessMessage("");
    setErrorMessage("");
    setProgress(0);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setErrorMessage("Please select a valid PDF file.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please choose a PDF file first.");
      return;
    }

    try {
      setUploading(true);
      setSuccessMessage("");
      setErrorMessage("");
      setProgress(0);

      // Remove any previously selected document
      localStorage.removeItem("currentDocument");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await api.post("/pdf/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percent);
          }
        },
      });

      // Save uploaded document information
      localStorage.setItem(
        "currentDocument",
        JSON.stringify(response.data.document)
      );

      setSuccessMessage(
        `${response.data.document.filename} uploaded successfully.`
      );

      setSelectedFile(null);
      setProgress(100);

      const input = document.getElementById("pdf-input");

      if (input) {
        input.value = "";
      }
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setErrorMessage(detail);
      } else if (Array.isArray(detail) && detail.length > 0) {
        setErrorMessage(detail[0].msg);
      } else {
        setErrorMessage("Failed to upload PDF. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Upload PDF
          </h1>

          <p className="text-gray-600 mb-8">
            Upload a PDF document to create embeddings for AI-powered search.
          </p>

          <div className="border-2 border-dashed border-indigo-300 rounded-xl p-10 text-center bg-indigo-50">
            <input
              id="pdf-input"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="mb-6 block w-full"
            />

            {selectedFile && (
              <div className="mb-6">
                <p className="font-semibold">
                  {selectedFile.name}
                </p>

                <p className="text-gray-500 text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            {uploading && (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  Uploading... {progress}%
                </p>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 bg-green-100 text-green-700 border border-green-300 rounded-lg p-3">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 bg-red-100 text-red-700 border border-red-300 rounded-lg p-3">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              {uploading ? "Uploading..." : "Upload PDF"}
            </button>
          </div>

          <div className="flex justify-between mt-8">
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
              Chat →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;