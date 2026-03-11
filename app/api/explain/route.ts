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

if (mode === "bhojpuri") {
  systemPrompt = `
Explain the topic in funny Bhojpuri style but in Hinglish (Hindi words written in English).

Rules:
- Use Bhojpuri / Bihari tone
- Write in Hinglish (Roman Hindi)
- Use words like: "are bhaiya", "samjha na", "dekho", "ka ho"
- Make it funny and simple
- Add village style analogy
- Keep it short (3–5 lines)

Example style:
"Are bhaiya, blockchain samjho jaise gaon ka bada register. 
Jo bhi kaam hota hai sab likh diya jata hai permanent. 
Ab koi bhi aake usko badal nahi sakta. 
Matlab sab log milke record sambhalte hai. Samjha na?"
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
