/* ── CUSTOM CURSOR ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
(function cursorLoop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(cursorLoop);})();
document.querySelectorAll('a,button,[class*="card"],[class*="btn"]').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.width='52px';ring.style.height='52px';ring.style.borderColor='rgba(0,232,127,.7)';});
  el.addEventListener('mouseleave',()=>{ring.style.width='32px';ring.style.height='32px';ring.style.borderColor='rgba(0,232,127,.4)';});
});

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>60));

/* ── HERO CANVAS — NEURAL NETWORK ── */
(function(){
  const cv=document.getElementById('hero-canvas');
  const cx=cv.getContext('2d');
  let W,H;
  const resize=()=>{W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;};
  resize();window.addEventListener('resize',resize);

  // Nodes
  const NODES=Array.from({length:70},()=>({
    x:Math.random()*100,y:Math.random()*100,
    vx:(Math.random()-.5)*.08,vy:(Math.random()-.5)*.08,
    r:Math.random()*2+.5,
    pulse:Math.random()*Math.PI*2,
    isAccent:Math.random()<.12
  }));

  function frame(){
    cx.clearRect(0,0,W,H);
    const t=Date.now()/1000;

    // Draw connections
    for(let i=0;i<NODES.length;i++){
      const a=NODES[i];
      const ax=a.x/100*W, ay=a.y/100*H;
      for(let j=i+1;j<NODES.length;j++){
        const b=NODES[j];
        const bx=b.x/100*W, by=b.y/100*H;
        const d=Math.hypot(ax-bx,ay-by);
        if(d<W*.18){
          const alpha=(1-d/(W*.18))*.18;
          cx.beginPath();
          cx.strokeStyle=`rgba(0,232,127,${alpha})`;
          cx.lineWidth=.5;
          cx.moveTo(ax,ay);cx.lineTo(bx,by);cx.stroke();
        }
      }
    }

    // Draw nodes
    NODES.forEach(n=>{
      const x=n.x/100*W,y=n.y/100*H;
      const pulsed=n.r+(Math.sin(t*2+n.pulse)*.6);
      cx.beginPath();
      if(n.isAccent){
        cx.arc(x,y,pulsed+2,0,Math.PI*2);
        cx.fillStyle='rgba(0,232,127,.08)';cx.fill();
        cx.beginPath();cx.arc(x,y,pulsed,0,Math.PI*2);
        cx.fillStyle='rgba(0,232,127,.9)';cx.fill();
      } else {
        cx.arc(x,y,pulsed,0,Math.PI*2);
        cx.fillStyle='rgba(255,255,255,.25)';cx.fill();
      }
      n.x+=n.vx;n.y+=n.vy;
      if(n.x<0||n.x>100)n.vx*=-1;
      if(n.y<0||n.y>100)n.vy*=-1;
    });
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ── SCROLL REVEAL ── */
(function(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('visible'),+e.target.dataset.delay||0);
        io.unobserve(e.target);
      }
    });
  },{threshold:.1});

  document.querySelectorAll('.project-item,.stat-block,.cert-block,.exp-item,.edu-card,.pub-card').forEach((el,i)=>{
    el.dataset.delay=(i%4)*80;
    io.observe(el);
  });

  // Skill bars
  const barIO=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.querySelectorAll('.bar-fill').forEach(b=>{b.style.width=b.dataset.width+'%';});
        barIO.unobserve(e.target);
      }
    });
  },{threshold:.3});
  document.querySelectorAll('.skill-category').forEach(g=>barIO.observe(g));
})();

/* ── SMOOTH NAV SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});