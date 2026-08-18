import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { noteInputSchema } from '@/lib/validation';

const DEMO_USER = 'demo-user@studyflow.local';
async function getUser() { return prisma.user.upsert({ where: { email: DEMO_USER }, update: {}, create: { email: DEMO_USER } }); }

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const user = await getUser();
    const note = await prisma.note.findFirst({ where: { id, userId: user.id }, include: { studyResults: { orderBy: { createdAt: 'desc' } } } });
    if (!note) return NextResponse.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Note not found.' } }, { status: 404 });
    return NextResponse.json({ success: true, data: note, error: null });
  } catch { return NextResponse.json({ success: false, data: null, error: { code: 'NOTE_READ_FAILED', message: 'Unable to load this note.' } }, { status: 500 }); }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const user = await getUser();
    const existing = await prisma.note.findFirst({ where: { id, userId: user.id } });
    if (!existing) return NextResponse.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Note not found.' } }, { status: 404 });
    const parsed = noteInputSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message || 'Invalid note.' } }, { status: 400 });
    const note = await prisma.note.update({ where: { id }, data: { ...parsed.data, subject: parsed.data.subject || null } });
    return NextResponse.json({ success: true, data: note, error: null });
  } catch { return NextResponse.json({ success: false, data: null, error: { code: 'NOTE_UPDATE_FAILED', message: 'Unable to update this note.' } }, { status: 500 }); }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const user = await getUser();
    const existing = await prisma.note.findFirst({ where: { id, userId: user.id } });
    if (!existing) return NextResponse.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Note not found.' } }, { status: 404 });
    await prisma.note.delete({ where: { id } });
    return NextResponse.json({ success: true, data: { id }, error: null });
  } catch { return NextResponse.json({ success: false, data: null, error: { code: 'NOTE_DELETE_FAILED', message: 'Unable to delete this note.' } }, { status: 500 }); }
}
