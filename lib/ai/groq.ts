import Groq from 'groq-sdk';

// Primary model for chat responses
export const CHAT_MODEL = 'llama-3.3-70b-versatile';

// Faster/cheaper model for memory extraction
export const EXTRACTION_MODEL = 'llama-3.1-8b-instant';

// Lazy-initialized Groq client to avoid build-time errors
// (the env var may not be available during static page collection)
let _groq: Groq | null = null;

function getGroqClient(): Groq {
  if (!_groq) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Missing GROQ_API_KEY environment variable. Please add it to .env.local'
      );
    }
    _groq = new Groq({ apiKey });
  }
  return _groq;
}

export default getGroqClient;
