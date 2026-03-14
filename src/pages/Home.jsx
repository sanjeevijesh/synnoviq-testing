import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Gamepad2, Palette, Zap, Shield, Users, Star, Quote, Code2, Layers, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

/* ═══════════════════════════ UTILS ═══════════════════════════ */
function useElProgress(ref, factor = 1) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setP(Math.min(1, Math.max(0, -r.top / ((r.height - window.innerHeight) || 1) * factor)));
    };
    window.addEventListener('scroll', fn, { passive: true }); fn();
    return () => window.removeEventListener('scroll', fn);
  }, [factor]);
  return p;
}

function Reveal({ children, delay = 0, x = 0, y = 50, scale = 1, style = {} }) {
  const ref = useRef(null); const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : `translate(${x}px,${y}px) scale(${scale})`, transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function Grain() {
  return <div style={{ position: 'fixed', inset: 0, zIndex: 9995, pointerEvents: 'none', opacity: 0.028, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '160px' }} />;
}

function Cursor() {
  const ring = useRef(null); const dot = useRef(null);
  const lag  = useRef({ x: -300, y: -300 }); const real = useRef({ x: -300, y: -300 });
  const [color, setColor] = useState('0,87,255');
  useEffect(() => {
    const onMove = e => { real.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    let raf;
    const tick = () => {
      lag.current.x += (real.current.x - lag.current.x) * 0.1;
      lag.current.y += (real.current.y - lag.current.y) * 0.1;
      if (ring.current) { ring.current.style.left = lag.current.x + 'px'; ring.current.style.top = lag.current.y + 'px'; }
      if (dot.current)  { dot.current.style.left  = real.current.x + 'px'; dot.current.style.top  = real.current.y  + 'px'; }
      raf = requestAnimationFrame(tick);
    };
    tick();
    const sections = [{ id: 'sec-svc', color: '0,87,255' }, { id: 'sec-process', color: '124,58,237' }, { id: 'sec-work', color: '219,39,119' }];
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { const s = sections.find(s => s.id === e.target.id); if (s) setColor(s.color); } });
    }, { threshold: 0.3 });
    sections.forEach(s => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); io.disconnect(); };
  }, []);
  return (
    <>
      <div ref={ring} style={{ position: 'fixed', width: 36, height: 36, borderRadius: '50%', border: `1.5px solid rgba(${color},0.7)`, transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 9999, mixBlendMode: 'difference', transition: 'border-color 0.4s, width 0.3s, height 0.3s' }} />
      <div ref={dot}  style={{ position: 'fixed', width: 5, height: 5, borderRadius: '50%', background: '#fff', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 9999, mixBlendMode: 'difference' }} />
    </>
  );
}

function ProgressBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => { const d = document.documentElement; setP(d.scrollTop / (d.scrollHeight - d.clientHeight) * 100 || 0); };
    window.addEventListener('scroll', fn, { passive: true }); fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return <div style={{ position: 'fixed', top: 0, left: 0, height: 3, width: `${p}%`, background: 'linear-gradient(90deg,#0057ff,#7c3aed,#db2777)', zIndex: 9998, boxShadow: '0 0 10px rgba(0,87,255,0.8)', transition: 'width 0.08s linear' }} />;
}

function Scramble({ text, trigger, style = {} }) {
  const [display, setDisplay] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
  useEffect(() => {
    if (!trigger) return;
    let frame = 0; let raf;
    const totalFrames = text.length * 3;
    const tick = () => {
      frame++;
      setDisplay(text.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (frame > i * 3) return ch;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      if (frame < totalFrames) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, text]);
  return <span style={style}>{display}</span>;
}

function Aurora({ colors = ['#0057ff', '#7c3aed', '#0ea5e9'], opacity = 0.9 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; const ctx = c.getContext('2d');
    let W, H, t = 0, raf;
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const orbs = colors.map((col, i) => ({ col, phase: (i / colors.length) * Math.PI * 2, rx: 0.28 + i * 0.15, ry: 0.28 + i * 0.1, speed: 0.004 + i * 0.002, size: 0.5 - i * 0.05 }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      orbs.forEach(o => {
        const x = W * (0.5 + o.rx * Math.cos(t * o.speed + o.phase));
        const y = H * (0.5 + o.ry * Math.sin(t * o.speed * 1.4 + o.phase));
        const r = Math.min(W, H) * o.size;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, o.col + '30'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      });
      t++; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity }} />;
}

function useScrollVelocity() {
  const [vel, setVel] = useState(0);
  useEffect(() => {
    let last = window.scrollY; let lastTime = Date.now();
    const fn = () => {
      const now = Date.now(); const dt = now - lastTime || 1;
      const v = Math.abs(window.scrollY - last) / dt * 16;
      setVel(Math.min(40, v)); last = window.scrollY; lastTime = now;
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return vel;
}

function Tilt({ children, style = {}, depth = 14 }) {
  const r = useRef(null);
  return (
    <div ref={r} style={{ transition: 'transform 0.15s ease', willChange: 'transform', ...style }}
      onMouseMove={e => { const b = r.current.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width - 0.5; const y = (e.clientY - b.top) / b.height - 0.5; r.current.style.transform = `perspective(1000px) rotateY(${x * depth}deg) rotateX(${-y * depth * 0.7}deg) translateZ(20px)`; }}
      onMouseLeave={() => { r.current.style.transform = ''; }}
    >{children}</div>
  );
}

function Counter({ end, suffix = '' }) {
  const [v, setV] = useState(0); const ref = useRef(null); const done = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let c = 0; const step = end / 80;
        const t = setInterval(() => { c += step; if (c >= end) { setV(end); clearInterval(t); } else setV(Math.floor(c)); }, 14);
      }
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [end]);
  return <span ref={ref}>{v}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */
const SVCS = [
  { id: 'fullstack', Icon: Globe,   color: '#0057ff', rgb: '0,87,255',   num: '01', title: 'Full Stack\nDevelopment',  desc: 'End-to-end web apps — from pixel-perfect frontends to scalable backends.', img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&q=85', tags: ['React', 'Node.js', 'AWS', 'Next.js'] },
  { id: 'gamedev',  Icon: Gamepad2, color: '#7c3aed', rgb: '124,58,237', num: '02', title: 'Game\nDevelopment',        desc: '2D & 3D games, mobile titles, and immersive multiplayer experiences.', img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=900&q=85', tags: ['Unity', 'Unreal', 'C#', 'Photon'] },
  { id: 'uiux',     Icon: Palette,  color: '#db2777', rgb: '219,39,119', num: '03', title: 'UI/UX\nDesign',            desc: 'Interfaces that users love — intuitive, beautiful, conversion-focused.', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&q=85', tags: ['Figma', 'Prototyping', 'Research', 'Design Systems'] },
];
const STATS = [
  { end: 50,  suf: '+', label: 'Projects',     sub: 'Delivered globally'  },
  { end: 15,  suf: '+', label: 'Technologies', sub: 'Mastered & deployed'  },
  { end: 100, suf: '%', label: 'Satisfaction', sub: 'Every single client'  },
  { end: 3,   suf: '+', label: 'Years',        sub: 'Of excellence'        },
];
const PROCESS = [
  { n: '01', Icon: Sparkles, t: 'Discovery',    d: 'Deep-diving into your goals, market, and users to forge a razor-sharp product vision.' },
  { n: '02', Icon: Layers,   t: 'Architecture', d: 'System blueprints built for scale, security, and zero technical debt from day one.' },
  { n: '03', Icon: Code2,    t: 'Build',        d: 'Agile sprints, weekly demos, real-time updates — you are always in the loop.' },
  { n: '04', Icon: Zap,      t: 'Launch',       d: 'Automated pipelines, zero-downtime cloud deployment, and rigorous QA before go-live.' },
  { n: '05', Icon: Shield,   t: 'Support',      d: 'Post-launch monitoring, performance tuning, and feature evolution as you scale.' },
];
const WORK = [
  { tag: 'Web App',    title: 'Enterprise SaaS Dashboard', tech: ['React', 'Node.js', 'AWS'],      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&q=80', color: '#0057ff' },
  { tag: 'Game',       title: 'Multiplayer Mobile RPG',    tech: ['Unity', 'C#', 'Photon'],        img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=700&q=80', color: '#7c3aed' },
  { tag: 'UI/UX',      title: 'FinTech App Redesign',      tech: ['Figma', 'React Native'],        img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=700&q=80', color: '#db2777' },
  { tag: 'E-Commerce', title: 'Fashion Retail Platform',   tech: ['Next.js', 'MongoDB', 'Stripe'], img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80', color: '#059669' },
];
const STACK = ['React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'Unity', 'Unreal Engine', 'AWS', 'Azure', 'Docker', 'PostgreSQL', 'MongoDB'];
const TESTIMONIALS = [
  { name: 'Rahul Menon',     role: 'Founder, TechStart',     stars: 5, text: 'Synnoviq delivered our SaaS platform in record time. The quality of code and design genuinely blew us away.' },
  { name: 'Ananya Krishnan', role: 'Product Lead, GameForge', stars: 5, text: 'Our Unity game went from concept to App Store in 4 months. Their expertise in game mechanics is truly world-class.' },
  { name: 'Vikram Patel',    role: 'CEO, FinServe App',       stars: 5, text: 'They treated our project as their own. Every milestone hit, every feature polished to absolute perfection.' },
];

/* ═══════════════════════════════════════════════════
   ① HERO
   - 200vh wrapper = 100vh of actual scroll travel
   - Exit animation only fires in the LAST 40vh of travel
   - opacity floor of 0.15 — never goes fully blank
═══════════════════════════════════════════════════ */
function Hero() {
  const wrapRef = useRef(null);
  const vel     = useScrollVelocity();
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState(0);
  const [ep, setEp] = useState(0); // exit progress 0→1

  const lines = ['We Build,\u00a0You Grow.', 'We Code,\u00a0You Scale.', 'We Ship,\u00a0You Win.'];

  // Typewriter
  useEffect(() => {
    const hl = lines[phase % lines.length];
    let i = 0; let erase = false;
    const t = setInterval(() => {
      if (!erase) { setTyped(hl.slice(0, ++i)); if (i >= hl.length) { erase = true; i = hl.length + 18; } }
      else { if (i > hl.length) { i--; return; } setTyped(hl.slice(0, --i)); if (i === 0) { erase = false; setPhase(p => p + 1); clearInterval(t); } }
    }, erase ? 36 : 58);
    return () => clearInterval(t);
  }, [phase]);

  // Scroll — only measure the exit window (last 40% of travel)
  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      // wrapper 200vh → travel = 200vh - 100vh = 100vh
      const travel = r.height - window.innerHeight;
      const raw = Math.min(1, Math.max(0, -r.top / travel));
      // exit starts at 60% of travel, ends at 100%
      setEp(Math.min(1, Math.max(0, (raw - 0.03) / 0.97)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={wrapRef} style={{ height: '130vh', position: 'relative' }}>
      <section style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#030810', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Aurora colors={['#0057ff', '#7c3aed', '#0ea5e9']} opacity={0.85} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px)', backgroundSize: '80px 80px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 25%, rgba(3,8,16,0.88) 100%)', pointerEvents: 'none' }} />

        {/* Dark veil slides in over the top — never covers content completely */}
        <div style={{ position: 'absolute', inset: 0, background: '#030810', opacity: ep * 0.75, pointerEvents: 'none', zIndex: 3 }} />

        {/* Content — drifts upward gently, opacity floors at 0.15 */}
        <div style={{
          position: 'relative', zIndex: 2, textAlign: 'center',
          padding: '0 clamp(16px,5vw,40px)', maxWidth: 920, width: '100%',
          transform: `translateY(${ep * -55}px) scale(${1 - ep * 0.05})`,
          opacity: Math.max(0.15, 1 - ep * 0.85),
          willChange: 'transform, opacity', transition: 'none',
        }}>
          

          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(3.4rem,9.5vw,7.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: 28, minHeight: '2.1em' }}>
            <span style={{ display: 'block' }}>{typed.split('\u00a0')[0]}</span>
            <span style={{ display: 'block', color: '#5aa8ff', fontStyle: 'italic' }}>
              {typed.split('\u00a0')[1] || ''}
              <span style={{ borderRight: '3px solid #5aa8ff', marginLeft: 2, animation: 'blink 0.75s step-end infinite' }}>&nbsp;</span>
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(0.95rem,1.8vw,1.13rem)', color: 'rgba(255,255,255,0.52)', maxWidth: 540, margin: '0 auto 48px', lineHeight: 1.95, animation: 'hIn 0.9s 0.5s both' }}>
            Synnoviq Technologies builds scalable Full Stack applications and immersive Game experiences — precision-engineered, innovation-driven.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 52, animation: 'hIn 0.9s 0.7s both' }}>
            <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 14, background: '#0057ff', color: '#fff', fontWeight: 700, fontSize: '0.94rem', boxShadow: '0 6px 28px rgba(0,87,255,0.5)', transition: 'all 0.25s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,87,255,0.65)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,87,255,0.5)'; }}
            >Explore Services <ArrowRight size={16} /></Link>
            <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 14, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', fontWeight: 700, fontSize: '0.94rem', border: '1px solid rgba(255,255,255,0.13)', backdropFilter: 'blur(8px)', transition: 'all 0.25s ease' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            >Let&rsquo;s Talk</Link>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', animation: 'hIn 0.9s 0.9s both' }}>
            {STACK.slice(0, 8).map(t => (
              <span key={t} style={{ padding: '5px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, fontSize: '0.73rem', color: 'rgba(255,255,255,0.48)', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Scroll cue — bottom-right, hidden on mobile */}
        <div className="hero-scroll-cue" style={{ position: 'absolute', bottom: 20, right: 32, display: 'flex', alignItems: 'center', gap: 8, opacity: Math.max(0, 1 - ep * 6), pointerEvents: 'none', animation: 'hIn 0.6s 1.2s both' }}>
          <div style={{ width: 36, height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.25))' }} />
          <span style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Scroll</span>
        </div>

        {/* Bottom progress bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, height: 2, width: `${ep * 100}%`, background: 'linear-gradient(90deg,#0057ff,#7c3aed)', boxShadow: '0 0 14px rgba(0,87,255,0.8)', transition: 'none', zIndex: 4 }} />
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ② MARQUEE TICKER
═══════════════════════════════════════════════════ */
function Ticker() {
  const items = ['Full Stack Dev', '·', 'Game Development', '·', 'UI/UX Design', '·', 'Mobile Apps', '·', 'Cloud', '·', 'SaaS', '·', 'E-Commerce', '·', 'API Dev', '·'];
  return (
    <div>
      {/* "We Master" label above ribbon */}
      <div style={{ background: '#050d1e', padding: '28px 20px 16px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.6rem,4vw,2.4rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.025em', display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'inline-block', width: 'clamp(28px,5vw,48px)', height: 2, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.25))', borderRadius: 1 }} />
          We <em style={{ fontStyle: 'italic', color: '#5aa8ff' }}>Expertise in</em>
          <span style={{ display: 'inline-block', width: 'clamp(28px,5vw,48px)', height: 2, background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.25))', borderRadius: 1 }} />
        </span>
      </div>
      {/* Marquee ribbon */}
      <div style={{ background: '#0057ff', borderBottom: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden' }}>
        {[0, 1].map(row => (
          <div key={row} style={{ padding: row === 0 ? '11px 0 0' : '0 0 11px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', width: 'max-content', animation: `${row === 0 ? 'tickL' : 'tickR'} ${row === 0 ? 22 : 30}s linear infinite` }}>
              {[0, 1, 2, 3].flatMap(() => items).map((item, i) => (
                <span key={i} style={{ padding: '0 20px', fontSize: '0.74rem', fontWeight: item === '·' ? 400 : 700, color: item === '·' ? 'rgba(255,255,255,0.3)' : '#fff', letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap', opacity: row === 0 ? 1 : 0.55 }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ③ STATS
═══════════════════════════════════════════════════ */
function Stats() {
  return (
    <section style={{ background: '#050d1e' }}>
      <div className="wrap">
        <div className="home-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {STATS.map(({ end, suf, label, sub }, i) => (
            <Reveal key={label} delay={i * 0.09} y={30}>
              <div style={{ padding: '52px 20px', textAlign: 'center', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ fontFamily: "'Bebas Neue', 'Oswald', var(--serif)", fontSize: 'clamp(3.2rem,7vw,5rem)', fontWeight: 900, lineHeight: 1, marginBottom: 8, background: 'linear-gradient(135deg,#fff,rgba(255,255,255,0.55))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.02em' }}>
                  <Counter end={end} suffix={suf} />
                </div>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'rgba(255,255,255,0.42)', letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>{sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ④ SERVICES
═══════════════════════════════════════════════════ */
/* Cinematic mobile card */
function MobileSvcCard({ svc }) {
  const ref = useRef(null);
  const [prog, setProg] = useState(0);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.15 });
    io.observe(el);
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      setProg(Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height))));
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);
  const tagVis = (i) => vis && prog > 0.2 + i * 0.04;
  return (
    <div ref={ref} style={{ position: 'relative', height: '92vw', maxHeight: 480, minHeight: 360, borderRadius: 24, overflow: 'hidden', border: `1px solid rgba(${svc.rgb},0.3)`, marginBottom: 24, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: '-15% 0', overflow: 'hidden' }}>
        <img src={svc.img} alt={svc.title} style={{ width: '100%', height: '130%', objectFit: 'cover', transform: `translateY(${(prog - 0.3) * 60}px)`, filter: `brightness(${0.35 + prog * 0.25}) saturate(${0.5 + prog * 0.5})`, transition: 'filter 0.3s ease', willChange: 'transform' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 80% 20%, rgba(${svc.rgb},${0.25 + prog * 0.15}) 0%, transparent 65%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,13,26,0.98) 0%, rgba(6,13,26,0.7) 50%, rgba(6,13,26,0.2) 100%)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(to right, ${svc.color}, transparent)`, transform: `scaleX(${vis ? Math.min(1, prog * 2.5) : 0})`, transformOrigin: 'left', transition: 'transform 0.05s linear' }} />
      <div style={{ position: 'absolute', bottom: -20, right: -10, fontFamily: 'var(--serif)', fontSize: '38vw', fontWeight: 900, color: `rgba(${svc.rgb},${0.04 + prog * 0.08})`, lineHeight: 1, pointerEvents: 'none', userSelect: 'none', letterSpacing: '-0.05em' }}>{svc.num}</div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `rgba(${svc.rgb},0.2)`, border: `1px solid rgba(${svc.rgb},0.5)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: svc.color, flexShrink: 0, boxShadow: `0 4px 16px rgba(${svc.rgb},0.3)` }}>
            <svc.Icon size={16} />
          </div>
          <div>
            <span style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: svc.color, display: 'block' }}>Service {svc.num}</span>
            <div style={{ height: 1.5, borderRadius: 1, background: `linear-gradient(to right, ${svc.color}, transparent)`, width: vis ? 64 : 0, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s', marginTop: 3 }} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          {svc.title.split('\n').map((line, li) => (
            <div key={li} style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.9rem,7vw,2.6rem)', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.035em', opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(40px)', transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${0.2 + li * 0.1}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${0.2 + li * 0.1}s` }}>{line}</div>
          ))}
        </div>
        <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.72, marginBottom: 18, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s' }}>{svc.desc}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {svc.tags.map((tag, ti) => (
            <span key={tag} style={{ padding: '4px 12px', borderRadius: 999, fontSize: '0.68rem', fontWeight: 600, color: svc.color, background: `rgba(${svc.rgb},0.14)`, border: `1px solid rgba(${svc.rgb},0.35)`, opacity: tagVis(ti) ? 1 : 0, transform: tagVis(ti) ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)', transition: `opacity 0.5s ease ${0.05 * ti}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.05 * ti}s` }}>{tag}</span>
          ))}
        </div>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s' }}>
          <Link to={`/services#${svc.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, background: svc.color, color: '#fff', fontSize: '0.84rem', fontWeight: 700, boxShadow: `0 6px 20px rgba(${svc.rgb},0.45)`, textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}>
            Explore Service <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ServicesSection() {
  const wrapRef = useRef(null);
  const prog = useElProgress(wrapRef);
  const active = Math.min(SVCS.length - 1, Math.floor(prog * SVCS.length));
  const subProg = (prog * SVCS.length) % 1;
  return (
    <>
      {/* Mobile */}
      <div className="svc-mobile-only" style={{ display: 'none', background: '#060d1a', padding: '52px 18px 40px' }}>
        <Reveal y={30} delay={0}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 10 }}>What We Do</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,8vw,2.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.08 }}>Our Core <em style={{ fontStyle: 'italic', color: '#5aa8ff' }}>Services</em></h2>
            <div style={{ width: 40, height: 2, background: 'linear-gradient(to right,#0057ff,#7c3aed)', borderRadius: 1, margin: '14px auto 0' }} />
          </div>
        </Reveal>
        {SVCS.map((svc) => <MobileSvcCard key={svc.id} svc={svc} />)}
      </div>

      {/* Desktop */}
      <div ref={wrapRef} id="sec-svc" className="svc-desktop-only" style={{ height: `${100 + SVCS.length * 100}vh`, position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', background: '#060d1a' }}>
          {SVCS.map((svc, i) => (
            <div key={svc.id} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 60% 50%, rgba(${svc.rgb},0.13) 0%, transparent 65%)`, opacity: active === i ? 1 : 0, transition: 'opacity 0.6s ease', willChange: 'opacity' }} />
          ))}
          <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            {SVCS.map((svc, i) => {
              const isActive = active === i;
              return (
                <div key={svc.id} style={{ position: 'relative', overflow: 'hidden', flex: isActive ? '1 1 65%' : '0 0 clamp(52px,5vw,72px)', transition: 'flex 0.75s cubic-bezier(0.16,1,0.3,1)', borderRight: i < SVCS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', willChange: 'flex' }}>
                  <img src={svc.img} alt={svc.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: isActive ? 'scale(1.04)' : 'scale(1.12)', transition: 'transform 0.75s cubic-bezier(0.16,1,0.3,1)', willChange: 'transform', filter: 'brightness(0.45) saturate(0.7)' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(6,13,26,0.58)', opacity: isActive ? 0 : 1, transition: 'opacity 0.75s ease', willChange: 'opacity', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(6,13,26,0.97) 0%, rgba(6,13,26,0.72) 42%, transparent 75%)', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isActive ? 0 : 1, transition: 'opacity 0.35s ease', pointerEvents: isActive ? 'none' : 'auto', willChange: 'opacity' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: `rgba(${svc.rgb},0.18)`, border: `1px solid rgba(${svc.rgb},0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: svc.color }}><svc.Icon size={16} /></div>
                      <div style={{ writingMode: 'vertical-rl', fontFamily: 'var(--serif)', fontSize: '0.78rem', fontWeight: 800, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{svc.title.replace('\n', ' ')}</div>
                      <div style={{ fontSize: '0.58rem', fontWeight: 700, color: `rgba(${svc.rgb},0.6)`, letterSpacing: '0.12em' }}>{svc.num}</div>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(28px,4vw,64px)', opacity: isActive ? 1 : 0, transform: isActive ? 'translateX(0) translateZ(0)' : 'translateX(-20px) translateZ(0)', transition: 'opacity 0.55s ease 0.2s, transform 0.55s cubic-bezier(0.16,1,0.3,1) 0.2s', pointerEvents: isActive ? 'auto' : 'none', maxWidth: 560, willChange: 'opacity, transform' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: `rgba(${svc.rgb},0.18)`, border: `1px solid rgba(${svc.rgb},0.45)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: svc.color, flexShrink: 0 }}><svc.Icon size={22} /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: `rgba(${svc.rgb},0.75)`, marginBottom: 3 }}>Service {svc.num}</div>
                        <div style={{ height: 2, borderRadius: 1, background: `linear-gradient(to right, ${svc.color}, transparent)`, transformOrigin: 'left', transform: isActive ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s', willChange: 'transform' }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      {svc.title.split('\n').map((line, li) => (
                        <div key={li} style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.6rem,4.5vw,4.4rem)', fontWeight: 900, color: '#fff', lineHeight: 1.0, letterSpacing: '-0.04em', transform: isActive ? 'translateY(0) translateZ(0)' : `translateY(${36 + li * 14}px) translateZ(0)`, opacity: isActive ? 1 : 0, transition: `opacity 0.55s ease ${0.28 + li * 0.09}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${0.28 + li * 0.09}s`, willChange: 'opacity, transform' }}>{line}</div>
                      ))}
                    </div>
                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.9, maxWidth: 440, marginBottom: 28, opacity: isActive ? 1 : 0, transform: isActive ? 'translateY(0) translateZ(0)' : 'translateY(16px) translateZ(0)', transition: 'opacity 0.55s ease 0.42s, transform 0.55s ease 0.42s', willChange: 'opacity, transform' }}>{svc.desc}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
                      {svc.tags.map((tag, ti) => (
                        <span key={tag} style={{ padding: '5px 14px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600, color: svc.color, background: `rgba(${svc.rgb},0.12)`, border: `1px solid rgba(${svc.rgb},0.3)`, opacity: isActive ? 1 : 0, transform: isActive ? 'translateY(0) translateZ(0)' : 'translateY(10px) translateZ(0)', transition: `opacity 0.45s ease ${0.5 + ti * 0.06}s, transform 0.45s ease ${0.5 + ti * 0.06}s`, willChange: 'opacity, transform' }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'translateY(0) translateZ(0)' : 'translateY(12px) translateZ(0)', transition: 'opacity 0.45s ease 0.65s, transform 0.45s ease 0.65s', willChange: 'opacity, transform' }}>
                      <Link to={`/services#${svc.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '13px 28px', borderRadius: 12, background: svc.color, color: '#fff', fontSize: '0.88rem', fontWeight: 700, boxShadow: `0 6px 24px rgba(${svc.rgb},0.4)`, transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 14px 32px rgba(${svc.rgb},0.55)`; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 6px 24px rgba(${svc.rgb},0.4)`; }}>
                        Explore Service <ArrowRight size={14} />
                      </Link>
                    </div>
                    <div style={{ position: 'absolute', bottom: 28, left: 'clamp(28px,4vw,64px)', display: 'flex', gap: 6 }}>
                      {SVCS.map((_, pi) => (<div key={pi} style={{ height: 3, borderRadius: 2, background: pi === active ? svc.color : 'rgba(255,255,255,0.15)', transform: `scaleX(${pi === active ? 3.5 : 1})`, transformOrigin: 'left', transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)', willChange: 'transform', width: 8 }} />))}
                    </div>
                  </div>
                  <div style={{ position: 'absolute', bottom: -10, right: 24, fontFamily: 'var(--serif)', fontSize: 'clamp(8rem,16vw,14rem)', fontWeight: 900, color: `rgba(${svc.rgb},0.07)`, lineHeight: 1, pointerEvents: 'none', userSelect: 'none', letterSpacing: '-0.05em', opacity: isActive ? 1 : 0.3, transition: 'opacity 0.6s ease', willChange: 'opacity' }}>{svc.num}</div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.04)' }}>
                    <div style={{ height: '100%', width: '100%', background: `linear-gradient(to right, ${svc.color}, rgba(${svc.rgb},0.3))`, transformOrigin: 'left', transform: isActive ? `scaleX(${subProg})` : 'scaleX(0)', transition: isActive ? 'none' : 'transform 0.3s ease', willChange: 'transform', boxShadow: `0 0 8px rgba(${svc.rgb},0.6)` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '28px clamp(24px,4vw,52px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(to bottom, rgba(6,13,26,0.9), transparent)', pointerEvents: 'none' }}>
            <div>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 3 }}>What We Do</span>
              <span style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>Our Core Services</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {SVCS.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: `rgba(${s.rgb},0.18)`, border: `1px solid rgba(${s.rgb},0.4)`, borderRadius: 999, opacity: active === i ? 1 : 0, transition: 'opacity 0.4s ease', willChange: 'opacity' }} />
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, position: 'relative', opacity: active === i ? 1 : 0.3, transition: 'opacity 0.4s ease', willChange: 'opacity' }} />
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: s.color, letterSpacing: '0.08em', position: 'relative', opacity: active === i ? 1 : 0.35, transition: 'opacity 0.4s ease', willChange: 'opacity' }}>{s.title.replace('\n', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .svc-mobile-only { display: block !important; }
          .svc-desktop-only { display: none !important; }
        }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   ⑤ PROCESS
═══════════════════════════════════════════════════ */
function ProcessSection() {
  const wrapRef = useRef(null);
  const prog    = useElProgress(wrapRef);
  const activeIdx = Math.min(PROCESS.length - 1, Math.floor(prog * PROCESS.length));
  const subProg   = (prog * PROCESS.length) % 1;
  const stepColors = ['#0057ff', '#7c3aed', '#db2777', '#059669', '#f59e0b'];
  const activeColor = stepColors[activeIdx % stepColors.length];
  const activeRgb = ['0,87,255', '124,58,237', '219,39,119', '5,150,105', '245,158,11'][activeIdx % 5];
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <div ref={wrapRef} id="sec-process" style={{ height: isMobile ? 'auto' : `${100 + PROCESS.length * 80}vh`, position: 'relative' }}>
      <div className="process-sticky" style={{ position: isMobile ? 'relative' : 'sticky', top: 0, height: isMobile ? 'auto' : '100vh', overflow: isMobile ? 'visible' : 'hidden', display: 'flex', flexDirection: isMobile ? 'column' : 'row', background: '#04080f' }}>
        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=60" alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.055, filter: 'saturate(0.3)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(4,8,15,0.85) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 72% 48%, rgba(${activeRgb},0.11) 0%, transparent 55%)`, transition: 'background 0.7s ease', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '36px 36px', pointerEvents: 'none', opacity: 0.5 }} />
        {/* Mobile layout */}
        <div className="process-mobile-layout" style={{ display: 'none', flexDirection: 'column', position: 'relative', zIndex: 1, padding: '60px 20px 48px' }}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 8 }}>How We Work</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,8vw,2.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.028em', lineHeight: 1.08 }}>Our Proven<br /><em style={{ fontStyle: 'italic', color: '#0057ff' }}>Process</em></h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {PROCESS.map(({ n, Icon, t, d }, i) => {
              const col = stepColors[i % stepColors.length];
              const rgb = ['0,87,255','124,58,237','219,39,119','5,150,105','245,158,11'][i % 5];
              return (
                <div key={n} style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(16px)', border: `1px solid rgba(${rgb},0.25)`, borderTop: `2px solid ${col}`, borderRadius: 18, padding: '22px 20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `rgba(${rgb},0.18)`, border: `1px solid rgba(${rgb},0.4)`, color: col, boxShadow: `0 4px 16px rgba(${rgb},0.3)` }}><Icon size={18} /></div>
                    <div>
                      <span style={{ fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: col, display: 'block', marginBottom: 2 }}>Step {n}</span>
                      <strong style={{ fontSize: '1rem', color: '#fff', fontWeight: 700, fontFamily: 'var(--serif)' }}>{t}</strong>
                    </div>
                  </div>
                  <div style={{ height: 1, background: `linear-gradient(to right, rgba(${rgb},0.4), transparent)`, marginBottom: 14 }} />
                  <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.78, margin: 0 }}>{d}</p>
                  <div style={{ position: 'absolute', bottom: -8, right: 12, fontFamily: 'var(--serif)', fontSize: '5rem', fontWeight: 900, color: `rgba(${rgb},0.07)`, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>{n}</div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Desktop left */}
        <div className="process-desktop-left" style={{ width: 'clamp(240px,36%,400px)', padding: '0 clamp(16px,3vw,48px) 0 clamp(20px,4vw,56px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 'clamp(20px,4vw,56px)', top: '50%', transform: 'translateY(-50%)', width: 2, height: `${PROCESS.length * 56}px`, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: `${prog * 100}%`, background: `linear-gradient(to bottom, ${activeColor}, rgba(${activeRgb},0.3))`, transition: 'none', boxShadow: `0 0 8px rgba(${activeRgb},0.6)` }} />
          </div>
          <div style={{ marginBottom: 32, paddingLeft: 20 }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 8 }}>How We Work</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.7rem,3vw,2.6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.028em', lineHeight: 1.08 }}>Our Proven<br /><em style={{ fontStyle: 'italic', color: activeColor, transition: 'color 0.5s ease' }}>Process</em></h2>
            <div style={{ height: 2, width: 48, borderRadius: 1, background: `linear-gradient(to right, ${activeColor}, transparent)`, marginTop: 14, transition: 'background 0.5s ease' }} />
          </div>
          {PROCESS.map(({ n, Icon, t }, i) => {
            const col = stepColors[i % stepColors.length];
            const rgb = ['0,87,255','124,58,237','219,39,119','5,150,105','245,158,11'][i % 5];
            const isAct = activeIdx === i;
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px 10px 20px', borderRadius: 12, marginBottom: 3, background: isAct ? `rgba(${rgb},0.1)` : 'transparent', border: isAct ? `1px solid rgba(${rgb},0.28)` : '1px solid transparent', transform: isAct ? 'translateX(8px)' : 'none', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isAct ? col : 'rgba(255,255,255,0.06)', color: isAct ? '#fff' : 'rgba(255,255,255,0.3)', transition: 'all 0.45s', boxShadow: isAct ? `0 4px 16px rgba(${rgb},0.4)` : 'none' }}><Icon size={14} /></div>
                <div>
                  <span style={{ fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: isAct ? col : 'rgba(255,255,255,0.25)', display: 'block', marginBottom: 1, transition: 'color 0.4s' }}>Step {n}</span>
                  <strong style={{ fontSize: '0.88rem', color: isAct ? '#fff' : 'rgba(255,255,255,0.35)', fontWeight: 700, transition: 'color 0.4s' }}>{t}</strong>
                </div>
                {isAct && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: col, boxShadow: `0 0 8px ${col}`, flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
        {/* Desktop right */}
        <div className="process-desktop-right" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px,4vw,60px)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 480, height: 480, borderRadius: '50%', background: `radial-gradient(circle, rgba(${activeRgb},0.09) 0%, transparent 70%)`, transition: 'background 0.7s ease', pointerEvents: 'none' }} />
          <Tilt style={{ width: '100%', maxWidth: 520, position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(24px)', border: `1px solid rgba(${activeRgb},0.28)`, borderTop: `2px solid ${activeColor}`, borderRadius: 24, padding: 'clamp(28px,4vw,48px)', boxShadow: `0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(${activeRgb},0.08) inset`, transition: 'border-color 0.6s ease, box-shadow 0.6s ease, border-top-color 0.5s ease', position: 'relative', overflow: 'hidden' }}>
              {(() => {
                const { n, Icon, t, d } = PROCESS[activeIdx];
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                      <div style={{ width: 58, height: 58, borderRadius: 16, background: `rgba(${activeRgb},0.18)`, border: `1px solid rgba(${activeRgb},0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: activeColor, boxShadow: `0 6px 24px rgba(${activeRgb},0.3)`, flexShrink: 0, transition: 'all 0.6s ease' }}><Icon size={24} /></div>
                      <div>
                        <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: activeColor, display: 'block', marginBottom: 4, transition: 'color 0.5s' }}>Step {n}</span>
                        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.5rem,3vw,2.1rem)', fontWeight: 900, color: '#fff', lineHeight: 1.08 }}>{t}</h3>
                      </div>
                    </div>
                    <div style={{ height: 1, background: `linear-gradient(to right, rgba(${activeRgb},0.5), transparent)`, marginBottom: 24, transition: 'background 0.5s ease' }} />
                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.92, marginBottom: 32 }}>{d}</p>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 20 }}>
                      <div style={{ height: '100%', width: `${subProg * 100}%`, background: `linear-gradient(to right, ${activeColor}, rgba(${activeRgb},0.5))`, borderRadius: 2, transition: 'none', boxShadow: `0 0 10px rgba(${activeRgb},0.6)` }} />
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {PROCESS.map((_, pi) => { const pc = stepColors[pi % stepColors.length]; return <div key={pi} style={{ height: 4, borderRadius: 2, background: pi === activeIdx ? pc : 'rgba(255,255,255,0.1)', width: pi === activeIdx ? 28 : 8, transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', boxShadow: pi === activeIdx ? `0 0 6px ${pc}` : 'none' }} />; })}
                    </div>
                    <div style={{ position: 'absolute', bottom: -12, right: 16, fontFamily: 'var(--serif)', fontSize: '7rem', fontWeight: 900, color: `rgba(${activeRgb},0.06)`, lineHeight: 1, pointerEvents: 'none', userSelect: 'none', transition: 'color 0.6s ease' }}>{n}</div>
                  </>
                );
              })()}
            </div>
          </Tilt>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ height: '100%', width: `${prog * 100}%`, background: `linear-gradient(to right, ${activeColor}, rgba(${activeRgb},0.4))`, transition: 'none', boxShadow: `0 0 10px rgba(${activeRgb},0.7)` }} />
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .process-sticky { min-height: 100vh !important; }
          .process-mobile-layout { display: flex !important; }
          .process-desktop-left { display: none !important; }
          .process-desktop-right { display: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ⑥ WORK
═══════════════════════════════════════════════════ */
function WorkCard({ w, i, active, total }) {
  const [hover, setHover] = useState(false);
  const isActive = active === i; const isPrev = active > i;
  const rgb = w.color.replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)).join(',');
  const origins = [{ rotY: -55, rotX: 8, tx: -180, ty: 60 }, { rotY: 30, rotX: -6, tx: 120, ty: -40 }, { rotY: -25, rotX: 12, tx: -80, ty: 80 }, { rotY: 50, rotX: -5, tx: 160, ty: -60 }];
  const o = origins[i % origins.length];
  let tf, op, zIdx;
  if (isActive) { tf = 'perspective(1100px) rotateY(0deg) rotateX(0deg) translate(0,0) scale(1)'; op = 1; zIdx = 10; }
  else if (isPrev) { tf = `perspective(1100px) rotateY(${o.rotY * -0.4}deg) rotateX(${o.rotX * -0.3}deg) translate(${o.tx * -0.3}px,${o.ty * -0.5}px) scale(0.88)`; op = 0; zIdx = 0; }
  else { tf = `perspective(1100px) rotateY(${o.rotY}deg) rotateX(${o.rotX}deg) translate(${o.tx}px,${o.ty}px) scale(0.82)`; op = 0; zIdx = 0; }
  return (
    <div style={{ position: 'absolute', inset: 0, transform: tf, opacity: op, zIndex: zIdx, transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.7s ease', transformOrigin: 'center center', willChange: 'transform,opacity', borderRadius: 24, overflow: 'hidden', cursor: 'pointer' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <img src={w.img} alt={w.title} style={{ width:'100%', height:'100%', objectFit:'cover', transform: hover ? 'scale(1.07)' : 'scale(1)', filter: `saturate(${hover ? 1.2 : 0.75})`, transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease' }}/>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(4,11,24,0.97) 0%, rgba(4,11,24,0.25) 55%, transparent 100%)' }}/>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 100%, rgba(${rgb},${hover?0.28:0}) 0%, transparent 70%)`, transition:'background 0.5s ease' }}/>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'28px 32px', transform: hover ? 'translateY(0)' : 'translateY(8px)', transition:'transform 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <span style={{ fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:w.color, padding:'3px 10px', background:`rgba(${rgb},0.18)`, border:`1px solid rgba(${rgb},0.35)`, borderRadius:999 }}>{w.tag}</span>
          <span style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em' }}>0{i+1}/{String(total).padStart(2,'0')}</span>
        </div>
        <h4 style={{ fontFamily:'var(--serif)', fontSize:'clamp(1.2rem,2.5vw,1.9rem)', fontWeight:900, color:'#fff', lineHeight:1.15, marginBottom:14, letterSpacing:'-0.02em' }}>{w.title}</h4>
        <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:18 }}>
          {w.tech.map(t=><span key={t} style={{ padding:'4px 12px', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:999, fontSize:'0.68rem', color:'rgba(255,255,255,0.65)', fontWeight:500 }}>{t}</span>)}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.78rem', fontWeight:700, color:w.color, opacity: hover ? 1 : 0, transform: hover ? 'translateX(0)' : 'translateX(-8px)', transition:'all 0.35s ease' }}>View project <ArrowRight size={13}/></div>
      </div>
      <div style={{ position:'absolute', top:20, right:20, width:36, height:36, borderRadius:'50%', background:`rgba(${rgb},0.15)`, border:`1px solid rgba(${rgb},0.4)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:w.color }}/>
      </div>
    </div>
  );
}

function WorkGrid() {
  const wrapRef = useRef(null);
  const prog = useElProgress(wrapRef);
  const active = Math.min(WORK.length - 1, Math.floor(prog * WORK.length));
  const rgb = (col) => col.replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)).join(',');
  return (
    <div ref={wrapRef} style={{ height: `${100 + WORK.length * 90}vh`, position: 'relative', background: '#040b18' }}>
      <section id="sec-work" style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center' }}>
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 65% 55%, rgba(${rgb(WORK[active].color)},0.08) 0%, transparent 60%)`, transition:'background 0.9s ease', pointerEvents:'none' }}/>
        <div className="wrap" style={{ width:'100%', display:'grid', gridTemplateColumns:'1fr', gap:32 }} id="work-layout">
          <div className="work-left">
            <Reveal y={20}>
              <p style={{ fontSize:'0.64rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:10 }}>Portfolio</p>
              <h2 style={{ fontFamily:'var(--serif)', fontSize:'clamp(2rem,4.5vw,3.8rem)', fontWeight:900, color:'#fff', letterSpacing:'-0.035em', lineHeight:1.05, marginBottom:24 }}>Recent Work</h2>
            </Reveal>
            <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:32 }}>
              {WORK.map((w, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:12, transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)', background: active===i ? `rgba(${rgb(w.color)},0.1)` : 'transparent', border: active===i ? `1px solid rgba(${rgb(w.color)},0.25)` : '1px solid transparent', transform: active===i ? 'translateX(8px)' : 'none' }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background: active===i ? w.color : 'rgba(255,255,255,0.2)', transition:'background 0.3s', flexShrink:0, boxShadow: active===i ? `0 0 8px ${w.color}` : 'none' }}/>
                  <span style={{ fontSize:'0.82rem', fontWeight: active===i ? 700 : 500, color: active===i ? '#fff' : 'rgba(255,255,255,0.38)', transition:'all 0.3s', letterSpacing:'-0.01em' }}>{w.title}</span>
                  {active===i && <span style={{ marginLeft:'auto', fontSize:'0.6rem', fontWeight:700, color:w.color, letterSpacing:'0.1em' }}>0{i+1}</span>}
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {WORK.map((_,i) => (<div key={i} style={{ height:3, borderRadius:2, transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)', background: i===active ? WORK[active].color : 'rgba(255,255,255,0.1)', width: i===active ? 36 : 10 }}/>))}
            </div>
          </div>
          <div className="work-right" style={{ position:'relative', height:'clamp(320px,55vh,560px)' }}>
            {WORK.map((w, i) => <WorkCard key={i} w={w} i={i} active={active} total={WORK.length} />)}
          </div>
        </div>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'rgba(255,255,255,0.04)' }}>
          <div style={{ height:'100%', width:`${prog*100}%`, background:`linear-gradient(to right,${WORK[active].color},transparent)`, transition:'none' }}/>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ⑦ TESTIMONIALS
═══════════════════════════════════════════════════ */
function Testimonials() {
  const [active, setActive] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const goto = useCallback((i) => { setFlipping(true); setTimeout(() => { setActive(i); setFlipping(false); }, 350); }, []);
  useEffect(() => { const t = setInterval(() => goto((active + 1) % TESTIMONIALS.length), 4200); return () => clearInterval(t); }, [active, goto]);
  const { name, role, text } = TESTIMONIALS[active];
  return (
    <section style={{ background: '#f4f6fb', padding: '96px 0', borderTop: '1px solid var(--rule)' }}>
      <div className="wrap" style={{ maxWidth: 700 }}>
        <Reveal y={24}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="label">Client Stories</span>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.025em' }}>What Our Clients Say</h2>
          </div>
        </Reveal>
        <Tilt>
          <div style={{ background: '#fff', border: '1px solid var(--rule)', borderRadius: 24, padding: 'clamp(32px,5vw,52px)', boxShadow: '0 8px 48px rgba(0,0,0,0.06)', transform: flipping ? 'rotateY(90deg)' : 'rotateY(0)', transition: 'transform 0.35s ease', perspective: '1000px' }}>
            <Quote size={32} style={{ color: 'var(--blue)', opacity: 0.18, marginBottom: 20 }} />
            <p style={{ fontSize: '1.05rem', color: 'var(--ink60)', lineHeight: 1.92, marginBottom: 32, fontStyle: 'italic', minHeight: 80 }}>{text}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontWeight: 900, color: '#fff', fontSize: '1.1rem', flexShrink: 0 }}>{name[0]}</div>
              <div><strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--ink)', fontWeight: 700 }}>{name}</strong><span style={{ fontSize: '0.74rem', color: 'var(--ink20)' }}>{role}</span></div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>{[...Array(5)].map((_, s) => <Star key={s} size={13} style={{ color: '#f59e0b', fill: '#f59e0b' }} />)}</div>
            </div>
          </div>
        </Tilt>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
          {TESTIMONIALS.map((_, i) => <button key={i} onClick={() => goto(i)} style={{ height: 4, borderRadius: 2, border: 'none', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', background: i === active ? 'var(--blue)' : 'var(--rule)', width: i === active ? 36 : 8, padding: 0 }} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ⑧ STACK
═══════════════════════════════════════════════════ */
function StackSection() {
  return (
    <section style={{ background: 'var(--surf)', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: '52px 0', overflow: 'hidden' }}>
      <Reveal y={16}><p style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink20)', marginBottom: 24 }}>Technologies We Master</p></Reveal>
      {[0, 1].map(row => (
        <div key={row} style={{ overflow: 'hidden', marginBottom: row === 0 ? 10 : 0 }}>
          <div style={{ display: 'flex', gap: 10, width: 'max-content', padding: '0 10px', animation: `${row === 0 ? 'tickL' : 'tickR'} ${row === 0 ? 22 : 30}s linear infinite` }}>
            {[...STACK, ...STACK, ...STACK, ...STACK].filter((_, i) => i % 2 === row).map((t, i) => (
              <span key={i} style={{ padding: '10px 22px', borderRadius: 999, background: '#fff', border: '1px solid var(--rule)', fontSize: '0.83rem', fontWeight: 600, color: 'var(--ink60)', whiteSpace: 'nowrap', flexShrink: 0, cursor: 'default', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0057ff'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0057ff'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,87,255,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--ink60)'; e.currentTarget.style.borderColor = 'var(--rule)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
              >{t}</span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ⑨ CTA
═══════════════════════════════════════════════════ */
function CtaSection() {
  const ref = useRef(null);
  const [ty, setTy] = useState(0);
  useEffect(() => {
    const fn = () => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); setTy((window.innerHeight - r.top) * 0.18); };
    window.addEventListener('scroll', fn, { passive: true }); fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <section ref={ref} style={{ position: 'relative', overflow: 'hidden', padding: '110px 0', background: '#030810', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <Aurora colors={['#0057ff', '#7c3aed', '#db2777']} opacity={0.65} />
      <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=75" alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '130%', objectFit: 'cover', opacity: .06, transform: `translateY(${ty}px)`, willChange: 'transform', transition: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(3,8,16,0.88) 0%, rgba(3,8,16,0.6) 50%, rgba(3,8,16,0.88) 100%)' }} />
      <div className="wrap" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
        <Reveal x={-40} y={0} style={{ maxWidth: 600 }}>
          <p style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>Internship Programme</p>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,5vw,3.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.05 }}>Shape Your Career<br />with Synnoviq</h2>
          <p style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.9 }}>Hands-on, mentor-driven internships on real live projects. Passionate about full stack, game dev, or design? We want you.</p>
        </Reveal>
        <Reveal x={40} y={0}>
          <Link to="/careers#internships" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '17px 36px', borderRadius: 14, background: '#fff', color: '#030810', fontSize: '0.96rem', fontWeight: 800, boxShadow: '0 4px 28px rgba(255,255,255,0.1)', transition: 'all 0.25s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0057ff'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,87,255,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#030810'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 28px rgba(255,255,255,0.1)'; }}
          >Apply Now <ArrowRight size={17} /></Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div style={{ marginTop: '-68px' }}>
      <Grain />
      <Cursor />
      <ProgressBar />
      <Hero />
      <Ticker />
      <Stats />
      <ServicesSection />
      <ProcessSection />
      <WorkGrid />
      <Testimonials />
      <StackSection />
      <CtaSection />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @keyframes hIn    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes gPulse { 0%,100%{box-shadow:0 0 6px #4ade80} 50%{box-shadow:0 0 20px #4ade80,0 0 36px #4ade8055} }
        @keyframes tickL  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes tickR  { from{transform:translateX(-50%)} to{transform:translateX(0)} }
        @media(min-width:768px){
          .home-stats { grid-template-columns:repeat(4,1fr) !important; }
          .home-stats>div>div { border-bottom:none !important; }
          #work-layout { grid-template-columns: 300px 1fr !important; align-items:center; }
        }
        @media(min-width:1024px){ #work-layout { grid-template-columns: 380px 1fr !important; } }
        @media(max-width:767px){
          .work-left { display:none !important; }
          .work-right { height: 420px !important; }
          .hero-scroll-cue { display: none !important; }
        }
      `}</style>
    </div>
  );
}
