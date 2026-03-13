import { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact(){
  const [form,setForm]=useState({name:'',email:'',phone:'',subject:'',message:'',privacy:false});
  const [status,setStatus]=useState(null);
  const [loading,setLoading]=useState(false);
  const change=e=>{const{name,value,type,checked}=e.target;setForm(p=>({...p,[name]:type==='checkbox'?checked:value}))};
  const submit=async()=>{
    if(!form.name||!form.email||!form.subject||!form.message||!form.privacy){setStatus('error');return;}
    setLoading(true);await new Promise(r=>setTimeout(r,900));setLoading(false);setStatus('success');
    setForm({name:'',email:'',phone:'',subject:'',message:'',privacy:false});
  };
  const F={width:'100%',padding:'12px 14px',background:'var(--surf)',border:'1px solid var(--rule)',borderRadius:'var(--r2)',color:'var(--ink)',fontSize:'0.93rem',transition:'all 0.2s'};
  const L={display:'block',fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'var(--ink40)',marginBottom:7};
  const focus=e=>{e.target.style.borderColor='var(--blue)';e.target.style.background='#fff';e.target.style.boxShadow='0 0 0 3px rgba(0,87,255,0.1)'};
  const blur=e=>{e.target.style.borderColor='var(--rule)';e.target.style.background='var(--surf)';e.target.style.boxShadow='none'};
  return(
    <div>
      {/* HERO */}
      <section className="img-hero">
        <img className="img-hero-bg" src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1800&q=75" alt="Contact"/>
        <div className="img-hero-dim"/>
        <div className="img-hero-body">
          <div className="wrap">
            <span className="label" style={{color:'rgba(255,255,255,0.5)'}}>Get in Touch</span>
            <h1 className="t-h1 white anim" style={{maxWidth:700,marginBottom:18}}>Let's Build Something <em className="italic" style={{color:'#5aa8ff'}}>Together</em></h1>
            <p className="t-lg anim d1" style={{color:'rgba(255,255,255,0.68)',maxWidth:500}}>Have a project in mind? Our team typically responds within 1 business day.</p>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="g2" style={{alignItems:'start'}}>
            {/* LEFT */}
            <div>
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=700&q=80" alt="Location" style={{width:'100%',height:220,objectFit:'cover',borderRadius:'var(--r4)',marginBottom:24,boxShadow:'var(--sh2)'}}/>
              {[
                {Icon:Mail, lbl:'Email',    val:'synnoviqtechnologies@gmail.com',href:'mailto:synnoviqtechnologies@gmail.com'},
                {Icon:MapPin,lbl:'Location', val:'India',href:null},
                {Icon:Clock, lbl:'Hours',    val:'Mon–Fri · 9 AM–5 PM IST',href:null},
              ].map(({Icon,lbl,val,href})=>(
                <div key={lbl} style={{display:'flex',gap:14,padding:'16px 0',borderBottom:'1px solid var(--rule)'}}>
                  <div style={{width:40,height:40,borderRadius:10,background:'var(--blue-s)',border:'1px solid var(--blue-t)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--blue)',flexShrink:0}}>
                    <Icon size={17}/>
                  </div>
                  <div>
                    <span style={{display:'block',fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',color:'var(--ink20)',marginBottom:3}}>{lbl}</span>
                    {href?<a href={href} style={{color:'var(--blue)',fontSize:'0.9rem',fontWeight:500}}>{val}</a>:<span style={{color:'var(--ink)',fontSize:'0.9rem'}}>{val}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* FORM */}
            <div style={{background:'var(--white)',border:'1px solid var(--rule)',borderRadius:'var(--r4)',padding:'32px 28px',boxShadow:'var(--sh1)'}}>
              {status==='success'?(
                <div style={{textAlign:'center',padding:'48px 20px'}}>
                  <CheckCircle size={48} style={{color:'var(--green)',margin:'0 auto 18px'}}/>
                  <h3 style={{fontFamily:'var(--serif)',fontSize:'1.6rem',fontWeight:800,color:'var(--ink)',marginBottom:8}}>Message Received!</h3>
                  <p style={{color:'var(--ink40)',marginBottom:24}}>We'll get back to you within 1 business day.</p>
                  <button onClick={()=>setStatus(null)} className="btn btn-outline">Send Another</button>
                </div>
              ):(
                <div style={{display:'flex',flexDirection:'column',gap:18}}>
                  <h2 style={{fontFamily:'var(--serif)',fontSize:'1.5rem',fontWeight:800,color:'var(--ink)',marginBottom:4}}>Send a Message</h2>
                  <div style={{height:1,background:'var(--rule)'}}/>
                  <div style={{display:'grid',gridTemplateColumns:'1fr',gap:16}} className="form-row">
                    <div><label style={L}>Full Name *</label><input name="name" value={form.name} onChange={change} style={F} placeholder="Your name" onFocus={focus} onBlur={blur}/></div>
                    <div><label style={L}>Email *</label><input name="email" type="email" value={form.email} onChange={change} style={F} placeholder="you@example.com" onFocus={focus} onBlur={blur}/></div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr',gap:16}} className="form-row">
                    <div><label style={L}>Phone (optional)</label><input name="phone" value={form.phone} onChange={change} style={F} placeholder="+91 00000 00000" onFocus={focus} onBlur={blur}/></div>
                    <div><label style={L}>Subject *</label>
                      <select name="subject" value={form.subject} onChange={change} style={{...F,cursor:'pointer'}}>
                        <option value="">Select a subject</option>
                        {['General Inquiry','Project Request','Partnership','Career','Other'].map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label style={L}>Message *</label><textarea name="message" value={form.message} onChange={change} style={{...F,minHeight:120,resize:'vertical'}} placeholder="Tell us about your project..." onFocus={focus} onBlur={blur}/></div>
                  <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
                    <input type="checkbox" id="priv" name="privacy" checked={form.privacy} onChange={change} style={{width:15,height:15,accentColor:'var(--blue)',marginTop:2,cursor:'pointer',flexShrink:0}}/>
                    <label htmlFor="priv" style={{fontSize:'0.85rem',color:'var(--ink40)',cursor:'pointer'}}>I agree to the <a href="/privacy-policy" style={{color:'var(--blue)'}}>Privacy Policy</a> *</label>
                  </div>
                  {status==='error'&&<div style={{display:'flex',alignItems:'center',gap:8,padding:'12px 14px',background:'rgba(220,38,38,0.06)',border:'1px solid rgba(220,38,38,0.2)',borderRadius:'var(--r2)',color:'var(--red)',fontSize:'0.85rem'}}><AlertCircle size={14}/>Please fill in all required fields and accept the Privacy Policy.</div>}
                  <button onClick={submit} disabled={loading} className="btn btn-blue" style={{justifyContent:'center',padding:'13px',opacity:loading?0.65:1}}>
                    {loading?'Sending…':<><Send size={15}/>Send Message</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <style>{`@media(min-width:500px){.form-row{grid-template-columns:1fr 1fr!important}}`}</style>
    </div>
  );
}
