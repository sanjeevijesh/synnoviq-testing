import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Instagram, Github } from 'lucide-react';
import logo from '../assets/logo.png';

const COLS = [
  { title: 'Company',   links: [{ l: 'About', to: '/about' }, { l: 'Our Team', to: '/team' }, { l: 'Careers', to: '/careers' }, { l: 'News', to: '/announcements' }] },
  { title: 'Services',  links: [{ l: 'Full Stack Dev', to: '/services#fullstack' }, { l: 'Game Development', to: '/services#gamedev' }, { l: 'UI/UX Design', to: '/services#uiux' }] },
  { title: 'Resources', links: [{ l: 'Blog', to: '/blog' }, { l: 'Verify Certificate', to: '/certificate-verification' }, { l: 'Contact Us', to: '/contact' }] },
];

const SOCIAL = [
  { I: Linkedin,  h: '#',                                          a: 'LinkedIn'  },
  { I: Twitter,   h: '#',                                          a: 'Twitter'   },
  { I: Instagram, h: '#',                                          a: 'Instagram' },
  { I: Github,    h: '#',                                          a: 'GitHub'    },
  { I: Mail,      h: 'mailto:synnoviqtechnologies@gmail.com',      a: 'Email'     },
];

export default function Footer() {
  return (
    <footer style={{ background: '#060c18', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="wrap" style={{ padding: '56px 20px 0' }}>

        {/* ── Top grid ── */}
        <div className="footer-top" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>

          {/* Brand column */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img src={logo} alt="Synnoviq Technologies" style={{ height: 52, width: 'auto' }} />
              <div style={{ lineHeight: 1 }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', display: 'block', letterSpacing: '-0.01em' }}>Synnoviq</span>
                <span style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: 3, display: 'block' }}>Technologies</span>
              </div>
            </Link>
            <p style={{ fontSize: '0.86rem', lineHeight: 1.72, maxWidth: 260, color: 'rgba(255,255,255,0.45)', marginBottom: 22 }}>
              Engineering excellence. Creating impact. Building the digital future one project at a time.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SOCIAL.map(({ I, h, a }) => (
                <a key={a} href={h} aria-label={a}
                  style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0057ff'; e.currentTarget.style.color = '#0057ff'; e.currentTarget.style.background = 'rgba(0,87,255,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'transparent'; }}
                ><I size={14} /></a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(({ title, links }) => (
            <div key={title}>
              <h4 style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginBottom: 16 }}>{title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(({ l, to }) => (
                  <li key={l}>
                    <Link to={to}
                      style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.45)', transition: 'color 0.18s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                    >{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 0' }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.28)' }}>© 2025 Synnoviq Technologies Pvt Ltd. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[{ l: 'Privacy Policy', to: '/privacy-policy' }, { l: 'Terms of Service', to: '/terms-of-service' }].map(({ l, to }) => (
              <Link key={to} to={to}
                style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.28)', transition: 'color 0.18s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.28)'}
              >{l}</Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 480px) { .footer-top { grid-template-columns: 1fr 1fr !important; } }
        @media (min-width: 900px) { .footer-top { grid-template-columns: 1.6fr 1fr 1fr 1fr !important; } }
        @media (min-width: 600px) { .footer-bottom { flex-direction: row !important; justify-content: space-between !important; align-items: center !important; } }
      `}</style>
    </footer>
  );
}