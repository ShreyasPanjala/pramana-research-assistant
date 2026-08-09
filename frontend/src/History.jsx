import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function History({ onOpenItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/history");
      const data = await res.json();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpen = async (id) => {
    const res = await fetch(`http://127.0.0.1:8000/history/${id}`);
    const data = await res.json();
    onOpenItem(data.result);
  };

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:8000/history/${id}`, { method: "DELETE" });
    setConfirmDeleteId(null);
    fetchHistory();
  };

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Loading history…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-sm mb-1" style={{ color: "var(--text-primary)" }}>
          No papers analyzed yet.
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Upload your first research paper to begin building your research library.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.15em] mb-6" style={{ color: "var(--text-secondary)" }}>
        Your research
      </p>

      <div>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="py-5 border-t flex items-center justify-between gap-4"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              onClick={() => handleOpen(item.id)}
              className="text-left flex-1"
            >
              <p className="text-base font-medium" style={{ color: "var(--text-primary)" }}>
                {item.title || item.filename}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                {formatTime(item.analyzed_at)}
              </p>
            </button>

            {confirmDeleteId === item.id ? (
              <div className="flex items-center gap-2 text-xs">
                <span style={{ color: "var(--text-secondary)" }}>Delete this analysis?</span>
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-2.5 py-1 rounded"
                  style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-2.5 py-1 rounded"
                  style={{ background: "var(--danger)", color: "#fff" }}
                >
                  Delete
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteId(item.id)}
                className="text-xs px-2.5 py-1 rounded shrink-0"
                style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                Delete
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default History;