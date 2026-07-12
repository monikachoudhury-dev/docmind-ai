import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome to DocMind AI
            </h1>

            <p className="text-gray-600 mt-2">
              Logged in as:
            </p>

            <p className="font-semibold">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/upload"
            className="border rounded-lg p-6 hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              Upload PDF
            </h2>

            <p className="text-gray-600">
              Upload a PDF and create embeddings for AI search.
            </p>
          </Link>

          <Link
            to="/chat"
            className="border rounded-lg p-6 hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              Chat with Documents
            </h2>

            <p className="text-gray-600">
              Ask questions about your uploaded PDFs.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;