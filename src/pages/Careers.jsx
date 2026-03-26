import { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, ArrowRight, ChevronDown, Send, Briefcase, Users, Zap, Globe, Shield, Code, Palette, BarChart2, Cpu, Terminal, Smartphone } from 'lucide-react';

/* ═══════════════ DATA ═══════════════ */
const PERKS = [
  { img:'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80', col:'#0057ff', rgb:'0,87,255',   title:'Real Projects Day One',  body:'No busywork. You ship to production code from your very first sprint — real users, real impact.' },
  { img:'https://images.unsplash.com/photo-1522881193457-37ae97c905bf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', col:'#7c3aed', rgb:'124,58,237', title:'Senior-Led Mentorship',   body:'Scheduled 1:1s with senior engineers every week — structured guidance, not corridor conversations.' },
  { img:'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80', col:'#059669', rgb:'5,150,105',  title:'Onsite Collaboration',    body:'Work side-by-side with a talented team in a focused, distraction-free professional environment.' },
  { img:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',    col:'#db2777', rgb:'219,39,119', title:'Clear Growth Path',       body:'Defined tracks from intern to senior engineer — you always know exactly what levelling up requires.' },
  { img:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80', col:'#0891b2', rgb:'8,145,178',  title:'Collaborative Culture',   body:'Flat hierarchy, no politics, no silos. We solve hard problems together and celebrate wins together.' },
  { img:'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80', col:'#f59e0b', rgb:'245,158,11', title:'Full Product Lifecycle',  body:'From strategy and design to build and launch — you experience every phase of great product-making.' },
];

const STATS = [
  { val:50,  suffix:'+',    label:'Projects shipped' },
  { val:8,   suffix:'',     label:'Departments hiring' },
  { val:6,   suffix:' months',  label:'Internship duration' },
  { val:100, suffix:'%',    label:'Career Growth' },
];

const DEPT_ICONS = { 'Full Stack':Code,'Game Dev':Zap,'UI/UX':Palette,'Data':BarChart2,'Security':Shield,'Mobile':Smartphone,'IoT':Cpu,'DevOps':Terminal };

const INTERNS = [
  { role:'Full Stack Dev Intern',           dept:'Full Stack', dur:'6 Months', col:'#0057ff', rgb:'0,87,255',
    resp:['Build and test web features using React and Node.js','Write clean, documented code under senior guidance','Participate in standups, sprints, and code reviews','Contribute to UI, API integrations, and database queries'],
    req:['Basic knowledge of HTML, CSS, JavaScript / React','Familiarity with Node.js or any backend framework is a plus','Strong willingness to learn and contribute'] },
  { role:'Game Dev Intern (Unity/Unreal)',   dept:'Game Dev',  dur:'6 Months', col:'#7c3aed', rgb:'124,58,237',
    resp:['Work on active game projects in the studio','Implement gameplay features, mechanics, and UI elements','Contribute to QA testing and performance optimisation','Assist with asset integration and scene management'],
    req:['Basic knowledge of Unity (C#) or Unreal Engine','Interest in game design or interactive media','Portfolio or game jam experience is a strong plus'] },
  { role:'UI/UX Design Intern',              dept:'UI/UX',     dur:'6 Months', col:'#db2777', rgb:'219,39,119',
    resp:['Create wireframes, prototypes, and mockups in Figma','Contribute to design system components','Collaborate with developers on implementation','Conduct basic user research and compile insights'],
    req:['Proficiency in Figma or equivalent tools','Eye for visual design, typography, and layout','Portfolio with 1–2 UI design projects'] },
  { role:'Data Analyst Intern',              dept:'Data',      dur:'6 Months', col:'#0891b2', rgb:'8,145,178',
    resp:['Collect, clean and organise datasets','Build dashboards using Power BI or Google Data Studio','Identify trends and patterns from business data','Document data sources and maintain reporting templates'],
    req:['Basic knowledge of Python or SQL','Familiarity with Excel or any BI tool','Analytical mindset with attention to detail'] },
  { role:'Cyber Security Intern',            dept:'Security',  dur:'6 Months', col:'#059669', rgb:'5,150,105',
    resp:['Assist in vulnerability assessments and security audits','Monitor systems for threats and document findings','Support implementation of security policies','Research emerging threats and contribute to reports'],
    req:['Basic understanding of networking and attack vectors','Familiarity with tools like Wireshark or Nmap is a plus','Strong interest in ethical hacking'] },
  { role:'App Developer Intern',             dept:'Mobile',    dur:'6 Months', col:'#f59e0b', rgb:'245,158,11',
    resp:['Build and test mobile app features for iOS or Android','Write clean, maintainable code under senior guidance','Participate in design reviews and UI implementation','Debug issues and optimise app performance'],
    req:['Basic knowledge of Flutter, React Native, or native iOS/Android','Familiarity with REST APIs and JSON','Eagerness to learn and ship real mobile features'] },
  { role:'IoT Engineer Intern',              dept:'IoT',       dur:'6 Months', col:'#8b5cf6', rgb:'139,92,246',
    resp:['Prototype and test IoT hardware/software integrations','Write embedded code to communicate with sensors','Contribute to cloud data pipelines from IoT devices','Document hardware setups and firmware configurations'],
    req:['Basic knowledge of Arduino, Raspberry Pi, or similar','Familiarity with C/C++, Python, or MicroPython','Interest in embedded systems and hardware-software integration'] },
  { role:'DevOps Engineer Intern',           dept:'DevOps',    dur:'6 Months', col:'#ef4444', rgb:'239,68,68',
    resp:['Set up and maintain CI/CD pipelines','Support cloud infrastructure on AWS or Azure','Monitor system performance and incident response','Automate deployment and configuration tasks'],
    req:['Basic knowledge of Linux, shell scripting, and Git','Familiarity with Docker or any CI/CD tool','Interest in cloud platforms and system reliability'] },
];

const FULL_TIME = [
  { role:'Senior Full Stack Developer', dept:'Full Stack', exp:'3+ yrs', col:'#0057ff', rgb:'0,87,255',   req:'React, Node.js, REST APIs, PostgreSQL/MongoDB, Docker, AWS/Azure',                    nice:'GraphQL, microservices, CI/CD ownership' },
  { role:'Game Developer (Unity)',       dept:'Game Dev',  exp:'2+ yrs', col:'#7c3aed', rgb:'124,58,237', req:'C#, Unity Engine, multiplayer/Photon experience, mobile optimisation',                nice:'Unreal Engine, shader programming, game analytics' },
  { role:'UI/UX Designer',               dept:'UI/UX',     exp:'2+ yrs', col:'#db2777', rgb:'219,39,119', req:'Figma expert, design systems, responsive & accessible design — portfolio required',   nice:'Motion design, Framer, basic HTML/CSS understanding' },
  { role:'Data Analyst',                 dept:'Data',      exp:'2+ yrs', col:'#0891b2', rgb:'8,145,178',  req:'Python or SQL, Power BI or Tableau, strong analytical skills',                         nice:'BigQuery, dbt, or data pipeline tooling' },
  { role:'Cyber Security Engineer',      dept:'Security',  exp:'2+ yrs', col:'#059669', rgb:'5,150,105',  req:'VAPT experience, OWASP Top 10, networking and firewall management',                    nice:'CEH/OSCP certification, SIEM tools, cloud security' },
  { role:'App Developer',                dept:'Mobile',    exp:'2+ yrs', col:'#f59e0b', rgb:'245,158,11', req:'Flutter or React Native, REST API integration, mobile performance optimisation',       nice:'Native iOS/Android, Firebase, app store deployment' },
  { role:'IoT Engineer',                 dept:'IoT',       exp:'2+ yrs', col:'#8b5cf6', rgb:'139,92,246', req:'C/C++ or Python for embedded systems, MQTT/HTTP protocols, AWS/Azure IoT',             nice:'PCB design basics, RTOS experience, industrial IoT ecosystems' },
  { role:'DevOps Engineer',              dept:'DevOps',    exp:'2+ yrs', col:'#ef4444', rgb:'239,68,68',  req:'Docker, Kubernetes, Terraform or Ansible, strong Linux and scripting skills',           nice:'GitOps workflows, Prometheus/Grafana, multi-cloud' },
];

/* ═══════════════ HOOKS ═══════════════ */
function useScrollProg(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setP(Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight))));
    };
    window.addEventListener('scroll', fn, { passive:true }); fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return p;
}

function useInView(threshold) {
  const ref = useRef(null); const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: threshold||0.06 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function useCounter(target, running) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!running) return;
    let start = null; const dur = 1600;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start)/dur, 1);
      setVal(Math.round((1-Math.pow(1-p,3))*target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [running, target]);
  return val;
}

/* ═══════════════ OVERLAYS ═══════════════ */
function Grain() {
  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,pointerEvents:'none',opacity:.022}}>
      <svg width="100%" height="100%"><filter id="crg"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#crg)"/></svg>
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
  return <div style={{position:'fixed',top:0,left:0,right:0,height:3,zIndex:9999}}><div style={{height:'100%',background:'linear-gradient(90deg,#0057ff,#7c3aed,#db2777)',transformOrigin:'left',transform:`scaleX(${p})`,transition:'none',willChange:'transform'}}/></div>;
}

/* ═══════════════ HERO ═══════════════
   Mobile: full-width stacked layout. Role cards hide on mobile,
   show on tablet+ via CSS. Headline scales down gracefully.
══════════════════════════════════════ */
const HERO_ROLES = [
  {label:'Full Stack Dev',    col:'#0057ff',rgb:'0,87,255'},
  {label:'Game Developer',    col:'#7c3aed',rgb:'124,58,237'},
  {label:'UI/UX Designer',    col:'#db2777',rgb:'219,39,119'},
  {label:'DevOps Engineer',   col:'#ef4444',rgb:'239,68,68'},
  {label:'Data Analyst',      col:'#0891b2',rgb:'8,145,178'},
  {label:'Security Engineer', col:'#059669',rgb:'5,150,105'},
  {label:'App Developer',     col:'#f59e0b',rgb:'245,158,11'},
  {label:'IoT Engineer',      col:'#8b5cf6',rgb:'139,92,246'},
];

function Hero() {
  const wRef = useRef(null);
  const prog = useScrollProg(wRef);
  const imgTy    = prog * 60;
  const textFade = Math.max(0.15, 1 - prog * 1.2); // fades gently, never disappears early
  const cardsE   = 1 - Math.pow(1 - Math.min(1, prog * 4), 3); // cards animate in immediately on scroll

  return (
    <div ref={wRef} style={{height:'180vh',position:'relative'}}>
      <section style={{position:'sticky',top:0,height:'100vh',overflow:'hidden',background:'#020810'}}>

        {/* BG */}
        <div style={{position:'absolute',inset:'-10% 0',transform:`translateY(${imgTy}px) translateZ(0)`,willChange:'transform',transition:'none'}}>
          <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1800&q=75" alt="" style={{width:'100%',height:'100%',objectFit:'cover',filter:'saturate(.3) brightness(.18)'}}/>
        </div>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(0,87,255,.18) 0%,rgba(124,58,237,.12) 50%,transparent 100%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(2,8,16,.25) 0%,rgba(2,8,16,.45) 60%,#020810 100%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)',backgroundSize:'clamp(40px,8vw,72px) clamp(40px,8vw,72px)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',top:'-20%',right:'-10%',width:'min(60vw,420px)',height:'min(60vw,420px)',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,87,255,.22) 0%,transparent 65%)',pointerEvents:'none',animation:'orbA 9s ease-in-out infinite'}}/>
        <div style={{position:'absolute',bottom:'-15%',left:'5%',width:'min(45vw,320px)',height:'min(45vw,320px)',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,.18) 0%,transparent 65%)',pointerEvents:'none',animation:'orbB 12s ease-in-out infinite'}}/>

        {/* LEFT — headline (full width on mobile, 55% on desktop) */}
        <div className="hero-left-panel" style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'center',padding:'clamp(16px,6vw,80px)',opacity:Math.max(0.12,textFade),transition:'none',willChange:'opacity',boxSizing:'border-box'}}>

          <div style={{display:'flex',alignItems:'center',flexWrap:'wrap',gap:'6px 8px',marginBottom:20,animation:'cUp .6s .05s both'}}>
            <Briefcase size={11} color="#0057ff"/>
            <span style={{fontSize:'clamp(.52rem,.8vw,.6rem)',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(255,255,255,.42)'}}>Join the Team</span>
            <div style={{width:22,height:1,background:'rgba(255,255,255,.15)',flexShrink:0}}/>
            <span style={{fontSize:'clamp(.52rem,.8vw,.6rem)',fontWeight:700,color:'rgba(0,87,255,.8)'}}>16 Open Roles</span>
          </div>

          <div style={{marginBottom:24, paddingBottom:8}}>
            {['Build','Meaningful','Things.'].map((word,i)=>(
              <div key={i} style={{overflow:'visible'}}>
                <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(2.8rem,9vw,8rem)',fontWeight:900,letterSpacing:'-.055em',lineHeight:.9,margin:0,animation:`cUp .8s ${.08+i*.1}s both`,
                  ...(i===1?{background:'linear-gradient(90deg,#4d9fff,#a78bfa)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',paddingBottom: '0.05em',lineHeight: 1.5}
                    :i===2?{color:'transparent',WebkitTextStroke:'1px rgba(255,255,255,.18)'}
                    :{color:'#fff'})
                }}>{word}</h1>
              </div>
            ))}
          </div>

          <p style={{fontSize:'clamp(.84rem,1.3vw,.96rem)',color:'rgba(255,255,255,.42)',maxWidth:360,lineHeight:1.86,marginBottom:24,animation:'cUp .7s .32s both'}}>
            We're looking for passionate developers, designers and problem-solvers to build innovative products together.
          </p>

          <div style={{display:'flex',gap:10,flexWrap:'wrap',animation:'cUp .6s .4s both'}}>
            <a href="#internships" style={{display:'inline-flex',alignItems:'center',gap:7,padding:'11px 20px',borderRadius:11,background:'#0057ff',color:'#fff',fontWeight:700,fontSize:'clamp(.78rem,1.5vw,.82rem)',textDecoration:'none',boxShadow:'0 6px 22px rgba(0,87,255,.45)',WebkitTapHighlightColor:'transparent',minHeight:44,touchAction:'manipulation'}}>
              View Internships <ArrowRight size={13}/>
            </a>
            <a href="#fulltime" style={{display:'inline-flex',alignItems:'center',gap:7,padding:'11px 20px',borderRadius:11,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.14)',color:'rgba(255,255,255,.75)',fontWeight:700,fontSize:'clamp(.78rem,1.5vw,.82rem)',textDecoration:'none',minHeight:44,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
              Full-Time Roles
            </a>
          </div>
        </div>

        {/* RIGHT — role cards (hidden on mobile via CSS) */}
        <div className="hero-cards-panel" style={{position:'absolute',top:0,right:0,bottom:0,width:'44%',display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 clamp(14px,3vw,48px)',gap:9,pointerEvents:'none'}}>
          {HERO_ROLES.map((r,i)=>{
            const delay = i * 0.07;
            const p = Math.max(0, Math.min(1,(cardsE-delay)/(1-delay*0.5)));
            const eased = 1 - Math.pow(1-p,3);
            return (
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 15px',borderRadius:12,background:'rgba(255,255,255,.04)',border:`1px solid rgba(${r.rgb},.22)`,backdropFilter:'blur(10px)',opacity:eased,transform:`translateX(${(1-eased)*40}px) translateZ(0)`,willChange:'opacity,transform',transition:'none'}}>
                <div style={{width:7,height:7,borderRadius:'50%',background:r.col,boxShadow:`0 0 10px rgba(${r.rgb},.7)`,flexShrink:0}}/>
                <span style={{fontSize:'clamp(.72rem,1.2vw,.8rem)',fontWeight:700,color:'rgba(255,255,255,.82)',letterSpacing:'-.01em'}}>{r.label}</span>
                <div style={{marginLeft:'auto',padding:'3px 9px',borderRadius:999,background:`rgba(${r.rgb},.15)`,border:`1px solid rgba(${r.rgb},.3)`,fontSize:'.54rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:r.col,flexShrink:0}}>Hiring</div>
              </div>
            );
          })}
          <div style={{textAlign:'center',marginTop:4,fontSize:'.56rem',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.18)',opacity:cardsE}}>8 departments · 16 open roles</div>
        </div>



        <div style={{position:'absolute',bottom:0,left:0,right:0,height:120,background:'linear-gradient(to bottom,transparent,#020810)',pointerEvents:'none'}}/>
      </section>
    </div>
  );
}

/* ═══════════════ STATS ═══════════════ */
function StatCard({val,suffix='',label,i}) {
  const [ref,vis]=useInView(0.2);
  const count=useCounter(val,vis);
  return (
    <div ref={ref} style={{textAlign:'center',opacity:vis?1:0,transform:vis?'none':'translateY(24px)',transition:`opacity .6s ${i*.1}s ease,transform .6s ${i*.1}s ease`}}>
      <div style={{fontFamily:"'Bebas Neue','Oswald',var(--serif)",fontSize:'clamp(2rem,5vw,3.8rem)',fontWeight:900,color:'#fff',letterSpacing:'.02em',lineHeight:1}}>{count}{suffix}</div>
      <div style={{fontSize:'clamp(.54rem,.8vw,.6rem)',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.32)',marginTop:8}}>{label}</div>
    </div>
  );
}
function Stats() {
  return (
    <section style={{background:'#050d1e',borderTop:'1px solid rgba(255,255,255,.06)',borderBottom:'1px solid rgba(255,255,255,.06)',padding:'clamp(44px,8vw,64px) 0'}}>
      <div className="wrap">
        <div className="careers-stats">
          {STATS.map((s,i)=><StatCard key={i} {...s} i={i}/>)}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ WHY JOIN — sticky panels ═══════════════
   On mobile: collapses to a single scrollable column layout
   (no side-by-side split — too narrow for that)
══════════════════════════════════════════════════════════ */
const WHY_PANELS = [
  {num:'01',headline:'Real work,\nnot busywork.',body:'You ship to real users from your first sprint. No fake projects, no tutorial assignments — your code goes into production.',img:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',col:'#0057ff',rgb:'0,87,255'},
  {num:'02',headline:'Senior-led\nmentorship.',body:'Weekly 1:1s with senior engineers. Structured, scheduled, and intentional — not accidental corridor conversations.',img:'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',col:'#7c3aed',rgb:'124,58,237'},
  {num:'03',headline:'Clear growth\npathways.',body:'Defined tracks from intern to senior. You know exactly what it takes to level up — no politics, no guessing.',img:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',col:'#059669',rgb:'5,150,105'},
];

function WhyJoinMobile() {
  return (
    <section style={{background:'#04080f',padding:'60px 0',borderTop:'1px solid rgba(255,255,255,.05)'}}>
      <div className="wrap">
        <div style={{marginBottom:36}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
            <div style={{width:22,height:2,background:'#0057ff',borderRadius:1}}/>
            <span style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.22em',textTransform:'uppercase',color:'rgba(255,255,255,.3)'}}>Why Synnoviq</span>
          </div>
          <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.8rem,6vw,2.8rem)',fontWeight:900,color:'#fff',letterSpacing:'-.04em',lineHeight:1.05,margin:0}}>Why people<br/><span style={{color:'#5aa8ff',fontStyle:'italic'}}>love it here.</span></h2>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {WHY_PANELS.map((p,i)=>(
            <div key={i} style={{borderRadius:18,overflow:'hidden',border:`1px solid rgba(${p.rgb},.2)`,background:'#07111f'}}>
              <div style={{position:'relative',height:180,overflow:'hidden'}}>
                <img src={p.img} alt="" style={{width:'100%',height:'110%',objectFit:'cover',filter:'saturate(.55) brightness(.45)'}}/>
                <div style={{position:'absolute',inset:0,background:`rgba(${p.rgb},.25)`,mixBlendMode:'multiply'}}/>
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 40%,#07111f 100%)'}}/>
                <div style={{position:'absolute',top:14,left:14,padding:'4px 12px',borderRadius:999,background:`rgba(${p.rgb},.2)`,border:`1px solid rgba(${p.rgb},.4)`,fontSize:'.58rem',fontWeight:700,letterSpacing:'.1em',color:'#fff'}}>0{i+1}</div>
              </div>
              <div style={{padding:'20px 22px 24px'}}>
                {p.headline.split('\n').map((line,li)=>(
                  <div key={li} style={{fontFamily:'var(--serif)',fontSize:'clamp(1.4rem,4vw,1.9rem)',fontWeight:900,lineHeight:1.0,letterSpacing:'-.04em',color:li===1?p.col:'#fff',fontStyle:li===1?'italic':'normal',marginBottom:li===0?2:14}}>{line}</div>
                ))}
                <p style={{fontSize:'.88rem',color:'rgba(255,255,255,.52)',lineHeight:1.82,margin:0}}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyJoinDesktop() {
  const wRef = useRef(null);
  const prog = useScrollProg(wRef);
  const pCount = WHY_PANELS.length;
  const rawIdx = prog * pCount;
  const idx  = Math.min(pCount-1, Math.floor(rawIdx));
  const intra = rawIdx - idx;
  const intraAdj = Math.max(0.3, intra); // never starts at 0 — prevents blank panel
  const wipeE = 1 - Math.pow(1-Math.min(1,intraAdj/0.4),2);
  const tE    = 1 - Math.pow(1-Math.min(1,intraAdj/0.55),3);
  const d = WHY_PANELS[idx];

  return (
    <div ref={wRef} style={{height:`${pCount*100}vh`,position:'relative'}}>
      <section style={{position:'sticky',top:0,height:'100vh',overflow:'hidden',display:'flex',background:'#04080f'}}>
        {/* LEFT image */}
        <div style={{position:'relative',width:'52%',flexShrink:0,overflow:'hidden'}}>
          {WHY_PANELS.map((p,i)=>(
            <div key={i} style={{position:'absolute',inset:0,clipPath:i===idx?`inset(0 ${100-wipeE*100}% 0 0)`:i<idx?'inset(0 0% 0 0)':'inset(0 100% 0 0)',willChange:'clip-path'}}>
              <img src={p.img} alt="" style={{position:'absolute',inset:0,width:'100%',height:'110%',objectFit:'cover',filter:'saturate(.55) brightness(.45)',transform:`translateY(${i===idx?intra*-6:0}%) translateZ(0)`,willChange:'transform',transition:'none'}}/>
              <div style={{position:'absolute',inset:0,background:`rgba(${p.rgb},.25)`,mixBlendMode:'multiply'}}/>
            </div>
          ))}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,transparent 55%,rgba(4,8,15,.98) 100%)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(4,8,15,.35) 0%,transparent 20%,transparent 80%,rgba(4,8,15,.65) 100%)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',right:22,top:'50%',transform:'translateY(-50%)',display:'flex',flexDirection:'column',gap:10,zIndex:2}}>
            {WHY_PANELS.map((_,i)=>(
              <div key={i} style={{width:4,height:i===idx?32:8,borderRadius:2,background:i===idx?'#fff':'rgba(255,255,255,.22)',transition:'height .4s cubic-bezier(.16,1,.3,1)',willChange:'height'}}/>
            ))}
          </div>
          <div style={{position:'absolute',bottom:32,left:32,fontFamily:'var(--serif)',fontSize:'.72rem',fontWeight:900,color:'rgba(255,255,255,.35)',letterSpacing:'.12em'}}>{d.num} / 0{pCount}</div>
        </div>
        {/* RIGHT text */}
        <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'60px 52px 60px 56px',position:'relative',overflow:'hidden',background:'#04080f'}}>
          <div style={{position:'absolute',bottom:-30,right:-10,fontFamily:'var(--serif)',fontSize:'clamp(8rem,14vw,12rem)',fontWeight:900,lineHeight:1,color:`rgba(${d.rgb},.055)`,letterSpacing:'-.06em',pointerEvents:'none',userSelect:'none',transition:'color .5s ease'}}>{d.num}</div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:36,opacity:tE,transform:`translateX(${(1-tE)*-22}px) translateZ(0)`,willChange:'opacity,transform'}}>
            <div style={{width:22,height:2,borderRadius:1,background:d.col,transition:'background .4s'}}/>
            <span style={{fontSize:'.58rem',fontWeight:700,letterSpacing:'.22em',textTransform:'uppercase',color:'rgba(255,255,255,.32)'}}>Why Synnoviq</span>
          </div>
          {d.headline.split('\n').map((line,li)=>{
            const lp=Math.min(1,Math.max(0,(tE-li*.14)/.7));
            const lE=1-Math.pow(1-lp,3);
            return <div key={`${idx}-${li}`} style={{display:'block',fontFamily:'var(--serif)',fontSize:'clamp(2.2rem,4.8vw,4.2rem)',fontWeight:900,lineHeight:1.0,letterSpacing:'-.045em',color:li===1?d.col:'#fff',fontStyle:li===1?'italic':'normal',opacity:lE,transform:`translateY(${(1-lE)*36}px) translateZ(0)`,willChange:'opacity,transform',transition:'color .4s ease',textShadow:li===1?`0 0 70px rgba(${d.rgb},.35)`:'none',marginBottom:li===0?2:20}}>{line}</div>;
          })}
          <div style={{height:2,width:56,borderRadius:1,background:d.col,transformOrigin:'left',transform:`scaleX(${tE}) translateZ(0)`,willChange:'transform',transition:'background .4s ease',marginBottom:22}}/>
          {(()=>{const pOp=Math.max(0,(tE-.28)/.72);return <p style={{fontSize:'clamp(.88rem,1.3vw,1rem)',color:'rgba(255,255,255,.52)',lineHeight:1.9,maxWidth:380,opacity:pOp,transform:`translateY(${Math.max(0,(1-pOp)*18)}px) translateZ(0)`,willChange:'opacity,transform'}}>{d.body}</p>;})()}
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:'rgba(255,255,255,.04)'}}>
            <div style={{height:'100%',background:`linear-gradient(to right,${d.col},transparent)`,transformOrigin:'left',transform:`scaleX(${prog}) translateZ(0)`,willChange:'transform',transition:'background .4s ease'}}/>
          </div>
        </div>
      </section>
    </div>
  );
}

/* Render mobile or desktop version based on viewport */
function WhyJoin() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile ? <WhyJoinMobile/> : <WhyJoinDesktop/>;
}

/* ═══════════════ PERK CARDS ═══════════════ */
function PerkCard({perk,i}) {
  const [ref,vis]=useInView(0.06);
  const [hov,setHov]=useState(false);
  return (
    <div ref={ref} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{borderRadius:18,overflow:'hidden',background:'#07111f',border:hov?`1px solid rgba(${perk.rgb},.4)`:'1px solid rgba(255,255,255,.07)',boxShadow:hov?`0 20px 48px rgba(0,0,0,.6)`:' 0 4px 20px rgba(0,0,0,.3)',opacity:vis?1:0,transform:vis?(hov?'translateY(-5px) translateZ(0)':'translateY(0)translateZ(0)'):'translateY(40px) translateZ(0)',transition:`opacity .6s cubic-bezier(.16,1,.3,1) ${i*.08}s,transform .6s cubic-bezier(.16,1,.3,1) ${i*.08}s,border-color .22s,box-shadow .25s`,willChange:'opacity,transform'}}>
      <div style={{position:'relative',height:150,overflow:'hidden'}}>
        <img src={perk.img} alt={perk.title} style={{width:'100%',height:'110%',objectFit:'cover',filter:'saturate(.55) brightness(.5)',transform:hov?'scale(1.06) translateZ(0)':'scale(1) translateZ(0)',transition:'transform .55s cubic-bezier(.16,1,.3,1)',willChange:'transform'}}/>
        <div style={{position:'absolute',inset:0,background:`rgba(${perk.rgb},.22)`,mixBlendMode:'multiply',opacity:hov?1:.6,transition:'opacity .3s'}}/>
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:70,background:'linear-gradient(to bottom,transparent,#07111f)'}}/>
        <div style={{position:'absolute',bottom:0,left:0,width:hov?'100%':'0%',height:2,background:perk.col,transition:'width .45s cubic-bezier(.16,1,.3,1)'}}/>
      </div>
      <div style={{padding:'18px 20px 22px'}}>
        <h3 style={{fontFamily:'var(--serif)',fontSize:'clamp(1rem,2vw,1.12rem)',fontWeight:800,color:'#fff',letterSpacing:'-.025em',marginBottom:8,lineHeight:1.2}}>{perk.title}</h3>
        <p style={{fontSize:'clamp(.82rem,1.5vw,.85rem)',color:'rgba(255,255,255,.46)',lineHeight:1.82,margin:0}}>{perk.body}</p>
      </div>
    </div>
  );
}

/* ═══════════════ JOB ROW ACCORDION ═══════════════ */
const APPLY_URL = 'https://docs.google.com/forms/d/1PwDvLj5HgRucG553Rtr1InnDFgqzTRGShsZ0VwqBdNw/viewform';

function JobRow({job,i,type}) {
  const [ref,vis]=useInView(0.06);
  const [open,setOpen]=useState(false);
  const [hov,setHov]=useState(false);
  const bodyRef=useRef(null);
  const [bodyH,setBodyH]=useState(0);
  const Icon=DEPT_ICONS[job.dept]||Code;

  useEffect(()=>{
    if (!bodyRef.current) return;
    if (open) { setBodyH(bodyRef.current.scrollHeight); }
    else { setBodyH(bodyRef.current.scrollHeight); requestAnimationFrame(()=>setBodyH(0)); }
  },[open]);

  return (
    <div ref={ref} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{borderRadius:14,overflow:'hidden',background:'#0a1628',border:open?`1px solid rgba(${job.rgb},.45)`:hov?'1px solid rgba(255,255,255,.14)':'1px solid rgba(255,255,255,.07)',boxShadow:open?`0 16px 40px rgba(0,0,0,.5)`:' none',opacity:vis?1:0,transform:vis?'none':'translateY(32px)',transition:`opacity .5s cubic-bezier(.16,1,.3,1) ${i*.06}s,transform .5s cubic-bezier(.16,1,.3,1) ${i*.06}s,border-color .25s,box-shadow .3s`,willChange:'opacity,transform',marginBottom:10}}>

      <button onClick={()=>setOpen(p=>!p)}
        style={{width:'100%',padding:'clamp(14px,3vw,20px) clamp(14px,3vw,24px)',display:'flex',alignItems:'center',gap:'clamp(10px,2vw,16px)',cursor:'pointer',background:'transparent',border:'none',textAlign:'left',WebkitTapHighlightColor:'transparent',touchAction:'manipulation'}}>

        <div style={{width:40,height:40,borderRadius:12,background:`rgba(${job.rgb},.15)`,border:`1px solid rgba(${job.rgb},.3)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'background .25s,transform .25s',transform:open?'scale(1.06)':'scale(1)',...(open?{background:`rgba(${job.rgb},.28)`}:{})}}>
          <Icon size={17} color={job.col}/>
        </div>

        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'var(--serif)',fontSize:'clamp(.92rem,2vw,1.05rem)',fontWeight:800,color:'#fff',letterSpacing:'-.02em',marginBottom:5,lineHeight:1.2}}>{job.role}</div>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
            <span style={{display:'flex',alignItems:'center',gap:4,fontSize:'clamp(.58rem,.9vw,.66rem)',fontWeight:600,color:'rgba(255,255,255,.38)'}}>
              <Clock size={9}/> {type==='intern'?job.dur:job.exp}
            </span>
            <span style={{display:'flex',alignItems:'center',gap:4,fontSize:'clamp(.56rem,.85vw,.64rem)',fontWeight:700,color:'rgba(255,165,50,.8)',background:'rgba(255,140,0,.08)',border:'1px solid rgba(255,140,0,.22)',padding:'2px 7px',borderRadius:999}}>
              📍 Onsite
            </span>
          </div>
        </div>

        {/* Dept pill — hidden on small mobile */}
        <div className="dept-pill" style={{padding:'4px 12px',borderRadius:999,background:`rgba(${job.rgb},.14)`,border:`1px solid rgba(${job.rgb},.3)`,fontSize:'.58rem',fontWeight:700,letterSpacing:'.08em',color:job.col,flexShrink:0,display:'none'}}>{job.dept}</div>

        <div style={{width:30,height:30,borderRadius:'50%',background:open?`rgba(${job.rgb},.22)`:`rgba(${job.rgb},.1)`,border:`1px solid rgba(${job.rgb},.25)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transform:open?'rotate(180deg)':'rotate(0deg)',transition:'transform .38s cubic-bezier(.16,1,.3,1),background .25s'}}>
          <ChevronDown size={14} color={job.col}/>
        </div>
      </button>

      <div style={{height:open?bodyH||'auto':0,overflow:'hidden',transition:'height .42s cubic-bezier(.16,1,.3,1)'}}>
        <div ref={bodyRef} style={{borderTop:`1px solid rgba(${job.rgb},.15)`}}>
          {type==='intern' ? (
            <div className="jd-grid" style={{padding:'clamp(16px,3vw,22px) clamp(14px,3vw,24px) clamp(20px,4vw,28px)',gap:24}}>
              <div style={{animation:open?'jdFadeUp .38s .05s both':'none'}}>
                <div style={{fontSize:'.58rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:job.col,marginBottom:12}}>Responsibilities</div>
                {job.resp.map((r,j)=>(
                  <div key={j} style={{display:'flex',gap:9,marginBottom:9}}>
                    <div style={{width:5,height:5,borderRadius:'50%',background:job.col,flexShrink:0,marginTop:7}}/>
                    <span style={{fontSize:'clamp(.82rem,1.5vw,.88rem)',color:'rgba(255,255,255,.58)',lineHeight:1.78}}>{r}</span>
                  </div>
                ))}
              </div>
              <div style={{animation:open?'jdFadeUp .38s .12s both':'none'}}>
                <div style={{fontSize:'.58rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:job.col,marginBottom:12}}>Requirements</div>
                {job.req.map((r,j)=>(
                  <div key={j} style={{display:'flex',gap:9,marginBottom:9}}>
                    <div style={{width:5,height:5,borderRadius:'50%',background:job.col,flexShrink:0,marginTop:7}}/>
                    <span style={{fontSize:'clamp(.82rem,1.5vw,.88rem)',color:'rgba(255,255,255,.58)',lineHeight:1.78}}>{r}</span>
                  </div>
                ))}
                <a href={APPLY_URL} target="_blank" rel="noopener noreferrer"
                  style={{display:'inline-flex',alignItems:'center',gap:8,marginTop:18,padding:'11px 22px',borderRadius:11,background:job.col,color:'#fff',fontWeight:700,fontSize:'clamp(.78rem,1.5vw,.82rem)',textDecoration:'none',boxShadow:`0 6px 22px rgba(${job.rgb},.42)`,minHeight:44,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
                  <Send size={13}/> Apply Now
                </a>
              </div>
            </div>
          ) : (
            <div style={{padding:'clamp(16px,3vw,22px) clamp(14px,3vw,24px) clamp(20px,4vw,28px)',animation:open?'jdFadeUp .38s .05s both':'none'}}>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:'.58rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:job.col,marginBottom:8}}>Requirements</div>
                <p style={{fontSize:'clamp(.82rem,1.5vw,.88rem)',color:'rgba(255,255,255,.58)',lineHeight:1.78,margin:0}}>{job.req}</p>
              </div>
              {job.nice&&(
                <div style={{marginBottom:18}}>
                  <div style={{fontSize:'.58rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(255,255,255,.25)',marginBottom:8}}>Nice to Have</div>
                  <p style={{fontSize:'clamp(.82rem,1.5vw,.88rem)',color:'rgba(255,255,255,.38)',lineHeight:1.78,margin:0}}>{job.nice}</p>
                </div>
              )}
              <a href={APPLY_URL} target="_blank" rel="noopener noreferrer"
                style={{display:'inline-flex',alignItems:'center',gap:8,padding:'11px 22px',borderRadius:11,background:job.col,color:'#fff',fontWeight:700,fontSize:'clamp(.78rem,1.5vw,.82rem)',textDecoration:'none',boxShadow:`0 6px 22px rgba(${job.rgb},.42)`,minHeight:44,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
                <Send size={13}/> Apply Now
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ SECTION LABEL ═══════════════ */
function SectionLabel({label,heading,sub,accent='#0057ff'}) {
  const [ref,vis]=useInView(0.1);
  return (
    <div ref={ref} style={{marginBottom:'clamp(28px,5vw,48px)',opacity:vis?1:0,transform:vis?'none':'translateY(20px)',transition:'opacity .7s ease,transform .7s ease'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
        <div style={{width:24,height:2,borderRadius:1,background:accent,flexShrink:0}}/>
        <span style={{fontSize:'clamp(.54rem,.8vw,.6rem)',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(255,255,255,.3)'}}>{label}</span>
      </div>
      <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.7rem,5vw,3.6rem)',fontWeight:900,color:'#fff',letterSpacing:'-.04em',lineHeight:1.05,maxWidth:580,margin:0,marginBottom:sub?10:0}}>{heading}</h2>
      {sub&&<p style={{fontSize:'clamp(.84rem,1.5vw,.95rem)',color:'rgba(255,255,255,.4)',lineHeight:1.85,maxWidth:500,marginTop:10,margin:0}}>{sub}</p>}
    </div>
  );
}

/* ═══════════════ TICKER ═══════════════ */
function Ticker() {
  const roles=['Full Stack Dev','·','Game Developer','·','UI/UX Designer','·','Data Analyst','·','Security Engineer','·','App Developer','·','IoT Engineer','·','DevOps Engineer','·'];
  return (
    <div style={{overflow:'hidden',background:'linear-gradient(90deg,#0057ff,#7c3aed)',padding:'12px 0'}}>
      <div style={{display:'flex',gap:28,animation:'tickL 22s linear infinite',whiteSpace:'nowrap',willChange:'transform'}}>
        {[...roles,...roles,...roles].map((w,i)=><span key={i} style={{fontSize:'clamp(.6rem,1vw,.7rem)',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(255,255,255,.82)',flexShrink:0}}>{w}</span>)}
      </div>
    </div>
  );
}

/* ═══════════════ CTA ═══════════════ */
function CTA() {
  const [ref,vis]=useInView(0.1);
  return (
    <section style={{background:'#020810',padding:'clamp(60px,10vw,100px) 0',position:'relative',overflow:'hidden',borderTop:'1px solid rgba(255,255,255,.05)'}}>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'min(70vw,500px)',height:'min(50vw,360px)',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(0,87,255,.08) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div className="wrap" style={{position:'relative',zIndex:1}}>
        <div ref={ref} style={{maxWidth:600,margin:'0 auto',textAlign:'center',opacity:vis?1:0,transform:vis?'none':'translateY(28px)',transition:'opacity .8s ease,transform .8s ease'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'6px 16px',borderRadius:999,background:'rgba(0,87,255,.1)',border:'1px solid rgba(0,87,255,.28)',fontSize:'clamp(.54rem,.8vw,.6rem)',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(90,168,255,.9)',marginBottom:22}}>
            <Users size={10}/> We're Hiring
          </div>
          <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(2rem,6vw,4rem)',fontWeight:900,color:'#fff',letterSpacing:'-.045em',lineHeight:1.04,marginBottom:14}}>
            Ready to build with<br/><span style={{color:'#5aa8ff',fontStyle:'italic'}}>Synnoviq?</span>
          </h2>
          <p style={{fontSize:'clamp(.84rem,1.5vw,.95rem)',color:'rgba(255,255,255,.4)',maxWidth:400,margin:'0 auto 10px',lineHeight:1.85}}>Send your resume and a short note about yourself to:</p>
          <a href="mailto:synnoviqtechnologies@gmail.com" style={{color:'#5aa8ff',fontSize:'clamp(.88rem,2vw,1.05rem)',fontWeight:700,display:'block',marginBottom:28,textDecoration:'none',letterSpacing:'-.01em',wordBreak:'break-all'}}>
            synnoviqtechnologies@gmail.com
          </a>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <a href={APPLY_URL} target="_blank" rel="noopener noreferrer"
              style={{display:'inline-flex',alignItems:'center',gap:9,padding:'13px clamp(18px,4vw,28px)',borderRadius:13,background:'#0057ff',color:'#fff',fontWeight:700,fontSize:'clamp(.84rem,1.5vw,.9rem)',textDecoration:'none',boxShadow:'0 8px 28px rgba(0,87,255,.48)',minHeight:48,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
              <Send size={14}/> Apply Now
            </a>
            <a href="#internships"
              style={{display:'inline-flex',alignItems:'center',gap:9,padding:'13px clamp(18px,4vw,28px)',borderRadius:13,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.15)',color:'rgba(255,255,255,.8)',fontWeight:700,fontSize:'clamp(.84rem,1.5vw,.9rem)',textDecoration:'none',minHeight:48,touchAction:'manipulation',WebkitTapHighlightColor:'transparent'}}>
              View Openings
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ ROOT ═══════════════ */
export default function Careers() {
  const [tab,setTab]=useState('intern');
  return (
    <div style={{background:'#020810',minHeight:'100vh',marginTop:'-68px'}}>
      <Grain/>
      <ProgressBar/>
      <Hero/>
      <Stats/>
      <WhyJoin/>

      {/* PERKS */}
      <section style={{background:'#020810',padding:'clamp(60px,10vw,100px) 0',borderTop:'1px solid rgba(255,255,255,.05)'}}>
        <div className="wrap">
          <SectionLabel label="Life at Synnoviq" heading={<>Why people love<br/><span style={{color:'#5aa8ff',fontStyle:'italic'}}>working here.</span></>} sub="Real benefits, real culture — not just ping-pong tables and free snacks."/>
          <div className="perks-grid">
            {PERKS.map((p,i)=><PerkCard key={i} perk={p} i={i}/>)}
          </div>
        </div>
      </section>

      <Ticker/>

      {/* JOBS */}
      <section style={{background:'#020810',padding:'clamp(60px,10vw,100px) 0',borderTop:'1px solid rgba(255,255,255,.05)'}}>
        <div className="wrap">
          {/* Tab switcher + label */}
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:16,marginBottom:'clamp(28px,5vw,48px)'}}>
            <SectionLabel label="Open Positions" heading={<>Find your<br/><span style={{color:'#5aa8ff',fontStyle:'italic'}}>next role.</span></>}/>
            <div style={{display:'flex',gap:5,padding:'5px',borderRadius:13,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',alignSelf:'flex-start',flexShrink:0}}>
              {[['intern','Internships'],['full','Full-Time']].map(([val,lbl])=>(
                <button key={val} onClick={()=>setTab(val)}
                  style={{padding:'9px clamp(14px,3vw,20px)',borderRadius:9,border:'none',cursor:'pointer',fontFamily:'var(--sans)',fontSize:'clamp(.72rem,1.5vw,.78rem)',fontWeight:700,background:tab===val?'#0057ff':'transparent',color:tab===val?'#fff':'rgba(255,255,255,.45)',boxShadow:tab===val?'0 4px 14px rgba(0,87,255,.4)':'none',transition:'all .22s ease',whiteSpace:'nowrap',WebkitTapHighlightColor:'transparent',touchAction:'manipulation',minHeight:40}}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {tab==='intern' && <div id="internships">{INTERNS.map((j,i)=><JobRow key={j.role} job={j} i={i} type="intern"/>)}</div>}
          {tab==='full'   && <div id="fulltime">  {FULL_TIME.map((j,i)=><JobRow key={j.role} job={j} i={i} type="full"/>)}</div>}
        </div>
      </section>

      <CTA/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @keyframes cUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes tickL  { from{transform:translateX(0)} to{transform:translateX(-33.33%)} }
        @keyframes lineP  { 0%,100%{opacity:.28} 50%{opacity:.65} }
        @keyframes orbA   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-24px) scale(1.03)} }
        @keyframes orbB   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(16px)} }
        @keyframes jdFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }

        /* Stats: 2-col mobile → 4-col md+ */
        .careers-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:clamp(24px,5vw,48px); }
        @media(min-width:640px){ .careers-stats { grid-template-columns:repeat(4,1fr); } }

        /* Perks grid */
        .perks-grid { display:grid; grid-template-columns:1fr; gap:14px; }
        @media(min-width:480px){ .perks-grid { grid-template-columns:repeat(2,1fr); gap:16px; } }
        @media(min-width:900px){ .perks-grid { grid-template-columns:repeat(3,1fr); gap:18px; } }

        /* Job description inner grid */
        .jd-grid { display:grid; grid-template-columns:1fr; }
        @media(min-width:560px){ .jd-grid { grid-template-columns:1fr 1fr; } }

        /* Dept pill on job rows */
        @media(min-width:560px){ .dept-pill { display:block !important; } }

        /* Hero: on mobile make left panel full width; hide role cards */
        .hero-left-panel { max-width:100% !important; }
        .hero-cards-panel { display:none !important; }
        @media(min-width:720px){
          .hero-left-panel { max-width:55% !important; }
          .hero-cards-panel { display:flex !important; }
        }

        /* Prevent horizontal overflow */
        * { max-width:100%; box-sizing:border-box; }

        /* Button/link tap */
        button,a { -webkit-tap-highlight-color:transparent; }

        ::-webkit-scrollbar { display:none; }
      `}</style>
    </div>
  );
}
