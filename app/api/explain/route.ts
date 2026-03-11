import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { topic, mode } = await req.json();

    let systemPrompt = "";

    if (mode === "kid") {
      systemPrompt = `
Explain the topic like you're talking to a 5-year-old.
Use very simple words and a fun analogy.
Keep it short and friendly.
`;
    }

    if (mode === "normal") {
      systemPrompt = `
Explain the topic clearly and simply for a general audience.
Avoid slang.
Use an example to help understanding.
`;
    }

    if (mode === "genz") {
      systemPrompt = `
Explain the topic using chaotic Gen Z humor.

Rules:
- Use slang like bro, fr, lowkey, highkey, no cap
- Make it funny
- Add a ridiculous analogy
- Still explain the concept correctly
`;
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: topic },
      ],
      temperature: 1,
    });

    return NextResponse.json({
      explanation: completion.choices[0].message.content,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
