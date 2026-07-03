/* ============================================================
   Dr. Jaideep Rao — Personal Site JS
   Handles: loader, custom cursor, scroll progress, nav state,
            reveal animations, counters, magnetic effects,
            interactive mouse-glow on cards.
   ============================================================ */

(() => {
  'use strict';

  // ============== LOADER ==============
  window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
      setTimeout(() => loader.classList.add('gone'), 700);
    }
    document.body.classList.add('loaded');
  });

  // ============== CUSTOM CURSOR REMOVED ==============
  // (User feedback: the cursor tracker was distracting. Native cursor only.)

  // ============== SCROLL PROGRESS ==============
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    document.addEventListener('scroll', () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      progressBar.style.width = scrolled + '%';
    }, { passive: true });
  }

  // ============== NAV SCROLLED STATE ==============
  const nav = document.querySelector('.nav');
  if (nav) {
    const updateNav = () => {
      if (window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    updateNav();
    document.addEventListener('scroll', updateNav, { passive: true });
  }

  // ============== MOBILE MENU ==============
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ============== REVEAL ANIMATIONS ==============
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

  document.querySelectorAll('.reveal, .text-reveal').forEach((el) => revealObserver.observe(el));

  // ============== STAT COUNTER ==============
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const decimals = (el.dataset.decimals && parseInt(el.dataset.decimals)) || 0;
        const duration = 1800;
        const startTime = performance.now();

        const animate = (now) => {
          const t = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
          const val = (target * eased).toFixed(decimals);
          el.textContent = val + suffix;
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

  // ============== MOUSE FOLLOW GLOW ON CARDS ==============
  document.querySelectorAll('.feature-card, .app-card, .info-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  // ============== 3D TILT ON GLASS CARDS ==============
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    let raf = null;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateZ(0)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============== MAGNETIC BUTTONS ==============
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ============== HERO TEXT SPLIT ==============
  document.querySelectorAll('.text-reveal').forEach((el) => {
    if (el.dataset.split === 'done') return;
    const text = el.innerHTML;
    // wrap each word, leave HTML tags alone
    const wrapped = text.replace(/(<[^>]+>)|(\S+)/g, (match, tag, word) => {
      if (tag) return tag;
      return `<span class="word-anim" style="transition-delay:${Math.random() * 0.3}s">${word}</span>`;
    });
    el.innerHTML = wrapped;
    el.dataset.split = 'done';
  });

  // ============== SET CURRENT YEAR ==============
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // ============== ACTIVE NAV ==============
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-mobile a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // If the active page lives inside the Apps dropdown, highlight the "Apps" trigger too
  const ddActive = document.querySelector('.nav-dropdown-panel .nav-link.active');
  if (ddActive) {
    const trigger = document.querySelector('.nav-dropdown-trigger');
    if (trigger) trigger.classList.add('active');
  }

  // ============== PARTICLE NETWORK BACKGROUND ==============
  // Pure-canvas constellation animation. Lives behind all content,
  // above the bg-canvas / bg-grid layers.
  (function initParticles() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouseX = -1000, mouseY = -1000;
    let raf = null;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
      buildParticles();
    }

    function buildParticles() {
      const w = window.innerWidth, h = window.innerHeight;
      // Density: roughly 1 particle per 16k pixels, capped for performance
      const target = Math.min(90, Math.max(35, Math.floor((w * h) / 16000)));
      particles = [];
      for (let i = 0; i < target; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.4 + 0.6,
          // Mix of accent colors per particle
          hue: Math.random() < 0.7 ? 'violet' : (Math.random() < 0.5 ? 'cyan' : 'magenta')
        });
      }
    }

    function colorFor(hue, alpha) {
      if (hue === 'cyan')    return `rgba(0, 224, 255, ${alpha})`;
      if (hue === 'magenta') return `rgba(255, 46, 154, ${alpha})`;
      return `rgba(124, 92, 255, ${alpha})`;
    }

    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    document.addEventListener('mouseleave', () => { mouseX = -1000; mouseY = -1000; });

    // Pause when tab is hidden to save battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = null; }
      else if (!raf) loop();
    });

    function loop() {
      const w = window.innerWidth, h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Update + draw dots
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = colorFor(p.hue, 0.85);
        ctx.fill();
      }

      // Connections between nearby particles
      const linkDist = 150;
      const linkDistSq = linkDist * linkDist;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dsq = dx * dx + dy * dy;
          if (dsq < linkDistSq) {
            const alpha = (1 - Math.sqrt(dsq) / linkDist) * 0.34;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = colorFor(a.hue, alpha);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
        // Mouse interaction line
        const dxm = a.x - mouseX;
        const dym = a.y - mouseY;
        const dmSq = dxm * dxm + dym * dym;
        if (dmSq < 200 * 200) {
          const alpha = (1 - Math.sqrt(dmSq) / 200) * 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(0, 224, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(loop);
    }

    resize();
    loop();
  })();

})();
