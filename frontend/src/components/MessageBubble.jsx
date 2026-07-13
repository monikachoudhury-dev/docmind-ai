import { useState } from "react";

export default function MessageBubble({
  role,
  content,
  timestamp,
}) {
  const [copied, setCopied] = useState(false);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const formatTime = (time) => {
    if (!time) return "";

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 mb-6 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
          AI
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-sm ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-white border border-gray-200 text-gray-800"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">
            {isUser ? "You" : "DocMind AI"}
          </span>

          {timestamp && (
            <span
              className={`text-xs ${
                isUser ? "text-indigo-100" : "text-gray-400"
              }`}
            >
              {formatTime(timestamp)}
            </span>
          )}
        </div>

        <div className="whitespace-pre-wrap break-words leading-7">
          {content}
        </div>

        <div className="flex justify-end mt-3">
          <button
            onClick={copyMessage}
            className={`text-sm transition ${
              isUser
                ? "text-indigo-100 hover:text-white"
                : "text-gray-500 hover:text-indigo-600"
            }`}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold shrink-0">
          U
        </div>
      )}
    </div>
  );
}