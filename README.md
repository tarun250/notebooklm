# NotebookLM RAG

A full-stack AI-powered PDF chat application inspired by NotebookLM.  
Upload PDFs, ask questions, and get grounded answers using Retrieval-Augmented Generation (RAG).

Built with:
- React + Vite
- Node.js + Express
- LangChain
- Qdrant Vector Database
- OpenRouter LLM API
- HuggingFace Embeddings

---

## Features

- Upload PDF documents
- AI-powered question answering
- Retrieval-Augmented Generation (RAG)
- Source page references
- Dynamic isolated vector collections per upload
- Dark mode UI
- Loading animations
- Cloud deployment support
- Qdrant vector search integration

---

## Tech Stack

### Frontend
- React
- Vite
- Axios

### Backend
- Node.js
- Express
- LangChain
- Qdrant
- Multer
- PDF Loader

### AI / Embeddings
- OpenRouter API
- HuggingFace Transformers
- Xenova/all-MiniLM-L6-v2

---

## Project Structure

```bash
notebooklm-rag/
│
├── client/          # React frontend
│
├── server/          # Express backend
│   ├── routes/
│   ├── services/
│   └── uploads/
│
└── README.md
```

---

## Environment Variables

Create:

```bash
server/.env
```

Add:

```env
OPENROUTER_API_KEY=your_openrouter_api_key

QDRANT_URL=https://your-qdrant-url.qdrant.io

QDRANT_API_KEY=your_qdrant_api_key

PORT=5001
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/tarun250/notebooklm-rag.git
```

```bash
cd notebooklm-rag
```

---

## Backend Setup

```bash
cd server
```

```bash
npm install --legacy-peer-deps
```

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:5001
```

---

## Frontend Setup

Open another terminal:

```bash
cd client
```

```bash
npm install
```

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## Deployment

### Frontend
Deploy on:
- Vercel

### Backend
Deploy on:
- Render

### Vector Database
Use:
- Qdrant Cloud

---

## Future Improvements

- Chat history
- Multiple document support
- Authentication
- Streaming responses
- Semantic search optimization
- Better UI/UX
- PDF preview support

---

## Author
Sakala Tarun
