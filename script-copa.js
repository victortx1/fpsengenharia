/* ============================================================
   FPS ENGENHARIA — COPA DO MUNDO 2026 PREMIUM JS
   ============================================================ */

(function () {
  'use strict';

  /* ─── UTILS ─────────────────────────────────────────────── */
  const qs  = (s) => document.querySelector(s);
  const qsa = (s) => document.querySelectorAll(s);

  /* ─── LOADER ─────────────────────────────────────────────── */
  const loaderScreen = qs('#loaderScreen');
  const loaderBar    = qs('#loaderBar');
  const loaderText   = qs('#loaderText');
  const loaderCanvas = qs('#loaderCanvas');

  const loaderMessages = [
    'Conectando à energia...',
    'Preparando o campo...',
    'Ativando sistemas FPS...',
    'Quase lá — vamos jogar! ⚽',
  ];

  function runLoader() {
    if (!loaderScreen) return;
    const jaViu = sessionStorage.getItem('fpsLoaderVisto');
    if (jaViu) {
      loaderScreen.style.display = 'none';
      showLoginPopupDelayed(400);
      return;
    }

    // Loader particles
    if (loaderCanvas) {
      const ctx = loaderCanvas.getContext('2d');
      loaderCanvas.width  = window.innerWidth;
      loaderCanvas.height = window.innerHeight;

      const pts = Array.from({ length: 60 }, () => ({
        x: Math.random() * loaderCanvas.width,
        y: Math.random() * loaderCanvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random(),
      }));

      let loaderAnimId;
      (function loaderTick() {
        ctx.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);
        pts.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,215,0,${p.alpha})`;
          ctx.fill();
          p.x += p.vx; p.y += p.vy;
          p.alpha += (Math.random() - 0.5) * 0.04;
          p.alpha = Math.max(0.05, Math.min(0.7, p.alpha));
          if (p.x < 0 || p.x > loaderCanvas.width)  p.vx *= -1;
          if (p.y < 0 || p.y > loaderCanvas.height)  p.vy *= -1;
        });
        loaderAnimId = requestAnimationFrame(loaderTick);
      })();

      setTimeout(() => cancelAnimationFrame(loaderAnimId), 3500);
    }

    // Progress bar
    let progress  = 0;
    let msgIndex  = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 8 + 3;
      if (progress > 100) progress = 100;
      if (loaderBar) loaderBar.style.width = progress + '%';

      const newMsgIndex = Math.floor((progress / 100) * loaderMessages.length);
      if (newMsgIndex !== msgIndex && newMsgIndex < loaderMessages.length) {
        msgIndex = newMsgIndex;
        if (loaderText) {
          loaderText.style.opacity = '0';
          setTimeout(() => {
            loaderText.textContent = loaderMessages[msgIndex];
            loaderText.style.opacity = '1';
          }, 200);
        }
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loaderScreen.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          loaderScreen.style.opacity  = '0';
          loaderScreen.style.transform = 'scale(1.05)';
          setTimeout(() => {
            loaderScreen.style.display = 'none';
            sessionStorage.setItem('fpsLoaderVisto', '1');
            showLoginPopupDelayed(600);
          }, 800);
        }, 400);
      }
    }, 60);
  }

  function showLoginPopupDelayed(ms) {
    const jaViuPopup = localStorage.getItem('popupLoginFPS');
    if (!jaViuPopup) {
      setTimeout(() => {
        const p = qs('#loginPopup');
        if (p) p.style.display = 'flex';
      }, ms);
    }
  }

  /* ─── PARTICLE CANVAS (GLOBAL) ───────────────────────────── */
  function initParticles() {
    const canvas = qs('#particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['rgba(255,215,0,', 'rgba(0,200,80,', 'rgba(0,180,255,'];

    function makeParticle() {
      return {
        x: Math.random() * W,
        y: H + 20,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.5 + 0.3),
        r: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 0,
        maxLife: Math.random() * 300 + 200,
      };
    }

    particles = Array.from({ length: 120 }, () => {
      const p = makeParticle();
      p.y = Math.random() * H; // spread initially
      p.life = Math.floor(Math.random() * p.maxLife);
      return p;
    });

    function tick() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const a = p.alpha * (1 - p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + a + ')';
        ctx.fill();
        if (p.life >= p.maxLife || p.y < -20) {
          particles[i] = makeParticle();
        }
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ─── CROWD LIGHTS ───────────────────────────────────────── */
  function initCrowdLights() {
    const container = qs('#crowdLights');
    if (!container) return;
    const colors = ['#FFD700','#00C851','#00B4FF','#FF4444','#FF8800','#FFFFFF'];
    for (let i = 0; i < 80; i++) {
      const dot = document.createElement('div');
      const c   = colors[Math.floor(Math.random() * colors.length)];
      dot.style.cssText = `
        position:absolute;
        width:${Math.random()*3+1}px;
        height:${Math.random()*3+1}px;
        background:${c};
        border-radius:50%;
        top:${Math.random()*100}%;
        left:${Math.random()*100}%;
        opacity:0;
        animation: crowdBlink ${(Math.random()*3+1).toFixed(2)}s ease-in-out infinite;
        animation-delay:${(Math.random()*4).toFixed(2)}s;
        box-shadow:0 0 ${Math.floor(Math.random()*6+2)}px ${c};
        pointer-events:none;
      `;
      container.appendChild(dot);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes crowdBlink {
        0%,100% { opacity:0; }
        50% { opacity:0.8; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ─── CUSTOM CURSOR ──────────────────────────────────────── */
  function initCursor() {
    const cur   = qs('#cursor');
    const trail = qs('#cursorTrail');
    if (!cur || !trail) return;
    if (window.matchMedia('(hover: none)').matches) return;

    let mx = 0, my = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    });

    (function trailTick() {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      trail.style.left = tx + 'px';
      trail.style.top  = ty + 'px';
      requestAnimationFrame(trailTick);
    })();

    document.querySelectorAll('a, button, .service-card, .card, .carrossel-track img').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cur.classList.add('hover');
        trail.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cur.classList.remove('hover');
        trail.classList.remove('hover');
      });
    });
  }

  /* ─── MAGNETIC BUTTONS ───────────────────────────────────── */
  function initMagnetic() {
    qsa('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const dx   = e.clientX - (rect.left + rect.width / 2);
        const dy   = e.clientY - (rect.top  + rect.height / 2);
        btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ─── HEADER SCROLL ──────────────────────────────────────── */
  function initHeader() {
    const header = qs('#mainHeader');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });

    const hamburger  = qs('#hamburger');
    const mobileNav  = qs('#mobileNav');
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('open');
      });
    }
  }

  /* ─── SCROLL ANIMATIONS ──────────────────────────────────── */
  function initScrollAnimations() {
    const elements = qsa('[data-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 0.1 + 's';
      observer.observe(el);
    });
  }

  /* ─── COUNTER ANIMATION ──────────────────────────────────── */
  function initCounters() {
    const counters = qsa('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.count);
        let current  = 0;
        const step   = Math.ceil(target / 50);
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current;
        }, 30);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  /* ─── CARROSSEL CLONE (infinite scroll) ──────────────────── */
  function initCarrossel() {
    const track = qs('#carrosselTrack');
    if (!track) return;
    // Clone all images for seamless loop
    const imgs = Array.from(track.children);
    imgs.forEach(img => {
      const clone = img.cloneNode(true);
      track.appendChild(clone);
    });
  }

  /* ─── PARALLAX HERO ──────────────────────────────────────── */
  function initParallax() {
    const heroVisual = qs('.hero-visual');
    if (!heroVisual) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.08}px)`;
      }
    }, { passive: true });

    // Mouse parallax
    document.addEventListener('mousemove', e => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      const rings = qsa('.visual-ring');
      rings.forEach((r, i) => {
        const factor = (i + 1) * 4;
        r.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      });
    });
  }

  /* ─── SERVICE CARD GLOW on hover ────────────────────────── */
  function initCardGlow() {
    qsa('.service-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x    = ((e.clientX - rect.left) / rect.width)  * 100;
        const y    = ((e.clientY - rect.top)  / rect.height) * 100;
        card.querySelector('.card-glow').style.background =
          `radial-gradient(circle at ${x}% ${y}%, rgba(255,215,0,0.1), transparent 60%)`;
      });
    });
  }

  /* ─── TITLE CHAR REVEAL ──────────────────────────────────── */
  function initTitleReveal() {
    const lines = qsa('.title-line');
    lines.forEach((line, li) => {
      const text = line.textContent.trim();
      line.textContent = '';
      line.style.overflow = 'hidden';
      const inner = document.createElement('span');
      inner.style.display = 'block';
      inner.style.transform = 'translateY(110%)';
      inner.style.transition = `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${0.2 + li * 0.12}s`;
      inner.textContent = text;
      line.appendChild(inner);

      setTimeout(() => {
        inner.style.transform = 'translateY(0)';
      }, 600);
    });
  }

  /* ─── NAV SMOOTH HOVER INDICATOR ────────────────────────── */
  function initNavIndicator() {
    const nav = qs('.nav');
    if (!nav) return;
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position:absolute;
      bottom:0;
      height:2px;
      background:var(--gold);
      border-radius:2px;
      transition:all 0.35s cubic-bezier(0.25,0.8,0.25,1);
      pointer-events:none;
      opacity:0;
      box-shadow:0 0 10px var(--gold);
    `;
    nav.style.position = 'relative';
    nav.appendChild(indicator);

    qsa('.nav-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        const rect    = link.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        indicator.style.opacity = '1';
        indicator.style.left  = (rect.left - navRect.left) + 'px';
        indicator.style.width = rect.width + 'px';
      });
    });
    nav.addEventListener('mouseleave', () => {
      indicator.style.opacity = '0';
    });
  }

  /* ─── SCROLL PROGRESS BAR ────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.style.cssText = `
      position:fixed;
      top:0;left:0;
      height:2px;
      width:0%;
      background:linear-gradient(90deg,#00C851,#FFD700,#00B4FF);
      z-index:99999;
      transition:width 0.1s;
      pointer-events:none;
      box-shadow:0 0 8px rgba(255,215,0,0.5);
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrollTop  = document.documentElement.scrollTop;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = (scrollTop / scrollable) * 100;
      bar.style.width  = progress + '%';
    }, { passive: true });
  }

  /* ─── SECTION REVEAL WITH GLOW LINE ─────────────────────── */
  function initSectionGlow() {
    const sectionTags = qsa('.section-tag');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'tagGlow 0.6s ease forwards';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const style = document.createElement('style');
    style.textContent = `
      @keyframes tagGlow {
        from { opacity:0; transform:translateY(10px) scale(0.95); }
        to { opacity:1; transform:translateY(0) scale(1); }
      }
      .section-tag { opacity:0; }
    `;
    document.head.appendChild(style);
    sectionTags.forEach(t => observer.observe(t));
  }

  /* ─── FOOTER BRAND GLOW ANIMATION ───────────────────────── */
  function initFooterEffects() {
    const footer = qs('.footer');
    if (!footer) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          qs('.footer-glow').style.animation = 'footerGlowPulse 3s ease-in-out infinite';
        }
      });
    }, { threshold: 0.1 });

    const style = document.createElement('style');
    style.textContent = `
      @keyframes footerGlowPulse {
        0%,100% { opacity:0.5; transform:translateX(-50%) scale(1); }
        50% { opacity:1; transform:translateX(-50%) scale(1.1); }
      }
    `;
    document.head.appendChild(style);
    observer.observe(footer);
  }

  /* ─── REPAIRS LIST STAGGER ───────────────────────────────── */
  function initRepairsStagger() {
    const items = qsa('.repairs-info li');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        items.forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateX(-20px)';
          item.style.transition = `opacity 0.5s ${i * 0.08}s, transform 0.5s ${i * 0.08}s`;
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, 50);
        });
        observer.disconnect();
      });
    }, { threshold: 0.3 });

    const section = qs('.repairs-info');
    if (section) observer.observe(section);
  }

  /* ─── COMO FUNCIONA PASSO ANIMATE ───────────────────────── */
  function initPassosAnimation() {
    const passos = qsa('.passo');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        passos.forEach((p, i) => {
          setTimeout(() => {
            p.style.transition = 'opacity 0.6s, transform 0.6s';
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
          }, i * 150);
        });
        observer.disconnect();
      });
    }, { threshold: 0.2 });

    passos.forEach(p => {
      p.style.opacity = '0';
      p.style.transform = 'translateY(30px)';
    });

    const section = qs('.como-funciona');
    if (section) observer.observe(section);
  }

  /* ─── CONFETTI ON CTA HOVER ──────────────────────────────── */
  function initConfettiOnHover() {
    const cta = qs('.btn-cta');
    if (!cta) return;

    cta.addEventListener('mouseenter', () => {
      for (let i = 0; i < 8; i++) {
        const c = document.createElement('div');
        const colors = ['#FFD700','#00C851','#00B4FF','#FFFFFF','#FF4444'];
        const color  = colors[Math.floor(Math.random() * colors.length)];
        const size   = Math.random() * 6 + 4;
        c.style.cssText = `
          position:fixed;
          width:${size}px; height:${size}px;
          background:${color};
          border-radius:50%;
          pointer-events:none;
          z-index:99999;
          left:${cta.getBoundingClientRect().left + Math.random() * cta.offsetWidth}px;
          top:${cta.getBoundingClientRect().top}px;
          animation:confettiFly 0.8s ease-out forwards;
        `;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 800);
      }
    });

    const style = document.createElement('style');
    style.textContent = `
      @keyframes confettiFly {
        0% { transform:translate(0,0) scale(1); opacity:1; }
        100% { transform:translate(${(Math.random()-0.5)*80}px, -80px) scale(0); opacity:0; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ─── SMOOTH ANCHOR SCROLL ───────────────────────────────── */
  function initSmoothScroll() {
    qsa('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = qs(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ─── HERO TEXT TYPEWRITER EFFECT ────────────────────────── */
  function initHeroBadgePulse() {
    const badge = qs('.hero-badge');
    if (!badge) return;
    const emojis = ['⚡', '🏆', '⚽', '🇧🇷', '⚡'];
    let i = 0;
    setInterval(() => {
      const em = badge.querySelector('.logo-icon') || badge;
      // Only swap emoji before text
      const text = badge.childNodes[badge.childNodes.length - 1];
      if (text && text.nodeType === 3) {
        // leave alone
      }
      i = (i + 1) % emojis.length;
    }, 2000);
  }

  /* ─── BODY BACKGROUND REACTIVE ───────────────────────────── */
  function initBodyGlow() {
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth)  * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.body.style.background =
        `radial-gradient(circle at ${x}% ${y}%, #0A1A0A 0%, #020508 50%)`;
    });
  }

  /* ─── INIT ALL ───────────────────────────────────────────── */
  function init() {
    runLoader();
    initParticles();
    initCrowdLights();
    initCursor();
    initMagnetic();
    initHeader();
    initScrollAnimations();
    initCounters();
    initCarrossel();
    initParallax();
    initCardGlow();
    initTitleReveal();
    initNavIndicator();
    initScrollProgress();
    initSectionGlow();
    initFooterEffects();
    initRepairsStagger();
    initPassosAnimation();
    initConfettiOnHover();
    initSmoothScroll();
    initHeroBadgePulse();
    initBodyGlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
