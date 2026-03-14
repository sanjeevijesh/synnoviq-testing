import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

const LINKS = [
  { to: '/',         l: 'Home'     },
  { to: '/about',    l: 'About'    },
  { to: '/services', l: 'Services' },
  { to: '/blog',     l: 'Blog'     },
  { to: '/careers',  l: 'Careers'  },
  { to: '/contact',  l: 'Contact'  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true }); fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [loc]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:1000, height:64,
        background: scrolled ? '#091629' : '#0d1e3a',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.45)' : 'none',
        transition:'background 0.3s ease',
      }}>
        <div style={{ maxWidth:1160, margin:'0 auto', padding:'0 20px', height:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>

          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0, textDecoration:'none' }}>
            <img src={logo} alt="Synnoviq" style={{ height:46, width:'auto' }} />
            <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
              <span style={{ fontFamily:'var(--serif)', fontSize:'1.1rem', fontWeight:800, color:'#fff', letterSpacing:'-0.01em' }}>Synnoviq</span>
              <span style={{ fontSize:'0.55rem', fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginTop:3 }}>Technologies</span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul style={{ display:'flex', gap:2, listStyle:'none', margin:0, padding:0, flex:1, justifyContent:'center' }} className="hide-mobile">
  {LINKS.map(({ to, l }) => (
    <li key={to}>
      <NavLink 
        to={to} 
        end={to === '/'}
        className={({ isActive }) => isActive ? "desktop-link active" : "desktop-link"}
      >
        {l}
      </NavLink>
    </li>
  ))}
</ul>

          {/* Desktop CTA */}
          <div className="hide-mobile">
            <Link to="/contact" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 18px', borderRadius:8, fontSize:'0.8rem', fontWeight:600, background:'#0057ff', color:'#fff', textDecoration:'none', boxShadow:'0 2px 12px rgba(0,87,255,0.4)', transition:'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#0044cc'; e.currentTarget.style.boxShadow='0 4px 18px rgba(0,87,255,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='#0057ff'; e.currentTarget.style.boxShadow='0 2px 12px rgba(0,87,255,0.4)'; }}
            >Get in Touch</Link>
          </div>

          {/* Hamburger */}
          <button onClick={() => setOpen(!open)} className="hide-desktop" aria-label="Toggle menu"
            style={{ width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8, border:'1px solid rgba(255,255,255,0.3)', color:'#fff', background: open ? 'rgba(255,255,255,0.1)' : 'transparent', cursor:'pointer', transition:'background 0.18s' }}>
            {open ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div style={{ position:'fixed', inset:0, zIndex:999, background:'#081120', display:'flex', flexDirection:'column', padding:'80px 28px 40px', transform: open ? 'translateX(0)' : 'translateX(100%)', transition:'transform 0.32s cubic-bezier(0.4,0,0.2,1)', overflowY:'auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:36 }}>
          <img src={logo} alt="Synnoviq" style={{ height:50, width:'auto' }} />
          <div style={{ lineHeight:1 }}>
            <span style={{ fontFamily:'var(--serif)', fontSize:'1.2rem', fontWeight:800, color:'#fff', display:'block' }}>Synnoviq</span>
            <span style={{ fontSize:'0.55rem', fontWeight:600, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.45)' }}>Technologies</span>
          </div>
        </div>

        {LINKS.map(({ to, l }, i) => (
          <NavLink key={to} to={to} end={to==='/'}
            style={({ isActive }) => ({
              display:'block', padding:'16px 0', textDecoration:'none',
              fontFamily:'var(--serif)', fontSize:'1.9rem', fontWeight:800, letterSpacing:'-0.02em',
              color: isActive ? '#7cb8ff' : '#ffffff',
              borderBottom:'1px solid rgba(255,255,255,0.07)',
              animationName:'drawerFadeUp', animationDuration:'0.4s',
              animationDelay:`${i*0.05}s`, animationFillMode:'both',
            })}
          >{l}</NavLink>
        ))}

        <Link to="/contact" style={{ display:'flex', alignItems:'center', justifyContent:'center', marginTop:32, padding:'14px', borderRadius:12, background:'#0057ff', color:'#fff', fontSize:'0.95rem', fontWeight:700, textDecoration:'none', boxShadow:'0 4px 18px rgba(0,87,255,0.45)' }}>
          Get in Touch
        </Link>
      </div>

      <style>{`
  /* Your existing drawer keyframes and media queries */
  @keyframes drawerFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @media(max-width:767px)  { .hide-mobile  { display:none !important; } }
  @media(min-width:768px)  { .hide-desktop { display:none !important; } }

  /* Add these new rules for your desktop links */
  .desktop-link {
    display: block;
    padding: 6px 12px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 0.82rem;
    font-weight: 500;
    color: #c2d4eb;
    background: transparent;
    transition: all 0.18s;
  }
  
  /* Hover effect (only applies when hovered) */
  .desktop-link:hover {
    color: #fff;
    background: rgba(255,255,255,0.08);
  }

  /* Active effect (stays locked in when on that page) */
  .desktop-link.active {
    font-weight: 600;
    color: #ffffff;
    background: rgba(255,255,255,0.12);
  }
`}</style>
    </>
  );
}