import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, CreditCard, Ban, AlertTriangle, Scale, Globe, Mail, ChevronRight, ArrowRight } from 'lucide-react';

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
      <svg width="100%" height="100%"><filter id="tgrn"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#tgrn)"/></svg>
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
  return <div style={{position:'fixed',top:0,left:0,right:0,height:3,zIndex:9999}}><div style={{height:'100%',background:'linear-gradient(90deg,#7c3aed,#0057ff,#db2777)',transformOrigin:'left',transform:`scaleX(${p})`,transition:'none',willChange:'transform'}}/></div>;
}

/* ═══════════ SECTION DATA ═══════════ */
const SECTIONS = [
  {
    id:'acceptance', Icon:FileText, col:'#7c3aed', rgb:'124,58,237',
    title:'Acceptance of Terms',
    content:[
      { head:'Agreement by use', body:'By accessing or using the Synnoviq Technologies website (synnoviq.com) or engaging our services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site or services.' },
      { head:'Capacity to agree', body:'By using our services, you represent that you are at least 18 years old and have the legal capacity to enter into a binding agreement. If you are using our services on behalf of an organisation, you warrant that you are authorised to bind that organisation.' },
      { head:'Changes to terms', body:'We reserve the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of the revised terms. We will notify users of material changes via our website.' },
    ]
  },
  {
    id:'services', Icon:Briefcase, col:'#0057ff', rgb:'0,87,255',
    title:'Services & Engagements',
    content:[
      { head:'Nature of services', body:'Synnoviq Technologies provides software development, game development, UI/UX design, and related technology consulting services. Specific terms for each project engagement are agreed upon separately through a Statement of Work or service agreement.' },
      { head:'Project agreements', body:'All custom development work requires a signed contract or Statement of Work (SOW) that defines scope, deliverables, timelines, and payment terms. These Terms of Service apply in addition to and not in lieu of any project-specific agreement.' },
      { head:'Service availability', body:'We make reasonable efforts to ensure our website and digital touchpoints are available. However, we do not guarantee uninterrupted access and may suspend or withdraw services for maintenance or other operational reasons.' },
    ]
  },
  {
    id:'payment', Icon:CreditCard, col:'#059669', rgb:'5,150,105',
    title:'Payments & Billing',
    content:[
      { head:'Payment terms', body:'Payment schedules are defined in individual project agreements. Standard terms require a deposit before work commences, with milestone-based payments throughout the project. Final deliverables are released upon receipt of full payment.' },
      { head:'Late payments', body:'Invoices not paid within the agreed period may attract a late fee of 1.5% per month on the outstanding balance. We reserve the right to pause work on a project if payment is more than 14 days overdue.' },
      { head:'Taxes', body:'All fees quoted are exclusive of applicable taxes unless stated otherwise. Clients are responsible for any taxes, duties, or levies applicable in their jurisdiction.' },
    ]
  },
  {
    id:'ip', Icon:Scale, col:'#db2777', rgb:'219,39,119',
    title:'Intellectual Property',
    content:[
      { head:'Client ownership', body:'Upon receipt of full payment, clients receive full ownership of all custom-developed deliverables created specifically for their project, including source code, designs, and documentation.' },
      { head:'Synnoviq IP', body:'We retain ownership of all pre-existing tools, frameworks, libraries, methodologies, and general know-how used in delivering services. These are licensed to clients for use within their project, but are not transferred.' },
      { head:'Portfolio rights', body:'Unless expressly prohibited in writing, we reserve the right to display completed projects in our portfolio and marketing materials. We will always seek client approval before doing so for confidential projects.' },
    ]
  },
  {
    id:'conduct', Icon:Ban, col:'#0891b2', rgb:'8,145,178',
    title:'Acceptable Use',
    content:[
      { head:'Prohibited activities', body:'You must not use our website or services to engage in unlawful activities, distribute malware, infringe third-party intellectual property rights, harass our team or other users, or attempt to gain unauthorised access to our systems.' },
      { head:'Accuracy of information', body:'You agree to provide accurate and complete information when engaging with us. Providing false information that leads to us entering a project under false pretences may result in termination of the engagement and forfeiture of any deposits paid.' },
      { head:'Fair use of website', body:'Automated scraping, crawling, or data harvesting of our website is prohibited without prior written consent. You may not reverse engineer, decompile, or attempt to extract source code from our website or any software we deliver to you.' },
    ]
  },
  {
    id:'liability', Icon:AlertTriangle, col:'#f59e0b', rgb:'245,158,11',
    title:'Limitation of Liability',
    content:[
      { head:'No warranty', body:'Our website and services are provided "as is." We do not warrant that our services will be error-free, uninterrupted, or meet all of your specific requirements. We exclude all warranties to the fullest extent permitted by law.' },
      { head:'Limitation of damages', body:'To the maximum extent permitted by law, Synnoviq Technologies shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services, even if we have been advised of the possibility of such damages.' },
      { head:'Maximum liability', body:'Our total aggregate liability to you in connection with any project or engagement shall not exceed the total fees paid by you to us for that specific project in the 12 months preceding the claim.' },
    ]
  },
  {
    id:'governing', Icon:Globe, col:'#8b5cf6', rgb:'139,92,246',
    title:'Governing Law & Disputes',
    content:[
      { head:'Governing law', body:'These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Tamil Nadu, India.' },
      { head:'Dispute resolution', body:'Before initiating legal proceedings, both parties agree to attempt resolution through good-faith negotiation. If negotiation fails, disputes shall be referred to mediation before proceeding to litigation.' },
      { head:'Severability', body:'If any provision of these terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.' },
    ]
  },
  {
    id:'contact-terms', Icon:Mail, col:'#ef4444', rgb:'239,68,68',
    title:'Contact & Questions',
    content:[
      { head:'Reach us', body:'For any questions regarding these Terms of Service, please contact us at synnoviqtechnologies@gmail.com. We aim to respond to all enquiries within 5 business days.' },
      { head:'Registered details', body:'Synnoviq Technologies Pvt Ltd, Kovilpatti, Tamil Nadu, India — 628 502. These terms are effective from June 2025 and supersede all previous versions.' },
      { head:'Privacy Policy', body:'These Terms of Service are to be read alongside our Privacy Policy, which governs how we collect and process personal data. In the event of conflict, the Privacy Policy takes precedence on matters of data processing.' },
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
    <section style={{position:'relative',minHeight:'72vh',display:'flex',alignItems:'center',overflow:'hidden',background:'linear-gradient(135deg,#020810 0%,#1a0030 50%,#020810 100%)'}}>
      <div style={{position:'absolute',top:'-10%',right:'-5%',width:'min(60vw,500px)',height:'min(60vw,500px)',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,.28) 0%,transparent 65%)',transform:`translate(${-mx*25}px,${my*18}px)`,transition:'transform 1.4s cubic-bezier(.16,1,.3,1)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:'-15%',left:'-5%',width:'min(50vw,380px)',height:'min(50vw,380px)',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,87,255,.2) 0%,transparent 65%)',transform:`translate(${mx*18}px,${-my*14}px)`,transition:'transform 1.6s cubic-bezier(.16,1,.3,1)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',backgroundSize:'clamp(40px,8vw,72px) clamp(40px,8vw,72px)',pointerEvents:'none'}}/>
      {/* Diagonal accents */}
      {[0,1].map(i=>(
        <div key={i} style={{position:'absolute',top:0,left:`${25+i*20}%`,width:1,height:'100%',background:`linear-gradient(to bottom,transparent,rgba(124,58,237,${.12-i*.04}),transparent)`,transform:'skewX(-20deg)',pointerEvents:'none'}}/>
      ))}

      <div style={{position:'relative',zIndex:1,padding:'clamp(110px,18vw,160px) clamp(20px,7vw,100px) clamp(60px,10vw,80px)',maxWidth:1200,width:'100%',margin:'0 auto',boxSizing:'border-box'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',borderRadius:999,background:'rgba(124,58,237,.1)',border:'1px solid rgba(124,58,237,.35)',fontSize:'clamp(.56rem,.9vw,.64rem)',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(167,139,250,.9)',marginBottom:28,animation:'tsUp .6s .05s both'}}>
          <Scale size={11}/> Last updated — June 2025
        </div>

        <div style={{marginBottom:28}}>
          {['Terms of','Service.'].map((word,i)=>(
            <div key={i} style={{overflow:'hidden'}}>
              <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(2.8rem,9.5vw,9rem)',fontWeight:900,lineHeight:.9,letterSpacing:'-.055em',margin:0,animation:`tsUp .8s ${.06+i*.1}s both`,
                ...(i===0?{background:'linear-gradient(90deg,#fff,rgba(255,255,255,.7))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}
                  :{color:'transparent',WebkitTextStroke:'1px rgba(255,255,255,.16)'})
              }}>{word}</h1>
            </div>
          ))}
        </div>

        <p style={{fontSize:'clamp(.9rem,2vw,1.05rem)',color:'rgba(255,255,255,.4)',lineHeight:1.9,maxWidth:520,marginBottom:36,animation:'tsUp .7s .28s both'}}>
          These terms govern your use of Synnoviq Technologies' website and services. Please read them carefully before engaging with us.
        </p>

        {/* Quick jump pills */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',animation:'tsUp .6s .4s both'}}>
          {SECTIONS.slice(0,6).map(s=>(
            <a key={s.id} href={`#${s.id}`}
              style={{display:'inline-flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:999,border:`1px solid rgba(${s.rgb},.3)`,background:`rgba(${s.rgb},.08)`,color:'rgba(255,255,255,.7)',fontSize:'clamp(.62rem,1.2vw,.7rem)',fontWeight:700,textDecoration:'none',transition:'all .2s ease',WebkitTapHighlightColor:'transparent',minHeight:36,touchAction:'manipulation'}}
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
      <div style={{display:'flex',alignItems:'flex-start',gap:'clamp(20px,4vw,52px)',flexWrap:'wrap'}}>

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
  const [active,setActive]=useState('acceptance');
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
    <section ref={ref} style={{padding:'clamp(60px,10vw,100px) 0',background:'linear-gradient(135deg,#1a0030 0%,#020810 100%)',borderTop:'1px solid rgba(255,255,255,.06)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'min(60vw,500px)',height:'min(40vw,360px)',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(124,58,237,.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div style={{maxWidth:900,margin:'0 auto',padding:'0 clamp(20px,5vw,80px)',textAlign:'center',position:'relative',zIndex:1}}>
        <div style={{opacity:vis?1:0,transform:vis?'none':'translateY(24px)',transition:'opacity .8s ease,transform .8s ease'}}>
          <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.6rem,4vw,2.6rem)',fontWeight:900,color:'#fff',letterSpacing:'-.04em',marginBottom:12,lineHeight:1.15}}>
            Questions about these terms?
          </h2>
          <p style={{color:'rgba(255,255,255,.35)',fontSize:'clamp(.84rem,1.8vw,.92rem)',lineHeight:1.8,marginBottom:28}}>
            We're happy to clarify anything. Reach out and we'll respond within 5 business days.
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <a href="mailto:synnoviqtechnologies@gmail.com"
              style={{display:'inline-flex',alignItems:'center',gap:9,padding:'13px clamp(18px,4vw,28px)',borderRadius:13,background:'#7c3aed',color:'#fff',fontWeight:700,fontSize:'clamp(.84rem,1.5vw,.9rem)',textDecoration:'none',boxShadow:'0 8px 28px rgba(124,58,237,.4)',minHeight:48,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
              <Mail size={14}/> Email Us <ArrowRight size={13}/>
            </a>
            <Link to="/privacy-policy"
              style={{display:'inline-flex',alignItems:'center',gap:9,padding:'13px clamp(18px,4vw,28px)',borderRadius:13,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.15)',color:'rgba(255,255,255,.8)',fontWeight:700,fontSize:'clamp(.84rem,1.5vw,.9rem)',textDecoration:'none',minHeight:48,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
              Privacy Policy <ChevronRight size={13}/>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TermsOfService() {
  return (
    <div style={{marginTop:'-68px',background:'#020810',minHeight:'100vh'}}>
      <Grain/>
      <ProgressBar/>
      <Hero/>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 clamp(20px,5vw,80px) 40px'}}>
        <div className="policy-layout" style={{display:'grid',gap:'clamp(32px,5vw,64px)',alignItems:'start'}}>
          <TableOfContents/>
          <div>
            {SECTIONS.map(s=><SectionBlock key={s.id} svc={s}/>)}
            <div style={{paddingTop:40,fontSize:'.78rem',color:'rgba(255,255,255,.22)',lineHeight:1.85}}>
              Synnoviq Technologies Pvt Ltd · Kovilpatti, Tamil Nadu, India 628 502<br/>
              For enquiries: <a href="mailto:synnoviqtechnologies@gmail.com" style={{color:'#a78bfa',textDecoration:'none'}}>synnoviqtechnologies@gmail.com</a>
            </div>
          </div>
        </div>
      </div>

      <CtaStrip/>

      <style>{`
        @keyframes tsUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
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