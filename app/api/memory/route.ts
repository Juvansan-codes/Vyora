import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import TripMemory from '@/lib/models/TripMemory';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const memory = await TripMemory.findOne({ userId: session.user.id }).lean();

    if (!memory) {
      return Response.json({});
    }

    // Return only the memory fields, not the mongo document metadata
    return Response.json({
      destination: (memory as Record<string, unknown>).destination,
      startDate: (memory as Record<string, unknown>).startDate,
      endDate: (memory as Record<string, unknown>).endDate,
      duration: (memory as Record<string, unknown>).duration,
      budget: (memory as Record<string, unknown>).budget,
      currency: (memory as Record<string, unknown>).currency,
      travelers: (memory as Record<string, unknown>).travelers,
      travelStyle: (memory as Record<string, unknown>).travelStyle,
      transportation: (memory as Record<string, unknown>).transportation,
      accommodation: (memory as Record<string, unknown>).accommodation,
      interests: (memory as Record<string, unknown>).interests,
    });
  } catch (error) {
    console.error('[Memory API] GET error:', error);
    return Response.json({ error: 'Failed to fetch memory' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { memory } = await req.json();
    if (!memory || typeof memory !== 'object') {
      return Response.json({ error: 'Invalid memory data' }, { status: 400 });
    }

    await dbConnect();

    const updated = await TripMemory.findOneAndUpdate(
      { userId: session.user.id },
      { $set: memory },
      { upsert: true, new: true }
    ).lean();

    return Response.json(updated);
  } catch (error) {
    console.error('[Memory API] PUT error:', error);
    return Response.json({ error: 'Failed to update memory' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    await TripMemory.findOneAndDelete({ userId: session.user.id });

    return Response.json({ success: true });
  } catch (error) {
    console.error('[Memory API] DELETE error:', error);
    return Response.json({ error: 'Failed to clear memory' }, { status: 500 });
  }
}
