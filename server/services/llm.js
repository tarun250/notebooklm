import dotenv from "dotenv";

dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

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
You are an intelligent RAG assistant similar to Google NotebookLM.

Your job is to answer questions ONLY using the provided document context.

Rules:
- Answer naturally and clearly.
- Explain concepts in simple language.
- Give slightly detailed answers instead of one-line responses.
- Combine information from multiple chunks if needed.
- Stay grounded in the provided context.
- Do NOT make up information.
- If the answer is not present in the context, say:
  "I could not find this in the uploaded document."

Formatting Rules:
- Use short paragraphs.
- Use bullet points when useful.
- Keep answers readable and structured.
- Mention technical terms clearly.

The context below comes from uploaded documents.

Context:
${context}
`
        },
        {
          role: "user",
          content: query
        }
      ]
    });

    return response.choices[0].message.content;

  } catch (error) {

    console.log("LLM ERROR:", error);

    return "Error generating response.";

  }

}