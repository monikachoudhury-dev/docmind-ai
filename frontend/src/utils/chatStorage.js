/**
 * DocMind AI Chat Storage
 * Stores chat history separately for each uploaded PDF.
 */

const getKey = (documentId) => `docmind_chat_${documentId}`;

export const loadChat = (documentId) => {
  if (!documentId) return [];

  try {
    const data = localStorage.getItem(getKey(documentId));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load chat:", error);
    return [];
  }
};

export const saveChat = (documentId, messages) => {
  if (!documentId) return;

  try {
    localStorage.setItem(
      getKey(documentId),
      JSON.stringify(messages)
    );
  } catch (error) {
    console.error("Failed to save chat:", error);
  }
};

export const clearChat = (documentId) => {
  if (!documentId) return;

  try {
    localStorage.removeItem(getKey(documentId));
  } catch (error) {
    console.error("Failed to clear chat:", error);
  }
};

export const clearAllChats = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("docmind_chat_")) {
      localStorage.removeItem(key);
    }
  });
};