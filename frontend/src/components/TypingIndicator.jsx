export default function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-6">
      {/* AI Avatar */}
      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
        AI
      </div>

      {/* Bubble */}
      <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
          <span
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></span>
          <span
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></span>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          DocMind AI is thinking...
        </p>
      </div>
    </div>
  );
}