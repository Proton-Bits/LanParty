
// Year
document.getElementById('year').textContent = new Date().getFullYear();

(function() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 60;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.2 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.4 + 0.1;
  };
  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,245,255,${(1 - dist / 140) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw dots
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,255,${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
})();

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ===== MOBILE NAV =====
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

menuToggle.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});

function animateCount(el, target, duration) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('[data-target]').forEach(el => {
        animateCount(el, parseInt(el.dataset.target), 1200);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, parseInt(entry.target.dataset.delay || 0));
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal').forEach((el, i) => {
  if (!el.dataset.delay) {
    el.dataset.delay = i * 50;
  }

  revealObserver.observe(el);
});

const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalName = document.getElementById('modalName');
const modalInfo = document.getElementById('modalInfo');
const modalImg = document.getElementById('modalImg');

if (modal && modalClose && modalName && modalInfo && modalImg) {

  function openModal(name, info, imgSrc) {
    modalName.textContent = name;
    modalInfo.textContent = info;
    modalImg.src = imgSrc || '';
    modalImg.style.display = imgSrc ? 'block' : 'none';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.card-info-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      const card = btn.closest('.player-card');
      const img = card?.querySelector('.player-photo img');

      openModal(
        btn.dataset.name,
        btn.dataset.info,
        img ? img.src : ''
      );
    });
  });

  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

// ===== CURSOR GLOW (desktop only) =====
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9997;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

// ===== GLITCH TITLE EFFECT =====
(function() {
  const titles = document.querySelectorAll('.hero-title .line1, .hero-title .line2');
  titles.forEach(el => {
    const original = el.textContent;
    const glitchChars = '!@#$%^&*<>?/\\|ABCDEFGHIJ';

    el.addEventListener('mouseenter', () => {
      let iter = 0;
      const interval = setInterval(() => {
        el.textContent = original.split('').map((char, idx) => {
          if (char === ' ') return ' ';
          if (idx < iter) return original[idx];
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }).join('');
        if (iter >= original.length) clearInterval(interval);
        iter += 2;
      }, 40);
    });
  });
})();

console.log('%c🎮 LAN Party – Tromba Latas', 'color: #00f5ff; font-size: 18px; font-weight: bold;');
console.log('%cSite carregado ✨', 'color: #9b5de5; font-size: 13px;');
