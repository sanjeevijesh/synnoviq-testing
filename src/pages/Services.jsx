import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Globe, Gamepad2, Palette, Monitor, Smartphone, Chrome, Tv2 } from 'lucide-react';
import logo from '../assets/logo.png';

/* ═══════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════ */
const SVCS = [
  {
    id: 'fullstack', Icon: Globe,
    num: '01',
    title: 'Full Stack\nWeb Development',
    tagline: 'Enterprise-grade web apps, built end-to-end.',
    color: '#0057ff', colorRgb: '0,87,255', bg: '#000a1f',
    img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=90',
    overview: 'We build complete web applications from the ground up — modern responsive frontends paired with powerful, secure, and scalable backends.',
    tags: ['React.js','Next.js','Node.js','PostgreSQL','AWS','Docker','GraphQL','TypeScript'],
    process: ['Discovery','Architecture','Development','QA & Testing','Deployment','Support'],
    included: [
      'Frontend: React.js, Next.js, Vue.js, Tailwind CSS',
      'Backend: Node.js, Python (Django/FastAPI), REST & GraphQL APIs',
      'Database: PostgreSQL, MongoDB, MySQL, Firebase',
      'Cloud & DevOps: AWS, Azure, Docker, Kubernetes, CI/CD',
      'E-commerce platforms, SaaS products, enterprise portals',
      'Performance audits and legacy system modernisation',
    ],
  },
  {
    id: 'gamedev', Icon: Gamepad2,
    num: '02',
    title: 'Game\nDevelopment',
    tagline: 'From mobile hits to immersive 3D worlds.',
    color: '#7c3aed', colorRgb: '124,58,237', bg: '#0d0020',
    img: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=1600&q=90',
    overview: 'From hypercasual mobile titles to complex 3D multiplayer environments — bringing interactive visions to life with technical precision and creative flair.',
    tags: ['Unity','Unreal Engine','C#','C++','iOS','Android','WebGL','Photon'],
    platforms: [
      { Icon: Smartphone, l: 'Mobile (iOS/Android)' },
      { Icon: Monitor,    l: 'PC (Windows/macOS)'   },
      { Icon: Chrome,     l: 'WebGL (browser)'       },
      { Icon: Tv2,        l: 'Console (scoped)'      },
    ],
    included: [
      '2D and 3D game development (Unity, Unreal Engine)',
      'Mobile game development for iOS & Android',
      'Multiplayer and networked game systems',
      'Game UI/UX design, HUD design and asset integration',
      'Gameplay mechanics, physics systems, AI behaviour',
      'Prototyping, playtesting and post-launch live-ops',
    ],
  },
  {
    id: 'uiux', Icon: Palette,
    num: '03',
    title: 'UI/UX Design\n& Consulting',
    tagline: 'Interfaces users love. Products that convert.',
    color: '#db2777', colorRgb: '219,39,119', bg: '#1a0010',
    img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&q=90',
    overview: 'Outstanding technology deserves outstanding design. We create interfaces that users love — intuitive, accessible, and visually refined down to the pixel.',
    tags: ['Figma','Prototyping','Research','Wireframes','Design Systems','Accessibility','Branding','Audit'],
    included: [
      'User research, persona development and journey mapping',
      'Wireframing, prototyping and usability testing',
      'Design systems and component libraries (Figma)',
      'Responsive and ADA-compliant interface design',
      'Technology stack advisory and architecture consulting',
      'Code reviews, technical audits and performance assessments',
    ],
  },
];

/* ═══════════════════════════════════════════════════
   CANVAS PARTICLE CURSOR TRAIL
═══════════════════════════════════════════════════ */
function CursorTrail({ color }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse     = useRef({ x: -999, y: -999 });
  const raf       = useRef(null);
  const colorRef  = useRef(color);
  useEffect(() => { colorRef.current = color; }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Spawn particle at mouse
      if (mouse.current.x > 0) {
        particles.current.push({
          x: mouse.current.x + (Math.random() - 0.5) * 12,
          y: mouse.current.y + (Math.random() - 0.5) * 12,
          r: Math.random() * 5 + 2,
          alpha: 0.7,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 - 0.5,
          color: colorRef.current,
        });
      }
      // Update & draw
      particles.current = particles.current.filter(p => p.alpha > 0.01);
      particles.current.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.r  *= 0.93;
        p.alpha *= 0.88;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, p.r), 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      raf.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />;
}

/* ═══════════════════════════════════════════════════
   3D TILT CARD
═══════════════════════════════════════════════════ */
function TiltCard({ children, style = {}, className = '' }) {
  const ref = useRef(null);
  const onMouseMove = (e) => {
    const r    = ref.current.getBoundingClientRect();
    const x    = (e.clientX - r.left) / r.width  - 0.5;
    const y    = (e.clientY - r.top)  / r.height - 0.5;
    ref.current.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) scale(1.025)`;
    ref.current.style.boxShadow = `${-x * 20}px ${y * 20}px 50px rgba(0,0,0,0.25)`;
  };
  const onLeave = () => {
    ref.current.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale(1)';
    ref.current.style.boxShadow = 'none';
  };
  return (
    <div ref={ref} className={className} style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease', ...style }}
      onMouseMove={onMouseMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STICKY SCROLL PANEL — the hero of this page
   Each service locks into a full-screen sticky frame.
   As user scrolls through its allocated height, an
   internal progress (0→1) drives ALL animations:
     - image zoom & reveal
     - text lines flying in
     - feature items drawing in one-by-one
     - colour wash shifting
═══════════════════════════════════════════════════ */
function StickyServicePanel({ svc, idx }) {
  const wrapRef    = useRef(null);   // tall wrapper that "holds" the sticky height
  const stickyRef  = useRef(null);   // the 100vh sticky element
  const [prog, setProg] = useState(0); // 0 → 1 as user scrolls through section

  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return;
      const rect   = wrapRef.current.getBoundingClientRect();
      const total  = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      setProg(Math.min(1, Math.max(0, scrolled / total)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Derived animation values from progress
  const imgScale    = 1.25 - prog * 0.22;           // 1.25 → 1.03
  const imgOpacity  = Math.min(1, prog * 3);          // 0 → 1 fast
  const overlayAmt  = Math.max(0, 0.82 - prog * 0.5);// dark overlay fades away
  const contentX    = Math.max(0, (1 - prog * 3.5)) * (idx % 2 === 0 ? -80 : 80);
  const contentOp   = Math.min(1, Math.max(0, prog * 4 - 0.3));
  const tagOpacity  = (i) => Math.min(1, Math.max(0, prog * 8 - i * 0.8));
  const tagX        = (i) => Math.max(0, (1 - Math.max(0, prog * 8 - i * 0.8)) * 40);
  const numScale    = 0.6 + prog * 0.8;              // number watermark grows
  const lineWidth   = Math.min(100, prog * 180);      // accent line draws across

  return (
    /* Tall wrapper — 300vh means 200vh of scroll travel */
    <div ref={wrapRef} id={svc.id} style={{ height: '300vh', position: 'relative' }}>
      {/* Sticky frame */}
      <div ref={stickyRef} style={{
        position: 'sticky', top: 0,
        height: '100vh', width: '100%',
        overflow: 'hidden',
        background: svc.bg,
      }}>

        {/* ── Full-bleed parallax image ── */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: imgOpacity,
          transition: 'none',
        }}>
          <img src={svc.img} alt={svc.title} style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            transform: `scale(${imgScale})`,
            transformOrigin: 'center center',
            willChange: 'transform',
            filter: `saturate(${0.6 + prog * 0.5})`,
          }} />
        </div>

        {/* ── Dark gradient overlay (fades as you scroll) ── */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, rgba(0,0,0,${overlayAmt + 0.3}) 0%, rgba(0,0,0,${overlayAmt * 0.6}) 100%)`,
        }} />

        {/* ── Colour wash from service colour ── */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at ${idx % 2 === 0 ? '80% 50%' : '20% 50%'}, rgba(${svc.colorRgb},${0.3 - prog * 0.18}) 0%, transparent 65%)`,
        }} />

        {/* ── Giant number watermark ── */}
        <div style={{
          position: 'absolute',
          top: '50%', left: idx % 2 === 0 ? 'auto' : '5%',
          right: idx % 2 === 0 ? '5%' : 'auto',
          transform: `translateY(-50%) scale(${numScale})`,
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(10rem, 25vw, 20rem)',
          fontWeight: 900, lineHeight: 1,
          color: `rgba(${svc.colorRgb},0.08)`,
          pointerEvents: 'none', userSelect: 'none',
          willChange: 'transform',
        }}>{svc.num}</div>

        {/* ── Animated accent line across top of content ── */}
        <div style={{
          position: 'absolute',
          top: idx % 2 === 0 ? '15%' : 'auto',
          bottom: idx % 2 !== 0 ? '15%' : 'auto',
          left: idx % 2 === 0 ? '50%' : '5%',
          height: 2,
          width: `${lineWidth}%`,
          maxWidth: 420,
          background: `linear-gradient(to right, ${svc.color}, transparent)`,
          transition: 'none',
        }} />

        {/* ── Content panel (slides in from side) ── */}
        <div style={{
          position: 'absolute',
          top: 0, bottom: 0,
          left: idx % 2 === 0 ? 0 : 'auto',
          right: idx % 2 !== 0 ? 0 : 'auto',
          width: 'min(520px, 48%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(32px,5vw,64px)',
          opacity: contentOp,
          transform: `translateX(${contentX}px)`,
          willChange: 'transform, opacity',
        }} className="svc-content-pane">

          {/* Service number + accent */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 2, background: svc.color, borderRadius: 1 }} />
            <span style={{ fontFamily: 'var(--serif)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: svc.color }}>Service {svc.num}</span>
          </div>

          {/* Title — each line slides in separately */}
          <div style={{ marginBottom: 18, overflow: 'hidden' }}>
            {svc.title.split('\n').map((line, li) => (
              <div key={li} style={{
                fontFamily: 'var(--serif)',
                fontSize: 'clamp(2rem,4vw,3.4rem)',
                fontWeight: 900, lineHeight: 1.08,
                color: '#fff', letterSpacing: '-0.03em',
                transform: `translateY(${Math.max(0, (1 - prog * 4 + li * 0.4)) * 60}px)`,
                opacity: Math.min(1, Math.max(0, prog * 5 - li * 0.5)),
                transition: 'none',
              }}>{line}</div>
            ))}
          </div>

          {/* Tagline */}
          <p style={{
            fontSize: '0.97rem', color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.8, marginBottom: 28,
            transform: `translateY(${Math.max(0, (1 - prog * 4) * 30)}px)`,
            opacity: Math.min(1, Math.max(0, prog * 5 - 0.6)),
          }}>{svc.overview}</p>

          {/* Tech tags — each appears staggered */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 28 }}>
            {svc.tags.map((tag, i) => (
              <span key={tag} style={{
                padding: '5px 13px', borderRadius: 999,
                background: `rgba(${svc.colorRgb},0.15)`,
                border: `1px solid rgba(${svc.colorRgb},0.35)`,
                fontSize: '0.75rem', fontWeight: 600, color: '#fff',
                opacity: tagOpacity(i),
                transform: `translateX(${tagX(i)}px)`,
                transition: 'none',
              }}>{tag}</span>
            ))}
          </div>

          {/* CTA */}
          <div style={{ opacity: Math.min(1, Math.max(0, prog * 6 - 2)), transform: `translateY(${Math.max(0,(1-prog*6+2)*20)}px)` }}>
            <Link to="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 10,
              background: svc.color, color: '#fff',
              fontSize: '0.87rem', fontWeight: 700,
              boxShadow: `0 6px 24px rgba(${svc.colorRgb},0.5)`,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)'; e.currentTarget.style.boxShadow = `0 12px 32px rgba(${svc.colorRgb},0.65)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 6px 24px rgba(${svc.colorRgb},0.5)`; }}
            >Start this project <ArrowRight size={15} /></Link>
          </div>
        </div>

        {/* ── Progress bar at bottom ── */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.08)' }}>
          <div style={{ height: '100%', width: `${prog * 100}%`, background: svc.color, boxShadow: `0 0 10px ${svc.color}`, transition: 'none' }} />
        </div>

        {/* ── Section indicator bottom-right ── */}
        <div style={{
          position: 'absolute', bottom: 24, right: 28,
          fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
        }}>{svc.num} / 03</div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HORIZONTAL SCROLLING FEATURES STRIP
═══════════════════════════════════════════════════ */
function HorizontalFeaturesStrip({ svc }) {
  const wrapRef = useRef(null);
  const [tx, setTx] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return;
      const rect   = wrapRef.current.getBoundingClientRect();
      const vh     = window.innerHeight;
      const enter  = 1 - rect.top / vh;
      // Map enter 0→2 to translateX 0 → -60%
      const shift  = Math.min(60, Math.max(0, (enter - 0.3) * 50));
      setTx(-shift);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={wrapRef} style={{ overflow: 'hidden', background: svc.bg, borderTop: `1px solid rgba(${svc.colorRgb},0.15)`, padding: '48px 0' }}>
      <div style={{ display: 'flex', gap: 20, padding: '0 48px', width: 'max-content', transform: `translateX(${tx}%)`, transition: 'transform 0.05s linear', willChange: 'transform' }}>
        {svc.included.map((item, i) => (
          <TiltCard key={i} style={{
            minWidth: 280, padding: '28px 24px', borderRadius: 16,
            background: `rgba(${svc.colorRgb},0.08)`,
            border: `1px solid rgba(${svc.colorRgb},0.2)`,
            flexShrink: 0,
          }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `rgba(${svc.colorRgb},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Check size={13} style={{ color: svc.color }} />
            </div>
            <p style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{item}</p>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ROTATING TEXT RING
═══════════════════════════════════════════════════ */
function RotatingRing({ color, text = 'FULL STACK · GAME DEV · UI/UX · WEB APPS · MOBILE · CLOUD · ' }) {
  const [angle, setAngle] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const tick = () => { setAngle(a => a + 0.25); raf.current = requestAnimationFrame(tick); };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);
  const chars = text.split('');
  const radius = 80;
  return (
    <div style={{ width: 210, height: 210, position: 'relative', flexShrink: 0 }}>
      <svg viewBox="0 0 180 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {chars.map((ch, i) => {
          const a = (i / chars.length) * 360 + angle;
          const r = a * Math.PI / 180;
          const x = 90 + radius * Math.cos(r);
          const y = 90 + radius * Math.sin(r);
          return (
            <text key={i} x={x} y={y}
              textAnchor="middle" dominantBaseline="middle"
              transform={`rotate(${a + 90}, ${x}, ${y})`}
              style={{ fontSize: 9, fontWeight: 700, fill: color, letterSpacing: 1, fontFamily: 'var(--sans)' }}>
              {ch}
            </text>
          );
        })}
        {/* White circle background behind logo */}
        <circle cx="90" cy="90" r="30" fill="rgba(255,255,255,0.08)" />
        <circle cx="90" cy="90" r="30" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
        <image href={logo} x="62" y="62" width="56" height="56" style={{ borderRadius: 28 }} clipPath="circle(28px at 28px 28px)" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SCROLL PROGRESS INDICATOR (floating pills)
═══════════════════════════════════════════════════ */
function SectionPills({ active }) {
  return (
    <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 1000, backdropFilter: 'blur(10px)', background: 'rgba(0,0,0,0.3)', padding: '8px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)' }}>
      {SVCS.map((s, i) => (
        <a key={s.id} href={`#${s.id}`} style={{
          display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none',
          padding: active === i ? '4px 14px' : '4px 8px',
          borderRadius: 999,
          background: active === i ? s.color : 'transparent',
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: active === i ? '#fff' : 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
          {active === i && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{s.title.split('\n')[0]}</span>}
        </a>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export default function Services() {
  const [activeSvc, setActiveSvc] = useState(0);
  const [cursorColor, setCursorColor] = useState('#0057ff');

  // Detect which section is in view based on scroll
  useEffect(() => {
    const sections = SVCS.map(s => document.getElementById(s.id));
    const onScroll = () => {
      const vh = window.innerHeight;
      sections.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.5 && r.bottom > vh * 0.5) {
          setActiveSvc(i);
          setCursorColor(SVCS[i].color);
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: '#040b18', marginTop: '-68px' }}>

      {/* Particle cursor trail */}
      <CursorTrail color={cursorColor} />

      {/* Floating section pills */}
      <SectionPills active={activeSvc} />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #040b18 0%, #000a2e 100%)',
      }}>
        {/* Grid texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Glow orb */}
        <div style={{ position: 'absolute', top: '30%', left: '55%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,87,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1, padding: '198px 20px 100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>

          {/* Left: text */}
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, fontSize: '0.74rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 32, backdropFilter: 'blur(8px)', animation: 'fadeUp 0.8s ease both' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', display: 'inline-block' }} />
              What We Build
            </div>

            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.8rem,7vw,5.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.03, letterSpacing: '-0.035em', marginBottom: 24, animation: 'fadeUp 0.9s 0.1s ease both' }}>
              Enterprise-Grade Dev.<br />
              <em style={{ fontStyle: 'italic', color: '#5aa8ff' }}>Startup Speed.</em>
            </h1>
            <p style={{ fontSize: 'clamp(0.9rem,1.6vw,1.08rem)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, maxWidth: 520, marginBottom: 44, animation: 'fadeUp 0.9s 0.25s ease both' }}>
              Scroll through our services below — each one unfolds as you move down the page.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', animation: 'fadeUp 0.9s 0.4s ease both' }}>
              {SVCS.map(s => (
                <a key={s.id} href={`#${s.id}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '9px 20px', borderRadius: 999, textDecoration: 'none',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 600,
                  transition: 'all 0.22s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = s.color; e.currentTarget.style.borderColor = s.color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = ''; }}
                >
                  <s.Icon size={13} /> {s.title.replace('\n', ' ').split(' ').slice(0, 2).join(' ')}
                </a>
              ))}
            </div>
          </div>

          {/* Right: rotating ring */}
          <div style={{ animation: 'fadeUp 1s 0.5s ease both' }} className="hide-mobile">
            <RotatingRing color="#0057ff" />
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', opacity: 0.4, animation: 'fadeUp 1s 1s both' }}>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, #fff, transparent)', margin: '0 auto 8px' }} />
          <span style={{ fontSize: '0.6rem', color: '#fff', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STICKY SERVICE PANELS
      ══════════════════════════════════════ */}
      {SVCS.map((svc, idx) => (
        <div key={svc.id}>
          <StickyServicePanel svc={svc} idx={idx} />
          <HorizontalFeaturesStrip svc={svc} />
        </div>
      ))}

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section style={{ background: '#060c18', position: 'relative', overflow: 'hidden', padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(0,87,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>Ready to Build?</p>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem,5vw,4rem)', fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-0.03em', lineHeight: 1.08 }}>Have a Project in Mind?</h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.9, maxWidth: 440, margin: '0 auto 40px' }}>
            Tell us your idea — we'll build a tailored plan on time, within budget, beyond expectations.
          </p>
          <Link to="/contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '16px 36px', borderRadius: 14,
            background: '#fff', color: '#040b18',
            fontSize: '0.95rem', fontWeight: 800,
            boxShadow: '0 4px 28px rgba(255,255,255,0.1)',
            transition: 'all 0.25s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0057ff'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,87,255,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#040b18'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 28px rgba(255,255,255,0.1)'; }}
          >
            Get a Free Consultation <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          GLOBAL STYLES
      ══════════════════════════════════════ */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Mobile: disable sticky / clip, show content normally */
        @media (max-width: 767px) {
          .svc-content-pane {
            width: 100% !important;
            left: 0 !important; right: 0 !important;
            padding: 36px 24px !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}