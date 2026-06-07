/**
 * Limitless — main.js
 * Page loader · Scroll progress · Nav · Particle canvas · Typewriter
 * Preview tabs · Carousel · FAQ accordion · Contact form · Reveal animations
 */

/* ── PAGE LOADER ─────────────────────────────────────────────────────────── */
// Always dismiss the loader — guaranteed, never blank
setTimeout(() => {
  const loader = document.getElementById('page-loader');
  if (loader) loader.classList.add('hidden');
}, 800);
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) loader.classList.add('hidden');
});

/* ── SCROLL PROGRESS BAR ─────────────────────────────────────────────────── */
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (!scrollBar) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

/* ── NAV: scrolled state ─────────────────────────────────────────────────── */
const nav = document.getElementById('main-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── MOBILE HAMBURGER ────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

/* ── ANNOUNCEMENT BAR ────────────────────────────────────────────────────── */
const closeAnnounce = document.getElementById('close-announce');
const announceBar   = document.getElementById('announce-bar');
if (closeAnnounce && announceBar) {
  closeAnnounce.addEventListener('click', () => {
    announceBar.style.display = 'none';
  });
}

/* ── SCROLL-REVEAL ───────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

/* ── PROGRESS BARS ───────────────────────────────────────────────────────── */
document.querySelectorAll('.progress-bar').forEach(bar => {
  const fill = bar.querySelector('.progress-fill');
  if (!fill) return;
  const orig = fill.style.width;
  fill.style.width = '0%';
  const ob = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { setTimeout(() => fill.style.width = orig, 120); ob.unobserve(bar); }
  }, { threshold: 0.5 });
  ob.observe(bar);
});

/* ── HERO PARTICLE CANVAS ────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); spawnParticles(); }, { passive: true });

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  const COLORS = ['rgba(139,92,246,', 'rgba(99,102,241,', 'rgba(34,211,238,', 'rgba(168,139,250,'];

  function spawnParticles() {
    particles = [];
    const count = Math.min(60, Math.floor(W * H / 18000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: randBetween(0, W), y: randBetween(0, H),
        r: randBetween(1, 2.8),
        vx: randBetween(-0.25, 0.25), vy: randBetween(-0.35, -0.1),
        alpha: randBetween(0.2, 0.7),
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
  }
  spawnParticles();

  let mouseX = W / 2, mouseY = H / 2;
  canvas.parentElement?.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      const dx = mouseX - p.x, dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 250) {
        p.vx += dx / dist * 0.008;
        p.vy += dy / dist * 0.008;
      }
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.8) { p.vx /= speed * 1.2; p.vy /= speed * 1.2; }

      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { p.y = H + 10; p.x = randBetween(0, W); }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── TYPEWRITER EFFECT ───────────────────────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typed-word');
  if (!el) return;
  const words = ['Building Discipline.', 'Earning XP Daily.', 'Leveling Up Fast.', 'Becoming Limitless.'];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 2200); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(type, 300); return; }
    }
    setTimeout(type, deleting ? 45 : 80);
  }
  setTimeout(type, 1200);
})();

/* ── INTERACTIVE DASHBOARD PREVIEW TABS ─────────────────────────────────── */
(function initPreviewTabs() {
  const tabs = document.querySelectorAll('.preview-tab');
  const panels = document.querySelectorAll('.preview-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + tab.dataset.panel);
      if (panel) panel.classList.add('active');
    });
  });

  ['demo-task-1', 'demo-task-2'].forEach(id => {
    const task = document.getElementById(id);
    if (!task) return;
    task.addEventListener('click', () => {
      task.classList.toggle('done');
      const xp = task.querySelector('.task-xp');
      if (xp) {
        xp.style.background = 'rgba(52,211,153,0.25)';
        xp.style.color = '#34d399';
        setTimeout(() => { xp.style.background = ''; xp.style.color = ''; }, 600);
      }
    });
  });
})();

/* ── TESTIMONIALS CAROUSEL ───────────────────────────────────────────────── */
(function initCarousel() {
  const track = document.getElementById('testimonials-track');
  const dots  = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  if (!track || !dots.length) return;

  let current = 0;
  const cards = track.querySelectorAll('.testimonial-card');
  const total = Math.max(cards.length - 2, 1);

  function goTo(index) {
    current = Math.max(0, Math.min(index, total - 1));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  let autoTimer = setInterval(() => goTo((current + 1) % total), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => { autoTimer = setInterval(() => goTo((current + 1) % total), 5000); });

  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  window.addEventListener('resize', () => goTo(current));
})();

/* ── STAT COUNTER ANIMATION ──────────────────────────────────────────────── */
document.querySelectorAll('.stat-num[data-count]').forEach(el => {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const ob = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    ob.unobserve(el);
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(start + (target - start) * eased);
      el.textContent = val >= 1000 ? (val / 1000).toFixed(0) + 'K' + suffix.replace(/K.*/, '') : val + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, { threshold: 0.5 });
  ob.observe(el);
});

/* ── FAQ ACCORDION ───────────────────────────────────────────────────────── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── CONTACT FORM ────────────────────────────────────────────────────────── */
const contactForm    = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');
const contactWrapper = document.getElementById('contact-form-wrapper');
const submitBtn      = document.getElementById('contact-submit');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('contact-name')?.value.trim();
    const email   = document.getElementById('contact-email')?.value.trim();
    const topic   = document.getElementById('contact-topic')?.value;
    const message = document.getElementById('contact-message')?.value.trim();

    if (!name || !email || !topic || !message) {
      [document.getElementById('contact-name'), document.getElementById('contact-email'),
       document.getElementById('contact-topic'), document.getElementById('contact-message')]
        .forEach(el => { if (el && !el.value.trim()) { el.style.borderColor = '#f87171'; setTimeout(() => el.style.borderColor = '', 2000); } });
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<div style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite"></div> Sending...';
    }
    setTimeout(() => {
      if (contactWrapper) contactWrapper.style.display = 'none';
      if (contactSuccess) contactSuccess.classList.add('visible');
    }, 1400);
  });
}

/* ── CURSOR GLOW ─────────────────────────────────────────────────────────── */
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = 'position:fixed;pointer-events:none;z-index:9998;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.055) 0%,transparent 70%);transform:translate(-50%,-50%);transition:opacity 0.4s;mix-blend-mode:screen;opacity:0';
  document.body.appendChild(glow);
  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; glow.style.opacity = '1'; }, { passive: true });
  document.addEventListener('mouseleave', () => glow.style.opacity = '0');
  function animate() { gx += (mx - gx) * 0.07; gy += (my - gy) * 0.07; glow.style.left = gx + 'px'; glow.style.top = gy + 'px'; requestAnimationFrame(animate); }
  animate();
})();

/* ── SPIN KEYFRAME ───────────────────────────────────────────────────────── */
const styleEl = document.createElement('style');
styleEl.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(styleEl);
