import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function gradeDocuments(query, context) {
  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
You are a retrieval evaluator.

Determine if the retrieved context contains enough information to answer the question.

Reply ONLY with:
YES
or
NO
`,
        },
        {
          role: "user",
          content: `
Question:
${query}

Context:
${context}
`,
        },
      ],
    });

    return response.choices[0].message.content
      .trim()
      .toUpperCase()
      .includes("YES");
  } catch (err) {
    console.log(err);
    return true;
  }
}

export async function askLLM(query, context) {
  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content: `
You are an intelligent Corrective RAG assistant.

Rules:
- Answer ONLY from the provided context.
- If context is insufficient, clearly say so.
- Use bullet points when useful.
- Be concise but informative.

Context:
${context}
`,
        },
        {
          role: "user",
          content: query,
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.log(error);
    return "Error generating response.";
  }
}
