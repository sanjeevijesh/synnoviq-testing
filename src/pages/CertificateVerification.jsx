import { useState } from 'react';
import { Shield, Search, CheckCircle2, XCircle, Calendar, AlertTriangle } from 'lucide-react';

const MOCK={
  'SYN-2025-001234':{name:'Arjun Sharma',program:'Full Stack Development Intern',duration:'June 2025 – September 2025 (3 Months)',status:'Successfully Completed',issued:'September 30, 2025',summary:'Demonstrated strong proficiency in React.js, Node.js, and REST API development through the delivery of 2 live client-facing projects. Actively contributed to daily standups, code reviews, and sprint planning.',img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80'},
  'SYN-2025-005678':{name:'Priya Nair',program:'UI/UX Design Intern',duration:'July 2025 – October 2025 (3 Months)',status:'Successfully Completed',issued:'October 31, 2025',summary:'Excelled in Figma-based design, delivering 3 complete UI design systems and conducting user research sessions. Contributed significantly to the design language of a client SaaS product shipped during the internship.',img:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&q=80'},
};

export default function CertificateVerification(){
  const [id,setId]=useState('');const [result,setResult]=useState(null);const [data,setData]=useState(null);const [loading,setLoading]=useState(false);
  const verify=async()=>{if(!id.trim())return;setLoading(true);setResult(null);await new Promise(r=>setTimeout(r,800));const found=MOCK[id.trim().toUpperCase()];setLoading(false);if(found){setData(found);setResult('valid')}else{setData(null);setResult('invalid')}};
  return(
    <div>
      {/* HERO */}
      <section className="img-hero">
        <img className="img-hero-bg" src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1800&q=75" alt="Certificate verification"/>
        <div className="img-hero-dim"/>
        <div className="img-hero-body">
          <div className="wrap" style={{textAlign:'center'}}>
            <div style={{width:60,height:60,borderRadius:16,background:'rgba(255,255,255,0.1)',backdropFilter:'blur(10px)',border:'1px solid rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',color:'#fff'}}>
              <Shield size={26}/>
            </div>
            <span className="label" style={{color:'rgba(255,255,255,0.5)'}}>Certificate Verification</span>
            <h1 className="t-h1 white anim" style={{marginBottom:16}}>Verify a Synnoviq <em className="italic" style={{color:'#5aa8ff'}}>Certificate</em></h1>
            <p className="t-lg anim d1" style={{color:'rgba(255,255,255,0.68)',maxWidth:440,margin:'0 auto'}}>Enter a Certificate ID to instantly verify its authenticity and view full intern details.</p>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap" style={{maxWidth:640}}>
          {/* Search */}
          <div style={{background:'var(--white)',border:'1px solid var(--rule)',borderRadius:'var(--r4)',padding:'28px 24px',marginBottom:20,boxShadow:'var(--sh1)'}}>
            <label style={{display:'block',fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.14em',textTransform:'uppercase',color:'var(--ink40)',marginBottom:10}}>Certificate ID</label>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <input value={id} onChange={e=>setId(e.target.value)} onKeyDown={e=>e.key==='Enter'&&verify()} placeholder="e.g. SYN-2025-001234"
                style={{flex:1,minWidth:200,padding:'12px 14px',background:'var(--surf)',border:'1px solid var(--rule)',borderRadius:'var(--r2)',color:'var(--ink)',fontSize:'0.95rem',fontFamily:'monospace',letterSpacing:'0.06em',transition:'all 0.2s'}}
                onFocus={e=>{e.target.style.borderColor='var(--blue)';e.target.style.background='#fff';e.target.style.boxShadow='0 0 0 3px rgba(0,87,255,0.1)'}}
                onBlur={e=>{e.target.style.borderColor='var(--rule)';e.target.style.background='var(--surf)';e.target.style.boxShadow='none'}}
              />
              <button onClick={verify} disabled={loading||!id.trim()} className="btn btn-blue" style={{opacity:(!id.trim()||loading)?0.55:1}}>
                {loading?'Checking…':<><Search size={14}/>Verify</>}
              </button>
            </div>
            <p style={{color:'var(--ink20)',fontSize:'0.78rem',marginTop:10}}>Demo IDs: <code style={{color:'var(--blue)',background:'var(--blue-s)',padding:'2px 7px',borderRadius:4,fontFamily:'monospace'}}>SYN-2025-001234</code> or <code style={{color:'var(--blue)',background:'var(--blue-s)',padding:'2px 7px',borderRadius:4,fontFamily:'monospace'}}>SYN-2025-005678</code></p>
          </div>

          {/* Valid result */}
          {result==='valid'&&data&&(
            <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'var(--r4)',padding:'28px 24px'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20,paddingBottom:16,borderBottom:'1px solid #bbf7d0'}}>
                <CheckCircle2 size={24} style={{color:'#16a34a'}}/>
                <div><div style={{fontWeight:700,color:'#16a34a',fontSize:'0.9rem'}}>Certificate Verified</div><div style={{fontSize:'0.76rem',color:'#4ade80'}}>This certificate is authentic and on record.</div></div>
              </div>
              {/* Profile row */}
              <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20,padding:'14px 16px',background:'#fff',borderRadius:'var(--r3)',border:'1px solid #bbf7d0'}}>
                <img src={data.img} alt={data.name} style={{width:52,height:52,borderRadius:'50%',objectFit:'cover',border:'2px solid #86efac',flexShrink:0}}/>
                <div>
                  <div style={{fontFamily:'var(--serif)',fontSize:'1.05rem',fontWeight:700,color:'var(--ink)'}}>{data.name}</div>
                  <div style={{fontSize:'0.8rem',color:'#16a34a',fontWeight:600}}>{data.program}</div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}} className="cert-grid">
                {[{lbl:'Duration',val:data.duration},{lbl:'Status',val:data.status},{lbl:'Issued By',val:'Synnoviq Technologies'},{lbl:'Issue Date',val:data.issued}].map(({lbl,val})=>(
                  <div key={lbl} style={{padding:'12px 14px',background:'#fff',borderRadius:'var(--r2)',border:'1px solid #bbf7d0'}}>
                    <span style={{display:'flex',alignItems:'center',gap:4,color:'#4ade80',fontSize:'0.65rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:4}}><Calendar size={9}/>{lbl}</span>
                    <strong style={{color:'var(--ink)',fontSize:'0.85rem',fontWeight:500}}>{val}</strong>
                  </div>
                ))}
              </div>
              <div style={{padding:'14px 16px',background:'#fff',borderRadius:'var(--r2)',borderLeft:'3px solid #16a34a'}}>
                <div style={{fontSize:'0.68rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',color:'#16a34a',marginBottom:6}}>Performance Summary</div>
                <p style={{color:'var(--ink60)',fontSize:'0.88rem',lineHeight:1.72}}>{data.summary}</p>
              </div>
            </div>
          )}

          {/* Invalid result */}
          {result==='invalid'&&(
            <div style={{background:'#fff5f5',border:'1px solid #fecaca',borderRadius:'var(--r4)',padding:'36px 24px',textAlign:'center'}}>
              <XCircle size={44} style={{color:'var(--red)',margin:'0 auto 14px'}}/>
              <h3 style={{fontFamily:'var(--serif)',fontSize:'1.3rem',fontWeight:800,color:'var(--red)',marginBottom:8}}>Certificate Not Found</h3>
              <p style={{color:'var(--ink40)',marginBottom:8}}>We could not find a certificate matching the ID you entered. Please check the ID and try again.</p>
              <p style={{fontSize:'0.86rem',color:'var(--ink40)'}}>If you believe this is an error, contact: <a href="mailto:synnoviqtechnologies@gmail.com" style={{color:'var(--blue)'}}>synnoviqtechnologies@gmail.com</a></p>
            </div>
          )}

          <div style={{marginTop:20,display:'flex',gap:10,padding:'16px 18px',background:'var(--surf)',border:'1px solid var(--rule)',borderRadius:'var(--r3)'}}>
            <AlertTriangle size={15} style={{color:'var(--ink20)',flexShrink:0,marginTop:2}}/>
            <p style={{color:'var(--ink40)',fontSize:'0.79rem',lineHeight:1.7}}>All Synnoviq certificates are digitally issued and stored in our secure system. Misrepresentation or falsification of any certificate is a violation of our Terms of Use.</p>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:480px){.cert-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
