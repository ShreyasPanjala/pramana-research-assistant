# Pramana

### AI-powered research understanding

**Upload a paper. Understand the ideas. Explore the evidence.**

Pramana transforms dense research papers into structured explanations, supporting knowledge, and questions that test your understanding.

**Live App:** https://pramana-research-assistant-six.vercel.app  
**API Docs:** https://pramana-research-assistant.onrender.com/docs

---

## ✨ Features

- 📄 **PDF Analysis** — Extracts research paper text using PyMuPDF.
- 🧠 **Hybrid RAG** — Combines a local ChromaDB knowledge base with live academic retrieval through OpenAlex.
- 🔎 **Academic Context** — Dynamically retrieves relevant research based on the paper's topic.
- 🤖 **Structured LLM Analysis** — Uses Llama 3.3 via Groq with structured JSON output.
- 📚 **Prerequisite Concepts** — Identifies concepts needed to understand the paper.
- ❓ **Understanding Questions** — Generates questions to test comprehension.
- 🗃️ **Persistent History** — Stores and displays previous analyses using SQLite.

---

## 🏗️ Architecture

```text
                         Research Paper
                               │
                               ▼
                         PDF Extraction
                            PyMuPDF
                               │
                               ▼
                          Paper Text
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
               ChromaDB               OpenAlex
          Local Knowledge Base     Academic Search
                    │                     │
                    └──────────┬──────────┘
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
                               │
                               ▼
                       React Frontend
```

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Framer Motion |
| Backend | Python, FastAPI |
| LLM | Llama 3.3 via Groq |
| RAG | ChromaDB + OpenAlex |
| PDF Processing | PyMuPDF |
| Database | SQLite |
| Deployment | Vercel + Render |

---

## 🔄 How It Works

1. **Upload** a research paper in PDF format.
2. **Extract** the paper's text using PyMuPDF.
3. **Retrieve** relevant concepts from the local ChromaDB knowledge base.
4. **Search** OpenAlex for related academic literature.
5. **Combine** the paper and retrieved context.
6. **Analyze** the content using Llama 3.3 through Groq.
7. **Generate** structured results including methodology, datasets, results, limitations, prerequisites, and questions.
8. **Store** the analysis in SQLite for persistent history.

---



---

## 👨‍💻 Author

**Shreyas Panjala**


---

