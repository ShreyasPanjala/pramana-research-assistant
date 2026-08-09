import { useState } from "react";
import { motion } from "framer-motion";
import Upload from "./Upload";
import Analysis from "./Analysis";
import History from "./History";

function Mark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="1.8" fill="var(--accent)" />
      <path d="M20 20 L20 7" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
      <path d="M20 20 L30 26" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
      <path d="M20 20 L10 26" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
      <circle cx="20" cy="7" r="1.4" fill="var(--accent)" opacity="0.85" />
      <circle cx="30" cy="26" r="1.4" fill="var(--accent)" opacity="0.65" />
      <circle cx="10" cy="26" r="1.4" fill="var(--accent)" opacity="0.65" />
    </svg>
  );
}

const headingLines = ["Upload a paper.", "Understand the ideas.", "Explore the evidence."];

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState("home"); // "home" | "history"

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    setResult(null);
    setView("home");
  };

  return (
    <div className="min-h-screen flex flex-col font-body relative" style={{ background: "var(--bg-0)", color: "var(--text-primary)" }}>
      <div className="atmosphere">
        <div className="glow-orb" />
        <div className="dot-field" />
      </div>

      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 border-b backdrop-blur-sm"
        style={{ borderColor: "var(--border)", background: "rgba(5,7,13,0.6)" }}
      >
        <div className="max-w-3xl w-full mx-auto px-6 py-5 relative flex items-center justify-center">
          <button onClick={goHome} className="flex items-center justify-center gap-2.5">
            <Mark size={32} />
            <span className="font-brand text-2xl md:text-3xl tracking-tight">PRAMANA</span>
          </button>

          <div className="absolute right-6 flex items-center gap-5 text-sm">
            <button
              onClick={goHome}
              style={{ color: view === "home" ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              Home
            </button>
            <button
              onClick={() => { setResult(null); setView("history"); }}
              style={{ color: view === "history" ? "var(--text-primary)" : "var(--text-secondary)" }}
            >
              History
            </button>
          </div>
        </div>
      </motion.nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 flex-1 w-full">
        {view === "history" && !result && (
          <div className="pt-14 pb-24">
            <History onOpenItem={(res) => setResult(res)} />
          </div>
        )}

        {view === "home" && !result && (
          <div className="min-h-[calc(100vh-140px)] flex flex-col justify-center">
            <div className="text-center pb-14">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xs uppercase tracking-[0.2em] mb-6"
                style={{ color: "var(--text-secondary)" }}
              >
                AI-powered research understanding
              </motion.p>

              <h1 className="font-brand text-4xl md:text-5xl leading-[1.25] mb-6">
                {headingLines.map((line, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 + i * 0.15, ease: "easeOut" }}
                    className="block"
                  >
                    {line}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.85 }}
                className="text-base max-w-lg mx-auto leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Turn dense research papers into structured explanations,
                supporting knowledge, and questions that test your understanding.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.05 }}
            >
              <Upload onUpload={handleUpload} loading={loading} error={error} />
            </motion.div>
          </div>
        )}

        {result && (
          <div className="pt-14 pb-24">
            <Analysis result={result} onReset={goHome} />
          </div>
        )}
      </div>

      <footer
        className="relative z-10 text-center py-8 text-sm border-t"
        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
      >
        <span>Developed by </span>
        <a href="https://www.linkedin.com/in/shreyas-panjala/" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--accent)" }}>Shreyas Panjala</a>
        <span> · </span>
        <a href="https://github.com/ShreyasPanjala" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--accent)" }}>GitHub</a>
        <span> © 2026</span>
      </footer>
    </div>
  );
}

export default App;