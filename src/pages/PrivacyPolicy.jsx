import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Bell, Trash2, Mail, ChevronRight, ArrowRight } from 'lucide-react';

/* ═══════════ HOOKS ═══════════ */
function useInView(threshold) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: threshold || 0.06 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ═══════════ OVERLAYS ═══════════ */
function Grain() {
  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,pointerEvents:'none',opacity:.022}}>
      <svg width="100%" height="100%"><filter id="pgrn"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#pgrn)"/></svg>
    </div>
  );
}

function ProgressBar() {
  const [p,setP]=useState(0);
  useEffect(()=>{
    const fn=()=>{const d=document.documentElement;setP(d.scrollTop/(d.scrollHeight-d.clientHeight));};
    window.addEventListener('scroll',fn,{passive:true});
    return ()=>window.removeEventListener('scroll',fn);
  },[]);
  return <div style={{position:'fixed',top:0,left:0,right:0,height:3,zIndex:9999}}><div style={{height:'100%',background:'linear-gradient(90deg,#0057ff,#7c3aed,#059669)',transformOrigin:'left',transform:`scaleX(${p})`,transition:'none',willChange:'transform'}}/></div>;
}

/* ═══════════ SECTION DATA ═══════════ */
const SECTIONS = [
  {
    id:'information', Icon:Database, col:'#0057ff', rgb:'0,87,255',
    title:'Information We Collect',
    content:[
      { head:'Information you provide directly', body:'When you fill out a contact form, apply for a job, or send us an email, we collect your name, email address, phone number, and the content of your message.' },
      { head:'Information collected automatically', body:'We may collect standard technical data such as your IP address, browser type, pages visited, and time spent on our site via analytics tools. This data is aggregated and cannot identify you personally.' },
      { head:'Communications', body:'If you subscribe to updates or newsletters, we retain your email address for that purpose only and you may unsubscribe at any time.' },
    ]
  },
  {
    id:'use', Icon:Eye, col:'#7c3aed', rgb:'124,58,237',
    title:'How We Use Your Information',
    content:[
      { head:'To respond to enquiries', body:'We use your contact details solely to respond to messages you send us. We do not sell, rent, or share your personal information with third parties for marketing purposes.' },
      { head:'To improve our services', body:'Aggregated, anonymised analytics data helps us understand how visitors interact with our site so we can make improvements.' },
      { head:'To process applications', body:'Information submitted through career applications is used only to evaluate candidates for the role applied for and is kept confidential within our hiring team.' },
    ]
  },
  {
    id:'storage', Icon:Lock, col:'#059669', rgb:'5,150,105',
    title:'Data Storage & Security',
    content:[
      { head:'Where your data is stored', body:'Data you submit through our forms is transmitted securely via HTTPS and processed through EmailJS. We do not maintain a proprietary database of user data beyond what email services retain.' },
      { head:'Security measures', body:'We implement industry-standard security measures including encrypted transmissions and access controls. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.' },
      { head:'Retention period', body:'We retain contact enquiry data for up to 12 months, after which it is deleted. Job application data is retained for 6 months post-hiring decision.' },
    ]
  },
  {
    id:'cookies', Icon:Bell, col:'#db2777', rgb:'219,39,119',
    title:'Cookies & Tracking',
    content:[
      { head:'Essential cookies only', body:'Our website uses only essential cookies necessary for basic site functionality. We do not use advertising cookies, cross-site tracking cookies, or sell data to ad networks.' },
      { head:'Analytics', body:'We may use privacy-respecting analytics tools (such as anonymised Google Analytics) to understand traffic patterns. These do not identify individual users.' },
      { head:'Your choices', body:'You can disable cookies in your browser settings at any time. Some site features may not function optimally if cookies are disabled.' },
    ]
  },
  {
    id:'rights', Icon:Shield, col:'#0891b2', rgb:'8,145,178',
    title:'Your Rights',
    content:[
      { head:'Access & correction', body:'You have the right to request access to any personal data we hold about you, and to request corrections if that data is inaccurate.' },
      { head:'Deletion', body:'You may request that we delete your personal data at any time. We will comply within 30 days except where we are required to retain data by law.' },
      { head:'Portability', body:'You have the right to receive your personal data in a structured, commonly used format so you can transfer it to another party if you wish.' },
    ]
  },
  {
    id:'contact', Icon:Mail, col:'#f59e0b', rgb:'245,158,11',
    title:'Contact & Updates',
    content:[
      { head:'Questions about this policy', body:'If you have any questions, concerns, or requests related to this Privacy Policy, please contact us at synnoviqtechnologies@gmail.com. We will respond within 5 business days.' },
      { head:'Policy updates', body:'We may update this policy from time to time. Material changes will be communicated via a notice on our website. Continued use of our site after changes constitutes acceptance.' },
      { head:'Governing law', body:'This Privacy Policy is governed by the laws of India. Any disputes will be subject to the jurisdiction of courts in Tamil Nadu, India.' },
    ]
  },
];

/* ═══════════ COMPONENTS ═══════════ */
function Hero() {
  const [mx,setMx]=useState(0.5);
  const [my,setMy]=useState(0.5);
  useEffect(()=>{
    const fn=e=>{setMx(e.clientX/window.innerWidth);setMy(e.clientY/window.innerHeight);};
    window.addEventListener('mousemove',fn);
    return ()=>window.removeEventListener('mousemove',fn);
  },[]);

  return (
    <section style={{position:'relative',minHeight:'72vh',display:'flex',alignItems:'center',overflow:'hidden',background:'linear-gradient(135deg,#020810 0%,#001a30 50%,#020810 100%)'}}>
      <div style={{position:'absolute',top:'-10%',left:'-5%',width:'min(60vw,500px)',height:'min(60vw,500px)',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,87,255,.25) 0%,transparent 65%)',transform:`translate(${mx*30}px,${my*20}px)`,transition:'transform 1.4s cubic-bezier(.16,1,.3,1)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:'-15%',right:'-5%',width:'min(50vw,380px)',height:'min(50vw,380px)',borderRadius:'50%',background:'radial-gradient(circle,rgba(5,150,105,.2) 0%,transparent 65%)',transform:`translate(${-mx*20}px,${-my*15}px)`,transition:'transform 1.6s cubic-bezier(.16,1,.3,1)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',backgroundSize:'clamp(40px,8vw,72px) clamp(40px,8vw,72px)',pointerEvents:'none'}}/>

      <div style={{position:'relative',zIndex:1,padding:'clamp(110px,18vw,160px) clamp(20px,7vw,100px) clamp(60px,10vw,80px)',maxWidth:1200,width:'100%',margin:'0 auto',boxSizing:'border-box'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',borderRadius:999,background:'rgba(5,150,105,.1)',border:'1px solid rgba(5,150,105,.3)',fontSize:'clamp(.56rem,.9vw,.64rem)',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(74,222,128,.9)',marginBottom:28,animation:'ppUp .6s .05s both'}}>
          <Shield size={11}/> Last updated — June 2025
        </div>

        <div style={{marginBottom:28}}>
          {['Privacy','Policy.'].map((word,i)=>(
            <div key={i} style={{overflow:'hidden'}}>
              <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(3rem,10vw,9rem)',fontWeight:900,lineHeight:1.20,letterSpacing:'-.055em',margin:0,animation:`ppUp .8s ${.06+i*.1}s both`,
                ...(i===0?{color:'#fff'}:{color:'transparent',WebkitTextStroke:'1px rgba(255,255,255,.18)'})
              }}>{word}</h1>
            </div>
          ))}
        </div>

        <p style={{fontSize:'clamp(.9rem,2vw,1.05rem)',color:'rgba(255,255,255,.4)',lineHeight:1.9,maxWidth:520,marginBottom:36,animation:'ppUp .7s .28s both'}}>
          Your privacy matters. This policy explains what data we collect, how we use it, and the rights you have over it.
        </p>

        {/* Quick jump pills */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',animation:'ppUp .6s .4s both'}}>
          {SECTIONS.map(s=>(
            <a key={s.id} href={`#${s.id}`}
              style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:999,border:`1px solid rgba(${s.rgb},.3)`,background:`rgba(${s.rgb},.08)`,color:`rgba(255,255,255,.7)`,fontSize:'clamp(.62rem,1.2vw,.7rem)',fontWeight:700,textDecoration:'none',transition:'all .2s ease',WebkitTapHighlightColor:'transparent',minHeight:36,touchAction:'manipulation'}}
              onMouseEnter={e=>{e.currentTarget.style.background=`rgba(${s.rgb},.2)`;e.currentTarget.style.borderColor=`rgba(${s.rgb},.6)`;e.currentTarget.style.color='#fff';}}
              onMouseLeave={e=>{e.currentTarget.style.background=`rgba(${s.rgb},.08)`;e.currentTarget.style.borderColor=`rgba(${s.rgb},.3)`;e.currentTarget.style.color='rgba(255,255,255,.7)';}}>
              <s.Icon size={10} style={{color:`rgb(${s.rgb})`}}/> {s.title.split(' ').slice(0,2).join(' ')}
            </a>
          ))}
        </div>
      </div>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:120,background:'linear-gradient(to bottom,transparent,#020810)',pointerEvents:'none'}}/>
    </section>
  );
}

function SectionBlock({svc}) {
  const [ref,vis]=useInView(.06);
  return (
    <div id={svc.id} ref={ref} style={{padding:'clamp(48px,7vw,72px) 0',borderBottom:'1px solid rgba(255,255,255,.05)',opacity:vis?1:0,transform:vis?'none':'translateY(36px)',transition:'opacity .75s ease,transform .75s cubic-bezier(.16,1,.3,1)'}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:'clamp(20px,4vw,52px)',flexDirection:'row',flexWrap:'wrap'}}>

        {/* Left — icon + title */}
        <div style={{flexShrink:0,width:'clamp(180px,22vw,240px)'}}>
          <div style={{width:52,height:52,borderRadius:16,background:`rgba(${svc.rgb},.15)`,border:`1px solid rgba(${svc.rgb},.3)`,display:'flex',alignItems:'center',justifyContent:'center',color:`rgb(${svc.rgb})`,marginBottom:18}}>
            <svc.Icon size={22}/>
          </div>
          <div style={{width:28,height:2,background:svc.col,borderRadius:1,marginBottom:12}}/>
          <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.2rem,2.5vw,1.7rem)',fontWeight:900,color:'#fff',letterSpacing:'-.03em',lineHeight:1.15,margin:0}}>{svc.title}</h2>
        </div>

        {/* Right — content items */}
        <div style={{flex:1,minWidth:'min(100%,280px)',display:'flex',flexDirection:'column',gap:24}}>
          {svc.content.map((item,i)=>(
            <div key={i} style={{paddingLeft:'clamp(16px,3vw,24px)',borderLeft:`2px solid rgba(${svc.rgb},.25)`,opacity:vis?1:0,transform:vis?'none':'translateX(20px)',transition:`opacity .6s ${.1+i*.1}s ease,transform .6s ${.1+i*.1}s cubic-bezier(.16,1,.3,1)`}}>
              <div style={{fontSize:'.72rem',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:`rgb(${svc.rgb})`,marginBottom:7}}>{item.head}</div>
              <p style={{fontSize:'clamp(.88rem,1.6vw,.95rem)',color:'rgba(255,255,255,.52)',lineHeight:1.85,margin:0}}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TableOfContents() {
  const [active,setActive]=useState('information');
  useEffect(()=>{
    const ids=SECTIONS.map(s=>s.id);
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id);});
    },{threshold:.4});
    ids.forEach(id=>{const el=document.getElementById(id);if(el)io.observe(el);});
    return ()=>io.disconnect();
  },[]);

  return (
    <div style={{position:'sticky',top:88,alignSelf:'flex-start',display:'flex',flexDirection:'column',gap:4}} className="toc-panel">
      <div style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(255,255,255,.25)',marginBottom:10,paddingLeft:12}}>Contents</div>
      {SECTIONS.map(s=>(
        <a key={s.id} href={`#${s.id}`}
          style={{display:'flex',alignItems:'center',gap:9,padding:'8px 12px',borderRadius:10,textDecoration:'none',background:active===s.id?`rgba(${s.rgb},.12)`:'transparent',transition:'all .2s ease',WebkitTapHighlightColor:'transparent'}}>
          <div style={{width:3,height:active===s.id?22:8,borderRadius:2,background:active===s.id?s.col:'rgba(255,255,255,.18)',transition:'all .3s cubic-bezier(.16,1,.3,1)',flexShrink:0}}/>
          <span style={{fontSize:'.78rem',fontWeight:active===s.id?700:400,color:active===s.id?'#fff':'rgba(255,255,255,.38)',lineHeight:1.3,transition:'all .2s ease'}}>{s.title}</span>
        </a>
      ))}
    </div>
  );
}

function CtaStrip() {
  const [ref,vis]=useInView(.1);
  return (
    <section ref={ref} style={{padding:'clamp(60px,10vw,100px) 0',background:'linear-gradient(135deg,#0d1b4b 0%,#020810 100%)',borderTop:'1px solid rgba(255,255,255,.06)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'min(60vw,500px)',height:'min(40vw,360px)',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(0,87,255,.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div style={{maxWidth:900,margin:'0 auto',padding:'0 clamp(20px,5vw,80px)',textAlign:'center',position:'relative',zIndex:1}}>
        <div style={{opacity:vis?1:0,transform:vis?'none':'translateY(24px)',transition:'opacity .8s ease,transform .8s ease'}}>
          <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.6rem,4vw,2.6rem)',fontWeight:900,color:'#fff',letterSpacing:'-.04em',marginBottom:12,lineHeight:1.15}}>
            Questions about your data?
          </h2>
          <p style={{color:'rgba(255,255,255,.35)',fontSize:'clamp(.84rem,1.8vw,.92rem)',lineHeight:1.8,marginBottom:28}}>
            Reach out to us and we'll respond within 5 business days.
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <a href="mailto:synnoviqtechnologies@gmail.com"
              style={{display:'inline-flex',alignItems:'center',gap:9,padding:'13px clamp(18px,4vw,28px)',borderRadius:13,background:'#0057ff',color:'#fff',fontWeight:700,fontSize:'clamp(.84rem,1.5vw,.9rem)',textDecoration:'none',boxShadow:'0 8px 28px rgba(0,87,255,.4)',minHeight:48,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
              <Mail size={14}/> Email Us <ArrowRight size={13}/>
            </a>
            <Link to="/terms-of-service"
              style={{display:'inline-flex',alignItems:'center',gap:9,padding:'13px clamp(18px,4vw,28px)',borderRadius:13,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.15)',color:'rgba(255,255,255,.8)',fontWeight:700,fontSize:'clamp(.84rem,1.5vw,.9rem)',textDecoration:'none',minHeight:48,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
              Terms of Service <ChevronRight size={13}/>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PrivacyPolicy() {
  return (
    <div style={{marginTop:'-68px',background:'#020810',minHeight:'100vh'}}>
      <Grain/>
      <ProgressBar/>
      <Hero/>

      {/* Main content — 2-col on desktop (TOC + content), single col on mobile */}
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 clamp(20px,5vw,80px) 40px'}}>
        <div className="policy-layout" style={{display:'grid',gap:'clamp(32px,5vw,64px)',alignItems:'start'}}>
          {/* Table of contents — sticky sidebar */}
          <TableOfContents/>
          {/* Sections */}
          <div>
            {SECTIONS.map(s=><SectionBlock key={s.id} svc={s}/>)}
            {/* Footer note */}
            <div style={{paddingTop:40,fontSize:'.78rem',color:'rgba(255,255,255,.22)',lineHeight:1.85}}>
              Synnoviq Technologies Pvt Ltd · Kovilpatti, Tamil Nadu, India 628 502<br/>
              For privacy requests: <a href="mailto:synnoviqtechnologies@gmail.com" style={{color:'#5aa8ff',textDecoration:'none'}}>synnoviqtechnologies@gmail.com</a>
            </div>
          </div>
        </div>
      </div>

      <CtaStrip/>

      <style>{`
        @keyframes ppUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
        .policy-layout { grid-template-columns: 1fr !important; }
        .toc-panel     { display:none !important; }
        @media(min-width:900px){
          .policy-layout { grid-template-columns: 220px 1fr !important; }
          .toc-panel     { display:flex !important; }
        }
        * { max-width:100%; box-sizing:border-box; }
        a { -webkit-tap-highlight-color:transparent; }
        ::-webkit-scrollbar { display:none; }
      `}</style>
    </div>
  );
}