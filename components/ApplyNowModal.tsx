import React, { useState, useEffect } from "react";

interface ApplyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "apply" | "brochure";
}

const API_BASE = "http://localhost:5000";

const ApplyNowModal: React.FC<ApplyNowModalProps> = ({
  isOpen,
  onClose,
  mode,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  /* 🔒 Prevent background scroll */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          intent: mode,
        }),
      });

      if (!response.ok) {
        alert("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setIsSubmitted(true);
    } catch {
      alert("Server error. Please try later.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setLoading(false);
    setFormData({ name: "", email: "", phone: "", course: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
             bg-black/60 backdrop-blur-md p-4"
      onClick={handleClose}
    >
      <div
        className="
  relative w-full max-w-5xl rounded-2xl
  bg-gradient-to-br from-[#102A4C] via-[#1A3D66] to-[#0E2440]

  text-white
  shadow-[0_30px_80px_rgba(0,0,0,0.55)]
  border border-white/10
  px-6 py-6 md:px-8 md:py-8
"

        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 h-9 w-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
        >
          ✕
        </button>

        {!isSubmitted ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT */}
            <div className="
  hidden md:block rounded-2xl p-6
  bg-gradient-to-br from-white/10 to-white/5
  backdrop-blur-lg
  border border-white/15
">

              <h3 className="text-lg font-bold">
                How StudyCups Helps You
              </h3>

              <p className="mt-2 text-sm text-white/80 leading-relaxed">
                StudyCups is your trusted education partner.
                We help you compare colleges, understand fees,
                and apply confidently with expert guidance.
              </p>

           <div className="mt-5 grid grid-cols-2 gap-3">
  {[
    {
      title: "Brochure Details",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white-700" viewBox="0 0 20 20" fill="currentColor"> <path d="M4 3a2 2 0 00-2 2v11a2 2 0 002 2h9a2 2 0 002-2V5a2 2 0 00-2-2H4zm2 3h7v2H6V6zm0 4h7v2H6v-2z" /> </svg>
      ),
    },
    {
      title: "Check Detailed Fees",
      icon: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white-700" viewBox="0 0 20 20" fill="currentColor"> <path d="M11 17a1 1 0 001 1h3a1 1 0 001-1v-2H11v2z" /> <path fillRule="evenodd" d="M11 5a1 1 0 011-1h3a1 1 0 011 1v8H11V5zM3 7a1 1 0 011-1h3a1 1 0 011 1v6H3V7z" clipRule="evenodd" /> </svg>
      ),
    },
    {
      title: "Shortlist & Apply",
      icon: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white-700" viewBox="0 0 20 20" fill="currentColor"> <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-7h2v5H9v-5zm0-4h2v2H9V7z" /> </svg>
      ),
    },
    {
      title: "24/7 Counselling",
      icon: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white-700" viewBox="0 0 20 20" fill="currentColor"> <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0z" /> <path d="M9 9h2v4H9z" /> </svg>
      ),
    },
    {
      title: "Scholarships",
      icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white-700" viewBox="0 0 20 20" fill="currentColor"> <path d="M4 3h12v2H4V3zm0 4h12v10l-6-3-6 3V7z" /> </svg>
      ),
    },
    {
      title: "Application Deadlines",
      icon: (
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white-700" viewBox="0 0 20 20" fill="currentColor"> <path d="M6 2a1 1 0 011 1v1h6V3a1 1 0 112 0v1h1a2 2 0 012 2v2H3V6a2 2 0 012-2h1V3a1 1 0 011-1z" /> <path d="M3 9h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /> </svg>
      ),
    },
  ].map((item) => (
    <div
      key={item.title}
      className="
        flex items-center gap-3
        rounded-lg px-3 py-2
        bg-gradient-to-r from-white/15 to-white/5
        border border-white/20
        hover:from-white/25 hover:to-white/10
        transition
      "
    >
      <div className="shrink-0">{item.icon}</div>
      <span className="text-sm font-semibold text-white/90">
        {item.title}
      </span>
    </div>
  ))}
</div>


       
            </div>

            {/* RIGHT FORM */}
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {mode === "brochure"
                  ? "Register to Download Brochure"
                  : "Register Now To Apply"}
              </h2>
              <p className="text-white/70 mb-5">
                Get details and latest updates
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="name"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-dark"
                  />

                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-dark"
                  />

                  <input
                    name="phone"
                    type="tel"
                    placeholder="Mobile Number"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-dark"
                  />

                  {/* CITY — UI ONLY */}
                  <input
                    placeholder="City"
                    className="input-dark"
                  />

                  <select
                    name="course"
                    required
                    value={formData.course}
                    onChange={handleChange}
                    className="input-dark"
                  >
                    <option value="" disabled>
                      Select a course
                    </option>
                    <option className="text-black">B.Tech</option>
                    <option className="text-black">BBA</option>
                    <option className="text-black">MBA</option>
                    <option className="text-black">B.Com</option>
                    <option className="text-black">MBBS</option>
                  </select>
                </div>

                <p className="text-xs text-white/60">
                  By submitting this form, you agree to our Terms of Use.
                </p>

               <button
  type="submit"
  disabled={loading}
  className="
    w-full rounded-lg py-3 font-semibold text-white
    bg-gradient-to-r from-red-500 via-orange-500 to-orange-600
    hover:from-red-600 hover:via-orange-600 hover:to-orange-700
    shadow-lg shadow-orange-500/30
    transition-all duration-300
    disabled:opacity-60
  "
>

                  {loading
                    ? "Submitting..."
                    : mode === "brochure"
                      ? "REGISTER & DOWNLOAD"
                      : "SUBMIT"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold">Thank You!</h2>
            <p className="mt-2 text-white/70">
              Our team will contact you shortly.
            </p>

            <button
              onClick={handleClose}
              className="mt-5 w-full rounded-lg py-3 font-semibold bg-orange-600 hover:bg-orange-700"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* INPUT DARK STYLE */}
      <style>
        {`
          .input-dark {
            width: 100%;
            padding: 0.6rem 0.75rem;
            border-radius: 0.5rem;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            color: white;
            outline: none;
          }
          .input-dark::placeholder {
            color: rgba(255,255,255,0.5);
          }
        `}
      </style>
    </div>
  );
};

export default ApplyNowModal;
