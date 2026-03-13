import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

const ITEMS=[
  {slug:'game-studio-launch',img:'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80',title:'Synnoviq Technologies Officially Launches Its Dedicated Game Development Studio',date:'April 20, 2025',badge:'Studio Launch',badgeColor:'#7c3aed',summary:'We are proud to announce the formal launch of our in-house game development studio, expanding our service offering to include 2D/3D game development, mobile games, and interactive simulations using Unity and Unreal Engine.'},
  {slug:'internship-open',img:'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',title:"Internship Programme Applications Are Now Open — Join Synnoviq's First Cohort",date:'March 15, 2025',badge:'Internships',badgeColor:'#059669',summary:'Synnoviq Technologies is opening applications for our inaugural internship programme. Roles are available in Full Stack Development, Game Development, UI/UX Design, and several other specialisations.'},
  {slug:'50-projects-milestone',img:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',title:'Synnoviq Crosses 50 Successful Project Deliveries',date:'February 28, 2025',badge:'Milestone',badgeColor:'#0057ff',summary:'We have successfully delivered over 50 client projects spanning web applications, enterprise platforms, SaaS products, and interactive games. This milestone reflects the dedication of our team and the trust of our clients.'},
  {slug:'ai-partnership',img:'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',title:'Synnoviq Partners with [Partner Name] to Accelerate AI-Driven Development',date:'January 10, 2025',badge:'Partnership',badgeColor:'#d97706',summary:"We're excited to announce a strategic partnership to accelerate AI-driven development capabilities, bringing more intelligent, automated solutions to our clients across all service areas."},
];

export default function Announcements(){return(
  <div>
    {/* HERO */}
    <section className="img-hero">
      <img className="img-hero-bg" src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1800&q=75" alt="News"/>
      <div className="img-hero-dim"/>
      <div className="img-hero-body">
        <div className="wrap">
          <span className="label" style={{color:'rgba(255,255,255,0.5)'}}>News & Updates</span>
          <h1 className="t-h1 white anim" style={{maxWidth:700,marginBottom:18}}>Latest from <em className="italic" style={{color:'#5aa8ff'}}>Synnoviq</em></h1>
          <p className="t-lg anim d1" style={{color:'rgba(255,255,255,0.68)',maxWidth:500}}>Stay informed with the latest company milestones, product launches, and partnership announcements.</p>
        </div>
      </div>
    </section>

    <section className="sec">
      <div className="wrap" style={{maxWidth:880}}>
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          {ITEMS.map(item=>(
            <article key={item.slug} className="card ann-card" style={{display:'grid',gridTemplateColumns:'1fr',overflow:'hidden'}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--sh2)';e.currentTarget.style.transform='translateY(-3px)'}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)'}}
            >
              <div style={{height:200,overflow:'hidden',position:'relative'}}>
                <img src={item.img} alt={item.title} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.4s ease'}}
                  onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
                />
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.28))'}}/>
              </div>
              <div style={{padding:'28px 28px 32px'}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14,flexWrap:'wrap'}}>
                  <span style={{padding:'4px 11px',borderRadius:999,background:`${item.badgeColor}18`,color:item.badgeColor,fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.07em'}}>{item.badge}</span>
                  <span style={{display:'flex',alignItems:'center',gap:5,color:'var(--ink20)',fontSize:'0.78rem'}}><Calendar size={11}/>{item.date}</span>
                </div>
                <h2 className="t-h3" style={{marginBottom:12}}>{item.title}</h2>
                <p className="t-md" style={{marginBottom:18}}>{item.summary}</p>
                <Link to={`/announcements/${item.slug}`} style={{display:'inline-flex',alignItems:'center',gap:5,color:item.badgeColor,fontSize:'0.8rem',fontWeight:700,transition:'gap 0.18s'}}
                  onMouseEnter={e=>e.currentTarget.style.gap='9px'}
                  onMouseLeave={e=>e.currentTarget.style.gap='5px'}
                >Read More<ArrowRight size={12}/></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
    <style>{`@media(min-width:640px){.ann-card{grid-template-columns:260px 1fr!important}}`}</style>
  </div>
);}
