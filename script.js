// Utility: qs / qsa
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Theme toggle with localStorage persistence
const themeToggle = () => {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('nf-theme', next);
};

const initTheme = () => {
  const saved = localStorage.getItem('nf-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
};

// Mobile nav toggle
const initMobileNav = () => {
  const toggle = qs('#mobileMenuToggle');
  const nav = qs('#siteNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.style.display === 'flex';
    nav.style.display = isOpen ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.gap = '6px';
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
  const syncOnResize = () => {
    if (window.innerWidth > 860) {
      nav.style.display = '';
      toggle.setAttribute('aria-expanded', 'false');
    }
  };
  window.addEventListener('resize', syncOnResize);
  // Close menu when clicking a link (mobile)
  qsa('#siteNav a').forEach((a) => a.addEventListener('click', () => {
    if (window.innerWidth <= 860) {
      nav.style.display = 'none';
      toggle.setAttribute('aria-expanded', 'false');
    }
  }));
};

// IntersectionObserver for reveal on scroll
const initReveal = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.12 });
  qsa('.reveal').forEach((el) => observer.observe(el));
};

// Particle background canvas
const initParticles = () => {
  const canvas = qs('#particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles, rafId;

  const DPR = Math.min(2, window.devicePixelRatio || 1);

  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * DPR);
    canvas.height = Math.floor(height * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    createParticles();
  };

  const createParticles = () => {
    const count = Math.floor((width * height) / 24000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.4,
      hue: Math.random() * 60 + 180,
    }));
  };

  const step = () => {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, 0.5)`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Connect near particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120) {
          const alpha = 1 - d2 / (120 * 120);
          ctx.strokeStyle = `rgba(110,231,255,${alpha * 0.25})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    rafId = requestAnimationFrame(step);
  };

  resize();
  step();
  window.addEventListener('resize', () => { cancelAnimationFrame(rafId); resize(); step(); });
};

// Tilt effect for [data-tilt]
const initTilt = () => {
  const els = qsa('[data-tilt]');
  els.forEach((el) => {
    const height = el.clientHeight;
    const width = el.clientWidth;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y - height / 2) / height) * -10;
      const ry = ((x - width / 2) / width) * 10;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
    };
    const reset = () => {
      el.style.transform = 'perspective(900px) translateZ(0)';
    };
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', reset);
  });
};

// Comparison slider
const initComparison = () => {
  const range = qs('#compareRange');
  const overlay = qs('#comparisonOverlay');
  if (!range || !overlay) return;
  const update = () => {
    overlay.style.width = `${range.value}%`;
  };
  range.addEventListener('input', update);
  update();
};

// Chat modal with mock responses
const chatState = { open: false };
const openModal = (id) => { const m = qs(`#${id}`); if (!m) return; m.hidden = false; m.querySelector('input, textarea, button, [tabindex]')?.focus(); };
const closeModal = (id) => { const m = qs(`#${id}`); if (!m) return; m.hidden = true; };

const initChat = () => {
  const openButtons = [qs('#openChat'), qs('#heroChat')].filter(Boolean);
  const modal = qs('#chatModal');
  const messages = qs('#chatMessages');
  const form = qs('#chatForm');
  const input = qs('#chatInput');
  if (!modal || !messages || !form || !input) return;

  const appendBubble = (text, who = 'ai') => {
    const el = document.createElement('div');
    el.className = `chat__bubble chat__bubble--${who}`;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  };

  openButtons.forEach((btn) => btn.addEventListener('click', () => {
    openModal('chatModal');
    if (!chatState.open) {
      messages.innerHTML = '';
      appendBubble('Hi, I am your NeuroFlow AI companion. How are you feeling today?');
      chatState.open = true;
    }
  }));

  qsa('[data-close="chatModal"]').forEach((btn) => btn.addEventListener('click', () => { closeModal('chatModal'); }));
  // Click outside to close
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal('chatModal'); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    appendBubble(val, 'user');
    input.value = '';
    setTimeout(() => {
      const reply = generateMockReply(val);
      appendBubble(reply, 'ai');
    }, 500 + Math.random() * 500);
  });
};

const generateMockReply = (msg) => {
  const normal = msg.toLowerCase();
  if (normal.includes('anx')) return 'Let’s try a grounding exercise. Name 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, and 1 you can taste.';
  if (normal.includes('sleep')) return 'Sleep can improve with routine. Would you like a gentle wind‑down plan with consistent bedtimes?';
  if (normal.includes('sad')) return 'I’m here with you. Would writing a short compassionate message to yourself help right now?';
  if (normal.includes('panic') || normal.includes('sos')) return 'If you feel unsafe, use the Emergency Help. For panic, try slow 4‑7‑8 breaths: inhale 4s, hold 7s, exhale 8s.';
  return 'Thank you for sharing. Would you like a quick 2‑minute check‑in or a coping strategy?';
};

// SOS modal
const initSOS = () => {
  const openBtn = qs('#openSOS');
  if (openBtn) openBtn.addEventListener('click', () => openModal('sosModal'));
  qsa('[data-close="sosModal"]').forEach((btn) => btn.addEventListener('click', () => closeModal('sosModal')));
  const modal = qs('#sosModal');
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal('sosModal'); });
};

// Contact form validation
const initContactForm = () => {
  const form = qs('#contactForm');
  if (!form) return;
  const name = qs('#name');
  const email = qs('#email');
  const message = qs('#message');
  const errName = qs('#err-name');
  const errEmail = qs('#err-email');
  const errMessage = qs('#err-message');

  const validate = () => {
    let ok = true;
    if (!name.value.trim()) { errName.textContent = 'Please enter your name.'; ok = false; } else errName.textContent = '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { errEmail.textContent = 'Enter a valid email.'; ok = false; } else errEmail.textContent = '';
    if (message.value.trim().length < 10) { errMessage.textContent = 'Please share a bit more (10+ chars).'; ok = false; } else errMessage.textContent = '';
    return ok;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    form.reset();
    alert('Thanks! Your message has been sent.');
  });
};

// Footer year
const setYear = () => { const y = qs('#year'); if (y) y.textContent = new Date().getFullYear(); };

// Init
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initReveal();
  initParticles();
  initTilt();
  initComparison();
  initChat();
  initSOS();
  initContactForm();
  setYear();

  const themeBtn = qs('#themeToggle');
  themeBtn?.addEventListener('click', themeToggle);

  // Escape closes modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ['chatModal', 'sosModal'].forEach((id) => { const m = qs('#' + id); if (m && !m.hidden) closeModal(id); });
    }
  });
});

