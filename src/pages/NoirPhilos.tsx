import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ── hooks ── */
const useCounter = (target: number, duration = 2000, start = false) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let t0: number | null = null
    const tick = (ts: number) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / duration, 1)
      setCount(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, start])
  return count
}

const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

/* ── canvas dots ── */
const Dots: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
    resize()
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.18 + 0.04,
    }))
    let id: number
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(160,130,90,${p.a})`; ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > c.width) p.vx *= -1
        if (p.y < 0 || p.y > c.height) p.vy *= -1
      })
      id = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
}

/* ── divider ── */
const Divider: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...style }}>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, rgba(184,160,122,0.45))' }} />
    <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(184,160,122,0.55)">
      <path d="M12 2L14.5 9.5H22L16 14L18.5 21.5L12 17L5.5 21.5L8 14L2 9.5H9.5L12 2Z" />
    </svg>
    <div style={{ flex: 1, height: 1, background: 'linear-gradient(to left, transparent, rgba(184,160,122,0.45))' }} />
  </div>
)

/* ── feature card ── */
interface FCardProps { icon: string; title: string; desc: string; delay: number; inView: boolean }
const FCard: React.FC<FCardProps> = ({ icon, title, desc, delay, inView }) => {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms, box-shadow .3s, border-color .3s`,
        backgroundColor: hov ? '#ffffff' : 'rgba(255,255,255,0.75)',
        border: `1px solid ${hov ? 'rgba(184,160,122,0.55)' : 'rgba(184,160,122,0.25)'}`,
        borderRadius: 18, padding: 32, position: 'relative',
        boxShadow: hov ? '0 12px 48px rgba(180,155,110,0.18)' : '0 2px 16px rgba(180,155,110,0.06)',
        cursor: 'default',
      }}
    >
      {/* corner marks */}
      {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
        <div key={v+h} style={{ position:'absolute', [v]:12, [h]:12, width:13, height:13,
          [`border${v.charAt(0).toUpperCase()+v.slice(1)}`]:'1px solid rgba(184,160,122,0.35)',
          [`border${h.charAt(0).toUpperCase()+h.slice(1)}`]:'1px solid rgba(184,160,122,0.35)',
        }} />
      ))}
      <div style={{ fontSize: 38, marginBottom: 18 }}>{icon}</div>
      <h3 style={{ fontFamily: '"Instrument Serif", serif', fontSize: 20, color: '#3d2e1e', marginBottom: 10, lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontSize: 14, color: '#7a6a55', lineHeight: 1.8 }}>{desc}</p>
      {/* bottom glow line on hover */}
      <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', height:1, width: hov ? '70%' : 0, background:'linear-gradient(to right, transparent, rgba(184,160,122,0.5), transparent)', transition:'width .4s ease' }} />
    </div>
  )
}

/* ── stat ── */
interface StatProps { value: number; suffix: string; label: string; inView: boolean; delay: number }
const Stat: React.FC<StatProps> = ({ value, suffix, label, inView, delay }) => {
  const n = useCounter(value, 1800, inView)
  return (
    <div style={{ textAlign:'center', opacity: inView?1:0, transform: inView?'translateY(0)':'translateY(20px)', transition:`opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms` }}>
      <div style={{ fontFamily:'"Instrument Serif",serif', fontSize:46, color:'#b8a07a', marginBottom:6 }}>{n}{suffix}</div>
      <div style={{ fontSize:11, color:'#9a8a75', letterSpacing:'0.13em', textTransform:'uppercase' }}>{label}</div>
    </div>
  )
}

/* ── FAQ accordion ── */
const faqs = [
  { q: 'Do I need any technical skills?', a: 'None at all. Just type or speak naturally — Philos understands plain language and handles everything behind the scenes.' },
  { q: 'Which apps does Philos connect to?', a: 'Gmail, Google Calendar, Outlook, Google Drive, Notion, Slack, and more. New integrations are added regularly.' },
  { q: 'Is my data safe?', a: 'Yes. All data is encrypted in transit and at rest. Philos never stores your email content or documents beyond the active session.' },
  { q: 'Can I try it for free?', a: 'Absolutely — no credit card required. The free plan includes unlimited basic tasks and 3 app integrations.' },
]
const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {faqs.map((f, i) => (
        <div key={i}
          style={{ border:'1px solid rgba(184,160,122,0.25)', borderRadius:14, overflow:'hidden', backgroundColor:'rgba(255,255,255,0.7)', transition:'border-color .2s', ...(open===i ? { borderColor:'rgba(184,160,122,0.5)' } : {}) }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px', background:'none', border:'none', cursor:'pointer', textAlign:'left' }}
          >
            <span style={{ fontSize:15, color:'#3d2e1e', fontWeight:500 }}>{f.q}</span>
            <span style={{ color:'#b8a07a', fontSize:20, transform: open===i ? 'rotate(45deg)' : 'rotate(0)', transition:'transform .3s' }}>+</span>
          </button>
          <div style={{ maxHeight: open===i ? 200 : 0, overflow:'hidden', transition:'max-height .35s ease' }}>
            <p style={{ padding:'0 24px 18px', fontSize:14, color:'#7a6a55', lineHeight:1.8 }}>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── main page ── */
const NoirPhilos: React.FC = () => {
  const [vis, setVis] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMsg, setChatMsg] = useState('')
  const [chatLog, setChatLog] = useState<{ from: 'user'|'philos'; text: string }[]>([
    { from: 'philos', text: 'Hi! I\'m Philos. Ask me anything or tell me what you need help with today.' }
  ])
  const chatEndRef = useRef<HTMLDivElement>(null)

  const { ref: statsRef, inView: statsIn } = useInView()
  const { ref: featRef, inView: featIn } = useInView()
  const { ref: faqRef, inView: faqIn } = useInView()
  const { ref: ctaRef, inView: ctaIn } = useInView()

  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t) }, [])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatLog])

  const sendChat = () => {
    if (!chatMsg.trim()) return
    const msg = chatMsg.trim()
    setChatMsg('')
    setChatLog(l => [...l, { from: 'user', text: msg }])
    setTimeout(() => {
      const replies = [
        'Sure! I can draft that for you right away.',
        'On it — give me a moment to organize that.',
        'Great idea. I\'ll set that up in your calendar.',
        'I\'ve connected to your Gmail and found 3 relevant threads.',
        'Done! Your document is ready to download.',
      ]
      setChatLog(l => [...l, { from: 'philos', text: replies[Math.floor(Math.random() * replies.length)] }])
    }, 900)
  }

  const anim = (delay = 0, dx = 0, dy = 24): React.CSSProperties => ({
    opacity: vis ? 1 : 0,
    transform: vis ? 'translate(0,0)' : `translate(${dx}px,${dy}px)`,
    transition: `opacity .8s ease ${delay}ms, transform .8s ease ${delay}ms`,
  })

  const features = [
    { icon: '🗂️', title: 'Instant Documents', desc: 'Generate PDFs, Word files, or any report in seconds. Describe what you need — Philos composes it with precision, formatted and ready to send.' },
    { icon: '📅', title: 'Master Your Schedule', desc: 'Reminders, to-do lists, and your calendar — unified under one intelligence. Philos anticipates your day before you even ask.' },
    { icon: '🔗', title: 'Seamless Integrations', desc: 'Gmail, Google Calendar, Outlook, and beyond — all woven together. Philos operates quietly in the background, so you stay in flow.' },
  ]

  const W: React.CSSProperties = { backgroundColor:'#faf8f4', minHeight:'100vh', position:'relative', overflowX:'hidden', fontFamily:'Inter, sans-serif', color:'#2c1f10' }

  return (
    <div className="philos-page" style={W}>
      <Dots />
      {/* ambient glow */}
      <div style={{ position:'fixed', top:0, left:'50%', transform:'translateX(-50%)', width:900, height:500, pointerEvents:'none', zIndex:0, background:'radial-gradient(ellipse at center, rgba(212,196,168,0.28) 0%, transparent 70%)' }} />

      {/* NAV */}
      <nav style={{ position:'relative', zIndex:20, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'22px 40px', maxWidth:1280, margin:'0 auto' }}>
        <Link to="/" style={{ fontFamily:'"Instrument Serif",serif', color:'#3d2e1e', fontSize:22, textDecoration:'none' }}>
          NOIR
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <Link to="/" style={{ color:'#9a8a75', fontSize:14, textDecoration:'none' }}>Home</Link>
          <button onClick={() => setChatOpen(true)} style={{ padding:'10px 24px', fontSize:14, color:'#b8a07a', border:'1px solid rgba(184,160,122,0.4)', borderRadius:999, background:'none', cursor:'pointer' }}>
            Try Philos
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position:'relative', zIndex:10, minHeight:'88vh', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'center', gap:64, padding:'80px 40px', maxWidth:1280, margin:'0 auto' }}>
        {/* copy */}
        <div style={{ flex:1, minWidth:280, maxWidth:520 }}>
          <div style={anim(0)}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:999, border:'1px solid rgba(184,160,122,0.3)', backgroundColor:'rgba(184,160,122,0.08)', marginBottom:28 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', backgroundColor:'#b8a07a', display:'inline-block', animation:'pulse 2s infinite' }} />
              <span style={{ color:'#b8a07a', fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase' }}>Introducing Philos</span>
            </div>
          </div>
          <div style={anim(100)}>
            <h1 style={{ fontFamily:'"Instrument Serif",serif', fontSize:'clamp(40px,6vw,68px)', lineHeight:1.05, color:'#2c1f10', marginBottom:22 }}>
              Your friendliest<br /><em style={{ fontStyle:'normal', color:'#b8a07a' }}>work companion.</em>
            </h1>
          </div>
          <div style={anim(200)}>
            <p style={{ fontSize:18, color:'#6b5a45', lineHeight:1.7, marginBottom:14 }}>
              Handle docs, schedules, and emails — just by typing or talking. As easy as chatting with a friend.
            </p>
          </div>
          <div style={anim(300)}>
            <p style={{ fontSize:15, color:'#9a8a75', lineHeight:1.8, marginBottom:36 }}>
              Got a mountain of tasks but don't know where to start? Philos has your back. From drafting reports and managing your calendar to sending emails and organizing files — all in one place, no hassle.
            </p>
          </div>
          <div style={{ ...anim(400), display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <button onClick={() => setChatOpen(true)} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'15px 30px', backgroundColor:'#3d2e1e', color:'#f5efe6', borderRadius:999, fontSize:14, fontWeight:500, border:'none', cursor:'pointer' }}>
              Try Philos for free
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
            <span style={{ fontSize:12, color:'#b8a07a' }}>No credit card required</span>
          </div>
        </div>

        {/* figure */}
        <div style={{ ...anim(300, 40, 0), position:'relative', flexShrink:0, width:'clamp(320px,42vw,520px)' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(184,160,122,0.22) 0%, transparent 65%)', borderRadius:'50%', transform:'scale(1.15)' }} />
          <div style={{ position:'relative', zIndex:10, width:'100%', aspectRatio:'1', borderRadius:'50%', overflow:'hidden', border:'1px solid rgba(212,196,168,0.7)', backgroundColor:'#f0e8d8', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 20px 60px rgba(180,155,110,0.22)' }}>
            <img src="/philos-figure.png" alt="Philos" style={{ width:'100%', height:'100%', objectFit:'contain', objectPosition:'center bottom', mixBlendMode:'multiply', transform:'scale(1.06)' }} />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ position:'relative', zIndex:10, padding:'60px 40px', borderTop:'1px solid rgba(212,196,168,0.45)', borderBottom:'1px solid rgba(212,196,168,0.45)', backgroundColor:'rgba(255,255,255,0.55)' }}>
        <div ref={statsRef} style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:40 }}>
          <Stat value={10} suffix="x" label="Faster workflows" inView={statsIn} delay={0} />
          <Stat value={50} suffix="+" label="App integrations" inView={statsIn} delay={100} />
          <Stat value={99} suffix="%" label="Uptime" inView={statsIn} delay={200} />
          <Stat value={0} suffix="" label="Tech skills needed" inView={statsIn} delay={300} />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ position:'relative', zIndex:10, padding:'100px 40px', maxWidth:1280, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:60 }}>
          <Divider style={{ maxWidth:260, margin:'0 auto 28px' }} />
          <h2 style={{ fontFamily:'"Instrument Serif",serif', fontSize:'clamp(30px,4vw,46px)', color:'#2c1f10', marginBottom:14, lineHeight:1.2 }}>
            Everything you need,<br /><em style={{ fontStyle:'normal', color:'#b8a07a' }}>nothing you don't.</em>
          </h2>
          <p style={{ fontSize:15, color:'#9a8a75', maxWidth:380, margin:'0 auto' }}>Just tell Philos what you need, and it gets done.</p>
        </div>
        <div ref={featRef} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:22 }}>
          {features.map((f, i) => <FCard key={i} icon={f.icon} title={f.title} desc={f.desc} delay={i*120} inView={featIn} />)}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ position:'relative', zIndex:10, padding:'70px 40px', maxWidth:860, margin:'0 auto' }}>
        <Divider style={{ marginBottom:56 }} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:36, textAlign:'center' }}>
          {[
            { step:'I', label:'Tell Philos', desc:'Type or speak your request — in plain language, no commands.' },
            { step:'II', label:'Philos thinks', desc:'It understands context, connects your apps, and plans the action.' },
            { step:'III', label:'Done.', desc:'Your document, email, or calendar update — ready in seconds.' },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
              <div style={{ width:46, height:46, borderRadius:'50%', border:'1px solid rgba(184,160,122,0.4)', backgroundColor:'rgba(184,160,122,0.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:'"Instrument Serif",serif', color:'#b8a07a', fontSize:14 }}>{item.step}</span>
              </div>
              <h4 style={{ fontFamily:'"Instrument Serif",serif', color:'#3d2e1e', fontSize:18 }}>{item.label}</h4>
              <p style={{ color:'#9a8a75', fontSize:14, lineHeight:1.75 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ position:'relative', zIndex:10, padding:'80px 40px', maxWidth:760, margin:'0 auto' }}>
        <div ref={faqRef} style={{ opacity: faqIn?1:0, transform: faqIn?'translateY(0)':'translateY(28px)', transition:'opacity .7s ease, transform .7s ease' }}>
          <h2 style={{ fontFamily:'"Instrument Serif",serif', fontSize:'clamp(26px,3vw,38px)', color:'#2c1f10', textAlign:'center', marginBottom:40 }}>
            Common questions
          </h2>
          <FAQ />
        </div>
      </section>

      {/* CTA */}
      <section style={{ position:'relative', zIndex:10, padding:'110px 40px', backgroundColor:'rgba(245,239,230,0.65)' }}>
        <div ref={ctaRef} style={{ maxWidth:660, margin:'0 auto', textAlign:'center', opacity: ctaIn?1:0, transform: ctaIn?'translateY(0)':'translateY(32px)', transition:'opacity .8s ease, transform .8s ease' }}>
          <div style={{ width:88, height:88, borderRadius:'50%', border:'1px solid rgba(184,160,122,0.25)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 36px' }}>
            <div style={{ width:60, height:60, borderRadius:'50%', border:'1px solid rgba(184,160,122,0.35)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:26, color:'#b8a07a' }}>✦</span>
            </div>
          </div>
          <h2 style={{ fontFamily:'"Instrument Serif",serif', fontSize:'clamp(34px,5vw,54px)', color:'#2c1f10', marginBottom:20, lineHeight:1.15 }}>
            Ready to meet<br /><em style={{ fontStyle:'normal', color:'#b8a07a' }}>Philos?</em>
          </h2>
          <p style={{ fontSize:16, color:'#9a8a75', lineHeight:1.75, maxWidth:400, margin:'0 auto 36px' }}>
            Try Philos for free — no credit card required. Your most productive chapter starts here.
          </p>
          <button onClick={() => setChatOpen(true)} style={{ display:'inline-flex', alignItems:'center', gap:12, padding:'17px 38px', backgroundColor:'#3d2e1e', color:'#f5efe6', borderRadius:999, fontSize:16, fontWeight:500, border:'none', cursor:'pointer' }}>
            Begin with Philos
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
          <p style={{ fontSize:12, color:'#c4b49a', marginTop:20, letterSpacing:'0.08em' }}>No credit card · Cancel anytime · Free forever plan</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position:'relative', zIndex:10, borderTop:'1px solid rgba(212,196,168,0.45)', padding:'28px 40px', backgroundColor:'rgba(255,255,255,0.4)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14 }}>
          <span style={{ fontFamily:'"Instrument Serif",serif', color:'#b8a07a', fontSize:18 }}>Philos</span>
          <p style={{ color:'#c4b49a', fontSize:12, letterSpacing:'0.08em' }}>© 2026 NOIR · All rights reserved</p>
          <Link to="/" style={{ color:'#c4b49a', fontSize:12, textDecoration:'none' }}>Back to NOIR</Link>
        </div>
      </footer>

      {/* CHAT WIDGET */}
      {chatOpen && (
        <div style={{ position:'fixed', bottom:24, right:24, zIndex:100, width:340, borderRadius:20, overflow:'hidden', boxShadow:'0 24px 80px rgba(61,46,30,0.22)', border:'1px solid rgba(212,196,168,0.5)', backgroundColor:'#faf8f4', display:'flex', flexDirection:'column' }}>
          {/* header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 18px', backgroundColor:'#3d2e1e' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', backgroundColor:'#f0e8d8', overflow:'hidden' }}>
                <img src="/philos-figure.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', mixBlendMode:'multiply' }} />
              </div>
              <div>
                <div style={{ color:'#f5efe6', fontSize:13, fontWeight:600 }}>Philos</div>
                <div style={{ color:'rgba(245,239,230,0.5)', fontSize:11 }}>AI Companion · Online</div>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ background:'none', border:'none', color:'rgba(245,239,230,0.6)', fontSize:18, cursor:'pointer', lineHeight:1 }}>✕</button>
          </div>
          {/* messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:10, maxHeight:300, minHeight:200 }}>
            {chatLog.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent: m.from==='user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth:'80%', padding:'10px 14px', borderRadius: m.from==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', backgroundColor: m.from==='user' ? '#3d2e1e' : 'rgba(255,255,255,0.85)', color: m.from==='user' ? '#f5efe6' : '#3d2e1e', fontSize:13, lineHeight:1.6, border: m.from==='philos' ? '1px solid rgba(184,160,122,0.2)' : 'none' }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {/* input */}
          <div style={{ display:'flex', gap:8, padding:'12px 14px', borderTop:'1px solid rgba(212,196,168,0.3)', backgroundColor:'rgba(255,255,255,0.6)' }}>
            <input
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key==='Enter' && sendChat()}
              placeholder="Ask Philos anything..."
              style={{ flex:1, padding:'10px 14px', borderRadius:999, border:'1px solid rgba(184,160,122,0.3)', backgroundColor:'#ffffff', fontSize:13, color:'#3d2e1e', outline:'none' }}
            />
            <button onClick={sendChat} style={{ width:38, height:38, borderRadius:'50%', backgroundColor:'#3d2e1e', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="15" height="15" fill="none" stroke="#f5efe6" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* chat bubble trigger */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} style={{ position:'fixed', bottom:24, right:24, zIndex:100, width:56, height:56, borderRadius:'50%', backgroundColor:'#3d2e1e', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 32px rgba(61,46,30,0.3)' }}>
          <svg width="22" height="22" fill="none" stroke="#f5efe6" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        </button>
      )}
    </div>
  )
}

export default NoirPhilos
