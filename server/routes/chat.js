import express from "express";

import { getVectorStore } from "../services/vector.js";

import { askLLM } from "../services/llm.js";

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const { query, collectionName } = req.body;

    if (!query) {

      return res.status(400).json({
        success: false,
        error: "Query is required"
      });

    }

    if (!collectionName) {

      return res.status(400).json({
        success: false,
        error: "Collection name missing"
      });

    }

    const vectorStore = await getVectorStore(collectionName);

    const retriever = vectorStore.asRetriever({
      k: 4
    });

    const docs = await retriever.invoke(query);

    const context = docs.map((doc) => doc.pageContent).join("\n\n");

    const answer = await askLLM(query, context);

    const sources = docs.map((doc) => ({
      page: doc.metadata.loc?.pageNumber || "Unknown"
    }));

    res.json({
      success: true,
      answer,
      sources
    });

  } catch (error) {

    console.log("CHAT ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});

export default router;