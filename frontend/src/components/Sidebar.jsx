import { Link } from "react-router-dom";

export default function Sidebar({
  filename,
  onClearChat,
  onUploadAnother,
  messageCount,
}) {
  return (
    <div className="w-72 bg-slate-900 text-white flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">DocMind AI</h1>
        <p className="text-sm text-slate-400 mt-1">
          Chat with your PDF
        </p>
      </div>

      {/* Document Info */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Current Document
        </h2>

        <div className="mt-3 bg-slate-800 rounded-xl p-3">
          <p className="font-medium break-words">
            {filename || "No PDF Selected"}
          </p>

          <p className="text-sm text-slate-400 mt-2">
            Messages: {messageCount}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex-1 p-6 space-y-3">
        <button
          onClick={onClearChat}
          className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-3"
        >
          Clear Chat
        </button>

        <button
          onClick={onUploadAnother}
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-lg py-3"
        >
          Upload Another PDF
        </button>

        <Link
          to="/dashboard"
          className="block text-center bg-slate-700 hover:bg-slate-600 transition rounded-lg py-3"
        >
          Dashboard
        </Link>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-700 text-xs text-slate-400">
        DocMind AI v2.0
      </div>
    </div>
  );
}