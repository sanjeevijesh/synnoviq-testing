import { useState, useEffect, useRef } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle, AlertCircle, ArrowRight, Zap, MessageSquare } from 'lucide-react';

const EJS_SERVICE        = 'service_ujmr6hv';
const EJS_TEMPLATE_USER  = 'template_d0iakz8';   // auto-reply → user
const EJS_TEMPLATE_ADMIN = 'template_sgwnhus';   // notification → admin
const EJS_KEY            = 'aShG1s4XfQ64HRBRd';
const TO_EMAIL           = 'support.synnoviqtech@gmail.com';
const CONFIGURED         = true;

const MAP_SRC = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3935.5!2d77.8616722!3d9.1810413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06b38506c749d9%3A0x1e0362e248249a58!2sKovilpatti%2C%20Tamil%20Nadu%20628502!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

function useInView(threshold) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); io.disconnect(); }
    }, { threshold: threshold || 0.05 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, vis];
}

function Grain() {
  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,pointerEvents:'none',opacity:.022}}>
      <svg width="100%" height="100%">
        <filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#gr)"/>
      </svg>
    </div>
  );
}

function ProgressBar() {
  const [p,setP] = useState(0);
  useEffect(() => {
    const fn = () => { const d = document.documentElement; setP(d.scrollTop/(d.scrollHeight-d.clientHeight)); };
    window.addEventListener('scroll', fn, {passive:true});
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,height:3,zIndex:9999}}>
      <div style={{height:'100%',background:'linear-gradient(90deg,#0057ff,#7c3aed,#db2777)',transformOrigin:'left',transform:`scaleX(${p})`,transition:'none',willChange:'transform'}}/>
    </div>
  );
}

/* ═══ HERO ═══ */
function Hero() {
  const [mx, setMx] = useState(0.5);
  const [my, setMy] = useState(0.5);
  useEffect(() => {
    const fn = e => { setMx(e.clientX/window.innerWidth); setMy(e.clientY/window.innerHeight); };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  return (
    <section style={{position:'relative',minHeight:'100svh',display:'flex',alignItems:'center',overflow:'hidden',background:'linear-gradient(135deg,#020810 0%,#0d1b4b 40%,#0a0d1e 100%)'}}>
      <div style={{position:'absolute',top:'-10%',left:'-5%',width:'min(70vw,400px)',height:'min(70vw,400px)',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,87,255,.35) 0%,transparent 65%)',transform:`translate(${mx*20}px,${my*15}px)`,transition:'transform 1.2s cubic-bezier(.16,1,.3,1)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:'-15%',right:'-5%',width:'min(55vw,320px)',height:'min(55vw,320px)',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,.3) 0%,transparent 65%)',transform:`translate(${-mx*15}px,${-my*12}px)`,transition:'transform 1.5s cubic-bezier(.16,1,.3,1)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)',backgroundSize:'clamp(36px,8vw,72px) clamp(36px,8vw,72px)',pointerEvents:'none'}}/>
      {[0,1,2].map(i=>(
        <div key={i} style={{position:'absolute',top:0,right:`${20+i*8}%`,width:1,height:'100%',background:`linear-gradient(to bottom,transparent,rgba(0,87,255,${.15-i*.04}),transparent)`,transform:'skewX(-15deg)',pointerEvents:'none'}}/>
      ))}

      <div style={{position:'relative',zIndex:1,padding:'clamp(90px,18vw,140px) clamp(20px,6vw,100px) clamp(60px,10vw,80px)',maxWidth:1200,width:'100%',margin:'0 auto',boxSizing:'border-box'}}>
        <div style={{display:'flex',alignItems:'center',flexWrap:'wrap',gap:'8px 10px',marginBottom:28,animation:'slideUp .6s .05s both'}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:'#4ade80',boxShadow:'0 0 16px #4ade80',animation:'gPulse 2s infinite',flexShrink:0}}/>
          <span style={{fontSize:'clamp(.52rem,.9vw,.62rem)',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(255,255,255,.5)'}}>Available Now</span>
          <div style={{width:28,height:1,background:'rgba(255,255,255,.15)',flexShrink:0}}/>
          <span style={{fontSize:'clamp(.52rem,.9vw,.62rem)',fontWeight:700,letterSpacing:'.08em',color:'rgba(0,87,255,.8)'}}>1 Business Day Response</span>
        </div>

        <div style={{marginBottom:32}}>
          {["Let's Build","Something","Together."].map((line,i)=>(
            <div key={i} style={{overflow:'hidden'}}>
              <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(2.6rem,9vw,9rem)',fontWeight:900,lineHeight:.9,letterSpacing:'-.05em',margin:0,animation:`slideUp .75s ${.08+i*.1}s both`,color:i===1?'transparent':i===2?'rgba(255,255,255,.15)':'#fff',background:i===1?'linear-gradient(90deg,#4d9fff,#a78bfa,#f472b6)':'none',WebkitBackgroundClip:i===1?'text':'unset',WebkitTextFillColor:i===1?'transparent':'unset',WebkitTextStroke:i===2?'1px rgba(255,255,255,.18)':'0'}}>{line}</h1>
            </div>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:24,animation:'slideUp .7s .4s both'}}>
          <p style={{fontSize:'clamp(.88rem,2vw,1.05rem)',color:'rgba(255,255,255,.4)',lineHeight:1.9,maxWidth:440,margin:0}}>
            Have a project in mind? We're a full stack &amp; game development studio — drop us a message and we'll get back within one business day.
          </p>
          <div style={{display:'flex',gap:'clamp(20px,5vw,40px)',flexWrap:'wrap'}}>
            {[['50+','Projects'],['< 1 Day','Response'],['100%','Satisfaction']].map(([n,l])=>(
              <div key={l}>
                <div style={{fontFamily:'var(--serif)',fontSize:'clamp(1.1rem,2.5vw,1.7rem)',fontWeight:900,color:'#fff',lineHeight:1}}>{n}</div>
                <div style={{fontSize:'clamp(.48rem,.7vw,.56rem)',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(255,255,255,.25)',marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{position:'absolute',bottom:24,left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:6,animation:'slideUp .6s .7s both'}}>
          <span style={{fontSize:'.52rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(255,255,255,.2)'}}>Scroll</span>
          <div style={{width:1,height:36,background:'linear-gradient(to bottom,rgba(255,255,255,.3),transparent)',animation:'scrollPulse 2s ease-in-out infinite'}}/>
        </div>
      </div>

      <div style={{position:'absolute',bottom:0,left:0,right:0,height:120,background:'linear-gradient(to bottom,transparent,#020810)',pointerEvents:'none'}}/>
    </section>
  );
}

/* ═══ INFO CARDS ═══ */
function InfoCards() {
  const [ref, vis] = useInView(.05);
  const cards = [
    {Icon:Mail,    col:'#0057ff',rgb:'0,87,255',   label:'Email Us',      val:'synnoviqtechnologies@gmail.com', sub:'We reply within 1 business day', href:'mailto:synnoviqtechnologies@gmail.com'},
    {Icon:MapPin,  col:'#7c3aed',rgb:'124,58,237', label:'Find Us',       val:'Kovilpatti, Tamil Nadu',          sub:'India — 628 502',                href:'https://maps.app.goo.gl/iEabAHETadFuYYnk9'},
    {Icon:Clock,   col:'#db2777',rgb:'219,39,119', label:'Working Hours', val:'Mon – Sat',                       sub:'9 AM – 8 PM IST',                href:null},
    {Icon:Zap,     col:'#059669',rgb:'5,150,105',  label:'Response Time', val:'< 24 Hours',                      sub:'On business days',               href:null},
  ];
  return (
    <section ref={ref} style={{background:'#020810',padding:'60px 0 0'}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 clamp(16px,5vw,80px)'}}>
        <div className="info-grid" style={{display:'grid',gap:12}}>
          {cards.map(({Icon,col,rgb,label,val,sub,href},i)=>{
            const inner = (
              <div style={{padding:'clamp(18px,3vw,28px) clamp(16px,3vw,24px)',borderRadius:16,background:`linear-gradient(135deg,rgba(${rgb},.08) 0%,rgba(${rgb},.03) 100%)`,border:`1px solid rgba(${rgb},.2)`,opacity:vis?1:0,transform:vis?'none':'translateY(24px)',transition:`opacity .6s ${i*.08}s ease,transform .6s ${i*.08}s cubic-bezier(.16,1,.3,1)`,cursor:href?'pointer':'default',position:'relative',overflow:'hidden',height:'100%',boxSizing:'border-box'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(to right,${col},transparent)`}}/>
                <div style={{width:42,height:42,borderRadius:12,background:`rgba(${rgb},.15)`,border:`1px solid rgba(${rgb},.3)`,display:'flex',alignItems:'center',justifyContent:'center',color:col,marginBottom:14,flexShrink:0}}><Icon size={18}/></div>
                <div style={{fontSize:'.56rem',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:col,marginBottom:5}}>{label}</div>
                <div style={{fontFamily:'var(--serif)',fontSize:'clamp(.88rem,1.5vw,1.1rem)',fontWeight:800,color:'#fff',lineHeight:1.25,marginBottom:3,wordBreak:'break-word'}}>{val}</div>
                <div style={{fontSize:'.72rem',color:'rgba(255,255,255,.35)',lineHeight:1.4}}>{sub}</div>
                {href&&<div style={{position:'absolute',bottom:16,right:16,opacity:.4}}><ArrowRight size={13} color="#fff"/></div>}
              </div>
            );
            return href
              ? <a key={label} href={href} target={href.startsWith('http')?'_blank':undefined} rel="noopener noreferrer" style={{textDecoration:'none'}}>{inner}</a>
              : <div key={label} style={{height:'100%'}}>{inner}</div>;
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══ CONTACT FORM ═══ */
function ContactForm() {
  const [ref, vis] = useInView(.05);
  const [form, setForm] = useState({name:'',email:'',phone:'',subject:'',message:'',privacy:false});
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState(null);

  const change = e => {
    const {name,value,type,checked} = e.target;
    setForm(p=>({...p,[name]:type==='checkbox'?checked:value}));
    if (errors[name]) setErrors(p=>({...p,[name]:false}));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.email.trim()||!/\S+@\S+\.\S+/.test(form.email)) e.email = true;
    if (!form.subject) e.subject = true;
    if (!form.message.trim()) e.message = true;
    if (!form.privacy) e.privacy = true;
    setErrors(e); return Object.keys(e).length===0;
  };

  const submit = async () => {
    if (!validate()) return;
    setStatus('loading');
    try {
      /* Load EmailJS SDK once */
      if (!window.emailjs) {
        await new Promise((res,rej)=>{
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
          s.onload=res; s.onerror=rej;
          document.head.appendChild(s);
        });
        window.emailjs.init(EJS_KEY);
      }

      const payload = {
        from_name:  form.name,
        from_email: form.email,
        phone:      form.phone || 'Not provided',
        subject:    form.subject,
        message:    form.message,
        to_email:   TO_EMAIL,
      };

      /* 1️⃣ Auto-reply to the person who filled the form */
      await window.emailjs.send(EJS_SERVICE, EJS_TEMPLATE_USER, payload);

      /* 2️⃣ Notification to admin inbox */
      await window.emailjs.send(EJS_SERVICE, EJS_TEMPLATE_ADMIN, payload);

      setStatus('success');
      setForm({name:'',email:'',phone:'',subject:'',message:'',privacy:false});
    } catch(err) {
      console.error('EmailJS error:', err);
      setStatus('error');
    }
  };

  const IS = name => ({
    width:'100%', boxSizing:'border-box',
    padding:'clamp(11px,2.5vw,14px) clamp(12px,3vw,16px)',
    background:focused===name?'rgba(255,255,255,.06)':'rgba(255,255,255,.03)',
    border:errors[name]?'1px solid rgba(239,68,68,.6)':focused===name?'1px solid rgba(0,87,255,.6)':'1px solid rgba(255,255,255,.1)',
    borderRadius:10, color:'#fff', fontSize:'clamp(.85rem,2vw,.93rem)',
    fontFamily:'var(--sans)', outline:'none', transition:'all .2s ease',
    boxShadow:focused===name?'0 0 0 3px rgba(0,87,255,.12)':'none',
    WebkitAppearance:'none', appearance:'none',
  });
  const LS = {display:'block',fontSize:'.6rem',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(255,255,255,.4)',marginBottom:7};

  return (
    <section style={{background:'#020810',padding:'clamp(48px,8vw,80px) 0 clamp(60px,10vw,120px)'}}>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'0 clamp(16px,5vw,80px)'}}>
        <div ref={ref} className="contact-grid" style={{display:'grid',gap:'clamp(32px,5vw,48px)',alignItems:'start'}}>

          {/* LEFT — map + info */}
          <div style={{opacity:vis?1:0,transform:vis?'none':'translateY(32px)',transition:'opacity .8s ease,transform .8s cubic-bezier(.16,1,.3,1)'}}>
            <div style={{marginBottom:28}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                <div style={{width:22,height:2,background:'#0057ff',borderRadius:1,flexShrink:0}}/>
                <span style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(255,255,255,.35)'}}>Find Us</span>
              </div>
              <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.7rem,5vw,3rem)',fontWeight:900,color:'#fff',letterSpacing:'-.04em',lineHeight:1.08,marginBottom:10}}>
                We're Based in<br/><span style={{color:'#5aa8ff',fontStyle:'italic'}}>Tamil Nadu.</span>
              </h2>
              <p style={{fontSize:'clamp(.82rem,2vw,.9rem)',color:'rgba(255,255,255,.38)',lineHeight:1.85,margin:0}}>Kovilpatti, Tamil Nadu — working with clients globally. Remote-ready, always reachable.</p>
            </div>

            <div style={{borderRadius:18,overflow:'hidden',border:'1px solid rgba(255,255,255,.1)',marginBottom:20,position:'relative'}}>
              <div style={{position:'absolute',inset:0,background:'rgba(0,23,80,.2)',pointerEvents:'none',zIndex:1,mixBlendMode:'multiply'}}/>
              <div style={{position:'absolute',inset:0,border:'1px solid rgba(0,87,255,.2)',borderRadius:18,zIndex:2,pointerEvents:'none'}}/>
              <iframe
                title="Synnoviq Location"
                src={MAP_SRC}
                width="100%"
                height="clamp(240px,50vw,320px)"
                style={{display:'block',border:0,filter:'invert(90%) hue-rotate(180deg) saturate(.55) brightness(.85)',width:'100%',height:'clamp(240px,50vw,320px)'}}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a href="https://maps.app.goo.gl/iEabAHETadFuYYnk9" target="_blank" rel="noopener noreferrer"
                style={{position:'absolute',bottom:12,left:12,zIndex:3,display:'flex',alignItems:'center',gap:6,padding:'7px 12px',borderRadius:999,background:'rgba(0,0,0,.75)',backdropFilter:'blur(12px)',border:'1px solid rgba(0,87,255,.4)',color:'#fff',textDecoration:'none',fontSize:'clamp(.62rem,.9vw,.7rem)',fontWeight:700,whiteSpace:'nowrap'}}>
                <MapPin size={11} color="#5aa8ff"/> Open in Maps <ArrowRight size={10}/>
              </a>
            </div>

            <a href="mailto:synnoviqtechnologies@gmail.com"
              style={{display:'flex',alignItems:'center',gap:12,padding:'clamp(14px,3vw,18px) clamp(14px,3vw,22px)',borderRadius:14,border:'1px solid rgba(0,87,255,.25)',background:'rgba(0,87,255,.07)',textDecoration:'none',transition:'all .25s ease'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(0,87,255,.5)';e.currentTarget.style.background='rgba(0,87,255,.12)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(0,87,255,.25)';e.currentTarget.style.background='rgba(0,87,255,.07)';}}>
              <div style={{width:40,height:40,borderRadius:11,background:'rgba(0,87,255,.2)',border:'1px solid rgba(0,87,255,.4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#5aa8ff',flexShrink:0}}><Mail size={17}/></div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'.58rem',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(0,87,255,.8)',marginBottom:2}}>Or email directly</div>
                <div style={{fontSize:'clamp(.72rem,1.5vw,.82rem)',fontWeight:600,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>synnoviqtechnologies@gmail.com</div>
              </div>
              <ArrowRight size={15} color="rgba(255,255,255,.3)" style={{flexShrink:0}}/>
            </a>
          </div>

          {/* RIGHT — form */}
          <div style={{opacity:vis?1:0,transform:vis?'none':'translateY(32px)',transition:'opacity .8s .12s ease,transform .8s .12s cubic-bezier(.16,1,.3,1)'}}>
            {status==='success' ? (
              <div style={{padding:'clamp(40px,8vw,60px) clamp(24px,5vw,40px)',borderRadius:22,background:'rgba(5,150,105,.08)',border:'1px solid rgba(5,150,105,.25)',textAlign:'center'}}>
                <div style={{width:64,height:64,borderRadius:'50%',background:'rgba(5,150,105,.15)',border:'1px solid rgba(5,150,105,.4)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',color:'#34d399'}}><CheckCircle size={28}/></div>
                <h3 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.5rem,4vw,2rem)',fontWeight:900,color:'#fff',marginBottom:10,letterSpacing:'-.03em'}}>Message Sent!</h3>
                <p style={{color:'rgba(255,255,255,.45)',lineHeight:1.8,marginBottom:28,fontSize:'clamp(.84rem,2vw,.9rem)'}}>We'll reply within 1 business day.</p>
                <button onClick={()=>setStatus('idle')} style={{padding:'11px 24px',borderRadius:11,background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',color:'#fff',fontSize:'.84rem',fontWeight:700,cursor:'pointer',fontFamily:'var(--sans)',WebkitTapHighlightColor:'transparent'}}>Send Another</button>
              </div>
            ) : (
              <div style={{borderRadius:22,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',padding:'clamp(20px,5vw,40px)',position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,#0057ff,#7c3aed,#db2777)'}}/>

                <div style={{marginBottom:24}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{width:34,height:34,borderRadius:9,background:'rgba(0,87,255,.15)',border:'1px solid rgba(0,87,255,.3)',display:'flex',alignItems:'center',justifyContent:'center',color:'#5aa8ff',flexShrink:0}}><MessageSquare size={15}/></div>
                    <span style={{fontFamily:'var(--serif)',fontSize:'clamp(1.1rem,3vw,1.3rem)',fontWeight:800,color:'#fff'}}>Send a Message</span>
                  </div>
                  <p style={{fontSize:'.76rem',color:'rgba(255,255,255,.3)',lineHeight:1.7,margin:0}}>Fill in the form and we'll get back to you ASAP.</p>
                </div>

                <div style={{display:'flex',flexDirection:'column',gap:16}}>
                  <div className="form-row-2" style={{display:'grid',gap:12}}>
                    <div>
                      <label style={LS}>Full Name <span style={{color:'#ef4444'}}>*</span></label>
                      <input name="name" value={form.name} onChange={change} placeholder="Your name" style={IS('name')} onFocus={()=>setFocused('name')} onBlur={()=>setFocused(null)} autoComplete="name"/>
                      {errors.name&&<div style={{fontSize:'.64rem',color:'#ef4444',marginTop:4}}>Name is required</div>}
                    </div>
                    <div>
                      <label style={LS}>Email <span style={{color:'#ef4444'}}>*</span></label>
                      <input name="email" type="email" inputMode="email" value={form.email} onChange={change} placeholder="you@example.com" style={IS('email')} onFocus={()=>setFocused('email')} onBlur={()=>setFocused(null)} autoComplete="email"/>
                      {errors.email&&<div style={{fontSize:'.64rem',color:'#ef4444',marginTop:4}}>Valid email required</div>}
                    </div>
                  </div>

                  <div className="form-row-2" style={{display:'grid',gap:12}}>
                    <div>
                      <label style={LS}>Phone <span style={{fontSize:'.58rem',fontWeight:400,color:'rgba(255,255,255,.2)'}}>(optional)</span></label>
                      <input name="phone" type="tel" inputMode="tel" value={form.phone} onChange={change} placeholder="+91 00000 00000" style={IS('phone')} onFocus={()=>setFocused('phone')} onBlur={()=>setFocused(null)} autoComplete="tel"/>
                    </div>
                    <div>
                      <label style={LS}>Subject <span style={{color:'#ef4444'}}>*</span></label>
                      <div style={{position:'relative'}}>
                        <select name="subject" value={form.subject} onChange={change}
                          style={{...IS('subject'),paddingRight:32,cursor:'pointer',color:form.subject?'#fff':'rgba(255,255,255,.35)'}}
                          onFocus={()=>setFocused('subject')} onBlur={()=>setFocused(null)}>
                          <option value="" style={{background:'#0d1b3e',color:'rgba(255,255,255,.5)'}}>Select topic…</option>
                          {['Project Request','Full Stack Development','Game Development','UI/UX Design','Partnership','Internship','General Inquiry','Other'].map(o=>(
                            <option key={o} value={o} style={{background:'#0d1b3e',color:'#fff'}}>{o}</option>
                          ))}
                        </select>
                        <div style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'rgba(255,255,255,.4)'}}>▾</div>
                      </div>
                      {errors.subject&&<div style={{fontSize:'.64rem',color:'#ef4444',marginTop:4}}>Please select a topic</div>}
                    </div>
                  </div>

                  <div>
                    <label style={LS}>Message <span style={{color:'#ef4444'}}>*</span></label>
                    <textarea name="message" value={form.message} onChange={change}
                      placeholder="Tell us about your project — scope, timeline, goals…"
                      style={{...IS('message'),minHeight:'clamp(110px,25vw,130px)',resize:'vertical',lineHeight:1.65}}
                      onFocus={()=>setFocused('message')} onBlur={()=>setFocused(null)}/>
                    {errors.message&&<div style={{fontSize:'.64rem',color:'#ef4444',marginTop:4}}>Message is required</div>}
                    <div style={{textAlign:'right',fontSize:'.6rem',color:'rgba(255,255,255,.2)',marginTop:3}}>{form.message.length} chars</div>
                  </div>

                  <div>
                    <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
                      {/* Custom checkbox div — native input is killed by globals.css -webkit-appearance:none */}
                      <div
                        onClick={()=>{setForm(p=>({...p,privacy:!p.privacy}));if(errors.privacy)setErrors(p=>({...p,privacy:false}));}}
                        style={{
                          width:18,height:18,minWidth:18,minHeight:18,
                          borderRadius:4,marginTop:2,flexShrink:0,cursor:'pointer',
                          border: errors.privacy ? '2px solid #ef4444' : form.privacy ? '2px solid #0057ff' : '2px solid rgba(255,255,255,0.35)',
                          background: form.privacy ? '#0057ff' : 'rgba(255,255,255,0.05)',
                          display:'flex',alignItems:'center',justifyContent:'center',
                          transition:'all .18s ease',WebkitTapHighlightColor:'transparent',
                        }}
                      >
                        {form.privacy&&(
                          <svg width="11" height="9" viewBox="0 0 11 9" fill="none" style={{display:'block',flexShrink:0}}>
                            <path d="M1 4.5L3.8 7.5L10 1" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <label
                        onClick={()=>{setForm(p=>({...p,privacy:!p.privacy}));if(errors.privacy)setErrors(p=>({...p,privacy:false}));}}
                        style={{fontSize:'clamp(.75rem,2vw,.8rem)',color:'rgba(255,255,255,.38)',cursor:'pointer',lineHeight:1.6,userSelect:'none'}}
                      >
                        I agree to the <a href="/privacy-policy" onClick={e=>e.stopPropagation()} style={{color:'#5aa8ff',textDecoration:'none'}}>Privacy Policy</a> and consent to being contacted. <span style={{color:'#ef4444'}}>*</span>
                      </label>
                    </div>
                    {errors.privacy&&<div style={{fontSize:'.64rem',color:'#ef4444',marginTop:4,paddingLeft:28}}>Please accept to continue</div>}
                  </div>

                  {status==='error'&&(
                    <div style={{display:'flex',alignItems:'flex-start',gap:9,padding:'11px 13px',borderRadius:10,background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.28)',color:'#fca5a5',fontSize:'clamp(.75rem,2vw,.8rem)',lineHeight:1.5}}>
                      <AlertCircle size={14} style={{flexShrink:0,marginTop:1}}/> Something went wrong. Please email us directly at synnoviqtechnologies@gmail.com
                    </div>
                  )}

                  <button onClick={submit} disabled={status==='loading'}
                    style={{display:'flex',alignItems:'center',justifyContent:'center',gap:9,padding:'clamp(13px,3vw,15px) 24px',width:'100%',borderRadius:13,border:'none',background:status==='loading'?'rgba(0,87,255,.5)':'linear-gradient(135deg,#0057ff,#2563eb)',color:'#fff',fontSize:'clamp(.86rem,2vw,.9rem)',fontWeight:700,cursor:status==='loading'?'not-allowed':'pointer',fontFamily:'var(--sans)',boxShadow:'0 8px 24px rgba(0,87,255,.35)',transition:'all .25s ease',WebkitTapHighlightColor:'transparent',touchAction:'manipulation'}}
                    onMouseEnter={e=>{if(status!=='loading'){e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 14px 32px rgba(0,87,255,.5)';}}}
                    onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 8px 24px rgba(0,87,255,.35)';}}>
                    {status==='loading'
                      ? <><span style={{width:16,height:16,border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',borderRadius:'50%',display:'inline-block',animation:'spin .8s linear infinite',flexShrink:0}}/> Sending…</>
                      : <><Send size={15}/> Send Message <ArrowRight size={14}/></>}
                  </button>

                  <p style={{fontSize:'clamp(.6rem,1.5vw,.65rem)',color:'rgba(255,255,255,.18)',textAlign:'center',lineHeight:1.6,margin:0}}>🔒 Your info is encrypted and never shared with third parties.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ CTA STRIP ═══ */
function CtaStrip() {
  const [ref, vis] = useInView(.1);
  return (
    <section ref={ref} style={{background:'linear-gradient(135deg,#0d1b4b 0%,#020810 100%)',padding:'clamp(52px,10vw,80px) 0',borderTop:'1px solid rgba(255,255,255,.06)',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'min(60vw,500px)',height:'min(40vw,360px)',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(0,87,255,.1) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div style={{maxWidth:900,margin:'0 auto',padding:'0 clamp(20px,5vw,80px)',textAlign:'center',position:'relative',zIndex:1}}>
        <div style={{opacity:vis?1:0,transform:vis?'none':'translateY(24px)',transition:'opacity .8s ease,transform .8s ease'}}>
          <p style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',marginBottom:14}}>Preferred Contact</p>
          <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.5rem,5vw,3rem)',fontWeight:900,color:'#fff',letterSpacing:'-.04em',marginBottom:12,lineHeight:1.15}}>
            Drop us a line at{' '}
            <a href="mailto:synnoviqtechnologies@gmail.com" style={{color:'#5aa8ff',fontStyle:'italic',textDecoration:'none',borderBottom:'2px solid rgba(90,168,255,.3)',paddingBottom:1,wordBreak:'break-all'}}>
              synnoviqtechnologies@gmail.com
            </a>
          </h2>
          <p style={{color:'rgba(255,255,255,.35)',fontSize:'clamp(.82rem,2vw,.88rem)',lineHeight:1.8,margin:0}}>Alternatively, use the form above — we reply within 1 business day, Monday to Saturday.</p>
        </div>
      </div>
    </section>
  );
}

/* ═══ ROOT ═══ */
export default function Contact() {
  return (
    <div style={{marginTop:'-68px',background:'#020810',minHeight:'100vh'}}>
      <Grain/>
      <ProgressBar/>
      <Hero/>
      <InfoCards/>
      <ContactForm/>
      <CtaStrip/>
      <style>{`
        @keyframes slideUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes gPulse     { 0%,100%{box-shadow:0 0 10px #4ade80} 50%{box-shadow:0 0 24px #4ade80,0 0 40px #4ade8044} }
        @keyframes scrollPulse{ 0%,100%{opacity:.3} 50%{opacity:.8} }
        @keyframes spin       { to{transform:rotate(360deg)} }

        .info-grid { grid-template-columns: 1fr 1fr !important; }
        @media(min-width:640px){ .info-grid { grid-template-columns: repeat(4,1fr) !important; } }

        .contact-grid { grid-template-columns: 1fr !important; }
        @media(min-width:860px){ .contact-grid { grid-template-columns: 1fr 1fr !important; } }

        .form-row-2 { grid-template-columns: 1fr !important; }
        @media(min-width:480px){ .form-row-2 { grid-template-columns: 1fr 1fr !important; } }

        * { max-width: 100%; }
        input[type="checkbox"] { max-width: 18px !important; max-height: 18px !important; min-width: 18px !important; width: 18px !important; height: 18px !important; }
        img, iframe { max-width: 100% !important; }

        input, textarea, select {
          -webkit-appearance: none;
          appearance: none;
          font-size: 16px !important;
        }
        @media(min-width:480px){
          input, textarea, select { font-size: inherit !important; }
        }

        button, a { min-height: 44px; }
        input[type="checkbox"] { min-height: unset; min-width: unset; width: 18px !important; height: 18px !important; flex-shrink: 0; }

        input::placeholder, textarea::placeholder { color:rgba(255,255,255,.22); }
        select option { background:#0d1b3e; color:#fff; }
        ::-webkit-scrollbar { display:none; }
      `}</style>
    </div>
  );
}