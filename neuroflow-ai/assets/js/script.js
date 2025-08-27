// Utilities
const $ = (s, o = document) => o.querySelector(s);
const $$ = (s, o = document) => [...o.querySelectorAll(s)];

// Theme toggle with persistence
const root = document.documentElement;
const THEME_KEY = "nf_theme";
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === "light") root.classList.add("light");

const themeToggle = $("#themeToggle");
if (themeToggle) {
	themeToggle.addEventListener("click", () => {
		root.classList.toggle("light");
		localStorage.setItem(THEME_KEY, root.classList.contains("light") ? "light" : "dark");
	});
}

// Mobile menu toggle
const mobileBtn = $("#mobileMenuBtn");
const menuList = $("#menuList");
if (mobileBtn && menuList) {
	mobileBtn.addEventListener("click", () => {
		const isOpen = menuList.classList.toggle("open");
		mobileBtn.setAttribute("aria-expanded", String(isOpen));
	});
	$$('#menuList a').forEach(a => a.addEventListener('click', () => {
		menuList.classList.remove('open');
		mobileBtn.setAttribute('aria-expanded', 'false');
	}));
}

// Smooth in-page scrolling
$$('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', e => {
		const targetId = anchor.getAttribute('href');
		if (!targetId || targetId === '#') return;
		const el = $(targetId);
		if (!el) return;
		e.preventDefault();
		el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});
});

// Intersection-based reveal animations
const observer = new IntersectionObserver((entries) => {
	for (const entry of entries) {
		if (entry.isIntersecting) {
			entry.target.classList.add('reveal');
			observer.unobserve(entry.target);
		}
	}
}, { threshold: 0.15 });
$$('.section, .feature-card, .benefit-card, .person-card, .node').forEach(el => {
	el.style.transform = 'translateY(12px)';
	el.style.opacity = '0';
	observer.observe(el);
});

// Reveal effect CSS injection (scoped)
const style = document.createElement('style');
style.textContent = `
.reveal { opacity: 1 !important; transform: none !important; transition: opacity 700ms cubic-bezier(.2,.8,.2,1), transform 700ms cubic-bezier(.2,.8,.2,1); }
`;
document.head.appendChild(style);

// Particles background (canvas)
(function particles() {
	const canvas = /** @type {HTMLCanvasElement} */(document.getElementById('bg-particles'));
	if (!canvas) return;
	const ctx = canvas.getContext('2d');
	let rafId = 0;
	let width = 0, height = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
	const particles = [];
	const PARTICLE_COUNT = 80;
	const hueBase = 200;

	function resize() {
		width = canvas.clientWidth = window.innerWidth;
		height = canvas.clientHeight = window.innerHeight;
		canvas.width = Math.floor(width * dpr);
		canvas.height = Math.floor(height * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
	window.addEventListener('resize', resize);
	resize();

	function spawn() {
		particles.length = 0;
		for (let i = 0; i < PARTICLE_COUNT; i++) {
			particles.push({
				x: Math.random() * width,
				y: Math.random() * height,
				z: Math.random() * 1 + 0.3,
				s: Math.random() * 1.2 + 0.3,
				dx: (Math.random() - 0.5) * 0.3,
				dy: (Math.random() - 0.5) * 0.3,
				life: Math.random() * 1000,
			});
		}
	}
	spawn();

	function draw() {
		ctx.clearRect(0, 0, width, height);
		for (let i = 0; i < particles.length; i++) {
			const p = particles[i];
			p.x += p.dx * p.z;
			p.y += p.dy * p.z;
			p.life += 1;

			if (p.x < -20) p.x = width + 20; if (p.x > width + 20) p.x = -20;
			if (p.y < -20) p.y = height + 20; if (p.y > height + 20) p.y = -20;

			const hue = hueBase + (p.x / width) * 80;
			const alpha = 0.35 + Math.sin(p.life * 0.02) * 0.1;
			ctx.beginPath();
			ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
			ctx.shadowColor = `hsla(${hue}, 90%, 60%, ${alpha})`;
			ctx.shadowBlur = 14 * p.z;
			ctx.arc(p.x, p.y, p.s * 2, 0, Math.PI * 2);
			ctx.fill();
		}
		rafId = requestAnimationFrame(draw);
	}
	draw();

	// Pause when tab hidden
	document.addEventListener('visibilitychange', () => {
		if (document.hidden) cancelAnimationFrame(rafId); else draw();
	});
})();

// Comparison slider subtle motion
(function sliderMotion() {
	const slider = document.querySelector('.comparison .slider');
	if (!slider) return;
	let progress = 0.5;
	let isDragging = false;

	function setPos(x) {
		const rect = slider.parentElement.getBoundingClientRect();
		progress = Math.min(1, Math.max(0, (x - rect.left) / rect.width));
		slider.style.left = `${progress * 100}%`;
	}

	slider.parentElement.addEventListener('pointerdown', (e) => { isDragging = true; setPos(e.clientX); });
	window.addEventListener('pointermove', (e) => { if (isDragging) setPos(e.clientX); });
	window.addEventListener('pointerup', () => { isDragging = false; });

	// init
	slider.style.left = '50%';
})();

// Contact form handling
(function contactForm() {
	const form = document.getElementById('contactForm');
	if (!form) return;
	const status = form.querySelector('.form-status');
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const formData = new FormData(form);
		const name = String(formData.get('name')||'').trim();
		const email = String(formData.get('email')||'').trim();
		const message = String(formData.get('message')||'').trim();
		if (!name || !email || !message) {
			status.textContent = 'Please fill out all fields.';
			return;
		}
		status.textContent = 'Sending...';
		await new Promise(r => setTimeout(r, 800));
		status.textContent = 'Thanks! We will get back to you shortly.';
		form.reset();
	});
})();

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());