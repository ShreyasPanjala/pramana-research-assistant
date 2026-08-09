# Pramana

### AI-powered research understanding

Upload a research paper. Understand the ideas. Explore the evidence.

Pramana transforms dense research papers into structured explanations, supporting knowledge, and questions that test your understanding.

**Live App:** https://pramana-research-assistant-six.vercel.app  
**API Docs:** https://pramana-research-assistant.onrender.com/docs

---

## ✨ Features

- 📄 **PDF Analysis** — Extracts research paper text using PyMuPDF.
- 🧠 **Hybrid RAG** — Combines a local ChromaDB knowledge base with live academic retrieval through OpenAlex.
- 🔎 **Academic Context** — Dynamically retrieves relevant research based on the paper's topic.
- 🤖 **Structured LLM Analysis** — Uses Llama 3.3 via Groq with structured JSON output.
- 📚 **Prerequisites & Concepts** — Identifies knowledge needed to understand the paper.
- ❓ **Understanding Questions** — Generates questions to test comprehension.
- 🗃️ **Persistent History** — Stores previous analyses in SQLite.

---

## 🏗️ Architecture

```text
PDF
 │
 ▼
PyMuPDF
 │
 ▼
Paper Text
 │
 ├──────────────► ChromaDB
 │                Local Knowledge
 │
 └──────────────► OpenAlex
                  Academic Retrieval
 │
 ▼
Retrieved Context
 │
 ▼
Groq / Llama 3.3
 │
 ▼
Structured JSON
 │
 ▼
SQLite

🛠️ Tech Stack

Frontend: React, Vite, Tailwind CSS, Framer Motion
Backend: Python, FastAPI
AI: Groq, Llama 3.3
RAG: ChromaDB + OpenAlex
PDF: PyMuPDF
Database: SQLite
Deployment: Vercel + Render

👨‍💻 Author
Shreyas Panjala
 │
 ▼
React Frontend
