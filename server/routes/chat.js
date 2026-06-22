import express from "express";

import { getVectorStore } from "../services/vector.js";

import {
  askLLM,
  gradeDocuments
} from "../services/llm.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { query, collectionName } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query is required",
      });
    }

    if (!collectionName) {
      return res.status(400).json({
        success: false,
        error: "Collection name missing",
      });
    }

    const vectorStore =
      await getVectorStore(collectionName);

    const retriever =
      vectorStore.asRetriever({
        k: 8,
      });

    const docs =
      await retriever.invoke(query);

    const context =
      docs
        .map((doc) => doc.pageContent)
        .join("\n\n");

    const relevant =
      await gradeDocuments(
        query,
        context
      );

    if (!relevant) {
      return res.json({
        success: true,
        answer:
          "The retrieved chunks do not contain enough information to confidently answer this question.",
        sources: [],
        correctiveRAG: true,
      });
    }

    const answer =
      await askLLM(
        query,
        context
      );

    const sources =
      docs.map((doc) => ({
        page:
          doc.metadata?.loc
            ?.pageNumber || "Unknown",
      }));

    res.json({
      success: true,
      answer,
      sources,
      correctiveRAG: false,
    });
  } catch (error) {
    console.log("CHAT ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
