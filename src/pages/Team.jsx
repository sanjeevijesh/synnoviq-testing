import { Linkedin } from 'lucide-react';

const DEPTS=[
  {name:'Leadership',members:[{
    name:'Mr. Abhishek',title:'Founder & CEO',initials:'MA',
    bio:'Technology entrepreneur and full stack architect. Founded Synnoviq with a vision where technical excellence and creative ambition go hand in hand. 50+ projects delivered globally.',
    img:'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    skills:['Full Stack Architecture','Product Strategy','Team Leadership','Client Relations'],
  }]},
  {name:'Research & Development',members:[
    {name:'Sanjeev Vijesh',   title:'R&D Engineer',initials:'SV',bio:'Drives research initiatives and emerging technology evaluation, exploring innovative solutions that shape Synnoviq\'s product future.',img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'},
    {name:'Deepak Kumar',     title:'R&D Engineer',initials:'DK',bio:'Specialises in prototyping and proof-of-concept development, bridging cutting-edge research with practical, scalable implementation.',img:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80'},
    {name:'Priyadharshini',   title:'R&D Engineer',initials:'PD',bio:'Focuses on data-driven research and analytical problem-solving, contributing to intelligent automation and next-generation integrations.',img:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'},
  ]},
  {name:'Engineering & Full Stack',members:[
    {name:'[Lead Engineer]',  title:'Lead Full Stack Engineer',  initials:'LE',bio:'Oversees architecture decisions and mentors junior developers across all web projects.',img:'https://images.unsplash.com/photo-1542156822-6924d1a71ace?w=400&q=80'},
    {name:'[Frontend Dev]',   title:'Senior Frontend Developer', initials:'FE',bio:'Specialises in React.js and Next.js, building pixel-perfect, performant interfaces.',img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'},
    {name:'[Backend Dev]',    title:'Backend Engineer',          initials:'BE',bio:'Expert in Node.js and Python, designing scalable APIs and data architectures.',img:'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&q=80'},
  ]},
  {name:'Game Development Studio',members:[
    {name:'[Game Director]',  title:'Game Director',   initials:'GD',bio:'Leads the studio with expertise in Unity and Unreal Engine across mobile and PC titles.',img:'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80'},
    {name:'[Game Dev]',       title:'Game Developer',  initials:'GV',bio:'Implements gameplay systems, physics and AI behaviour for engaging experiences.',img:'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&q=80'},
  ]},
  {name:'UI/UX Design & Product',members:[
    {name:'[Design Lead]',    title:'Lead UI/UX Designer',initials:'DL',bio:'Creates intuitive, beautiful interfaces with deep expertise in Figma and design systems.',img:'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'},
    {name:'[Product Designer]',title:'Product Designer', initials:'PD',bio:'Bridges research and design to craft user-centred digital experiences.',img:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80'},
  ]},
  {name:'QA, DevOps & Operations',members:[
    {name:'[QA Lead]',    title:'QA Engineer',     initials:'QA',bio:'Ensures product quality through rigorous functional, performance and security testing.',img:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80'},
    {name:'[DevOps]',     title:'DevOps Engineer', initials:'DO',bio:'Manages CI/CD pipelines and cloud infrastructure for seamless deployments.',img:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'},
    {name:'[Operations]', title:'Operations & HR',  initials:'OP',bio:'Keeps teams aligned and manages talent acquisition and the internship programme.',img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'},
  ]},
];

function Card({m}){return(
  <div className="card" style={{display:'flex',flexDirection:'column'}}
    onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--sh2)';e.currentTarget.style.transform='translateY(-4px)'}}
    onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)'}}
  >
    <div style={{height:200,overflow:'hidden',position:'relative',background:'var(--surf)'}}>
      <img src={m.img} alt={m.name} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',transition:'transform 0.4s ease'}}
        onMouseEnter={e=>e.currentTarget.style.transform='scale(1.06)'}
        onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
      />
      <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 55%,rgba(0,0,0,0.22))'}}/>
    </div>
    <div style={{padding:'20px 22px 24px',flex:1,display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
        <div>
          <strong style={{display:'block',fontFamily:'var(--serif)',fontSize:'1rem',fontWeight:700,color:'var(--ink)',marginBottom:3}}>{m.name}</strong>
          <span style={{color:'var(--blue)',fontSize:'0.75rem',fontWeight:600,letterSpacing:'0.03em'}}>{m.title}</span>
        </div>
        <a href="#" aria-label="LinkedIn" style={{color:'#d0d0d0',transition:'color 0.2s',marginTop:2}}
          onMouseEnter={e=>e.currentTarget.style.color='#0a66c2'}
          onMouseLeave={e=>e.currentTarget.style.color='#d0d0d0'}
        ><Linkedin size={15}/></a>
      </div>
      <div style={{height:1,background:'var(--rule)',margin:'10px 0'}}/>
      <p className="t-sm" style={{flex:1}}>{m.bio}</p>
    </div>
  </div>
);}

export default function Team(){return(
  <div>
    {/* HERO */}
    <section className="img-hero">
      <img className="img-hero-bg" src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1800&q=75" alt="Team"/>
      <div className="img-hero-dim"/>
      <div className="img-hero-body">
        <div className="wrap">
          <span className="label" style={{color:'rgba(255,255,255,0.5)'}}>Our People</span>
          <h1 className="t-h1 white anim" style={{maxWidth:700,marginBottom:18}}>Meet the People <em className="italic" style={{color:'#5aa8ff'}}>Behind the Code</em></h1>
          <p className="t-lg anim d1" style={{color:'rgba(255,255,255,0.68)',maxWidth:520}}>Talented developers, designers, and strategists united by a love of technology and commitment to exceptional products.</p>
        </div>
      </div>
    </section>

    {DEPTS.map((d,i)=>(
      <section key={d.name} style={{padding:'56px 0',background:i%2===1?'var(--surf)':'var(--white)',borderTop:'1px solid var(--rule)'}}>
        <div className="wrap">
          <div style={{marginBottom:32}}>
            <span className="label">{d.name}</span>
            <div style={{width:36,height:2,background:'var(--blue)',borderRadius:1,marginTop:4}}/>
          </div>
          {d.name==='Leadership'?(
            <div className="g2" style={{alignItems:'center'}}>
              <div style={{maxWidth:320}}><Card m={d.members[0]}/></div>
              <div>
                <h3 className="t-h2" style={{marginBottom:14}}>Founder &amp; Visionary</h3>
                <p className="t-md" style={{marginBottom:20}}>Mr. Abhishek founded Synnoviq with a singular belief — that technology, when built right, can transform businesses and change lives. As both architect and entrepreneur, he leads by example, setting the standard for engineering quality, team culture, and client delivery across every project.</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {d.members[0].skills.map(s=>(
                    <span key={s} style={{padding:'5px 12px',background:'var(--blue-s)',border:'1px solid var(--blue-t)',borderRadius:999,fontSize:'0.76rem',fontWeight:600,color:'var(--blue)'}}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ):(
            <div className="team-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
              {d.members.map(m=><Card key={m.title} m={m}/>)}
            </div>
          )}
        </div>
      </section>
    ))}
    <style>{`
      @media(max-width:959px){.team-grid{grid-template-columns:repeat(2,1fr)!important}}
      @media(max-width:599px){.team-grid{grid-template-columns:1fr!important}}
    `}</style>
  </div>
);}
