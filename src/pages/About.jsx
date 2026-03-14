import { Link } from 'react-router-dom';
import { ArrowRight, Target, Eye, Layers, Zap, Brain, Code2, Rocket, Shield, Users } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

/* ────────────────────────────────────────────────────────
   UTILITIES
──────────────────────────────────────────────────────── */
function useScrollProg(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setP(Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight))));
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return p;
}

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ────────────────────────────────────────────────────────
   FIXED OVERLAYS
──────────────────────────────────────────────────────── */
function ProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => { const d = document.documentElement; setP(d.scrollTop / (d.scrollHeight - d.clientHeight)); };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 9999, background: 'rgba(0,0,0,0.08)' }}>
      <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg,#0057ff,#7c3aed,#db2777)', boxShadow: '0 0 12px rgba(0,87,255,0.7)', transformOrigin: 'left', transform: `scaleX(${p})`, transition: 'none', willChange: 'transform' }} />
    </div>
  );
}

function Grain() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9990, pointerEvents: 'none', opacity: 0.028,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: '180px' }} />
  );
}


/* ────────────────────────────────────────────────────────
   CANVAS: AURORA MESH
──────────────────────────────────────────────────────── */
function Aurora({ colors = ['#0057ff', '#7c3aed'], style = {}, opacity = 1 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    let W, H, t = 0, raf;
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const orbs = colors.map((col, i) => ({
      col, ph: (i / colors.length) * Math.PI * 2,
      rx: 0.3 + Math.random() * 0.4, ry: 0.25 + Math.random() * 0.4,
      sp: 0.003 + Math.random() * 0.003, sz: 0.4 + Math.random() * 0.3
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      orbs.forEach(o => {
        const x = W * (0.5 + o.rx * Math.cos(t * o.sp + o.ph));
        const y = H * (0.5 + o.ry * Math.sin(t * o.sp * 1.4 + o.ph));
        const r = Math.min(W, H) * o.sz;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, o.col + '2e'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });
      t++; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity, ...style }} />;
}

/* ────────────────────────────────────────────────────────
   CANVAS: CONSTELLATION (stars + lines)
──────────────────────────────────────────────────────── */
function Constellation() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    let W, H, pts, raf;
    const mk = () => Array.from({ length: 48 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
      r: Math.random() * 1.2 + .3, a: Math.random() * .5 + .1,
      ph: Math.random() * Math.PI * 2, sp: .008 + Math.random() * .006
    }));
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; pts = mk(); };
    resize(); window.addEventListener('resize', resize);
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        const a = p.a * (.5 + .5 * Math.sin(t * p.sp + p.ph));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160,200,255,${a})`; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        let connections = 0;
        for (let j = i + 1; j < pts.length && connections < 3; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d2 = dx * dx + dy * dy;
          if (d2 < 8100) { // 90^2 — no sqrt needed
            connections++;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,87,255,${.09 * (1 - d2 / 8100)})`; ctx.lineWidth = .5; ctx.stroke();
          }
        }
      }
      t++; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

/* ────────────────────────────────────────────────────────
   TEXT EFFECTS
──────────────────────────────────────────────────────── */
function GlitchText({ text, style = {} }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const t = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 180); }, 3200 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...style }}>
      {text}
      {glitch && <>
        <span style={{ position: 'absolute', top: 0, left: '2px', color: '#ff0040', opacity: .7, clipPath: 'inset(20% 0 60% 0)', pointerEvents: 'none' }}>{text}</span>
        <span style={{ position: 'absolute', top: 0, left: '-2px', color: '#00ffff', opacity: .7, clipPath: 'inset(60% 0 10% 0)', pointerEvents: 'none' }}>{text}</span>
      </>}
    </span>
  );
}

function ScrambleText({ text, trigger, style = {} }) {
  const [display, setDisplay] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
  useEffect(() => {
    if (!trigger) return;
    let frame = 0, raf;
    const tick = () => {
      frame++;
      setDisplay(text.split('').map((ch, i) => frame > i * 1.5 ? ch : chars[Math.floor(Math.random() * chars.length)]).join(''));
      if (frame < text.length * 1.8) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [trigger, text]);
  return <span style={style}>{display}</span>;
}

function CharStagger({ text, style = {}, baseDelay = 0, color }) {
  const [ref, vis] = useInView(0.15);
  return (
    <div ref={ref} style={style} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span key={i} aria-hidden style={{
          display: 'inline-block', whiteSpace: ch === ' ' ? 'pre' : 'normal',
          color: color || 'inherit',
          opacity: vis ? 1 : 0,
          transform: vis ? 'translateY(0) skewX(0deg)' : 'translateY(100%) skewX(-8deg)',
          transition: `opacity .55s cubic-bezier(.16,1,.3,1) ${baseDelay + i * .036}s, transform .55s cubic-bezier(.16,1,.3,1) ${baseDelay + i * .036}s`,
        }}>{ch}</span>
      ))}
    </div>
  );
}

function Reveal({ children, delay = 0, dir = 'up', style = {} }) {
  const [ref, vis] = useInView(0.1);
  const T = { up: 'translateY(52px)', left: 'translateX(-52px)', right: 'translateX(52px)', scale: 'scale(.86) translateY(24px)' };
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : (T[dir] || T.up), transition: `opacity .8s cubic-bezier(.16,1,.3,1) ${delay}s,transform .8s cubic-bezier(.16,1,.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function Counter({ end, suffix = '' }) {
  const [v, setV] = useState(0), [ref, vis] = useInView(.5), started = useRef(false);
  useEffect(() => {
    if (!vis || started.current) return;
    started.current = true;
    let c = 0; const s = end / 80;
    const t = setInterval(() => { c += s; if (c >= end) { setV(end); clearInterval(t); } else setV(Math.floor(c)); }, 15);
  }, [vis, end]);
  return <span ref={ref}>{v}{suffix}</span>;
}

function Tilt({ children, style = {}, intensity = 12 }) {
  const r = useRef(null);
  return (
    <div ref={r} style={{ willChange: 'transform', transition: 'transform .14s ease', ...style }}
      onMouseMove={e => { const b = r.current.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; r.current.style.transform = `perspective(900px) rotateY(${x * intensity}deg) rotateX(${-y * intensity * .7}deg) scale(1.025)`; }}
      onMouseLeave={() => { r.current.style.transform = ''; }}>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   DATA
──────────────────────────────────────────────────────── */
const STATS = [
  { end: 50, suf: '+', label: 'Projects', sub: 'Delivered globally' },
  { end: 3, suf: '+', label: 'Years', sub: 'Of excellence' },
  { end: 15, suf: '+', label: 'Technologies', sub: 'Mastered' },
  { end: 100, suf: '%', label: 'Satisfaction', sub: 'Every client' },
];

const WHO_PANELS = [
  { num: '01', title: 'We are Synnoviq.', body: "A forward-thinking software company founded on one belief: great technology, built with care, changes everything. We don't build to spec — we build to last." },
  { num: '02', title: 'We are builders.', body: 'From enterprise SaaS platforms to multiplayer game worlds — our engineers, designers, and QA specialists function as one unified team on every engagement.' },
  { num: '03', title: 'We are partners.', body: 'We embed into your vision, communicate like co-founders, and measure our success entirely by yours. Every engagement is a long-term relationship, not a transaction.' },
];

const VALUES = [
  { Icon: Layers, label: 'Synergy', col: '#0057ff', rgb: '0,87,255', desc: 'People, ideas, and technology fused into solutions stronger than any single part.' },
  { Icon: Zap, label: 'Innovation', col: '#7c3aed', rgb: '124,58,237', desc: 'Exploring emerging technology constantly — building smarter, faster, more impactful software.' },
  { Icon: Brain, label: 'Intelligence', col: '#db2777', rgb: '219,39,119', desc: 'Data, insight, and strategic thinking baked into every decision and every pixel.' },
];

const PHIL = [
  { n: '01', Icon: Target,  t: 'Understand First',     d: 'Great software starts with great understanding. We invest deeply in knowing your business, users, and goals before writing a single line of code.',  img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=85', col: '#0057ff', rgb: '0,87,255'     },
  { n: '02', Icon: Code2,   t: 'Agile Architecture',   d: 'Fast iteration on a solid foundation — shipping working software weekly while building for long-term scale with zero technical debt.',               img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=85', col: '#7c3aed', rgb: '124,58,237' },
  { n: '03', Icon: Rocket,  t: 'Modern Technology',    d: 'AI-driven automation, cloud-native architectures, CI/CD pipelines, and advanced analytics power everything we build and ship.',                    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=85', col: '#db2777', rgb: '219,39,119' },
  { n: '04', Icon: Shield,  t: 'Ship with Confidence', d: 'Build with purpose, test relentlessly, and ship with full confidence. Every release is production-ready and battle-tested from day one.',          img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&q=85', col: '#059669', rgb: '5,150,105'  },
];

/* ────────────────────────────────────────────────────────
   ① HERO — 180vh compressed scroll narrative
   0.00→0.40  images slam in from right (fast stagger)
   0.30→0.65  stats row rises from bottom
   0.60→1.00  tagline fades, title shifts left, images
              scale slightly for depth
──────────────────────────────────────────────────────── */
const HERO_IMGS = [
  { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85', label: 'Studio' },
  { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=85', label: 'People' },
  { src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=85', label: 'Work'   },
];
const HERO_PILLS = [
  { icon: '', text: 'Fast delivery cycles' },
  { icon: '', text: 'Product-first thinking' },
  { icon: '', text: 'Enterprise-grade security' },
  { icon: '', text: 'Remote-ready teams' },
];

// Clamp helper
const cl = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function Hero() {
  const wRef = useRef(null);
  const prog = useScrollProg(wRef);

  // No scroll travel — images and stats animate in on load
  const imgP   = 1;
  const statP  = 1;

  const imgIdx = Math.min(HERO_IMGS.length - 1, Math.floor(imgP * HERO_IMGS.length));

  return (
    <div ref={wRef} style={{ height: '100vh', position: 'relative' }}>
      <section style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#020810' }}>

        {/* Aurora + stars */}
        <Aurora colors={['#0057ff', '#7c3aed', '#0d1f4e']} opacity={.5} />
        <Constellation />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 35% 55%, transparent 20%, rgba(2,8,16,.72) 100%)', pointerEvents: 'none' }} />

        {/* ── 3 image strips — slam in from right with tight stagger ── */}
        {HERO_IMGS.map((img, i) => {
          // each strip delayed by 0.12 units — so they fire closely one after another
          const sp = cl((imgP - i * 0.12) / 0.55, 0, 1);
          // ease: fast decelerate
          const ease = 1 - Math.pow(1 - sp, 3);
          const tx = (1 - ease) * 105; // slides from right
          return (
            <div key={i} style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${i * 33.33}%`, width: '33.34%',
              transform: `translateX(${tx}%) translateZ(0)`,
              willChange: 'transform', overflow: 'hidden',
            }}>
              <img src={img.src} alt={img.label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(.55) brightness(.42)' }} />
              {/* blend left edge into dark */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(2,8,16,.88) 0%, rgba(2,8,16,.15) 40%, transparent 100%)' }} />
              {/* right-edge glowing separator */}
              <div style={{ position: 'absolute', top: '15%', bottom: '15%', right: 0, width: 1, background: `linear-gradient(to bottom, transparent, rgba(255,255,255,${ease * 0.12}), transparent)` }} />
            </div>
          );
        })}

        {/* dark overlay that lifts as images arrive */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,8,16,.55)', opacity: 1 - imgP * 0.75, willChange: 'opacity', pointerEvents: 'none' }} />

        {/* ── MAIN CONTENT ── */}
        <div className="abt-hero-content" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 clamp(28px,6vw,80px)' }}>

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 999, fontSize: '.7rem', fontWeight: 600, color: 'rgba(255,255,255,.58)', marginBottom: 24, backdropFilter: 'blur(10px)', alignSelf: 'flex-start', animation: 'aIn .8s .05s both' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', display: 'inline-block', animation: 'glow 2s ease-in-out infinite' }} />
            About Synnoviq
          </div>

          {/* Headline — static, no shift */}
          <div style={{ marginBottom: 20 }}>
            <h1 className="abt-hero-title" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(3.4rem,9vw,9rem)', fontWeight: 900, color: '#fff', lineHeight: .92, letterSpacing: '-.055em', margin: 0 }}>
              <span style={{ display: 'block', animation: 'aIn .7s .05s both' }}>
                <GlitchText text="Synnoviq" style={{ color: '#5aa8ff', fontStyle: 'italic' }} />
              </span>
              <span style={{ display: 'block', animation: 'aIn .7s .14s both', color: 'rgba(255,255,255,.9)' }}>Technologies</span>
            </h1>
            {/* Accent rule — draws in on load */}
            <div style={{ height: 2, marginTop: 16, background: 'linear-gradient(to right,#0057ff,#7c3aed,transparent)', transformOrigin: 'left', animation: 'rulerIn .9s .3s both', width: '50%' }} />
          </div>

          {/* Tagline + CTAs — always visible */}
          <div style={{ maxWidth: 480 }}>
            <p style={{ fontSize: 'clamp(.88rem,1.4vw,1rem)', color: 'rgba(255,255,255,.42)', lineHeight: 1.85, marginBottom: 28, animation: 'aIn .8s .4s both' }}>
              A forward-thinking studio crafting digital experiences through clean code, sharp design, and relentless ambition.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', animation: 'aIn .8s .52s both' }}>
              <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 24px', borderRadius: 11, background: '#0057ff', color: '#fff', fontWeight: 700, fontSize: '.86rem', boxShadow: '0 5px 22px rgba(0,87,255,.48)', transition: 'transform .18s ease, box-shadow .18s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,87,255,.62)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 5px 22px rgba(0,87,255,.48)'; }}>
                Our Services <ArrowRight size={13} />
              </Link>

            </div>
          </div>
        </div>

        {/* ── PILLS ROW — rises from bottom as statP grows ── */}
        <div className="abt-hero-pills" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 clamp(28px,6vw,80px) 36px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end', opacity: statP, transform: `translateY(${(1 - statP) * 52}px) translateZ(0)`, willChange: 'opacity,transform', pointerEvents: statP > 0.1 ? 'auto' : 'none' }}>
          {/* separator line draws across */}
          <div style={{ position: 'absolute', top: 0, left: 'clamp(28px,6vw,80px)', right: 'clamp(28px,6vw,80px)', height: 1, background: 'rgba(255,255,255,.1)', transformOrigin: 'left', transform: `scaleX(${statP}) translateZ(0)`, willChange: 'transform' }} />
          {HERO_PILLS.map(({ icon, text }, i) => {
            const itemO = cl((statP - i * 0.08) / 0.35, 0, 1);
            return (
              <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 999, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', backdropFilter: 'blur(10px)', opacity: itemO, transform: `translateY(${(1-itemO)*16}px) translateZ(0)`, willChange: 'opacity,transform', marginTop: 20 }}>
                <span style={{ fontSize: '.85rem' }}>{icon}</span>
                <span style={{ fontSize: '.72rem', fontWeight: 600, color: 'rgba(255,255,255,.7)', letterSpacing: '.04em' }}>{text}</span>
              </div>
            );
          })}
        </div>



      </section>
      <style>{`
        @keyframes rulerIn{from{transform:scaleX(0);transform-origin:left}to{transform:scaleX(1)}}
        @media (max-width: 640px) {
          .abt-hero-content {
            padding: 0 22px !important;
            justify-content: flex-start !important;
            padding-top: 80px !important;
          }
          .abt-hero-title { font-size: clamp(2.6rem,14vw,4rem) !important; letter-spacing: -.03em !important; line-height: 1.0 !important; }
          .abt-hero-pills { display: none !important; }
          .abt-hero-img-strips { opacity: 0.55 !important; }
          .abt-hero-badge { margin-bottom: 16px !important; }
          .abt-hero-tagline { font-size: .88rem !important; margin-bottom: 20px !important; }
        }
      `}</style>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   ② STATS — liquid morphing numbers on dark
──────────────────────────────────────────────────────── */
function Stats() {
  return (
    <section style={{ background: '#050d1e', position: 'relative', overflow: 'hidden' }}>
      <Aurora colors={['#0057ff', '#7c3aed']} opacity={.35} />
      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <div className="abt-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          {STATS.map(({ end, suf, label, sub }, i) => (
            <Reveal key={label} delay={i * .09}>
              <div style={{ padding: '56px 24px', textAlign: 'center', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,.06)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,.06)' : 'none' }}>
                <div style={{ fontFamily: "'Bebas Neue', 'Oswald', var(--serif)", fontSize: 'clamp(3rem,6.5vw,5rem)', fontWeight: 900, lineHeight: 1, marginBottom: 10, background: 'linear-gradient(135deg,#fff 20%,rgba(90,168,255,.65))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  <Counter end={end} suffix={suf} />
                </div>
                <div style={{ fontSize: '.76rem', fontWeight: 700, color: 'rgba(255,255,255,.38)', letterSpacing: '.13em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.2)' }}>{sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────
   ③ WHO WE ARE — cinematic editorial split
   300vh sticky. Left = fullbleed image with hard clip-path
   wipe between panels. Right = stark dark panel with
   oversized numbering, bold serif headline, body text.
   Scroll-driven: each panel 100vh of scroll budget.
──────────────────────────────────────────────────────── */
const WHO_DATA = [
  {
    num: '01', tag: 'Identity',
    headline: ['We are', 'Synnoviq.'],
    body: "A forward-thinking software company founded on one belief: great technology, built with care, changes everything. We don't build to spec — we build to last.",
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=90',
    accent: '#0057ff', rgb: '0,87,255',
    stat: { val: '50+', label: 'Projects delivered' },
  },
  {
    num: '02', tag: 'Craft',
    headline: ['We are', 'builders.'],
    body: 'From enterprise SaaS platforms to multiplayer game worlds — our engineers, designers, and QA specialists function as one unified team on every engagement.',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=90',
    accent: '#7c3aed', rgb: '124,58,237',
    stat: { val: '15+', label: 'Technologies mastered' },
  },
  {
    num: '03', tag: 'Promise',
    headline: ['We are', 'partners.'],
    body: 'We embed into your vision, communicate like co-founders, and measure our success entirely by yours. Every engagement is a long-term relationship, not a transaction.',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=90',
    accent: '#db2777', rgb: '219,39,119',
    stat: { val: '100%', label: 'Client satisfaction' },
  },
];

function WhoWeAre() {
  const wRef = useRef(null);
  const prog = useScrollProg(wRef);

  const total  = WHO_DATA.length;
  const rawIdx = prog * total;
  const idx    = Math.min(total - 1, Math.floor(rawIdx));
  const intra  = rawIdx - idx; // 0→1 within current panel

  // For first panel always show fully; for others start at 0.3 so
  // content is never invisible at the panel boundary
  const intraAdj = idx === 0 ? Math.max(0.3, intra) : Math.max(0.3, intra);

  // Smooth enter for text
  const tEnter = Math.min(1, intraAdj / 0.5);
  const tE     = 1 - Math.pow(1 - tEnter, 3); // cubic ease-out

  // Image wipe: start already partially revealed
  const wipe   = Math.min(1, intraAdj / 0.35);
  const wipeE  = 1 - Math.pow(1 - wipe, 2);

  const d = WHO_DATA[idx];

  return (
    <div ref={wRef} style={{ height: `${total * 100}vh`, position: 'relative' }}>
      <section className="who-sticky" style={{
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden', display: 'flex',
        background: '#04080f',
      }}>

        {/* ══════════════════════════════════════════
            LEFT — fullbleed image panel (55% width)
            Hard-cuts between panels; clip-path wipe
            reveals the new image from the right edge
        ══════════════════════════════════════════ */}
        <div style={{ position: 'relative', width: '55%', flexShrink: 0, overflow: 'hidden' }}>

          {/* All images stacked; only active one visible */}
          {WHO_DATA.map((item, i) => (
            <div
              key={i}
              style={{
                position: 'absolute', inset: 0,
                clipPath: i === idx
                  ? `inset(0 ${100 - wipeE * 100}% 0 0)`
                  : i < idx ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                transition: i === idx ? 'none' : 'clip-path .0s',
                willChange: 'clip-path',
              }}
            >
              <img
                src={item.img} alt=""
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '110%',
                  objectFit: 'cover',
                  filter: 'saturate(.6) brightness(.55)',
                  transform: `translateY(${i === idx ? intra * -5 : 0}%) translateZ(0)`,
                  willChange: 'transform', transition: 'none',
                }}
              />
              {/* Colour grade overlay */}
              <div style={{ position: 'absolute', inset: 0, background: `rgba(${item.rgb},.28)`, mixBlendMode: 'multiply' }} />
            </div>
          ))}

          {/* Dark right-edge feather — blends into right panel */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 55%, rgba(4,8,15,.95) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(4,8,15,.4) 0%, transparent 20%, transparent 80%, rgba(4,8,15,.7) 100%)', pointerEvents: 'none' }} />

          {/* Bottom-left panel number + tag */}
          <div style={{ position: 'absolute', bottom: 36, left: 36, zIndex: 2 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', borderRadius: 999,
              background: `rgba(${d.rgb},.2)`, backdropFilter: 'blur(12px)',
              border: `1px solid rgba(${d.rgb},.45)`,
              fontSize: '.6rem', fontWeight: 700, letterSpacing: '.14em',
              textTransform: 'uppercase', color: '#fff',
              opacity: wipeE, transform: `translateY(${(1-wipeE)*12}px) translateZ(0)`,
              transition: 'none', willChange: 'opacity,transform',
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: d.accent }} />
              {d.tag}
            </div>
          </div>

          {/* Right-side step dots */}
          <div style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 10, zIndex: 2 }}>
            {WHO_DATA.map((item, i) => (
              <div key={i} style={{
                width: 4, height: i === idx ? 32 : 8,
                borderRadius: 2,
                background: i === idx ? '#fff' : 'rgba(255,255,255,.25)',
                transition: 'height .4s cubic-bezier(.16,1,.3,1)',
                willChange: 'height',
              }} />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            RIGHT — stark editorial text panel
        ══════════════════════════════════════════ */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '60px 48px 60px 52px',
          position: 'relative', overflow: 'hidden',
          background: '#04080f',
        }}>

          {/* Giant ghost number — behind everything */}
          <div style={{
            position: 'absolute', bottom: -40, right: -20,
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(10rem,18vw,15rem)',
            fontWeight: 900, lineHeight: 1,
            color: `rgba(${d.rgb},.06)`,
            letterSpacing: '-.06em',
            pointerEvents: 'none', userSelect: 'none',
            transition: 'color .5s ease',
          }}>{d.num}</div>

          {/* Section label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36,
            opacity: tE, transform: `translateX(${(1-tE)*-24}px) translateZ(0)`,
            willChange: 'opacity,transform',
          }}>
            <div style={{ width: 24, height: 2, borderRadius: 1, background: d.accent, transition: 'background .4s ease' }} />
            <span style={{ fontSize: '.58rem', fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)' }}>Who We Are</span>
            <span style={{ fontSize: '.58rem', fontWeight: 700, letterSpacing: '.1em', color: `rgba(${d.rgb},.7)`, marginLeft: 4 }}>— {d.num} / 0{total}</span>
          </div>

          {/* Headline — two lines, each animates independently */}
          <div style={{ marginBottom: 28, overflow: 'hidden' }}>
            {d.headline.map((line, li) => {
              const lp = Math.min(1, Math.max(0, (tE - li * 0.12) / 0.7));
              const lE = 1 - Math.pow(1 - lp, 3);
              return (
                <div key={`${idx}-${li}`} style={{
                  display: 'block',
                  fontFamily: 'var(--serif)',
                  fontSize: 'clamp(2.8rem,5vw,4.4rem)',
                  fontWeight: 900,
                  lineHeight: 1.0,
                  letterSpacing: '-.045em',
                  color: li === 1 ? d.accent : '#ffffff',
                  fontStyle: li === 1 ? 'italic' : 'normal',
                  opacity: lE,
                  transform: `translateY(${(1-lE)*40}px) translateZ(0)`,
                  willChange: 'opacity,transform',
                  transition: 'color .4s ease',
                  textShadow: li === 1 ? `0 0 80px rgba(${d.rgb},.4)` : 'none',
                }}>
                  {line}
                </div>
              );
            })}
          </div>

          {/* Accent line — draws in */}
          <div style={{
            height: 2, borderRadius: 1, marginBottom: 24,
            background: d.accent,
            width: 64,
            transformOrigin: 'left',
            transform: `scaleX(${tE}) translateZ(0)`,
            willChange: 'transform',
            transition: 'background .4s ease',
          }} />

          {/* Body text */}
          <p style={{
            fontSize: 'clamp(.92rem,1.4vw,1.05rem)',
            color: 'rgba(255,255,255,.58)',
            lineHeight: 1.9, maxWidth: 380,
            marginBottom: 40,
            opacity: Math.max(0, (tE - 0.3) / 0.7),
            transform: `translateY(${Math.max(0,(1 - Math.max(0,(tE-0.3)/0.7)))*20}px) translateZ(0)`,
            willChange: 'opacity,transform',
          }}>{d.body}</p>

          {/* Stat block */}
          <div style={{
            opacity: Math.max(0, (tE - 0.5) / 0.5),
            transform: `translateY(${Math.max(0,(1-Math.max(0,(tE-0.5)/0.5)))*20}px) translateZ(0)`,
            willChange: 'opacity,transform',
          }}>
            <div style={{
              display: 'inline-flex', flexDirection: 'column',
              padding: '20px 28px', borderRadius: 14,
              background: `rgba(${d.rgb},.07)`,
              border: `1px solid rgba(${d.rgb},.2)`,
              transition: 'background .4s ease, border-color .4s ease',
            }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,3.5vw,2.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-.04em' }}>{d.stat.val}</span>
              <span style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginTop: 5 }}>{d.stat.label}</span>
            </div>
          </div>

          {/* Progress bar — bottom of right panel */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,.04)' }}>
            <div style={{ height: '100%', background: `linear-gradient(to right,${d.accent},transparent)`, transformOrigin: 'left', transform: `scaleX(${prog}) translateZ(0)`, willChange: 'transform', transition: 'background .4s ease' }} />
          </div>
        </div>

        {/* Mobile: stack vertically */}
        <style>{`
          @media(max-width:700px){
            section.who-sticky { flex-direction: column !important; }
            section.who-sticky > div:first-child { width: 100% !important; height: 42vh !important; flex-shrink: 0; }
            section.who-sticky > div:last-child  { padding: 28px 24px !important; }
          }
        `}</style>
      </section>
    </div>
  );
}


/* ────────────────────────────────────────────────────────
   ④ MISSION + VISION — angled split cards with
      clip-path wipe on scroll entry + parallax image
──────────────────────────────────────────────────────── */
function MissionVision() {
  const CARDS = [
    { label: 'Mission', Icon: Target, col: '#0057ff', rgb: '0,87,255', img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=85', title: 'Engineering products that move the world forward.', body: "To empower businesses with high-quality, scalable software — delivering platforms and game experiences that solve real problems and drive measurable growth." },
    { label: 'Vision', Icon: Eye, col: '#7c3aed', rgb: '124,58,237', img: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=900&q=85', title: 'A globally trusted technology partner.', body: "To become the go-to studio recognised for technical excellence, creative engineering, and a relentless commitment to digital products that make a lasting impact." },
  ];
  return (
    <section style={{ background: '#f2f4f8', padding: '100px 0', borderTop: '1px solid var(--rule)' }}>
      <div className="wrap">
        <Reveal style={{ textAlign: 'center', marginBottom: 68 }}>
          <p style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink20)', marginBottom: 14 }}>Our Purpose</p>
          <CharStagger text="Mission & Vision" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.4rem,6vw,4.8rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.04em' }} />
        </Reveal>
        <div className="mv-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          {CARDS.map(({ label, Icon, col, rgb, img, title, body }, i) => (
            <MvCard key={label} label={label} Icon={Icon} col={col} rgb={rgb} img={img} title={title} body={body} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MvCard({ label, Icon, col, rgb, img, title, body, i }) {
  const [ref, vis] = useInView(.12);
  const [hover, setHover] = useState(false);
  return (
    <div ref={ref}>
      <Tilt style={{ borderRadius: 22, overflow: 'hidden', background: '#fff', border: '1px solid #e4e9f0', boxShadow: '0 4px 32px rgba(0,0,0,.06)', transition: 'box-shadow .3s' }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {/* Image with diagonal clip-path reveal */}
        <div className="mv-img" style={{ position: 'relative', overflow: 'hidden' }}>
          <img src={img} alt={label} style={{ width: '100%', height: '130%', objectFit: 'cover', transform: hover ? 'scale(1.06) translateY(-3%) translateZ(0)' : 'scale(1) translateZ(0)', transition: 'transform .7s cubic-bezier(.16,1,.3,1)', filter: 'saturate(.85)', willChange: 'transform' }} />
          {/* Diagonal wipe overlay that disappears on entry */}
          <div style={{ position: 'absolute', inset: 0, background: i === 0 ? '#f2f4f8' : '#f2f4f8', clipPath: vis ? (i === 0 ? 'polygon(100% 0,100% 0,100% 100%,100% 100%)' : 'polygon(0 0,0 0,0 100%,0 100%)') : (i === 0 ? 'polygon(0 0,100% 0,100% 100%,0 100%)' : 'polygon(0 0,100% 0,100% 100%,0 100%)'), transition: 'clip-path 1.1s cubic-bezier(.16,1,.3,1) .15s', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 30%,rgba(0,0,0,.62))' }} />
          {/* Floating badge */}
          <div style={{ position: 'absolute', bottom: 20, left: 22, display: 'flex', alignItems: 'center', gap: 10, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(18px)', transition: 'all .7s .5s ease' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(${rgb},.22)`, backdropFilter: 'blur(12px)', border: `1px solid rgba(${rgb},.55)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><Icon size={17} /></div>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#fff' }}>{label}</span>
          </div>
        </div>
        {/* Content */}
        <div style={{ padding: '32px 36px 38px' }}>
          {/* Animated accent line */}
          <div style={{ height: 3, borderRadius: 2, background: col, marginBottom: 22, width: 44, transformOrigin: 'left', transform: vis ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 1s cubic-bezier(.16,1,.3,1) .35s', willChange: 'transform' }} />
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.15rem,2.5vw,1.65rem)', fontWeight: 800, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 14, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(14px)', transition: 'all .7s .3s ease' }}>{title}</h3>
          <p style={{ fontSize: '.94rem', color: 'var(--ink60)', lineHeight: 1.88, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(10px)', transition: 'all .7s .45s ease' }}>{body}</p>
        </div>
      </Tilt>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   ⑤ VALUES — dark section, cards orbit in from angles
──────────────────────────────────────────────────────── */
function Values() {
  return (
    <section style={{ background: '#020810', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,.05)', position: 'relative', overflow: 'hidden' }}>
      <Aurora colors={['#0057ff', '#7c3aed', '#db2777']} opacity={.55} />
      {/* Big faint background brand text */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: 'var(--serif)', fontSize: 'clamp(8rem,20vw,18rem)', fontWeight: 900, color: 'rgba(255,255,255,.015)', whiteSpace: 'nowrap', letterSpacing: '-.05em', pointerEvents: 'none', userSelect: 'none' }}>VALUES</div>
      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginBottom: 14 }}>Core Values</p>
          <CharStagger text="What We Stand For" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.4rem,6vw,4.2rem)', fontWeight: 900, color: '#fff', letterSpacing: '-.038em' }} />
        </Reveal>
        <div className="val-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
          {VALUES.map(({ Icon, label, col, rgb, desc }, i) => {
            const [ref, vis] = useInView(.18);
            const origins = ['translateY(60px) rotate(-6deg)', 'translateY(60px) scale(.88)', 'translateY(60px) rotate(6deg)'];
            return (
              <div key={label} ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : origins[i], transition: `opacity .75s cubic-bezier(.16,1,.3,1) ${i * .14}s,transform .75s cubic-bezier(.16,1,.3,1) ${i * .14}s` }}>
                <Tilt style={{ padding: '40px 36px', borderRadius: 22, background: `rgba(${rgb},.055)`, border: `1px solid rgba(${rgb},.16)`, height: '100%', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', bottom: -24, right: -12, fontFamily: 'var(--serif)', fontSize: '7.5rem', fontWeight: 900, color: `rgba(${rgb},.06)`, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>0{i + 1}</div>
                  <div style={{ width: 54, height: 54, borderRadius: 15, background: `rgba(${rgb},.18)`, border: `1px solid rgba(${rgb},.36)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: col, marginBottom: 22, boxShadow: `0 4px 20px rgba(${rgb},.25)` }}><Icon size={23} /></div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-.01em' }}>{label}</h3>
                  <p style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.46)', lineHeight: 1.82 }}>{desc}</p>
                  <div style={{ marginTop: 26, height: 2, borderRadius: 1, background: `linear-gradient(to right,${col},transparent)`, width: '55%' }} />
                </Tilt>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────
   ⑥ PHILOSOPHY — sticky split, per-step image swap
──────────────────────────────────────────────────────── */
function Philosophy() {
  const wRef = useRef(null);
  const prog = useScrollProg(wRef);
  const active = Math.min(PHIL.length - 1, Math.floor(prog * PHIL.length));
  const { col, rgb } = PHIL[active];

  return (
    <div ref={wRef} style={{ height: `${100 + PHIL.length * 90}vh`, position: 'relative', background: '#f2f4f8' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', borderTop: '1px solid var(--rule)' }}>
        <div className="wrap" style={{ width: '100%' }}>
          <div className="phil-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>

            {/* LEFT — per-step image crossfade */}
            <div className="phil-img" style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', minHeight: 320 }}>

              {/* Each step gets its own image — fade between them */}
              {PHIL.map((step, i) => (
                <div key={i} style={{ position: 'absolute', inset: 0, opacity: active === i ? 1 : 0, transition: 'opacity .65s cubic-bezier(.4,0,.2,1)', willChange: 'opacity' }}>
                  <img
                    src={step.img}
                    alt={step.t}
                    style={{ width: '100%', height: '115%', objectFit: 'cover', filter: 'saturate(.75) brightness(.7)', transform: `translateY(${prog * -18}px) translateZ(0)`, willChange: 'transform', transition: 'none' }}
                  />
                  {/* Per-step colour tint overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: `rgba(${step.rgb},.22)`, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
                </div>
              ))}

              {/* Common overlays on top */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 35%, rgba(4,11,24,.82))', pointerEvents: 'none' }} />

              {/* Bottom pill — step label */}
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 14, padding: '14px 18px', zIndex: 2 }}>
                <p style={{ fontSize: '.56rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 3 }}>Step {PHIL[active].n}</p>
                <p style={{ fontFamily: 'var(--serif)', fontSize: '.98rem', fontWeight: 700, color: '#fff' }}>{PHIL[active].t}</p>
                {/* Coloured accent line */}
                <div style={{ height: 2, borderRadius: 1, background: col, marginTop: 10, width: '40%', transition: 'background .4s ease, width .4s ease' }} />
              </div>

              {/* Step indicator dots — right side */}
              <div style={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 7, zIndex: 2 }}>
                {PHIL.map((_, i) => (
                  <div key={i} style={{ width: 5, height: active === i ? 22 : 5, borderRadius: 3, background: active === i ? '#fff' : 'rgba(255,255,255,.3)', transition: 'height .35s cubic-bezier(.16,1,.3,1)', willChange: 'height' }} />
                ))}
              </div>
            </div>

            {/* RIGHT — step list + detail card */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Reveal>
                <p style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--ink20)', marginBottom: 10 }}>Our Philosophy</p>
              </Reveal>
              <CharStagger text="How We Think & Build" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.6rem,3.5vw,2.7rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.025em', marginBottom: 24, lineHeight: 1.1 }} />

              {/* Step rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 20 }}>
                {PHIL.map(({ n, Icon, t, col: c, rgb: r }, i) => (
                  <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, position: 'relative', overflow: 'hidden', transform: active === i ? 'translateX(8px)' : 'none', transition: 'transform .4s cubic-bezier(.16,1,.3,1)' }}>
                    {/* Active bg */}
                    <div style={{ position: 'absolute', inset: 0, background: `rgba(${r},.07)`, border: `1px solid rgba(${r},.22)`, borderRadius: 12, opacity: active === i ? 1 : 0, transition: 'opacity .35s ease', pointerEvents: 'none' }} />
                    {/* Icon */}
                    <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, background: active === i ? c : 'var(--rule)', color: active === i ? '#fff' : 'var(--ink40)', transition: 'background .3s ease, color .3s ease' }}>
                      <Icon size={14} />
                    </div>
                    <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                      <span style={{ fontSize: '.56rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: active === i ? c : 'var(--ink20)', display: 'block', marginBottom: 1, transition: 'color .3s ease' }}>Step {n}</span>
                      <strong style={{ fontSize: '.9rem', color: active === i ? 'var(--ink)' : 'var(--ink40)', fontWeight: 700, transition: 'color .3s ease' }}>{t}</strong>
                    </div>
                    {active === i && <div style={{ width: 6, height: 6, borderRadius: '50%', background: c, flexShrink: 0, position: 'relative', zIndex: 1 }} />}
                  </div>
                ))}
              </div>

              {/* Detail card */}
              <Tilt style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '22px 24px', boxShadow: '0 6px 28px rgba(0,0,0,.06)' }}>
                <p style={{ fontSize: '.95rem', color: 'var(--ink60)', lineHeight: 1.86, marginBottom: 16 }}>{PHIL[active].d}</p>
                <div style={{ display: 'flex', gap: 5 }}>
                  {PHIL.map((_, pi) => (
                    <div key={pi} style={{ height: 4, borderRadius: 2, background: pi === active ? col : '#e2e8f0', width: 8, transformOrigin: 'left', transform: pi === active ? 'scaleX(4)' : 'scaleX(1)', transition: 'transform .4s cubic-bezier(.16,1,.3,1), background .3s ease', willChange: 'transform' }} />
                  ))}
                </div>
              </Tilt>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   ⑦ TEAM CTA — parallax dark with aurora + scramble
──────────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────────
   ROOT
──────────────────────────────────────────────────────── */
export default function About() {
  return (
    <div style={{ marginTop: "-68px" }}>
      <Grain />
      <ProgressBar />
      <Hero />
      <Stats />
      <WhoWeAre />
      <MissionVision />
      <Values />
      <Philosophy />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @keyframes aIn   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
        @keyframes glow  { 0%,100%{box-shadow:0 0 6px #4ade80}50%{box-shadow:0 0 18px #4ade80,0 0 32px #4ade8055} }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
        @keyframes bounce{ 0%,100%{transform:translateY(0)}50%{transform:translateY(8px)} }

        /* ── STATS GRID ── */
        .abt-stats { grid-template-columns: repeat(2,1fr) !important; }
        @media(min-width:640px){ .abt-stats { grid-template-columns: repeat(4,1fr) !important; } }

        /* ── WHO WE ARE ── */
        .who-hero-pad { padding: 0 64px !important; }
        @media(max-width:640px){ .who-hero-pad { padding: 0 20px 0 56px !important; } }

        /* ── MISSION/VISION ── */
        .mv-grid { grid-template-columns: 1fr !important; }
        @media(min-width:768px){ .mv-grid { grid-template-columns: 1fr 1fr !important; } }

        /* ── VALUES ── */
        .val-grid { grid-template-columns: 1fr !important; }
        @media(min-width:540px){ .val-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media(min-width:900px){ .val-grid { grid-template-columns: repeat(3,1fr) !important; } }

        /* ── PHILOSOPHY ── */
        .phil-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        .phil-img  { min-height: 260px !important; order: -1; }
        @media(min-width:768px){
          .phil-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
          .phil-img  { min-height: 80vh !important; order: 0; }
        }

        /* ── TEAM CTA ── */
        .cta-row { flex-direction: column !important; gap: 28px !important; align-items: flex-start !important; }
        @media(min-width:768px){ .cta-row { flex-direction: row !important; align-items: center !important; justify-content: space-between !important; } }

        /* ── HERO mobile ── */
        @media(max-width:640px){
          .hero-badge { display: none !important; }
        }

        /* ── MissionVision image height ── */
        .mv-img { height: 220px !important; }
        @media(min-width:768px){ .mv-img { height: 280px !important; } }
      `}</style>
    </div>
  );
}
