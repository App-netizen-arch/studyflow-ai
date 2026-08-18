import Link from 'next/link';
import { ArrowRight, Brain, CheckCircle2, FileText, Layers3, Sparkles } from 'lucide-react';

export default function Home() {
  return <main>
    <nav className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'22px 0'}}>
      <Link href="/" style={{fontWeight:900,fontSize:20,textDecoration:'none',color:'inherit'}}>StudyFlow<span style={{color:'#315efb'}}> AI</span></Link>
      <Link href="/dashboard" className="btn btn-secondary">Open workspace</Link>
    </nav>
    <section className="container fade-up" style={{padding:'74px 0 70px',display:'grid',gridTemplateColumns:'1.1fr .9fr',gap:44,alignItems:'center'}}>
      <div>
        <span className="badge"><Sparkles size={14}/> AI study assistant</span>
        <h1 style={{fontSize:'clamp(42px,6vw,72px)',lineHeight:1.02,letterSpacing:'-.045em',margin:'18px 0'}}>Turn your notes into <span style={{color:'#315efb'}}>smarter study material.</span></h1>
        <p style={{fontSize:19,lineHeight:1.65,color:'#667085',maxWidth:650,marginBottom:28}}>Paste your lecture notes, textbook sections, or revision material. StudyFlow transforms them into clear summaries, exam-focused key points, and ready-to-use flashcards.</p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}><Link href="/notes/new" className="btn btn-primary">Start studying <ArrowRight size={17}/></Link><a href="#how" className="btn btn-secondary">See how it works</a></div>
        <div style={{display:'flex',gap:18,marginTop:25,flexWrap:'wrap',color:'#667085',fontSize:13}}><span><CheckCircle2 size={15} style={{verticalAlign:'-3px',marginRight:5}}/>Structured AI output</span><span><CheckCircle2 size={15} style={{verticalAlign:'-3px',marginRight:5}}/>Persistent notes</span><span><CheckCircle2 size={15} style={{verticalAlign:'-3px',marginRight:5}}/>Keyboard-friendly</span></div>
      </div>
      <div className="card" style={{padding:16,background:'#fbfcff'}}>
        <div style={{background:'#fff',border:'1px solid #e7eaf0',borderRadius:16,padding:18}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}><div><div style={{fontWeight:800}}>Photosynthesis</div><div style={{fontSize:12,color:'#667085'}}>Biology · just now</div></div><span className="badge">AI ready</span></div>
          <div style={{fontSize:12,color:'#667085',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em'}}>Summary</div>
          <p style={{fontSize:15,lineHeight:1.65}}>Plants convert light energy into chemical energy, using carbon dioxide and water to produce glucose and oxygen.</p>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:14}}>
            <div style={{background:'#f7f8fb',borderRadius:12,padding:13}}><div style={{fontWeight:800,fontSize:12}}>Key points</div><p style={{fontSize:13,color:'#667085',lineHeight:1.5,margin:'7px 0 0'}}>Chloroplasts · Light energy · CO₂ + water</p></div>
            <div style={{background:'#eef3ff',borderRadius:12,padding:13}}><div style={{fontWeight:800,fontSize:12,color:'#315efb'}}>Flashcards</div><p style={{fontSize:13,color:'#52617a',lineHeight:1.5,margin:'7px 0 0'}}>12 cards generated</p></div>
          </div>
        </div>
      </div>
    </section>
    <section id="how" className="container" style={{padding:'28px 0 80px'}}>
      <div style={{textAlign:'center',maxWidth:700,margin:'0 auto 34px'}}><div className="badge">Simple by design</div><h2 style={{fontSize:38,letterSpacing:'-.03em',margin:'14px 0 8px'}}>One focused workflow.</h2><p style={{color:'#667085',lineHeight:1.6}}>No chatbot maze. Your notes stay at the center of the experience.</p></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
        {[['01','Bring your notes',FileText,'Paste or write your study material in a distraction-free editor.'],['02','Choose an operation',Brain,'Pick summary, key points, or flashcards depending on what you need.'],['03','Study the result',Layers3,'Save the generated material, return later, and study at your own pace.']].map(([n,t,I,d])=> <div className="card" key={String(n)} style={{padding:24}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{width:42,height:42,borderRadius:12,display:'grid',placeItems:'center',background:'#eef3ff',color:'#315efb'}}>{typeof I === 'function' && <I size={19}/>}</div><span style={{fontWeight:900,color:'#98a2b3'}}>{n}</span></div><h3 style={{fontSize:18,margin:'22px 0 7px'}}>{String(t)}</h3><p style={{color:'#667085',lineHeight:1.6,margin:0}}>{String(d)}</p></div>)}
      </div>
    </section>
    <footer style={{borderTop:'1px solid #e5e7eb'}}><div className="container" style={{padding:'22px 0',display:'flex',justifyContent:'space-between',color:'#667085',fontSize:13}}><span>StudyFlow AI</span><span>Built as a portfolio-grade full-stack product.</span></div></footer>
  </main>;
}
