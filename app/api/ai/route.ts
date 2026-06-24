import { NextResponse } from 'next/server';
import getGroqClient, { CHAT_MODEL } from '@/lib/ai/groq';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Call the Groq SDK using the client we configured with process.env.GROQ_API_KEY
    const client = getGroqClient();
    const res = await client.chat.completions.create({
      model: CHAT_MODEL,
      messages: [{ role: 'user', content: prompt }],
    });

    // Return the model's text
    return NextResponse.json({ text: res.choices[0]?.message?.content || '' });
  } catch (error) {
    console.error('AI Route Error:', error);
    return NextResponse.json({ error: 'Failed to fetch AI response' }, { status: 500 });
  }
}
