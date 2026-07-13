import { useEffect, useRef } from "react";

export default function ChatInput({
  value,
  onChange,
  onSend,
  loading,
  disabled,
}) {
  const textareaRef = useRef(null);

  // Auto resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "0px";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + "px";
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!loading && value.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="border-t bg-white px-6 py-5">
      <div className="flex items-end gap-3">

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled || loading}
          placeholder="Ask anything about your PDF..."
          className="
            flex-1
            resize-none
            rounded-2xl
            border
            border-gray-300
            bg-white
            px-4
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-indigo-500
            focus:border-indigo-500
            max-h-52
            overflow-y-auto
          "
        />

        <button
          onClick={onSend}
          disabled={
            disabled ||
            loading ||
            value.trim() === ""
          }
          className="
            rounded-2xl
            bg-indigo-600
            px-6
            py-3
            font-medium
            text-white
            transition
            hover:bg-indigo-700
            disabled:bg-gray-400
            disabled:cursor-not-allowed
          "
        >
          {loading ? "..." : "Send"}
        </button>

      </div>

      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>Press Enter to send • Shift + Enter for a new line</span>

        <span>{value.length} characters</span>
      </div>
    </div>
  );
}