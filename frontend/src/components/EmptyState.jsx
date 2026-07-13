export default function EmptyState({ filename }) {
  const suggestions = [
    "Summarize this document.",
    "What are the key points?",
    "Explain this PDF in simple language.",
    "What are the important conclusions?",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      {/* AI Avatar */}
      <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
        AI
      </div>

      <h2 className="mt-6 text-3xl font-bold text-gray-800">
        Welcome to DocMind AI
      </h2>

      <p className="mt-3 text-gray-500 max-w-xl">
        Ask questions about your uploaded PDF and receive accurate,
        context-aware answers powered by AI.
      </p>

      {filename && (
        <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
          <p className="text-sm text-gray-600">
            Current document
          </p>

          <p className="font-semibold text-indigo-700 break-all">
            {filename}
          </p>
        </div>
      )}

      <div className="mt-10 w-full max-w-xl">
        <h3 className="font-semibold text-gray-700 mb-4">
          Try asking:
        </h3>

        <div className="grid gap-3">
          {suggestions.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-sm text-gray-400">
        Press Enter to send your message.
      </p>
    </div>
  );
}