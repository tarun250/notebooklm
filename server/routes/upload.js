import express from "express";

import multer from "multer";

import fs from "fs";

import { PDFLoader }
from "@langchain/community/document_loaders/fs/pdf";

import {
  RecursiveCharacterTextSplitter
}
from "langchain/text_splitter";

import { QdrantVectorStore }
from "@langchain/qdrant";

import { embeddings }
from "../services/vector.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/"
});

router.post(
  "/",
  upload.single("file"),
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          success: false,
          error: "No file uploaded"
        });

      }

      const collectionName =
        `collection_${Date.now()}`;

      let docs;

      // PDF SUPPORT
      if (
        req.file.mimetype ===
        "application/pdf"
      ) {

        const loader =
          new PDFLoader(req.file.path);

        docs = await loader.load();

      }

      // TXT SUPPORT
      else if (
        req.file.mimetype ===
        "text/plain"
      ) {

        const text =
          fs.readFileSync(
            req.file.path,
            "utf-8"
          );

        docs = [
          {
            pageContent: text,
            metadata: {
              source:
                req.file.originalname
            }
          }
        ];

      }

      // CSV SUPPORT
      else if (
        req.file.mimetype ===
        "text/csv"
      ) {

        const text =
          fs.readFileSync(
            req.file.path,
            "utf-8"
          );

        docs = [
          {
            pageContent: text,
            metadata: {
              source:
                req.file.originalname
            }
          }
        ];

      }

      else {

        return res.status(400).json({
          success: false,
          error:
            "Only PDF, TXT and CSV files are supported"
        });

      }

      const splitter =
        new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200
        });

      const splitDocs =
        await splitter.splitDocuments(
          docs
        );

      splitDocs.forEach(
        (doc, index) => {

          doc.metadata.chunk = index;

        }
      );

      await QdrantVectorStore.fromDocuments(
        splitDocs,
        embeddings,
        {
          url:
            process.env.QDRANT_URL,

          apiKey:
            process.env.QDRANT_API_KEY,

          collectionName
        }
      );

      res.json({
        success: true,
        message:
          "Document uploaded and indexed",
        collectionName
      });

    } catch (error) {

      console.log(
        "UPLOAD ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        error: error.message
      });

    }

  }
);

export default router;