/* ============================================
   OMKAR PATHARE — PORTFOLIO SCRIPTS
   ============================================ */

/* ── CANVAS BACKGROUND: SPEED STREAKS + DOTS ── */
(function () {
  const cv = document.getElementById('bg-canvas');
  if (!cv) return;
  const cx = cv.getContext('2d');
  let W, H;
  const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  const streaks = Array.from({ length: 60 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    len: Math.random() * 90 + 20,
    speed: Math.random() * 4.5 + 1,
    opacity: Math.random() * .18 + .04,
    w: Math.random() * 1.4 + .3,
    color: Math.random() < .18 ? '#e8002d' : (Math.random() < .12 ? '#ffd700' : '#383835')
  }));

  const dots = Array.from({ length: 35 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * .25,
    vy: (Math.random() - .5) * .25,
    r: Math.random() * 1.1 + .3,
    opacity: Math.random() * .12 + .04,
    color: Math.random() < .2 ? '#e8002d' : '#333330'
  }));

  function frame() {
    cx.clearRect(0, 0, W, H);

    // Diagonal carbon-fiber lines
    cx.save();
    cx.globalAlpha = .02;
    cx.strokeStyle = '#666';
    cx.lineWidth = .5;
    for (let x = -H; x < W + H; x += 18) {
      cx.beginPath(); cx.moveTo(x, 0); cx.lineTo(x + H, H); cx.stroke();
    }
    cx.restore();

    // Horizontal speed streaks
    streaks.forEach(s => {
      cx.save();
      cx.globalAlpha = s.opacity;
      const g = cx.createLinearGradient(s.x - s.len, s.y, s.x, s.y);
      g.addColorStop(0, 'transparent');
      g.addColorStop(1, s.color);
      cx.strokeStyle = g;
      cx.lineWidth = s.w;
      cx.beginPath(); cx.moveTo(s.x - s.len, s.y); cx.lineTo(s.x, s.y); cx.stroke();
      cx.restore();
      s.x += s.speed;
      if (s.x > W + 100) { s.x = -s.len; s.y = Math.random() * H; }
    });

    // Floating dots
    dots.forEach(d => {
      cx.save();
      cx.globalAlpha = d.opacity;
      cx.fillStyle = d.color;
      cx.beginPath(); cx.arc(d.x, d.y, d.r, 0, Math.PI * 2); cx.fill();
      cx.restore();
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
      if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
    });

    requestAnimationFrame(frame);
  }
  frame();
})();

/* ── TYPING ANIMATION ── */
(function () {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const titles = ['Data Scientist', 'ML Engineer', 'NLP Researcher', 'AI Builder', 'Big Data Engineer'];
  let ti = 0, ci = 0, del = false;

  function tick() {
    const cur = titles[ti];
    if (!del) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; setTimeout(tick, 2000); return; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; ti = (ti + 1) % titles.length; setTimeout(tick, 300); return; }
    }
    setTimeout(tick, del ? 45 : 85);
  }
  tick();
})();

/* ── MOBILE NAV TOGGLE ── */
(function () {
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
})();

/* ── SCROLL REVEAL ── */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), +e.target.dataset.delay || 0);
        io.unobserve(e.target);
      }
    });
  }, { threshold: .1 });

  document.querySelectorAll(
    '.reveal, .h-card, .skill-group, .timeline-item, .edu-card, .project-card, .pub-card, .contact-item, .cert-card'
  ).forEach((el, i) => {
    if (!el.classList.contains('reveal')) el.dataset.delay = (i % 5) * 70;
    io.observe(el);
  });

  // Skill bar fill on scroll
  const barIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(b => b.style.width = b.dataset.width + '%');
        barIO.unobserve(e.target);
      }
    });
  }, { threshold: .3 });
  document.querySelectorAll('.skill-group').forEach(g => barIO.observe(g));
})();

/* ── STAT COUNTERS ── */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.counter').forEach(el => {
          const target = +el.dataset.target;
          const step   = target / 40;
          let cur = 0;
          const tm = setInterval(() => {
            cur = Math.min(cur + step, target);
            el.textContent = Math.floor(cur);
            if (cur >= target) clearInterval(tm);
          }, 28);
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: .5 });
  const stats = document.querySelector('.hero-stats');
  if (stats) io.observe(stats);
})();

/* ── ACTIVE NAV HIGHLIGHT ON SCROLL ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  });
})();

/* ── INTERACTIVE TERMINAL ── */
(function () {
  const out = document.getElementById('terminal-output');
  const inp = document.getElementById('terminal-input');
  if (!out || !inp) return;

  const cmds = {
    help: () => [
      '<span class="r">╔═ AVAILABLE COMMANDS ═╗</span>',
      '  <span class="g">about</span>    — who is Omkar?',
      '  <span class="g">skills</span>   — full tech stack',
      '  <span class="g">certs</span>    — certifications',
      '  <span class="g">projects</span> — top projects',
      '  <span class="g">contact</span>  — reach out',
      '  <span class="g">edu</span>      — education',
      '  <span class="g">clear</span>    — clear screen',
    ],
    about: () => [
      '<span class="r">// Omkar Shashank Pathare</span>',
      'MS Data Science @ Stevens Institute of Tech.',
      'Building ML solutions that move the needle.',
      'LLMs · Recommender Systems · MLOps · NLP',
      'Seeking full-time DS/ML roles — May 2026.',
    ],
    skills: () => [
      '<span class="r">STACK:</span>',
      '<span class="g">Languages:</span>  Python · R · SQL',
      '<span class="g">ML:</span>         Scikit-learn · TF · HuggingFace',
      '<span class="g">Cloud:</span>      Azure · AWS · Docker',
      '<span class="g">BI:</span>         Tableau · Power BI',
      '<span class="g">Big Data:</span>   Spark · Data Engineering',
    ],
    certs: () => [
      '<span class="r">CERTIFICATIONS:</span>',
      '<span class="g">✓</span> Apache Spark Developer — Databricks',
      '<span class="g">✓</span> AWS Cloud Practitioner — Amazon',
      '<span class="g">✓</span> Google Data Analytics — Google',
    ],
    projects: () => [
      '<span class="r">TOP PROJECTS:</span>',
      '<span class="g">1.</span> Drawing w/ LLM — Qwen-7B QLoRA',
      '<span class="g">2.</span> Job Recommender — +17% precision',
      '<span class="g">3.</span> Credit Default — 0.88 AUC via PCA',
      '<span class="g">4.</span> Airbnb Spark ETL — 80% runtime reduction',
      '<span class="g">5.</span> Azure Image Platform — MLOps pipeline',
    ],
    contact: () => [
      '<span class="r">CONTACT:</span>',
      '<span class="g">Email:</span>    opathare@stevens.edu',
      '<span class="g">Phone:</span>    +1 (201) 589-3135',
      '<span class="g">Location:</span> Jersey City, NJ, USA',
      '<span class="g">LinkedIn:</span> linkedin.com/in/omkar-pathare-337a59234',
      '<span class="g">GitHub:</span>   github.com/coderx-com',
    ],
    edu: () => [
      '<span class="r">EDUCATION:</span>',
      '<span class="g">MS Data Science</span>',
      '  Stevens Institute of Technology',
      '  Expected May 2026',
      '<span class="g">BE AI & Data Science — Distinction</span>',
      '  Thadomal Shahani Eng. College',
      '  June 2024',
    ],
    clear: () => null,
  };

  function addLine(html) {
    const d = document.createElement('div');
    d.className = 't-out';
    d.innerHTML = html;
    out.appendChild(d);
    out.scrollTop = out.scrollHeight;
  }

  inp.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const cmd = inp.value.trim().toLowerCase();
    inp.value = '';
    if (!cmd) return;

    addLine(`<span style="color:var(--red)">omkar@portfolio:~$</span> ${cmd}`);

    if (cmd === 'clear') { out.innerHTML = ''; return; }

    const fn = cmds[cmd];
    if (fn) {
      fn().forEach(l => addLine(l));
    } else {
      addLine(`<span class="o">command not found: ${cmd}</span>`);
      addLine('Type <span class="g">help</span> for available commands.');
    }
  });

  // Focus on terminal click
  document.querySelector('.mini-terminal')?.addEventListener('click', () => inp.focus());
})();
