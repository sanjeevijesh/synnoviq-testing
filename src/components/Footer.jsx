import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Instagram } from 'lucide-react';
import logo from '../assets/logo.png';

/* ── Only working pages ── */
const COLS = [
  {
    title: 'Company',
    links: [
      { l: 'About',   to: '/about'   },
      { l: 'Careers', to: '/careers' },
    ],
  },
  {
    title: 'Services',
    links: [
      { l: 'Full Stack Dev',  to: '/services#fullstack' },
      { l: 'Game Development',to: '/services#gamedev'   },
      { l: 'UI/UX Design',    to: '/services#uiux'      },
    ],
  },
  {
    title: 'Connect',
    links: [
      { l: 'Blog',               to: '/blog'                    },
      { l: 'Verify Certificate', to: '/certificate-verification'},
      { l: 'Contact Us',         to: '/contact'                 },
    ],
  },
];

const SOCIAL = [
  {
    I: Linkedin,
    h: 'https://www.linkedin.com/company/synnoviq-technologies/',
    a: 'LinkedIn',
    col: '#0a66c2',
    rgb: '10,102,194',
  },
  {
    I: Twitter,
    h: 'https://x.com/synnoviqtech?t=R4PSw0kAuyb-niJZ63lv_g&s=08',
    a: 'X / Twitter',
    col: '#e7e9ea',
    rgb: '231,233,234',
  },
  {
    I: Instagram,
    h: 'https://www.instagram.com/synnoviq_technologies?igsh=N2p4NTVrY2s0aTN6',
    a: 'Instagram',
    col: '#e1306c',
    rgb: '225,48,108',
  },
  {
    I: Mail,
    h: 'mailto:synnoviqtechnologies@gmail.com',
    a: 'Email',
    col: '#0057ff',
    rgb: '0,87,255',
  },
];

export default function Footer() {
  return (
    <footer style={{ background: '#060c18', borderTop: '1px solid rgba(255,255,255,.06)' }}>
      <div className="wrap" style={{ padding: '0 clamp(20px,5vw,48px)' }}>

        {/* ── TOP GRID ── */}
        <div className="footer-top" style={{ display: 'grid', gap: 'clamp(32px,5vw,48px)', padding: 'clamp(44px,7vw,64px) 0 clamp(36px,5vw,48px)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>

          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16, textDecoration: 'none' }}>
              <img src={logo} alt="Synnoviq Technologies" style={{ height: 46, width: 'auto' }} />
              <div style={{ lineHeight: 1 }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 800, color: '#fff', display: 'block', letterSpacing: '-.01em' }}>Synnoviq</span>
                <span style={{ fontSize: '.52rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)', marginTop: 3, display: 'block' }}>Technologies</span>
              </div>
            </Link>

            <p style={{ fontSize: 'clamp(.82rem,1.4vw,.86rem)', lineHeight: 1.75, maxWidth: 240, color: 'rgba(255,255,255,.4)', marginBottom: 24 }}>
              Engineering excellence. Creating impact. Building the digital future one project at a time.
            </p>

            {/* Social icons — labelled on mobile for better tap UX */}
            <div className="footer-social" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SOCIAL.map(({ I, h, a, col, rgb }) => (
                <a key={a} href={h}
                  target={h.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={a}
                  className="footer-social-link"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 14px', borderRadius: 12,
                    border: '1px solid rgba(255,255,255,.08)',
                    background: 'rgba(255,255,255,.03)',
                    color: 'rgba(255,255,255,.5)',
                    textDecoration: 'none',
                    transition: 'all .2s ease',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    minHeight: 44,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `rgba(${rgb},.5)`;
                    e.currentTarget.style.background  = `rgba(${rgb},.1)`;
                    e.currentTarget.style.color = col;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)';
                    e.currentTarget.style.background  = 'rgba(255,255,255,.03)';
                    e.currentTarget.style.color = 'rgba(255,255,255,.5)';
                  }}
                >
                  <I size={15} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 'clamp(.78rem,1.3vw,.82rem)', fontWeight: 600 }}>{a}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(({ title, links }) => (
            <div key={title}>
              <h4 style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.7)', marginBottom: 18 }}>{title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {links.map(({ l, to }) => (
  <li key={l}>
    <Link to={to}
      style={{ fontSize: 'clamp(.82rem,1.4vw,.86rem)', color: 'rgba(255,255,255,.42)', transition: 'color .18s', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.42)'}
    >
      {l}
    </Link>
  </li>
))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 'clamp(16px,3vw,20px) 0' }}>
          <p style={{ fontSize: 'clamp(.74rem,1.2vw,.8rem)', color: 'rgba(255,255,255,.25)', margin: 0 }}>
            © {new Date().getFullYear()} Synnoviq Technologies Pvt Ltd. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { l: 'Privacy Policy',    to: '/privacy-policy'   },
              { l: 'Terms of Service',  to: '/terms-of-service' },
            ].map(({ l, to }) => (
              <Link key={to} to={to}
                style={{ fontSize: 'clamp(.74rem,1.2vw,.8rem)', color: 'rgba(255,255,255,.25)', transition: 'color .18s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.25)'}
              >{l}</Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* Mobile-first: single column */
        .footer-top { grid-template-columns: 1fr !important; }

        /* 2-col at 480px: brand full width, then 2 link cols per row */
        @media(min-width:480px){
          .footer-top { grid-template-columns: 1fr 1fr !important; }
          .footer-top > div:first-child { grid-column: 1 / -1; }
        }

        /* 3-col at 680px: brand + 2 link cols */
        @media(min-width:680px){
          .footer-top { grid-template-columns: 1fr 1fr 1fr !important; }
          .footer-top > div:first-child { grid-column: 1 / 1; }
        }

        /* 4-col at 900px: original desktop layout */
        @media(min-width:900px){
          .footer-top { grid-template-columns: 1.5fr 1fr 1fr 1fr !important; }
          .footer-top > div:first-child { grid-column: auto; }
          /* On desktop, social icons go back to compact icon-only row */
          .footer-social { flex-direction: row !important; flex-wrap: wrap; gap: 8px !important; }
          .footer-social-link { padding: 0 !important; width: 36px; height: 36px; border-radius: 10px !important; justify-content: center; min-height: unset !important; }
          .footer-social-link span { display: none; }
        }

        /* Bottom bar goes horizontal on tablet+ */
        @media(min-width:600px){
          .footer-bottom {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
        }

        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </footer>
  );
}