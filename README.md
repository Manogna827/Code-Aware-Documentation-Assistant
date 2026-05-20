# Code-Aware Documentation Assistant (LangChain + MongoDB)

An enterprise-ready, educational Retrieval-Augmented Generation (RAG) application built with **Next.js, LangChain, Google Gemini, and MongoDB Atlas Vector Search**.

This project provides a clean, easily understandable pipeline mapping to the standard 7-step RAG architecture using industry-standard LangChain abstractions.

## 🌟 Features
- **LangChain Integration**: Uses official `@langchain` packages for data ingestion, chunking, and chains.
- **Persistent Vector Store**: Uses MongoDB Atlas for reliable and fast vector similarity search.
- **Source Citations**: The AI tells you exactly which chunks it used to generate its answer.
- **Clean Architecture**: Every step of the RAG pipeline is separated into clearly numbered and commented files in `src/lib/rag/`.

## 🏗️ The RAG Pipeline (Code Structure)

Check out the `src/lib/rag/` folder to see exactly how RAG works under the hood:

1. **`1-ingestion.ts`**: Extracts and structures raw text from TXT, MD, and CSV files.
2. **`2-chunking.ts`**: Uses `RecursiveCharacterTextSplitter`.
3. **`3-embeddings.ts`**: Uses `GoogleGenerativeAIEmbeddings`.
4. **`4-vectorStore.ts`**: Connects to `MongoDBAtlasVectorSearch`.
5. **`5-retriever.ts`**: Creates a LangChain Retriever interface.
6. **`6-prompt.ts`**: Builds a `ChatPromptTemplate`.
7. **`7-llm.ts`**: Wires everything together with `createRetrievalChain`.

## 🚀 Getting Started

### 1. Prerequisites
- **Google Gemini API Key**: [Get it here free](https://aistudio.google.com/app/apikey).
- **MongoDB Atlas Account**: [Create a free cluster](https://www.mongodb.com/cloud/atlas/register).

### 2. MongoDB Atlas Vector Search Setup
To use MongoDB as a vector database, you MUST create a Vector Search Index in the Atlas UI.

1. Create a Database named `rag_db` and a Collection named `docs`.
2. Go to the "Atlas Search" tab in your cluster and click "Create Search Index".
3. Choose **Atlas Vector Search** (JSON editor).
4. Select your `rag_db.docs` collection.
5. Use the following exact JSON configuration:
```json
{
  "fields": [
    {
      "numDimensions": 768,
      "path": "embedding",
      "similarity": "cosine",
      "type": "vector"
    }
  ]
}
```
6. Name the index **`vector_index`** and save it. Wait for it to build.

### 3. Local Setup
1. Clone this repository.
2. Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_key_here
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/
   MONGODB_DB_NAME=rag_db
   MONGODB_COLLECTION_NAME=docs
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## ☁️ Deployment (Vercel)
1. Push your code to a GitHub repository.
2. Go to [Vercel.com](https://vercel.com/) and click "Add New Project".
3. Import your GitHub repository.
4. Add your `GEMINI_API_KEY` and `MONGODB_URI` environment variables.
5. Click **Deploy**!
