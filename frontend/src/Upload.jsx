import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const stages = [
  "Extracting paper",
  "Understanding concepts",
  "Retrieving evidence",
  "Building analysis",
];

function Upload({ onUpload, loading, error }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      setStageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 1400);
    return () => clearInterval(interval);
  }, [loading]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  };

  const handleSubmit = () => {
    if (file) onUpload(file);
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  };

  return (
    <div>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className="rounded-xl p-10 text-center backdrop-blur-md transition-all duration-300"
        style={{
          border: `1px solid ${dragActive ? "var(--border-strong)" : "var(--border)"}`,
          background: dragActive ? "var(--accent-soft)" : "rgba(255,255,255,0.02)",
          boxShadow: dragActive ? "0 0 40px rgba(109,117,232,0.15)" : "none",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />

        {loading ? (
          <div className="py-4">
            {stages.map((stage, i) => (
              <motion.p
                key={stage}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: i === stageIndex ? 1 : 0.3 }}
                transition={{ duration: 0.4 }}
                className="text-sm mb-1.5"
                style={{ color: i === stageIndex ? "var(--text-primary)" : "var(--text-secondary)" }}
              >
                {stage}
              </motion.p>
            ))}
          </div>
        ) : file ? (
          <div className="flex items-center justify-center gap-3">
            <div className="text-left">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{formatSize(file.size)}</p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="text-xs px-2.5 py-1 rounded"
              style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm mb-1">Drag and drop your PDF here</p>
            <p className="text-xs mb-5" style={{ color: "var(--text-secondary)" }}>
              PDF up to 20MB
            </p>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(109,117,232,0.25)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => inputRef.current.click()}
              className="text-sm px-5 py-2.5 rounded-lg"
              style={{ border: "1px solid var(--border-strong)", color: "var(--text-primary)" }}
            >
              Choose PDF
            </motion.button>
          </>
        )}
      </motion.div>

      {!loading && (
        <div className="mt-5 flex justify-center">
          <motion.button
            whileHover={file ? { scale: 1.02 } : {}}
            whileTap={file ? { scale: 0.98 } : {}}
            onClick={handleSubmit}
            disabled={!file}
            className="px-7 py-2.5 rounded-lg text-sm font-medium transition-opacity duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Analyze paper
          </motion.button>
        </div>
      )}

      {error && (
        <p className="text-sm mt-4 text-center" style={{ color: "var(--danger)" }}>{error}</p>
      )}
    </div>
  );
}

export default Upload;