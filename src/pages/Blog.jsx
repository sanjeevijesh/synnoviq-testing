import { useState, useEffect, useRef } from 'react';
import { Clock, X, BookOpen, Rss, Search, Calendar, User, Tag, ChevronRight, Eye } from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const CATS = ['All','Full Stack','Game Dev','UI/UX','DevOps','Careers','News'];
const CAT_META = {
  'Full Stack': { col:'#0057ff', rgb:'0,87,255',   dark:'#003db3', label:'Full Stack' },
  'Game Dev':   { col:'#7c3aed', rgb:'124,58,237', dark:'#5b28b5', label:'Game Dev' },
  'UI/UX':      { col:'#db2777', rgb:'219,39,119', dark:'#b01d62', label:'UI/UX Design' },
  'DevOps':     { col:'#0891b2', rgb:'8,145,178',  dark:'#06728e', label:'DevOps & Cloud' },
  'Careers':    { col:'#059669', rgb:'5,150,105',  dark:'#047554', label:'Careers' },
  'News':       { col:'#d97706', rgb:'217,119,6',  dark:'#b05e04', label:'Company News' },
};

const POSTS = [
  {
    slug:'scalable-rest-apis', featured:true,
    img:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=85',
    title:'Building Scalable REST APIs with Node.js',
    subtitle:'Best practices every engineer should know — from auth to rate limiting.',
    excerpt:'RESTful APIs are the backbone of modern web apps. We break down the patterns our team follows to keep APIs clean, consistent, and production-ready at scale. From proper status codes to versioning strategies, every detail matters.',
    fullContent: `When building REST APIs that need to scale, the devil is in the details. At Synnoviq, we've shipped dozens of production APIs and distilled our learnings into a repeatable playbook.

**1. Always version your API.** Use /v1/, /v2/ in the path. Breaking changes become manageable, not catastrophic.

**2. Standardise your error responses.** Every error should return { code, message, details }. Clients shouldn't have to guess the shape of a failure.

**3. Use pagination everywhere.** Never return unbounded lists. Cursor-based pagination scales better than offset for large datasets.

**4. Rate limiting is not optional.** Implement it at the gateway level using sliding window counters. Redis makes this trivial.

**5. Validate at the boundary.** Use Zod or Joi to validate every incoming payload. Fail fast, fail loud.

These five patterns alone will save you from 80% of production incidents.`,
    cat:'Full Stack', author:'Synnoviq Engineering', date:'Jan 15, 2025', read:'5 min',
    tags:['Node.js','REST API','Backend','Architecture'],
  },
  {
    slug:'unity-vs-unreal-2025',
    img:'https://deftsoft.com/wp-content/uploads/2024/07/featured-3.png',
    title:'Unity vs. Unreal in 2025',
    subtitle:'Which engine fits your next game project?',
    excerpt:"Both engines are industry-leading — but serve very different purposes. Here's how our game team approaches the engine decision for every new project we take on.",
    fullContent:`The Unity vs. Unreal debate never really ends — and for good reason. Both are exceptional tools with distinct strengths.

**Choose Unity if:** You're targeting mobile, building a 2D or stylised 3D game, or need a fast iteration cycle. Unity's asset store is unmatched, and C# is approachable for most teams.

**Choose Unreal if:** You need photorealistic visuals, you're targeting PC/console, or your team has strong C++ skills. Nanite and Lumen in UE5 are genuinely revolutionary for visual fidelity.

**The hidden factor: team expertise.** We've seen projects fail not because of the wrong engine choice, but because the team tried to learn Unreal's Blueprint system on a deadline. Stick to what your team knows unless you have explicit ramp-up time budgeted.

Our recommendation: default to Unity for anything with a tight timeline, Unreal for anything where visuals are the primary differentiator.`,
    cat:'Game Dev', author:'Synnoviq Game Studio', date:'Feb 3, 2025', read:'7 min',
    tags:['Unity','Unreal','Game Design'],
  },
  {
    slug:'internship-experience',
    img:'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=85',
    title:'From Intern to Engineer',
    subtitle:"What our Synnoviq internship actually looks like.",
    excerpt:"Our internship isn't about coffee runs. It's about real projects, real code reviews, and real mentorship. Here's a typical week for our interns at Synnoviq.",
    fullContent:`Week one: you're assigned a real feature on a live codebase. Not a tutorial. Not a toy project. A feature that ships to real users.

This isn't the norm, and we know it. Most internships gate-keep meaningful work behind months of "orientation". We don't believe in that.

**What a typical week looks like:**
- Monday: sprint planning with the full team. Your tasks are on the board alongside the seniors.
- Tuesday-Thursday: deep work cycles, pair programming sessions, async code review.
- Friday: demo day. Everyone shows what they shipped, no matter how small.

**Mentorship is structured, not accidental.** Every intern is paired with a senior engineer for weekly 1:1s. The goal is not just technical growth — it's learning to think like a product engineer.

By week 8, most interns are shipping independently. By the end of the program, several have received full-time offers.`,
    cat:'Careers', author:'Synnoviq HR', date:'Mar 10, 2025', read:'4 min',
    tags:['Internship','Career','Mentorship'],
  },
  {
    slug:'ux-conversion-mistakes',
    img:'https://images.unsplash.com/photo-1618788372246-79faff0c3742?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title:'5 UX Mistakes Killing Conversions',
    subtitle:"Bad UX doesn't just frustrate — it costs real revenue.",
    excerpt:'Our design team walks through the five most common UX mistakes they see in client products and exactly how to fix each one without a full redesign.',
    fullContent:`After auditing over 30 client products, these five patterns kill conversion every single time.

**1. Unclear primary action.** Every screen should have one obvious next step. If your user has to decide between five equally-weighted buttons, they'll choose none.

**2. Friction at the critical moment.** Forcing account creation before checkout. Requiring email verification before onboarding. Every extra step at the point of intent is a conversion killer.

**3. Form labels inside inputs.** When the user starts typing, the label disappears. Now they can't remember what the field was asking. Use floating labels or external labels — always.

**4. No feedback on action.** Button clicked. Nothing happened visibly. Did it work? Users click again. Now you have double submissions. Always show loading states.

**5. Mobile afterthought layout.** Designing desktop-first and squishing it for mobile. Tap targets under 44px. Text that requires zooming. In 2025, mobile-first isn't a preference — it's the baseline.`,
    cat:'UI/UX', author:'Synnoviq Design', date:'Mar 28, 2025', read:'6 min',
    tags:['UX','Figma','Conversion'],
  },
  {
    slug:'cicd-pipelines',
    img:'https://s7280.pcdn.co/wp-content/uploads/2021/04/ci-cd-pipeline-jenkins-configuration.png',
    title:'CI/CD Pipelines From Zero',
    subtitle:'Automated deployment without the headaches.',
    excerpt:"Continuous integration and deployment can feel overwhelming. Here's how Synnoviq sets up battle-tested pipelines that let teams ship confidently every day.",
    fullContent:`The goal of CI/CD is simple: make shipping boring. Every deployment should be an unremarkable event, not a nerve-wracking ceremony.

**Stage 1: Lint & test on every push.** ESLint, Prettier, and your full test suite run on every commit. If it fails, the branch can't merge. Non-negotiable.

**Stage 2: Preview environments.** Every pull request spins up a unique deployment URL. Reviewers can test the actual change, not just read code. We use Railway or Vercel preview deploys depending on the stack.

**Stage 3: Staging parity.** Your staging environment must mirror production exactly — same infra, same env vars (with safe values), same data shape. "Works on staging" means something only when this is true.

**Stage 4: Automated production deploy on merge.** No manual steps. No "remember to SSH in and restart the server". Merge to main, pipeline runs, production updates. Done.

The whole pipeline should run in under 8 minutes. If it takes longer, you'll stop running it — and that defeats the purpose.`,
    cat:'DevOps', author:'Synnoviq DevOps', date:'Apr 5, 2025', read:'8 min',
    tags:['CI/CD','Docker','AWS'],
  },
  {
    slug:'game-studio-launch',
    img:'https://cdn.prod.website-files.com/62d80bbbdf31d3a28076714f/63f365492e8890113ddb87da_ella-don-kCFXVisUqug-unsplash.jpg',
    title:'Synnoviq Launches Game Studio',
    subtitle:'A new chapter in our story as a tech company.',
    excerpt:"We're thrilled to announce the formal launch of our in-house game development studio — what it means for our clients and what we're building next.",
    fullContent:`Today marks a major milestone for Synnoviq: the official launch of our dedicated game development studio.

This isn't a pivot — it's an evolution. Game development has been part of our DNA since our earliest projects. We've built multiplayer systems, game backends, UI/UX for mobile games, and even shipped a few titles quietly over the years. Now we're making it official.

**What this means for clients:**
- Dedicated game dev team with Unity and Unreal expertise
- End-to-end game development from concept to launch
- Game backend infrastructure (matchmaking, leaderboards, IAP)
- Port and porting services for existing titles

**What we're building:**
We have three unannounced titles in various stages of development. One is a mobile strategy game. One is a co-op PC title. We can't say more yet — but we will soon.

If you're building a game or want to bring a game idea to life, we'd love to talk.`,
    cat:'News', author:'Synnoviq Team', date:'Apr 20, 2025', read:'3 min',
    tags:['Announcement','Game Dev','Studio'],
  },
  {
    slug:'react-performance-2025',
    img:'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&q=85',
    title:'React Performance in 2025',
    subtitle:'Profiling, memoisation, and the new compiler.',
    excerpt:'With React 19 and the compiler now stable, optimisation strategies have shifted. Here is our updated playbook for buttery-smooth React apps in production.',
    fullContent:`React 19's compiler changes everything. Most of what we used to do manually — wrapping components in memo(), calling useMemo and useCallback — is now handled automatically.

**What the compiler does:** It analyses your component tree and automatically inserts memoisation where it's beneficial. You write plain React, it outputs optimised React.

**What still matters:**
- **Bundle splitting.** Dynamic imports and React.lazy are still your first line of defence against slow initial loads.
- **Virtualisation.** Rendering 10,000 rows? Still use react-virtual. The compiler doesn't help with DOM node count.
- **Server components.** Moving data fetching to the server means less JS on the client. This is the highest-leverage change available to most apps.
- **Transitions.** useTransition for expensive state updates keeps the UI responsive. This is even more important now that users expect 60fps.

**Profile before you optimise.** React DevTools Profiler is your friend. Don't guess — measure. Most apps have one or two genuinely hot paths, and everything else is fine.`,
    cat:'Full Stack', author:'Synnoviq Engineering', date:'May 2, 2025', read:'9 min',
    tags:['React','Performance','Frontend'],
  },
  {
    slug:'design-systems-at-scale',
    img:'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=900&q=85',
    title:'Design Systems at Scale',
    subtitle:'Consistency across 10+ products.',
    excerpt:'A well-built design system is the difference between a team that ships fast and one that debates button colours every sprint. Here is how we built ours.',
    fullContent:`A design system is not a component library. It's a shared language between design and engineering — tokens, patterns, principles, and components working together.

**Start with tokens, not components.** Colours, spacing, typography, radius, shadow — these are your primitives. Get these right first. Every component is just an assembly of tokens.

**The dangerous middle stage.** Every design system goes through a phase where it has 40% coverage. At this point it's more of a burden than a benefit — some screens use it, some don't. Push through. The tipping point comes around 70% coverage.

**Versioning is non-negotiable at scale.** When you have 10 products consuming your system, a breaking change in the button component is a coordinated incident. Use semantic versioning and changelogs religiously.

**The governance model matters.** Who can propose changes? Who approves them? Who maintains backwards compatibility? Answer these questions before you need to — not during a crisis.

Our system now covers 12 products, 3 platforms (web, iOS, Android), and has been running in production for 18 months without a breaking change.`,
    cat:'UI/UX', author:'Synnoviq Design', date:'May 18, 2025', read:'6 min',
    tags:['Design System','Figma','Tokens'],
  },
  {
    slug:'typescript-tips-2025',
    img:'https://miro.medium.com/v2/resize:fit:1100/format:webp/1*moJeTvW97yShLB7URRj5Kg.png',
    title:'TypeScript Tips That Will Change How You Code',
    subtitle:'Advanced patterns the docs never told you about.',
    excerpt:'After years of TypeScript in production, these patterns consistently surprise developers. Discriminated unions, template literal types, infer — here is how we actually use them.',
    fullContent:`Most TypeScript tutorials cover the basics. This is not that tutorial.

**1. Discriminated unions beat optional fields.** Instead of type Result = { data?: T; error?: string }, use type Result = { ok: true; data: T } | { ok: false; error: string }. Now TypeScript knows exactly which fields exist based on the ok flag.

**2. Template literal types for type-safe names.** type EventName = \`on\${Capitalize<string>}\` enforces naming conventions at the type level. No more typos in event handlers.

**3. Infer in conditional types.** type UnpackPromise<T> = T extends Promise<infer U> ? U : T. This pattern unlocks enormous power for library authors.

**4. const assertions for literal inference.** const config = { env: 'production' } as const means env is typed as the literal 'production', not string. This eliminates an entire class of runtime errors.

**5. Satisfies operator (TS 4.9+).** const palette = { red: [255,0,0] } satisfies Record<string, number[]>. You get type checking without widening — the object retains its literal types.

These five patterns will make your TypeScript more expressive, safer, and easier to read.`,
    cat:'Full Stack', author:'Synnoviq Engineering', date:'Jun 20, 2025', read:'8 min',
    tags:['TypeScript','Frontend','Patterns'],
  },
  {
    slug:'kubernetes-for-startups',
    img:'https://a.storyblok.com/f/153547/1024x768/c5b8195486/kqueen-open-source-multi-cloud-k8s-cluster-manager.jpg/m/2048x1536/filters:quality(70)',
    title:'Kubernetes for Startups',
    subtitle:"When you need it — and when you really don't.",
    excerpt:"Kubernetes is powerful, but it's not always the right tool. Here's a framework for deciding when to adopt it and how to do so without burning your team out.",
    fullContent:`The honest answer: most startups don't need Kubernetes. Yet.

Kubernetes solves real problems — horizontal scaling, self-healing infrastructure, declarative deployments. But it introduces real complexity: YAML configuration, cluster management, networking abstractions, and a steep learning curve.

**When you don't need Kubernetes:**
- Under 10 services
- Team smaller than 8 engineers
- No significant traffic spikes
- No dedicated DevOps/platform engineer

**When Kubernetes starts making sense:**
- 15+ microservices with independent scaling requirements
- Multiple teams deploying independently
- You're spending meaningful engineering time on deployment coordination
- You have or can hire a platform engineer

**The middle path:** Managed Kubernetes (GKE, EKS, AKS) dramatically reduces operational burden. If you're going to adopt K8s, use a managed offering. Building and running your own control plane is almost never worth it.

**Our recommendation:** Start with Railway, Render, or Fly.io. Migrate to managed Kubernetes when the pain of not having it is greater than the pain of adopting it. That moment is usually obvious when it arrives.`,
    cat:'DevOps', author:'Synnoviq DevOps', date:'Jun 1, 2025', read:'7 min',
    tags:['Kubernetes','DevOps','Cloud'],
  },
];

/* ═══════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════ */
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

function useInView(threshold=0.1) {
  const ref = useRef(null); const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if(e.isIntersecting){setVis(true);io.disconnect();} },{threshold});
    if(ref.current) io.observe(ref.current); return () => io.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ═══════════════════════════════════════════════════════
   GRAIN + PROGRESSBAR
═══════════════════════════════════════════════════════ */
function Grain() {
  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,pointerEvents:'none',opacity:.022}}>
      <svg width="100%" height="100%"><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#gr)"/></svg>
    </div>
  );
}
function ProgressBar() {
  const [p,setP]=useState(0);
  useEffect(()=>{
    const fn=()=>{const d=document.documentElement;setP(d.scrollTop/(d.scrollHeight-d.clientHeight));};
    window.addEventListener('scroll',fn,{passive:true}); return ()=>window.removeEventListener('scroll',fn);
  },[]);
  return <div style={{position:'fixed',top:0,left:0,right:0,height:3,zIndex:9999}}><div style={{height:'100%',background:'linear-gradient(90deg,#0057ff,#7c3aed,#db2777)',transformOrigin:'left',transform:`scaleX(${p})`,transition:'none',willChange:'transform'}}/></div>;
}

/* ═══════════════════════════════════════════════════════
   HERO — vivid, static height, NO disappearing content
═══════════════════════════════════════════════════════ */
const HERO_PREVIEWS = [
  { title:'Building Scalable REST APIs', cat:'Full Stack', col:'#0057ff', rgb:'0,87,255', img:'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=70', read:'5 min' },
  { title:'Unity vs. Unreal in 2025',    cat:'Game Dev',  col:'#7c3aed', rgb:'124,58,237', img:'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=70', read:'7 min' },
  { title:'5 UX Mistakes Killing Conversions', cat:'UI/UX', col:'#db2777', rgb:'219,39,119', img:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=70', read:'6 min' },
];

function Hero() {
  return (
    <section style={{position:'relative',minHeight:'100vh',overflow:'hidden',display:'flex',alignItems:'center'}}>

      {/* Vivid gradient BG */}
      <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#0d1b4b 0%,#1a0533 30%,#0a2a5c 60%,#0f1e3a 100%)'}}/>

      {/* Animated orbs */}
      <div style={{position:'absolute',top:'-15%',left:'55%',width:'70vw',height:'70vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(0,87,255,.45) 0%,transparent 65%)',pointerEvents:'none',animation:'floatA 8s ease-in-out infinite'}}/>
      <div style={{position:'absolute',bottom:'-20%',right:'60%',width:'55vw',height:'55vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,.35) 0%,transparent 65%)',pointerEvents:'none',animation:'floatB 10s ease-in-out infinite'}}/>
      <div style={{position:'absolute',top:'30%',left:'30%',width:'40vw',height:'40vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(219,39,119,.2) 0%,transparent 65%)',pointerEvents:'none',animation:'floatA 12s ease-in-out infinite reverse'}}/>

      {/* Fine grid */}
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',backgroundSize:'60px 60px',pointerEvents:'none'}}/>

      {/* Diagonal stripes */}
      <div style={{position:'absolute',top:0,right:'30%',width:2,height:'100%',background:'linear-gradient(to bottom,transparent,rgba(0,87,255,.4),transparent)',transform:'skewX(-20deg)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,right:'32%',width:1,height:'100%',background:'linear-gradient(to bottom,transparent,rgba(124,58,237,.25),transparent)',transform:'skewX(-20deg)',pointerEvents:'none'}}/>

      {/* Right side: floating article preview cards */}
      <div style={{position:'absolute',top:0,right:0,bottom:0,width:'44%',display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 32px',gap:14,pointerEvents:'none'}}>
        {HERO_PREVIEWS.map((p,i) => (
          <div key={i} style={{borderRadius:14,overflow:'hidden',border:`1px solid rgba(${p.rgb},.25)`,background:'rgba(255,255,255,.04)',backdropFilter:'blur(12px)',display:'flex',gap:0,animation:`floatIn .8s ${.2+i*.15}s both`,opacity:.88}}>
            <img src={p.img} alt="" style={{width:72,height:72,objectFit:'cover',filter:'saturate(.5) brightness(.5)',flexShrink:0}}/>
            <div style={{padding:'10px 14px',display:'flex',flexDirection:'column',justifyContent:'center',minWidth:0}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:p.col,flexShrink:0}}/>
                <span style={{fontSize:'.54rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:`rgba(${p.rgb},.9)`}}>{p.cat}</span>
                <span style={{fontSize:'.54rem',color:'rgba(255,255,255,.28)',marginLeft:'auto'}}>{p.read}</span>
              </div>
              <div style={{fontSize:'.78rem',fontWeight:700,color:'rgba(255,255,255,.82)',lineHeight:1.25,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.title}</div>
            </div>
          </div>
        ))}
        <div style={{opacity:.18,fontSize:'.58rem',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'#fff',textAlign:'center',paddingTop:6}}>10 Articles Available</div>
      </div>

      {/* Left content — full height, always visible */}
      <div style={{position:'relative',zIndex:1,padding:'100px clamp(28px,7vw,80px)',maxWidth:'58%'}}>

        {/* Eyebrow */}
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:28,animation:'slideUp .6s .05s both'}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:'#0057ff',boxShadow:'0 0 16px rgba(0,87,255,.9)',animation:'pulse 2s ease-in-out infinite'}}/>
          <span style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.26em',textTransform:'uppercase',color:'rgba(255,255,255,.55)'}}>Synnoviq Blog</span>
          <div style={{width:32,height:1,background:'rgba(255,255,255,.2)'}}/>
          <span style={{fontSize:'.62rem',fontWeight:700,letterSpacing:'.12em',color:'rgba(0,87,255,.8)'}}>10 Articles</span>
        </div>

        {/* Headline — always visible, no scroll-triggered opacity */}
        <div style={{overflow:'hidden',marginBottom:6}}>
          <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(3.2rem,9vw,8.5rem)',fontWeight:900,color:'#fff',letterSpacing:'-.055em',lineHeight:.88,margin:0,animation:'slideUp .75s .1s both'}}>Tech</h1>
        </div>
        <div style={{overflow:'hidden',marginBottom:6}}>
          <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(3.2rem,9vw,8.5rem)',fontWeight:900,letterSpacing:'-.055em',lineHeight:1.19,margin:0,animation:'slideUp .75s .18s both',background:'linear-gradient(90deg,#4d9fff,#a78bfa,#f472b6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Insights</h1>
        </div>
        <div style={{overflow:'hidden',marginBottom:36}}>
          <h1 style={{fontFamily:'var(--serif)',fontSize:'clamp(3.2rem,9vw,8.5rem)',fontWeight:900,letterSpacing:'-.055em',lineHeight:.88,margin:0,animation:'slideUp .75s .26s both',WebkitTextStroke:'1px rgba(255,255,255,.2)',color:'transparent'}}>&amp; Stories.</h1>
        </div>

        {/* Subtext */}
        <p style={{fontSize:'clamp(.88rem,1.3vw,.98rem)',color:'rgba(255,255,255,.46)',maxWidth:380,lineHeight:1.88,marginBottom:32,animation:'slideUp .7s .34s both'}}>
          Tutorials, deep-dives &amp; industry perspectives — written by engineers and designers at Synnoviq.
        </p>

        {/* Tech pills */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',animation:'slideUp .6s .44s both'}}>
          {['Node.js','React','Unity','DevOps','UI/UX','Figma'].map((t,i) => (
            <span key={t} style={{padding:'6px 14px',borderRadius:999,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.13)',fontSize:'.6rem',fontWeight:700,color:'rgba(255,255,255,.6)',letterSpacing:'.06em'}}>{t}</span>
          ))}
        </div>

        {/* Stats row */}
        <div style={{display:'flex',gap:36,marginTop:44,paddingTop:32,borderTop:'1px solid rgba(255,255,255,.08)',animation:'slideUp .6s .52s both'}}>
          {[['10+','Articles'],['6','Categories'],['2025','Latest']].map(([n,l]) => (
            <div key={l}>
              <div style={{fontFamily:'var(--serif)',fontSize:'clamp(1.4rem,2.5vw,1.9rem)',fontWeight:900,color:'#fff',letterSpacing:'-.04em',lineHeight:1}}>{n}</div>
              <div style={{fontSize:'.56rem',fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.26)',marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient to blend into content */}
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:120,background:'linear-gradient(to bottom,transparent,#020810)',pointerEvents:'none'}}/>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   EXPANDED MODAL — no routing, inline drawer
═══════════════════════════════════════════════════════ */
function PostModal({ post, onClose }) {
  const meta = CAT_META[post.cat] || { col:'#0057ff', rgb:'0,87,255', label:post.cat };
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    document.body.style.overflow = 'hidden';
    const onKey = e => { if(e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow=''; window.removeEventListener('keydown',onKey); };
  }, []);

  // parse basic bold markdown
  const renderContent = (text) =>
    text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} style={{height:14}}/>;
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} style={{margin:'0 0 4px',fontSize:'clamp(.9rem,1.3vw,.98rem)',color:'rgba(255,255,255,.62)',lineHeight:1.88}}>
          {parts.map((p,j) => j%2===1 ? <strong key={j} style={{color:'#fff',fontWeight:700}}>{p}</strong> : p)}
        </p>
      );
    });

  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:5000,background:'rgba(0,0,0,.75)',backdropFilter:'blur(8px)',display:'flex',alignItems:'flex-end',justifyContent:'center',opacity:mounted?1:0,transition:'opacity .3s ease'}}>
      <div onClick={e=>e.stopPropagation()}
        style={{width:'100%',maxWidth:820,maxHeight:'92vh',borderRadius:'24px 24px 0 0',overflow:'hidden',background:'#060f20',border:'1px solid rgba(255,255,255,.1)',borderBottom:'none',transform:mounted?'translateY(0)':'translateY(100%)',transition:'transform .45s cubic-bezier(.16,1,.3,1)',display:'flex',flexDirection:'column'}}>

        {/* Hero image */}
        <div style={{position:'relative',height:'clamp(180px,28vh,320px)',flexShrink:0,overflow:'hidden'}}>
          <img src={post.img} alt={post.title}
            style={{position:'absolute',inset:0,width:'100%',height:'115%',objectFit:'cover',filter:'saturate(.65) brightness(.5)'}}/>
          <div style={{position:'absolute',inset:0,background:`linear-gradient(135deg,rgba(${meta.rgb},.35) 0%,transparent 55%)`}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 40%,#060f20 100%)'}}/>
          {/* Close btn */}
          <button onClick={onClose} style={{position:'absolute',top:20,right:20,width:40,height:40,borderRadius:'50%',background:'rgba(0,0,0,.5)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,.15)',color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <X size={16}/>
          </button>
          {/* Cat badge */}
          <div style={{position:'absolute',bottom:20,left:24,padding:'6px 14px',borderRadius:999,background:`rgba(${meta.rgb},.22)`,backdropFilter:'blur(10px)',border:`1px solid rgba(${meta.rgb},.5)`,fontSize:'.6rem',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'#fff'}}>
            {meta.label}
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{overflowY:'auto',flex:1,padding:'32px clamp(20px,5vw,48px) 40px'}}>
          {/* Meta row */}
          <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap',marginBottom:20}}>
            <div style={{display:'flex',alignItems:'center',gap:5,color:'rgba(255,255,255,.35)',fontSize:'.72rem'}}>
              <User size={12}/><span>{post.author}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:5,color:'rgba(255,255,255,.35)',fontSize:'.72rem'}}>
              <Calendar size={12}/><span>{post.date}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:5,color:'rgba(255,255,255,.35)',fontSize:'.72rem'}}>
              <Clock size={12}/><span>{post.read} read</span>
            </div>
          </div>

          {/* Title */}
          <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.6rem,3.5vw,2.4rem)',fontWeight:900,color:'#fff',letterSpacing:'-.035em',lineHeight:1.08,marginBottom:8}}>
            {post.title}
          </h2>
          <p style={{fontSize:'clamp(.88rem,1.3vw,.98rem)',color:meta.col,fontWeight:600,marginBottom:24,letterSpacing:'-.01em'}}>
            {post.subtitle}
          </p>

          {/* Divider */}
          <div style={{height:1,background:`linear-gradient(to right,rgba(${meta.rgb},.4),transparent)`,marginBottom:28}}/>

          {/* Full content */}
          <div>{renderContent(post.fullContent)}</div>

          {/* Tags */}
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:32,paddingTop:24,borderTop:'1px solid rgba(255,255,255,.07)'}}>
            <Tag size={13} color="rgba(255,255,255,.25)" style={{marginTop:2}}/>
            {post.tags.map(t=>(
              <span key={t} style={{padding:'4px 12px',borderRadius:999,background:`rgba(${meta.rgb},.12)`,border:`1px solid rgba(${meta.rgb},.25)`,fontSize:'.65rem',fontWeight:700,color:'rgba(255,255,255,.55)',letterSpacing:'.06em'}}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   UNIQUE BLOG CARD — tilt + expand-on-click
═══════════════════════════════════════════════════════ */
function BlogCard({ post, i, onOpen }) {
  const [ref, vis] = useInView(0.08);
  const [hov, setHov] = useState(false);
  const meta = CAT_META[post.cat] || { col:'#0057ff', rgb:'0,87,255', label:post.cat };

  // Subtle tilt on mouse
  const [tilt, setTilt] = useState({ x:0, y:0 });
  const onMove = e => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - .5) * 10;
    const y = ((e.clientY - r.top)  / r.height - .5) * -10;
    setTilt({ x, y });
  };

  return (
    <article
      ref={ref}
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setTilt({x:0,y:0}); }}
      onMouseMove={onMove}
      style={{
        borderRadius:20, overflow:'hidden', cursor:'pointer',
        background:'linear-gradient(145deg,#0d1e3a,#060f20)',
        border: hov ? `1px solid rgba(${meta.rgb},.5)` : '1px solid rgba(255,255,255,.07)',
        boxShadow: hov ? `0 24px 60px rgba(0,0,0,.6),0 0 40px rgba(${meta.rgb},.18)` : '0 4px 24px rgba(0,0,0,.35)',
        transform: vis
          ? hov
            ? `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(-10px) translateZ(0)`
            : 'perspective(800px) rotateX(0) rotateY(0) translateY(0) translateZ(0)'
          : 'translateY(64px) translateZ(0)',
        opacity: vis ? 1 : 0,
        transition: vis
          ? hov
            ? 'box-shadow .25s ease, border-color .25s ease, transform .15s ease'
            : 'box-shadow .3s ease, border-color .3s ease, transform .5s cubic-bezier(.16,1,.3,1)'
          : `opacity .65s cubic-bezier(.16,1,.3,1) ${i*.1}s, transform .65s cubic-bezier(.16,1,.3,1) ${i*.1}s`,
        willChange:'opacity,transform',
        display:'flex', flexDirection:'column',
        position:'relative',
      }}
    >
      {/* Shimmer top border */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,rgba(${meta.rgb},.8),transparent)`,opacity:hov?1:0,transition:'opacity .3s ease'}}/>

      {/* Glow behind card on hover */}
      <div style={{position:'absolute',inset:-1,borderRadius:20,background:`radial-gradient(ellipse at 50% 0%,rgba(${meta.rgb},.15) 0%,transparent 65%)`,opacity:hov?1:0,transition:'opacity .4s ease',pointerEvents:'none'}}/>

      {/* Image with number overlay */}
      <div style={{position:'relative',height:200,overflow:'hidden',flexShrink:0}}>
        <img src={post.img} alt={post.title}
          style={{position:'absolute',inset:0,width:'100%',height:'116%',objectFit:'cover',filter:'saturate(.55) brightness(.45)',transform:hov?'scale(1.1) translateZ(0)':'scale(1) translateZ(0)',transition:'transform .8s cubic-bezier(.16,1,.3,1)',willChange:'transform'}}/>
        {/* Colour grade */}
        <div style={{position:'absolute',inset:0,background:`rgba(${meta.rgb},.22)`,mixBlendMode:'multiply',opacity:hov?.85:.4,transition:'opacity .4s ease'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 20%,#060f20 100%)'}}/>

        {/* Big number watermark */}
        <div style={{position:'absolute',bottom:-10,right:16,fontFamily:'var(--serif)',fontSize:'5.5rem',fontWeight:900,color:'rgba(255,255,255,.07)',lineHeight:1,pointerEvents:'none',userSelect:'none',letterSpacing:'-.06em'}}>
          {String(i+1).padStart(2,'0')}
        </div>

        {/* Category */}
        <div style={{position:'absolute',top:14,left:14,padding:'5px 12px',borderRadius:999,background:`rgba(${meta.rgb},.2)`,backdropFilter:'blur(10px)',border:`1px solid rgba(${meta.rgb},.45)`,fontSize:'.56rem',fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'#fff'}}>
          {meta.label}
        </div>

        {/* Read time */}
        <div style={{position:'absolute',top:14,right:14,display:'flex',alignItems:'center',gap:4,padding:'5px 9px',borderRadius:999,background:'rgba(0,0,0,.45)',backdropFilter:'blur(8px)'}}>
          <Clock size={9} color="rgba(255,255,255,.55)"/>
          <span style={{fontSize:'.56rem',fontWeight:600,color:'rgba(255,255,255,.55)'}}>{post.read}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{padding:'22px 22px 24px',flex:1,display:'flex',flexDirection:'column',position:'relative'}}>
        <div style={{fontSize:'.58rem',fontWeight:600,color:'rgba(255,255,255,.22)',letterSpacing:'.1em',marginBottom:10}}>{post.date}</div>

        <h3 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.05rem,1.6vw,1.25rem)',fontWeight:800,color:'#fff',letterSpacing:'-.025em',lineHeight:1.18,marginBottom:7}}>
          {post.title}
        </h3>

        <p style={{fontSize:'.78rem',color:meta.col,fontWeight:600,marginBottom:10,letterSpacing:'-.01em'}}>
          {post.subtitle}
        </p>

        <p style={{fontSize:'.84rem',color:'rgba(255,255,255,.42)',lineHeight:1.76,marginBottom:18,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',flex:1}}>
          {post.excerpt}
        </p>

        {/* Tag pills */}
        <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:18}}>
          {post.tags.slice(0,3).map(t=>(
            <span key={t} style={{padding:'3px 9px',borderRadius:999,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',fontSize:'.56rem',fontWeight:600,color:'rgba(255,255,255,.38)'}}>{t}</span>
          ))}
        </div>

        {/* Bottom */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:14}}>
          <span style={{fontSize:'.65rem',color:'rgba(255,255,255,.26)',fontWeight:500}}>{post.author}</span>
          <div style={{display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:10,background:hov?meta.col:'rgba(255,255,255,.07)',color:'#fff',fontSize:'.65rem',fontWeight:700,letterSpacing:'.04em',transition:'background .25s ease, transform .2s ease',transform:hov?'translateX(2px)':'none'}}>
            <Eye size={11}/> Read
          </div>
        </div>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════
   FEATURED CARD — wider, special treatment
═══════════════════════════════════════════════════════ */
function FeaturedCard({ post, onOpen }) {
  const [ref, vis] = useInView(0.1);
  const [hov, setHov] = useState(false);
  const meta = CAT_META[post.cat] || { col:'#0057ff', rgb:'0,87,255', label:post.cat };

  return (
    <div ref={ref} style={{opacity:vis?1:0,transform:vis?'none':'translateY(32px)',transition:'opacity .8s ease, transform .8s ease',marginBottom:32}}>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:20}}>
        <div style={{width:28,height:2,borderRadius:1,background:'#0057ff'}}/>
        <span style={{fontSize:'.6rem',fontWeight:700,letterSpacing:'.22em',textTransform:'uppercase',color:'rgba(255,255,255,.32)'}}>Featured Post</span>
      </div>

      <div onClick={onOpen} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} className="feat-grid"
        style={{display:'grid',borderRadius:22,overflow:'hidden',cursor:'pointer',border:`1px solid rgba(${meta.rgb},.22)`,boxShadow:hov?`0 40px 80px rgba(0,0,0,.65),0 0 0 1px rgba(${meta.rgb},.4)`:'0 16px 48px rgba(0,0,0,.4)',transition:'box-shadow .4s ease, transform .4s ease',transform:hov?'translateY(-4px)':'none',background:'#060f20'}}>

        {/* Image */}
        <div style={{position:'relative',overflow:'hidden',minHeight:320}}>
          <img src={post.img} alt={post.title}
            style={{position:'absolute',inset:0,width:'100%',height:'112%',objectFit:'cover',filter:'saturate(.7) brightness(.55)',transform:hov?'scale(1.06) translateZ(0)':'scale(1) translateZ(0)',transition:'transform .8s cubic-bezier(.16,1,.3,1)',willChange:'transform'}}/>
          <div style={{position:'absolute',inset:0,background:`linear-gradient(130deg,rgba(${meta.rgb},.28) 0%,transparent 55%)`}}/>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,transparent 55%,#060f20 100%)'}}/>
          <div style={{position:'absolute',top:20,left:20,padding:'6px 15px',borderRadius:999,background:`rgba(${meta.rgb},.22)`,backdropFilter:'blur(12px)',border:`1px solid rgba(${meta.rgb},.5)`,fontSize:'.6rem',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'#fff'}}>{meta.label}</div>
          <div style={{position:'absolute',bottom:20,left:20,fontSize:'.7rem',color:'rgba(255,255,255,.4)',fontWeight:600}}>{post.read} read · {post.date}</div>
        </div>

        {/* Text */}
        <div style={{padding:'clamp(28px,4vw,48px)',display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(1.6rem,2.8vw,2.4rem)',fontWeight:900,color:'#fff',letterSpacing:'-.035em',lineHeight:1.08,marginBottom:10}}>{post.title}</h2>
          <p style={{fontSize:'.88rem',color:meta.col,fontWeight:600,marginBottom:14}}>{post.subtitle}</p>
          <p style={{fontSize:'.9rem',color:'rgba(255,255,255,.48)',lineHeight:1.86,marginBottom:24}}>{post.excerpt}</p>
          <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:24}}>
            {post.tags.map(t=><span key={t} style={{padding:'4px 11px',borderRadius:999,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.09)',fontSize:'.6rem',fontWeight:600,color:'rgba(255,255,255,.42)'}}>{t}</span>)}
          </div>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'11px 22px',borderRadius:11,background:meta.col,color:'#fff',fontWeight:700,fontSize:'.82rem',alignSelf:'flex-start',boxShadow:`0 8px 22px rgba(${meta.rgb},.4)`,transform:hov?'translateX(4px)':'none',transition:'transform .3s ease'}}>
            <Eye size={13}/> Read Article <ChevronRight size={13}/>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TICKER
═══════════════════════════════════════════════════════ */
function Ticker() {
  const words = ['Full Stack','·','Game Dev','·','UI/UX Design','·','DevOps & Cloud','·','Careers','·','Company News','·'];
  return (
    <div style={{overflow:'hidden',background:'linear-gradient(90deg,#0057ff,#7c3aed)',padding:'13px 0',margin:'80px 0 0'}}>
      <div style={{display:'flex',gap:28,animation:'tickL 18s linear infinite',whiteSpace:'nowrap',willChange:'transform'}}>
        {[...words,...words,...words].map((w,i)=><span key={i} style={{fontSize:'.7rem',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.8)',flexShrink:0}}>{w}</span>)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NEWSLETTER — Real EmailJS integration
   ─────────────────────────────────────────────────────
   SETUP (one-time, ~3 minutes):
   1. Go to https://www.emailjs.com → sign up free
   2. Add Email Service → connect your Gmail/Outlook
      → copy the Service ID below
   3. Email Templates → Create Template
      → set Subject: "New subscriber: {{subscriber_email}}"
      → set Body:  "New blog subscriber: {{subscriber_email}}\nTime: {{time}}"
      → copy the Template ID below
   4. Account → API Keys → copy Public Key below
   5. Replace the 3 placeholder strings and you're live!
═══════════════════════════════════════════════════════ */

// ── REPLACE THESE 3 VALUES ──────────────────────────
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g. 'template_xyz789'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g. 'aBcDeFgHiJkLmNoP'
// ────────────────────────────────────────────────────

const EMAILJS_CONFIGURED =
  EMAILJS_SERVICE_ID  !== 'YOUR_SERVICE_ID' &&
  EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
  EMAILJS_PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY';

// Lazy-load EmailJS SDK from CDN (no npm install needed)
function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) { resolve(window.emailjs); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); resolve(window.emailjs); };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function Newsletter() {
  const [ref, vis] = useInView(0.15);
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState('idle'); // idle | loading | success | error | notConfigured
  const [errMsg, setErrMsg]   = useState('');

  const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleSubscribe = async () => {
    if (!email.trim()) return;
    if (!isValidEmail(email)) { setStatus('error'); setErrMsg('Please enter a valid email address.'); return; }

    if (!EMAILJS_CONFIGURED) { setStatus('notConfigured'); return; }

    setStatus('loading');
    try {
      const ejs = await loadEmailJS();
      await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        subscriber_email: email.trim(),
        time: new Date().toLocaleString('en-IN', { timeZone:'Asia/Kolkata' }),
        blog_name: 'Synnoviq Blog',
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrMsg('Something went wrong. Please try again.');
    }
  };

  const handleKey = e => { if (e.key === 'Enter') handleSubscribe(); };

  return (
    <section style={{background:'#020810',padding:'100px 0',position:'relative',overflow:'hidden',borderTop:'1px solid rgba(255,255,255,.05)'}}>
      {/* Glow */}
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'70vw',height:'50vw',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(0,87,255,.07) 0%,transparent 70%)',pointerEvents:'none'}}/>

      <div className="wrap" style={{position:'relative',zIndex:1}}>
        <div ref={ref} style={{maxWidth:580,margin:'0 auto',textAlign:'center',opacity:vis?1:0,transform:vis?'none':'translateY(32px)',transition:'opacity .8s ease,transform .8s ease'}}>

          {/* Badge */}
          <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'6px 14px',borderRadius:999,background:'rgba(0,87,255,.1)',border:'1px solid rgba(0,87,255,.28)',fontSize:'.6rem',fontWeight:700,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(90,168,255,.9)',marginBottom:20}}>
            <Rss size={10}/> Stay Updated
          </div>

          {/* Headline */}
          <h2 style={{fontFamily:'var(--serif)',fontSize:'clamp(2rem,5vw,3.2rem)',fontWeight:900,color:'#fff',letterSpacing:'-.04em',lineHeight:1.05,marginBottom:12}}>
            Never miss a <span style={{color:'#5aa8ff',fontStyle:'italic'}}>post.</span>
          </h2>
          <p style={{fontSize:'.9rem',color:'rgba(255,255,255,.38)',lineHeight:1.85,marginBottom:30}}>
            Tutorials, case studies, and insights — straight to your inbox. No spam.
          </p>

          {/* ── SUCCESS STATE ── */}
          {status === 'success' && (
            <div style={{display:'inline-flex',flexDirection:'column',alignItems:'center',gap:10,padding:'20px 32px',borderRadius:16,background:'rgba(5,150,105,.12)',border:'1px solid rgba(5,150,105,.35)'}}>
              <div style={{width:44,height:44,borderRadius:'50%',background:'rgba(5,150,105,.2)',border:'1px solid rgba(5,150,105,.5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem'}}>✓</div>
              <div style={{color:'#34d399',fontWeight:700,fontSize:'1rem'}}>You&#39;re subscribed!</div>
              <div style={{color:'rgba(52,211,153,.65)',fontSize:'.82rem'}}>We&#39;ll send you the next post at <strong style={{color:'#34d399'}}>{email}</strong></div>
            </div>
          )}

          {/* ── NOT CONFIGURED WARNING ── */}
          {status === 'notConfigured' && (
            <div style={{padding:'18px 24px',borderRadius:14,background:'rgba(217,119,6,.1)',border:'1px solid rgba(217,119,6,.35)',textAlign:'left'}}>
              <div style={{color:'#fbbf24',fontWeight:700,fontSize:'.88rem',marginBottom:8}}>⚙ EmailJS not configured yet</div>
              <div style={{color:'rgba(251,191,36,.65)',fontSize:'.78rem',lineHeight:1.7}}>
                Open <code style={{background:'rgba(255,255,255,.08)',padding:'1px 6px',borderRadius:4}}>Blog.jsx</code> and replace the 3 constants at the top of the Newsletter section:<br/>
                <code style={{background:'rgba(255,255,255,.08)',padding:'1px 6px',borderRadius:4,display:'inline-block',marginTop:4}}>EMAILJS_SERVICE_ID</code> &nbsp;
                <code style={{background:'rgba(255,255,255,.08)',padding:'1px 6px',borderRadius:4}}>EMAILJS_TEMPLATE_ID</code> &nbsp;
                <code style={{background:'rgba(255,255,255,.08)',padding:'1px 6px',borderRadius:4}}>EMAILJS_PUBLIC_KEY</code>
              </div>
            </div>
          )}

          {/* ── INPUT FORM (idle / loading / error) ── */}
          {(status === 'idle' || status === 'loading' || status === 'error') && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,maxWidth:440,margin:'0 auto'}}>
              <div style={{display:'flex',gap:9,width:'100%'}}>
                <input
                  value={email}
                  onChange={e => { setEmail(e.target.value); if(status==='error') setStatus('idle'); }}
                  onKeyDown={handleKey}
                  placeholder="your@email.com"
                  disabled={status==='loading'}
                  style={{flex:1,padding:'13px 16px',borderRadius:11,background:'rgba(255,255,255,.07)',border: status==='error'?'1px solid rgba(239,68,68,.6)':'1px solid rgba(255,255,255,.11)',color:'#fff',fontSize:'.84rem',outline:'none',fontFamily:'var(--sans)',transition:'border-color .2s ease',opacity:status==='loading'?.6:1}}
                />
                <button
                  onClick={handleSubscribe}
                  disabled={status==='loading'}
                  style={{padding:'13px 22px',borderRadius:11,background: status==='loading'?'#0044cc':'#0057ff',color:'#fff',fontWeight:700,fontSize:'.84rem',border:'none',cursor:status==='loading'?'not-allowed':'pointer',whiteSpace:'nowrap',boxShadow:'0 6px 20px rgba(0,87,255,.4)',fontFamily:'var(--sans)',transition:'all .2s ease',display:'flex',alignItems:'center',gap:8,minWidth:110,justifyContent:'center'}}
                  onMouseEnter={e=>{ if(status!=='loading'){e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 10px 28px rgba(0,87,255,.58)';} }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='0 6px 20px rgba(0,87,255,.4)'; }}
                >
                  {status === 'loading' ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{animation:'spin .8s linear infinite'}}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                      Sending…
                    </>
                  ) : 'Subscribe'}
                </button>
              </div>

              {/* Error message */}
              {status === 'error' && (
                <div style={{display:'flex',alignItems:'center',gap:7,color:'rgba(239,68,68,.85)',fontSize:'.76rem',fontWeight:600,alignSelf:'flex-start'}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {errMsg}
                </div>
              )}

              {/* Privacy note */}
              <p style={{fontSize:'.62rem',color:'rgba(255,255,255,.2)',margin:0}}>
                🔒 Your email is safe. We never share it with anyone.
              </p>
            </div>
          )}

        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════ */
export default function Blog() {
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [openPost, setOpenPost] = useState(null);
  const [catRef, catVis] = useInView(0.05);

  const featured = POSTS.find(p => p.featured);
  const rest = POSTS.filter(p => {
    const matchCat = activeCat === 'All' || p.cat === activeCat;
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
    return matchCat && matchSearch && !p.featured;
  });

  return (
    <div style={{background:'#020810',minHeight:'100vh',marginTop:'-68px'}}>
      <Grain/>
      <ProgressBar/>
      <Hero/>

      {/* Sticky filter */}
      <div style={{background:'rgba(2,8,16,.92)',position:'sticky',top:0,zIndex:50,borderBottom:'1px solid rgba(255,255,255,.06)',backdropFilter:'blur(20px)'}}>
        <div className="wrap" style={{paddingTop:0,paddingBottom:0}}>
          <div ref={catRef} style={{display:'flex',alignItems:'center',overflowX:'auto',scrollbarWidth:'none',padding:'14px 0',gap:0,opacity:catVis?1:0,transform:catVis?'none':'translateY(-8px)',transition:'opacity .5s ease,transform .5s ease'}}>
            <div style={{display:'flex',alignItems:'center',gap:7,padding:'7px 12px',borderRadius:9,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.09)',marginRight:12,flexShrink:0}}>
              <Search size={12} color="rgba(255,255,255,.38)"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…"
                style={{background:'transparent',border:'none',outline:'none',color:'#fff',fontSize:'.74rem',width:100,fontFamily:'var(--sans)'}}/>
            </div>
            <div style={{width:1,height:16,background:'rgba(255,255,255,.09)',marginRight:12,flexShrink:0}}/>
            <div style={{display:'flex',gap:5,flexShrink:0}}>
              {CATS.map(c=>{
                const m=CAT_META[c]; const isA=activeCat===c;
                return <button key={c} onClick={()=>setActiveCat(c)} style={{padding:'6px 13px',borderRadius:999,border:'none',cursor:'pointer',background:isA?(m?m.col:'rgba(255,255,255,.9)'):'rgba(255,255,255,.06)',color:isA?'#fff':'rgba(255,255,255,.45)',fontSize:'.68rem',fontWeight:700,letterSpacing:'.04em',transition:'all .2s ease',whiteSpace:'nowrap',fontFamily:'var(--sans)',boxShadow:isA&&m?`0 4px 12px rgba(${m.rgb},.38)`:'none'}}>{c}</button>;
              })}
            </div>
            <div style={{marginLeft:'auto',fontSize:'.6rem',fontWeight:600,color:'rgba(255,255,255,.2)',whiteSpace:'nowrap',paddingLeft:12,flexShrink:0}}>{rest.length} post{rest.length!==1?'s':''}</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section style={{background:'#020810',padding:'64px 0 100px'}}>
        <div className="wrap">
          {/* Featured */}
          {(activeCat === 'All' || activeCat === 'Full Stack') && !search && (
            <FeaturedCard post={featured} onOpen={()=>setOpenPost(featured)}/>
          )}
          {/* Grid */}
          {rest.length > 0 ? (
            <div className="blog-grid">
              {rest.map((post,i)=><BlogCard key={post.slug} post={post} i={i} onOpen={()=>setOpenPost(post)}/>)}
            </div>
          ) : (
            <div style={{textAlign:'center',padding:'80px 0'}}>
              <BookOpen size={36} color="rgba(255,255,255,.1)" style={{marginBottom:16}}/>
              <p style={{color:'rgba(255,255,255,.28)',fontSize:'.95rem'}}>No posts found.</p>
            </div>
          )}
        </div>
      </section>

      <Ticker/>
      <Newsletter/>

      {/* Post modal */}
      {openPost && <PostModal post={openPost} onClose={()=>setOpenPost(null)}/>}

      <style>{`
        @keyframes slideUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes floatIn  { from{opacity:0;transform:translateX(32px)} to{opacity:.88;transform:none} }
        @keyframes tickL    { from{transform:translateX(0)} to{transform:translateX(-33.33%)} }
        @keyframes lineP    { 0%,100%{opacity:.25} 50%{opacity:.65} }
        @keyframes floatA   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.04)} }
        @keyframes floatB   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(20px) scale(.97)} }
        @keyframes pulse    { 0%,100%{box-shadow:0 0 16px rgba(0,87,255,.9)} 50%{box-shadow:0 0 28px rgba(0,87,255,1),0 0 48px rgba(0,87,255,.5)} }
        .blog-grid{display:grid;grid-template-columns:1fr;gap:22px;}
        @media(min-width:560px){.blog-grid{grid-template-columns:repeat(2,1fr);}}
        @media(min-width:900px){.blog-grid{grid-template-columns:repeat(3,1fr);}}
        .feat-grid{grid-template-columns:1fr!important;}
        @media(min-width:720px){.feat-grid{grid-template-columns:1fr 1fr!important;}}
        @media(max-width:700px){.hero-previews{display:none!important;} .hero-left{max-width:100%!important;padding-right:28px!important;}}
        input::placeholder{color:rgba(255,255,255,.28);}
        ::-webkit-scrollbar{display:none;}
      `}</style>
    </div>
  );
}
