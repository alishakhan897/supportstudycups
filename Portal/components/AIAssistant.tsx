import React, { useEffect, useState } from "react";
import { getAIRecommendations } from "../services/geminiService";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const WELCOME_MESSAGES = [
  "Hi 👋 How can I assist you today?",
  "Looking for the right college? Ask me anything 😊",
  "Tell me your preferences and I’ll suggest colleges 🎓",
  "Need help with colleges, courses or exams?",
];

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<
    { collegeId: number; collegeName: string }[]
  >([]);
  const [message, setMessage] = useState("");
  const [welcome, setWelcome] = useState("");

  // Random welcome message on open
  useEffect(() => {
    if (isOpen) {
      const random =
        WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
      setWelcome(random);
      setResults([]);
      setMessage("");
      setError("");
      setInput("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);
    setMessage("");

    try {
      const data = await getAIRecommendations(input);
      setResults(data.recommendations || []);
      setMessage(data.message || "Here are some colleges you may like:");
    } catch (err) {
      setError("Sorry, I couldn't fetch recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            💡
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              AI College Counselor
            </h2>
            <p className="text-sm text-slate-500">
              Personalized college guidance
            </p>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="bg-slate-50 rounded-xl p-4 min-h-[160px] mb-4 text-sm text-slate-700 space-y-3">
          {welcome && <p>{welcome}</p>}

          {loading && <p className="animate-pulse">Thinking… 🤔</p>}

          {error && <p className="text-red-600">{error}</p>}

          {message && <p>{message}</p>}

          {results.length > 0 && (
            <ul className="list-disc pl-5 space-y-1">
              {results.map((c) => (
                <li key={c.collegeId} className="font-medium">
                  {c.collegeName}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* INPUT */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Government engineering college with low fees"
          className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          rows={3}
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full bg-[#1f4fa8] text-white py-3 rounded-xl font-semibold hover:bg-[#163a7a] transition disabled:opacity-60"
        >
          {loading ? "Finding colleges..." : "Find My College"}
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
