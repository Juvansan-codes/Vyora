import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/lib/models/Conversation';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const conversations = await Conversation.find({ userId: session.user.id })
      .select('title updatedAt messages')
      .sort({ updatedAt: -1 })
      .lean();

    const summaries = conversations.map((conv: Record<string, unknown>) => ({
      _id: conv._id,
      title: conv.title,
      updatedAt: conv.updatedAt,
      messageCount: Array.isArray(conv.messages) ? conv.messages.length : 0,
    }));

    return Response.json(summaries);
  } catch (error) {
    console.error('[Conversations API] Error:', error);
    return Response.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
