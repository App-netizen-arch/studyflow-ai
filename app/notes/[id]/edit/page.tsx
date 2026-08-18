'use client';

import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { use, useEffect, useState } from 'react';

export default function EditNote({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadNote() {
      setBusy(true);
      try {
        const r = await fetch(`/api/notes/${id}`, { cache: 'no-store' });
        const j = await r.json();
        if (!cancelled) {
          if (j.success) {
            setTitle(j.data.title);
            setSubject(j.data.subject || '');
            setContent(j.data.content);
          } else {
            setError(j.error?.message || 'Unable to load note');
          }
        }
      } catch {
        if (!cancelled) setError('Unable to load note');
      } finally {
        if (!cancelled) setBusy(false);
      }
    }
    void loadNote();
    return () => { cancelled = true; };
  }, [id]);

  async function save() {
    setBusy(true);
    setError('');
    try {
      const r = await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subject, content }),
      });
      const j = await r.json();
      if (!j.success) setError(j.error?.message || 'Unable to save changes');
      else window.location.href = `/notes/${id}`;
    } catch {
      setError('Unable to save changes. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function del() {
    if (!confirm('Delete this note?')) return;
    const r = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
    if (r.ok) window.location.href = '/dashboard';
  }

  if (busy && !title && !content) return <main><div className="container" style={{ padding: '80px 0', color: '#667085' }}>Loading…</div></main>;

  return <main><header style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}><div className="container" style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Link href={`/notes/${id}`} className="btn btn-ghost"><ArrowLeft size={17} /> Study session</Link><button className="btn btn-primary" onClick={save} disabled={busy}><Save size={16} />{busy ? 'Saving…' : 'Save changes'}</button></div></header><div className="container" style={{ maxWidth: 900, padding: '34px 0 70px' }}><h1 style={{ fontSize: 32, margin: '0 0 5px' }}>Edit note</h1><p style={{ color: '#667085', margin: '0 0 22px' }}>Update the source material before generating a new result.</p><div className="card" style={{ padding: 22 }}><div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 12, marginBottom: 14 }}><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Note title" /><input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Subject" placeholder="Subject" /></div><textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} aria-label="Study notes" />{error && <div role="alert" style={{ marginTop: 14, color: '#b42318' }}>{error}</div>}</div><div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}><button className="btn btn-danger" onClick={del}><Trash2 size={16} /> Delete note</button><Link href={`/notes/${id}`} className="btn btn-secondary">Cancel</Link></div></div></main>;
}
