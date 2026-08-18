import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { aiRequestSchema, type AIOperation } from '@/lib/validation';
import { generateStudyMaterial } from '@/lib/ai';

const DEMO_USER = 'demo-user@studyflow.local';
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 8;
const hits = new Map<string, { count: number; resetAt: number }>();

async function getUser() { return prisma.user.upsert({ where: { email: DEMO_USER }, update: {}, create: { email: DEMO_USER } }); }

export async function POST(request: NextRequest, { params }: { params: Promise<{ operation: string }> }) {
  const { operation } = await params;
  if (!['summarize', 'flashcards', 'key-points'].includes(operation)) return NextResponse.json({ success: false, data: null, error: { code: 'INVALID_OPERATION', message: 'Unsupported study operation.' } }, { status: 400 });

  const key = request.headers.get('x-forwarded-for') || 'demo';
  const now = Date.now(); const current = hits.get(key);
  if (!current || current.resetAt < now) hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
  else if (current.count >= MAX_REQUESTS) return NextResponse.json({ success: false, data: null, error: { code: 'RATE_LIMITED', message: 'Too many generations. Please try again in a minute.' } }, { status: 429 });
  else current.count += 1;

  try {
    const body = await request.json();
    const parsed = aiRequestSchema.safeParse({ ...body, operation });
    if (!parsed.success) return NextResponse.json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Invalid generation request.' } }, { status: 400 });
    const user = await getUser();
    const note = await prisma.note.findFirst({ where: { id: parsed.data.noteId, userId: user.id } });
    if (!note) return NextResponse.json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Note not found.' } }, { status: 404 });

    const result = await generateStudyMaterial(parsed.data.operation as AIOperation, note.content);
    const saved = await prisma.studyResult.create({ data: { noteId: note.id, operation: parsed.data.operation, result: result as object } });
    return NextResponse.json({ success: true, data: saved, error: null });
  } catch (error) {
    console.error('AI generation failed', error instanceof Error ? error.message : error);
    const message = error instanceof Error && error.message === 'AI_NOT_CONFIGURED' ? 'AI is not configured. Add GEMINI_API_KEY to the server environment.' : 'Unable to generate study material right now. Please retry.';
    const code = error instanceof Error && error.message === 'AI_NOT_CONFIGURED' ? 'AI_NOT_CONFIGURED' : 'AI_REQUEST_FAILED';
    return NextResponse.json({ success: false, data: null, error: { code, message } }, { status: 502 });
  }
}
