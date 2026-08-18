'use client';

import Link from 'next/link';
import { ArrowLeft, Copy, Edit3, Trash2, Sparkles, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { use, useEffect, useMemo, useState } from 'react';

type Result = { id: string; operation: string; result: any; createdAt: string };
type Note = { id: string; title: string; subject: string | null; content: string; updatedAt: string; studyResults: Result[] };

export default function StudySession({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [operation, setOperation] = useState('summary');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  async function load(noteId = id) {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes/${noteId}`, { cache: 'no-store' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Unable to load');
      setNote(json.data);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load note.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [id]);

  const current = useMemo(() => {
    if (!note) return null;
    const wanted = operation === 'summary' ? 'summarize' : operation;
    return note.studyResults.find((r) => r.operation === wanted) || null;
  }, [note, operation]);

  async function generate() {
    setBusy(true);
    setError('');
    try {
      const op = operation === 'summary' ? 'summarize' : operation;
      const res = await fetch(`/api/ai/${op}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId: id, operation: op }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Generation failed');
      setCardIndex(0);
      setFlipped(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to generate study material.');
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm('Delete this note and its generated study material?')) return;
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    if (res.ok) window.location.href = '/dashboard';
  }

  async function copyText() {
    if (!current) return;
    await navigator.clipboard.writeText(JSON.stringify(current.result, null, 2));
  }

  if (loading) return <main><div className="container" style={{ padding: '80px 0', color: '#667085' }}>Loading study session…</div></main>;
  if (!note) return <main><div className="container" style={{ padding: '80px 0' }}><h1>We could not open that note.</h1><p style={{ color: '#667085' }}>{error}</p><Link href="/dashboard" className="btn btn-secondary">Back to dashboard</Link></div></main>;

  const cards = current?.result?.flashcards || [];

  return <main><header style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}><div className="container" style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Link href="/dashboard" className="btn btn-ghost"><ArrowLeft size={17} /> Dashboard</Link><div style={{ display: 'flex', gap: 8 }}><Link href={`/notes/${id}/edit`} className="icon-btn" aria-label="Edit note"><Edit3 size={17} /></Link><button className="icon-btn" aria-label="Delete note" onClick={remove}><Trash2 size={17} /></button></div></div></header>
    <div className="container" style={{ padding: '34px 0 70px' }}><div style={{ marginBottom: 24 }}><span className="badge">{note.subject || 'General study'}</span><h1 style={{ fontSize: 36, letterSpacing: '-.035em', margin: '10px 0 5px' }}>{note.title}</h1><p style={{ color: '#667085', margin: 0 }}>Study session · updated {new Date(note.updatedAt).toLocaleString()}</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,.9fr) minmax(0,1.1fr)', gap: 18, alignItems: 'start' }}><section className="card" style={{ padding: 22, position: 'sticky', top: 18 }}><div style={{ fontWeight: 850, marginBottom: 12 }}>Original notes</div><div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75, color: '#455064', fontSize: 14, maxHeight: '67vh', overflow: 'auto' }}>{note.content}</div></section>
        <section className="card" style={{ padding: 22 }}><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}><div style={{ display: 'flex', gap: 6 }}>{[['summary', 'Summary'], ['key-points', 'Key points'], ['flashcards', 'Flashcards']].map(([tabId, label]) => <button key={tabId} role="tab" aria-selected={operation === tabId} className={operation === tabId ? 'btn btn-primary' : 'btn btn-secondary'} style={{ minHeight: 38, padding: '0 13px' }} onClick={() => { setOperation(tabId); setCardIndex(0); setFlipped(false); }}>{label}</button>)}</div><button className="icon-btn" aria-label="Copy generated result" onClick={copyText} disabled={!current}><Copy size={17} /></button></div>
          <div style={{ borderTop: '1px solid #eef0f3', margin: '20px 0' }} />
          {!current && <div style={{ textAlign: 'center', padding: '42px 18px' }}><div style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', margin: '0 auto 13px', borderRadius: 14, background: '#eef3ff', color: '#315efb' }}><Sparkles /></div><h3 style={{ margin: '0 0 7px' }}>Ready to turn these notes into study material?</h3><p style={{ color: '#667085', lineHeight: 1.6, maxWidth: 450, margin: '0 auto 18px' }}>Choose an operation above and let StudyFlow create a structured result grounded in your notes.</p><button className="btn btn-primary" onClick={generate} disabled={busy}><Sparkles size={16} />{busy ? 'Analyzing your notes…' : 'Generate ' + (operation === 'key-points' ? 'key points' : operation)}</button></div>}
          {current && operation === 'summary' && <SummaryView data={current.result} />} {current && operation === 'key-points' && <KeyPointsView data={current.result} />} {current && operation === 'flashcards' && <FlashcardsView cards={cards} index={cardIndex} flipped={flipped} setIndex={setCardIndex} setFlipped={setFlipped} />}
          {current && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22, paddingTop: 16, borderTop: '1px solid #eef0f3' }}><span style={{ fontSize: 12, color: '#667085' }}>Generated {new Date(current.createdAt).toLocaleString()}</span><button className="btn btn-secondary" onClick={generate} disabled={busy}><RotateCw size={15} />{busy ? 'Generating…' : 'Regenerate'}</button></div>}
          {error && <div role="alert" style={{ marginTop: 16, padding: 12, borderRadius: 12, background: '#fff4f2', color: '#b42318', fontSize: 13 }}>{error}</div>}
        </section></div></div></main>;
}

function SectionList({ title, items }: { title: string; items: string[] }) { return <div style={{ marginTop: 20 }}><h3 style={{ fontSize: 15, margin: '0 0 10px' }}>{title}</h3><ul style={{ paddingLeft: 20, margin: 0, color: '#4e596b', lineHeight: 1.8 }}>{items.map((x, i) => <li key={i}>{x}</li>)}</ul></div>; }
function SummaryView({ data }: any) { return <div><div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.45 }}>{data.summary}</div><SectionList title="Key concepts" items={data.keyConcepts} /><SectionList title="Important facts" items={data.importantFacts} />{data.definitions?.length > 0 && <div style={{ marginTop: 20 }}><h3 style={{ fontSize: 15 }}>Definitions</h3>{data.definitions.map((d: any) => <div key={d.term} style={{ padding: '10px 0', borderBottom: '1px solid #eef0f3' }}><b>{d.term}</b><div style={{ color: '#667085', marginTop: 3 }}>{d.definition}</div></div>)}</div>}</div>; }
function KeyPointsView({ data }: any) { return <div><SectionList title="Key concepts" items={data.keyConcepts} /><SectionList title="Important facts" items={data.importantFacts} /><SectionList title="Exam-relevant points" items={data.examPoints} />{data.formulas?.length > 0 && <SectionList title="Formulas" items={data.formulas} />}</div>; }
function FlashcardsView({ cards, index, flipped, setIndex, setFlipped }: { cards: any[]; index: number; flipped: boolean; setIndex: (n: number) => void; setFlipped: (v: boolean) => void }) { if (!cards.length) return <div style={{ padding: 35, textAlign: 'center', color: '#667085' }}>No flashcards were returned. Regenerate the set.</div>; const card = cards[index]; return <div><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#667085', marginBottom: 10 }}><span>Card {index + 1} of {cards.length}</span><span>{Math.round(((index + 1) / cards.length) * 100)}%</span></div><button onClick={() => setFlipped(!flipped)} aria-label="Flip flashcard" style={{ width: '100%', minHeight: 310, border: '1px solid #dfe4ee', borderRadius: 18, background: flipped ? '#eef3ff' : '#fbfcff', padding: 28, textAlign: 'left' }}><div style={{ fontSize: 11, fontWeight: 900, color: '#315efb', textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 18 }}>{flipped ? 'Answer' : 'Question'}</div><div style={{ fontSize: 24, lineHeight: 1.35, fontWeight: 800 }}>{flipped ? card.answer : card.question}</div><div style={{ marginTop: 22, fontSize: 12, color: '#667085' }}>Topic: {card.topic} · {card.difficulty}</div></button><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}><button className="btn btn-secondary" disabled={index === 0} onClick={() => { setIndex(index - 1); setFlipped(false); }}><ChevronLeft size={16} /> Previous</button><span style={{ fontSize: 12, color: '#667085' }}>Press the card to flip</span><button className="btn btn-secondary" disabled={index === cards.length - 1} onClick={() => { setIndex(index + 1); setFlipped(false); }}>Next <ChevronRight size={16} /></button></div></div>; }
