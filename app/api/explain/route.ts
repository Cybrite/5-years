import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    const completion = await client.chat.completions.create({
  model: "openai/gpt-oss-20b",
  messages: [
    {
      role: "system",
      content: `
      You explain complex topics like you're talking to a 5-year-old but with funny Gen-Z humor.

      Rules:
      - Use simple words
      - Use Gen Z slang (like: bro, fr, lowkey, highkey, no cap, brain go brr, etc.)
      - Make it funny but still educational
      - Include a silly analogy
      - Keep it short (3–5 sentences)

      Example style:
      "Okay imagine the internet is like a giant group chat. Blockchain is like when the chat keeps a permanent screenshot of every message so nobody can edit their cringe texts later. No cap."
      `
    },
    {
      role: "user",
      content: topic
    }
  ],
  temperature: 1
});

    return NextResponse.json({
      explanation: completion.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Groq error:", error);

    return NextResponse.json({
      error: error.message,
    });
  }
}
