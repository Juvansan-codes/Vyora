import getGroqClient, { EXTRACTION_MODEL } from './groq';
import { TripMemory } from '@/types/chat';

const EXTRACTION_PROMPT = `You are a data extraction assistant. Analyze the user's message and extract any travel-related information into a JSON object.

Extract ONLY the following fields if mentioned:
- destination (string): The travel destination city/country
- startDate (string): Travel start date in YYYY-MM-DD format if possible
- endDate (string): Travel end date in YYYY-MM-DD format if possible
- duration (number): Trip duration in days
- budget (number): Numeric budget amount only
- currency (string): Currency code like USD, INR, EUR, GBP, etc.
- travelers (number): Number of travelers
- travelStyle (string): e.g., "luxury", "budget", "adventure", "relaxation", "backpacking"
- transportation (string): Preferred transport mode
- accommodation (string): Preferred accommodation type
- interests (string[]): Array of interest areas like ["food", "nature", "history"]
- tripStatus (string): The user's current stage in the travel funnel. MUST be one of: "exploring" (just looking at options), "planning" (building itinerary), "booking" (ready to book flights/hotels), "finalized" (trip is fully booked).

Rules:
- Return ONLY a valid JSON object with the fields found. Do NOT include fields that are not mentioned.
- If no travel data is found, return an empty object: {}
- Do NOT include explanations or markdown — ONLY the JSON object.
- Parse relative dates like "next month" or "in 2 weeks" into approximate dates if possible.
- For budget, extract only the numeric value and set the currency separately.
- Infer number of travelers from context (e.g., "me and my wife" = 2, "family of 4" = 4).

Examples:
User: "I want to visit Bali next month for 5 days with a budget of ₹80,000"
Output: {"destination":"Bali","duration":5,"budget":80000,"currency":"INR"}

User: "Me and my wife want a luxury beach vacation"
Output: {"travelers":2,"travelStyle":"luxury","interests":["beach"]}

User: "Can you suggest some good restaurants?"
Output: {}

User: "I'm just looking at options for my summer vacation."
Output: {"tripStatus":"exploring"}

User: "Help me book my flights to Paris."
Output: {"destination":"Paris","tripStatus":"booking"}`;

/**
 * Extracts structured travel data from a user message using a fast LLM call.
 * Returns only the newly extracted fields (partial TripMemory).
 */
export async function extractMemory(
  userMessage: string
): Promise<Partial<TripMemory>> {
  try {
    const completion = await getGroqClient().chat.completions.create({
      model: EXTRACTION_MODEL,
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content?.trim();
    if (!responseText) return {};

    const extracted = JSON.parse(responseText);

    // Validate and sanitize extracted fields
    const sanitized: Partial<TripMemory> = {};

    if (typeof extracted.destination === 'string' && extracted.destination.length > 0) {
      sanitized.destination = extracted.destination;
    }
    if (typeof extracted.startDate === 'string') {
      sanitized.startDate = extracted.startDate;
    }
    if (typeof extracted.endDate === 'string') {
      sanitized.endDate = extracted.endDate;
    }
    if (typeof extracted.duration === 'number' && extracted.duration > 0) {
      sanitized.duration = extracted.duration;
    }
    if (typeof extracted.budget === 'number' && extracted.budget > 0) {
      sanitized.budget = extracted.budget;
    }
    if (typeof extracted.currency === 'string' && extracted.currency.length > 0) {
      sanitized.currency = extracted.currency.toUpperCase();
    }
    if (typeof extracted.travelers === 'number' && extracted.travelers > 0) {
      sanitized.travelers = extracted.travelers;
    }
    if (typeof extracted.travelStyle === 'string' && extracted.travelStyle.length > 0) {
      sanitized.travelStyle = extracted.travelStyle;
    }
    if (typeof extracted.transportation === 'string' && extracted.transportation.length > 0) {
      sanitized.transportation = extracted.transportation;
    }
    if (typeof extracted.accommodation === 'string' && extracted.accommodation.length > 0) {
      sanitized.accommodation = extracted.accommodation;
    }
    if (Array.isArray(extracted.interests) && extracted.interests.length > 0) {
      sanitized.interests = extracted.interests.filter(
        (i: unknown) => typeof i === 'string' && i.length > 0
      );
    }
    
    if (
      typeof extracted.tripStatus === 'string' &&
      ['exploring', 'planning', 'booking', 'finalized'].includes(extracted.tripStatus)
    ) {
      sanitized.tripStatus = extracted.tripStatus as 'exploring' | 'planning' | 'booking' | 'finalized';
    }

    return sanitized;
  } catch (error) {
    console.error('[MemoryExtractor] Failed to extract memory:', error);
    return {};
  }
}

/**
 * Merges newly extracted fields into existing memory.
 * Only overwrites fields that are explicitly provided in the new data.
 * For arrays (like interests), merges and deduplicates.
 */
export function mergeMemory(
  existing: TripMemory,
  extracted: Partial<TripMemory>
): TripMemory {
  const merged = { ...existing };

  for (const [key, value] of Object.entries(extracted)) {
    if (value === undefined || value === null) continue;

    if (key === 'interests' && Array.isArray(value)) {
      const existingInterests = merged.interests || [];
      const combined = [...new Set([...existingInterests, ...value])];
      merged.interests = combined;
    } else {
      (merged as Record<string, unknown>)[key] = value;
    }
  }

  return merged;
}
