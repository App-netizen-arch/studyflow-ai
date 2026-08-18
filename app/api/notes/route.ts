import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { noteInputSchema } from '@/lib/validation';

const DEMO_USER = 'demo-user@studyflow.local';

async function getUser() {
  return prisma.user.upsert({ where: { email: DEMO_USER }, update: {}, create: { email: DEMO_USER } });
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    const q = request.nextUrl.searchParams.get('q')?.trim();
    const notes = await prisma.note.findMany({
      where: { userId: user.id, ...(q ? { OR: [{ title: { contains: q } }, { subject: { contains: q } }, { content: { contains: q } }] } : {}) },
      include: { studyResults: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { updatedAt: 'desc' }, take: 100,
    });
    return NextResponse.json({ success: true, data: notes, error: null });
  } catch { return NextResponse.json({ success: false, data: null, error: { code: 'NOTES_READ_FAILED', message: 'Unable to load your notes.' } }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const parsed = noteInputSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message || 'Invalid note.' } }, { status: 400 });
    const user = await getUser();
    const note = await prisma.note.create({ data: { ...parsed.data, subject: parsed.data.subject || null, userId: user.id } });
    return NextResponse.json({ success: true, data: note, error: null }, { status: 201 });
  } catch { return NextResponse.json({ success: false, data: null, error: { code: 'NOTE_CREATE_FAILED', message: 'Unable to save this note.' } }, { status: 500 }); }
}
