import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/lib/models/Conversation';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversationId = req.nextUrl.searchParams.get('conversationId');
    if (!conversationId || conversationId === 'null') {
      return Response.json({});
    }

    await dbConnect();

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: session.user.id,
    }).lean();

    if (!conversation || !conversation.memory) {
      return Response.json({});
    }

    // Return only the memory fields
    return Response.json(conversation.memory);
  } catch (error) {
    console.error('[Memory API] GET error:', error);
    return Response.json({ error: 'Failed to fetch memory' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, memory } = await req.json();
    if (!conversationId || conversationId === 'null') {
      return Response.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    if (!memory || typeof memory !== 'object') {
      return Response.json({ error: 'Invalid memory data' }, { status: 400 });
    }

    await dbConnect();

    const updated = await Conversation.findOneAndUpdate(
      { _id: conversationId, userId: session.user.id },
      { $set: { memory } },
      { new: true }
    ).lean();

    if (!updated) {
       return Response.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return Response.json(updated.memory || {});
  } catch (error) {
    console.error('[Memory API] PUT error:', error);
    return Response.json({ error: 'Failed to update memory' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversationId = req.nextUrl.searchParams.get('conversationId');
    if (!conversationId || conversationId === 'null') {
       return Response.json({ success: true });
    }

    await dbConnect();

    await Conversation.findOneAndUpdate(
      { _id: conversationId, userId: session.user.id },
      { $set: { memory: {} } }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error('[Memory API] DELETE error:', error);
    return Response.json({ error: 'Failed to clear memory' }, { status: 500 });
  }
}
