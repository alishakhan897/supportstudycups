import React, { useEffect, useState } from "react";

interface SupportFabProps {
  onOpenAIBot: () => void;
}

const messages = [
  "Hi 👋",
  "How can I assist you today?",
  "Need college guidance?",
  "Contact us on WhatsApp", 
  "Feel Free to reach out!",
];

const SupportFab: React.FC<SupportFabProps> = ({ onOpenAIBot }) => {
  const [open, setOpen] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);

  // Rotate messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">

      {/* MESSAGE BUBBLE */}
      {!open && showBubble && (
        <div
          onClick={() => setOpen(true)}
          className="
            bg-white text-slate-800
            px-4 py-2
            rounded-2xl
            shadow-lg
            text-sm font-medium
            max-w-[220px]
            cursor-pointer
            animate-fadeIn
          "
        >
          {messages[msgIndex]}
        </div>
      )}

      {/* OPTIONS */}
      {open && (
        <div className="flex flex-col items-center gap-3 mb-1">
          {/* WhatsApp */}
          <a
            href="https://wa.me/918081269969"
            target="_blank"
            rel="noopener noreferrer"
            className="
              h-11 w-11 rounded-full
              bg-green-500
              shadow-lg
              flex items-center justify-center
              hover:bg-green-600 transition
            "
            title="Chat on WhatsApp"
          >
            <img src="/icons/apple.png" className="h-8 w-8" />
          </a>

          {/* AI Assistant */}
          <button
            onClick={() => {
              setOpen(false);
              onOpenAIBot();
            }}
            className="
              h-11 w-11 rounded-full
              bg-[#1f4fa8]
              shadow-lg
              flex items-center justify-center
              hover:bg-[#163a7a] transition
            "
            title="AI Assistant"
          >
            <img src="/icons/chat-bot.png" className="h-8 w-8" />
          </button>
        </div>
      )}

      {/* MAIN FAB */}
      <button
        onClick={() => {
          setOpen(!open);
          setShowBubble(false);
        }}
        className="
          h-20 w-20 rounded-full
          bg-[#0A225A]
          shadow-2xl
          flex items-center justify-center
          hover:scale-105 transition
        "
      >
        {open ? (
          <span className="text-white text-xl">✕</span>
        ) : (
          <img
            src="/icons/live-chat.png"
            className="h-9 w-9"
            style={{ filter: "invert(1)" }}
          />
        )}
      </button>
    </div>
  );
};

export default SupportFab;
