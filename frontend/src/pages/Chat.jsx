import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Chat() {
  const navigate = useNavigate();
  const currentDocument = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("currentDocument")); }
    catch { return null; }
  }, []);
  const documentId = currentDocument?.document_id;
  const filename = currentDocument?.filename;

  const [messages,setMessages]=useState([]);
  const [question,setQuestion]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const endRef=useRef(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,loading]);

  const ask=async()=>{
    const q=question.trim();
    if(!documentId){ setError("Please upload a PDF first."); return; }
    if(!q) return;
    setError("");
    setMessages(prev=>[...prev,{role:"user",content:q}]);
    setQuestion("");
    setLoading(true);
    try{
      const res=await api.get("/chat",{params:{document_id:documentId,question:q}});
      setMessages(prev=>[...prev,{role:"assistant",content:res.data.answer}]);
    }catch(err){
      setError(err.response?.data?.detail || "Failed to get response.");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg flex flex-col h-[85vh]">
        <div className="border-b p-5">
          <h1 className="text-3xl font-bold">DocMind AI Chat</h1>
          <p className="text-gray-600">{filename || "No document selected"}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length===0 && (
            <div className="text-center text-gray-500 mt-20">
              <h2 className="text-xl font-semibold mb-2">Start chatting with your PDF</h2>
              <p>Ask questions like:</p>
              <ul className="mt-3 space-y-1">
                <li>• Summarize this document.</li>
                <li>• Explain chapter 2.</li>
                <li>• What are the key findings?</li>
              </ul>
            </div>
          )}

          {messages.map((m,i)=>(
            <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${
                m.role==="user"
                ?"bg-indigo-600 text-white"
                :"bg-gray-100 text-gray-800"
              }`}>
                <div className="text-xs font-semibold mb-1">
                  {m.role==="user"?"You":"DocMind AI"}
                </div>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="bg-gray-100 inline-block rounded-2xl px-4 py-3">
              🤖 DocMind AI is thinking...
            </div>
          )}

          <div ref={endRef}/>
        </div>

        {error && <div className="px-6 pb-2 text-red-600">{error}</div>}

        <div className="border-t p-4">
          <textarea
            className="w-full border rounded-lg p-3 resize-none"
            rows={3}
            value={question}
            onChange={(e)=>setQuestion(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key==="Enter" && !e.shiftKey){
                e.preventDefault();
                if(!loading) ask();
              }
            }}
            placeholder="Ask anything about your PDF..."
          />
          <div className="flex justify-between mt-3">
            <Link to="/dashboard" className="text-indigo-600 hover:underline">← Dashboard</Link>
            <div className="space-x-3">
              <button
                onClick={()=>{
                  localStorage.removeItem("currentDocument");
                  navigate("/upload");
                }}
                className="px-4 py-2 border rounded-lg">
                Upload Another PDF
              </button>
              <button
                onClick={ask}
                disabled={loading||!documentId}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400">
                {loading?"Thinking...":"Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}