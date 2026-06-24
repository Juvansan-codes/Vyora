import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/lib/models/Conversation';
import TripMemory from '@/lib/models/TripMemory';
import getGroqClient, { CHAT_MODEL } from '@/lib/ai/groq';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import { extractMemory, mergeMemory } from '@/lib/ai/memory-extractor';
import type { TripMemory as TripMemoryType } from '@/types/chat';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user.id;
    const { message, conversationId } = await req.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await dbConnect();

    // 2. Load or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
      });
      if (!conversation) {
        return new Response(JSON.stringify({ error: 'Conversation not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      conversation = new Conversation({
        userId,
        title: message.slice(0, 80).trim() || 'New Trip Chat',
        messages: [],
        memory: {},
      });
    }

    // 3. Load user's working memory
    let memoryDoc = await TripMemory.findOne({ userId });
    if (!memoryDoc) {
      memoryDoc = new TripMemory({ userId });
    }
    const currentMemory: TripMemoryType = {
      destination: memoryDoc.destination,
      startDate: memoryDoc.startDate,
      endDate: memoryDoc.endDate,
      duration: memoryDoc.duration,
      budget: memoryDoc.budget,
      currency: memoryDoc.currency,
      travelers: memoryDoc.travelers,
      travelStyle: memoryDoc.travelStyle,
      transportation: memoryDoc.transportation,
      accommodation: memoryDoc.accommodation,
      interests: memoryDoc.interests,
    };

    // 4. Add user message to conversation
    conversation.messages.push({
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    });

    // 5. Build messages for Groq
    const systemPrompt = buildSystemPrompt(currentMemory);
    const groqMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Include last 20 messages for context window management
    const recentMessages = conversation.messages.slice(-20);
    for (const msg of recentMessages) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        groqMessages.push({ role: msg.role, content: msg.content });
      }
    }

    // 6. Stream the response
    const stream = await getGroqClient().chat.completions.create({
      model: CHAT_MODEL,
      messages: groqMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.9,
    });

    // Create a readable stream for the client
    const encoder = new TextEncoder();
    let fullResponse = '';

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Send the conversation ID first
          const convId = conversation._id.toString();
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'meta', conversationId: convId })}\n\n`)
          );

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'token', content })}\n\n`)
              );
            }
          }

          // Save assistant message
          conversation.messages.push({
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date(),
          });
          await conversation.save();

          // Extract memory in background (non-blocking for the stream)
          extractMemory(message.trim())
            .then(async (extracted) => {
              if (Object.keys(extracted).length > 0) {
                const merged = mergeMemory(currentMemory, extracted);

                // Update working memory
                await TripMemory.findOneAndUpdate(
                  { userId },
                  { $set: merged },
                  { upsert: true, new: true }
                );

                // Update conversation memory snapshot
                conversation.memory = merged;
                await conversation.save();
              }
            })
            .catch((err) => {
              console.error('[Chat] Memory extraction failed:', err);
            });

          // Signal completion
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
          );
          controller.close();
        } catch (error) {
          console.error('[Chat] Streaming error:', error);
          const errorMessage =
            error instanceof Error ? error.message : 'An unexpected error occurred';
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', error: errorMessage })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[Chat API] Error:', error);

    // Handle specific Groq API errors
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    const status =
      errorMessage.includes('rate_limit') || errorMessage.includes('429')
        ? 429
        : errorMessage.includes('authentication') || errorMessage.includes('401')
          ? 401
          : 500;

    const userMessage =
      status === 429
        ? 'Too many requests. Please wait a moment and try again.'
        : status === 401
          ? 'AI service authentication failed. Please check the API key configuration.'
          : 'Something went wrong. Please try again.';

    return new Response(JSON.stringify({ error: userMessage }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
