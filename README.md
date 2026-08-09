**Pramana**

AI-powered research understanding

Upload a paper. Understand the ideas. Explore the evidence.

Pramana turns dense research papers into structured explanations grounded in retrieved supporting knowledge. Upload a PDF and get the paper's problem, methodology, dataset, results, limitations, and prerequisite concepts, plus questions to test your understanding.

Live app: https://pramana-research-assistant-six.vercel.app API docs: https://pramana-research-assistant.onrender.com/docs

What it does
Upload a research paper PDF
Backend extracts the raw text (PyMuPDF)
Hybrid retrieval pulls supporting knowledge from two sources:
A local knowledge base of core ML concepts (ChromaDB vector search)
Live academic search via the OpenAlex API, so retrieval generalizes to any paper topic
Paper text and retrieved knowledge are sent to an LLM (Groq / Llama 3.3) with a forced JSON schema
The structured analysis is saved to a database and rendered in the frontend
Past analyses are browsable in a persistent History view
Architecture
PDF
 |  PyMuPDF
plain text
 |
 |-- ChromaDB (local concept knowledge base)
 |-- LLM keyword extraction -> OpenAlex API (live academic search)
 |
combined retrieved context
 |
LLM (Groq / Llama 3.3) -- forced structured JSON output
 |
SQLite (persisted history)
 |  FastAPI
React frontend (Vite + Tailwind + Framer Motion)
Tech stack
Frontend: React (Vite), Tailwind CSS, Framer Motion
Backend: Python, FastAPI
PDF processing: PyMuPDF
LLM: Groq API (Llama 3.3 70B)
RAG: ChromaDB (local vector store) + OpenAlex API (live academic retrieval)
Persistence: SQLite
Deployment: Vercel (frontend), Render (backend)
