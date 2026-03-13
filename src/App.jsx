import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import './styles/globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Team from './pages/Team';
import Announcements from './pages/Announcements';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import CertificateVerification from './pages/CertificateVerification';

const Placeholder = ({ title }) => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 68 }}>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: 12 }}>Page</p>
      <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--ink)', marginBottom: 8 }}>{title}</h1>
      <p style={{ color: 'var(--ink40)' }}>This page is coming soon.</p>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <Routes>
          <Route path="/"                         element={<Home />}                    />
          <Route path="/about"                    element={<About />}                   />
          <Route path="/services"                 element={<Services />}                />
          <Route path="/blog"                     element={<Blog />}                    />
          <Route path="/blog/:slug"               element={<Placeholder title="Blog Post" />} />
          <Route path="/team"                     element={<Team />}                    />
          <Route path="/announcements"            element={<Announcements />}           />
          <Route path="/announcements/:slug"      element={<Placeholder title="Announcement" />} />
          <Route path="/careers"                  element={<Careers />}                 />
          <Route path="/contact"                  element={<Contact />}                 />
          <Route path="/certificate-verification" element={<CertificateVerification />} />
          <Route path="/login"                    element={<Placeholder title="Login" />} />
          <Route path="/privacy-policy"           element={<Placeholder title="Privacy Policy" />} />
          <Route path="/terms-of-service"         element={<Placeholder title="Terms of Service" />} />
          <Route path="*"                         element={<Placeholder title="404 — Not Found" />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
