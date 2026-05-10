import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

import uploadRoute from "./routes/upload.js";
import chatRoute from "./routes/chat.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/upload", uploadRoute);
app.use("/chat", chatRoute);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});