import dotenv from "dotenv";

dotenv.config();

import { QdrantVectorStore } from "@langchain/qdrant";

import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";

const embeddings = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2",
});

console.log("QDRANT_URL =", process.env.QDRANT_URL);

export async function getVectorStore(collectionName) {

  return await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName
    }
  );

}

export { embeddings };