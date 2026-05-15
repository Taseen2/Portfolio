/**
 * Taseen Portfolio - Core Script
 * Cleaned & Optimized Version
 */

// 1. UTILITIES & CONSTANTS
const doc = document.documentElement;
const storageKey = 'portfolio-theme';

// 2. THEME MANAGEMENT - Handles Light/Dark mode and transitions
function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem(storageKey) || 'dark';

  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', (e) => {
    const newTheme = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

    // Support for View Transitions API for smooth theme switching
    if (!document.startViewTransition) {
      applyTheme(newTheme);
      return;
    }

    doc.style.setProperty('--reveal-x', `${e.clientX}px`);
    doc.style.setProperty('--reveal-y', `${e.clientY}px`);
    document.startViewTransition(() => applyTheme(newTheme));
  });
}

/**
 * Updates the DOM and localStorage with the selected theme
 */
function applyTheme(theme) {
  doc.setAttribute('data-theme', theme);
  localStorage.setItem(storageKey, theme);
  const sunIcon = document.querySelector('.sun-icon');
  if (sunIcon) sunIcon.textContent = theme === 'dark' ? 'THEME ☀️' : 'THEME 🌙';
}

// 3. CURSOR & MOUSE INTERACTIONS - Custom cursor and hover effects
function initMouseInteractions() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const mouseGlow = document.querySelector('.mouse-glow');
  const heroTerminal = document.querySelector('.hero-terminal');
  const hero = document.querySelector('.hero');

  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Background Glow tracking
    if (mouseGlow) {
      mouseGlow.style.opacity = '1';
      mouseGlow.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
    }

    // Hero 3D Tilt (Desktop only)
    if (heroTerminal && hero && window.innerWidth >= 992) {
      const rect = hero.getBoundingClientRect();
      const relX = mouseX - rect.left;
      const relY = mouseY - rect.top;

      const moveX = (relX - rect.width / 2) * 0.05;
      const moveY = (relY - rect.height / 2) * 0.05;

      heroTerminal.style.setProperty('--move-x', `${moveX}px`);
      heroTerminal.style.setProperty('--move-y', `${moveY}px`);
      heroTerminal.dataset.tiltX = (relY - rect.height / 2) / 25;
      heroTerminal.dataset.tiltY = (rect.width / 2 - relX) / 25;
      heroTerminal.dataset.isHovering = 'true';
    }
  });

  // Smooth Cursor Animation Loop
  const renderCursor = () => {
    // LERP for smooth following
    dotX += (mouseX - dotX) * 0.4;
    dotY += (mouseY - dotY) * 0.4;
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    dot.style.transform = `translate3d(calc(${dotX}px - 50%), calc(${dotY}px - 50%), 0)`;
    ring.style.transform = `translate3d(calc(${ringX}px - 50%), calc(${ringY}px - 50%), 0)`;

    requestAnimationFrame(renderCursor);
  };
  renderCursor();

  document.addEventListener('mouseleave', () => {
    if (mouseGlow) mouseGlow.style.opacity = '0';
    if (heroTerminal) heroTerminal.dataset.isHovering = 'false';
  });

  // Cursor Hover Effects
  const interactives = 'a, button, .project-card, .skill-pill, .social-icon, .stat-card, .btn, .day-box';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
  });

  // Spotlight effect for cards
  const spotlightCards = document.querySelectorAll('.project-card, .skill-category, .stat-card, .day-box');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  // Magnetic Buttons
  document.querySelectorAll('.btn-primary, .btn-outline, .social-icon').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  // Hero Tilt Animation Loop
  if (heroTerminal) {
    let curX = 0, curY = 0;
    const animateHero = () => {
      const isHovering = heroTerminal.dataset.isHovering === 'true';
      const targetX = isHovering ? parseFloat(heroTerminal.dataset.tiltX) : 0;
      const targetY = isHovering ? parseFloat(heroTerminal.dataset.tiltY) : 0;

      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;

      const mX = heroTerminal.style.getPropertyValue('--move-x') || '0px';
      const mY = heroTerminal.style.getPropertyValue('--move-y') || '0px';

      if (isHovering || Math.abs(curX) > 0.01) {
        heroTerminal.style.transform = `translate3d(${mX}, ${mY}, 0) rotateX(${curX}deg) rotateY(${curY}deg)`;
        heroTerminal.style.animation = 'none';
      } else {
        heroTerminal.style.transform = '';
        heroTerminal.style.animation = 'float-card 8s ease-in-out infinite';
      }
      requestAnimationFrame(animateHero);
    };
    animateHero();
  }
}

// 4. SCROLL & NAVIGATION
function initScrollAndNav() {
  const header = document.querySelector('.site-header');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const menuBtn = document.querySelector('.menu-btn');
  const siteNav = document.querySelector('.site-nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav a');

  // Reveal Observer
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('in'));
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .stagger').forEach(el => revealObserver.observe(el));

  // Stagger Delay Auto-calc
  document.querySelectorAll('.stagger').forEach(container => {
    Array.from(container.children).forEach((child, i) => child.style.transitionDelay = `${i * 0.1}s`);
  });

  // Active Nav Observer
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.3, rootMargin: '-10% 0px -50% 0px' });

  sections.forEach(s => navObserver.observe(s));

  // Scroll Listeners
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 50);
    scrollIndicator?.classList.toggle('scrolled', y > 100);

    // Parallax
    const orb1 = document.querySelector('.orb-one');
    const orb2 = document.querySelector('.orb-two');
    if (orb1) orb1.style.transform = `translateY(${y * 0.1}px)`;
    if (orb2) orb2.style.transform = `translateY(${y * -0.1}px)`;
  }, { passive: true });

  // Mobile Nav
  menuBtn?.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    menuBtn.textContent = open ? 'Close' : 'Menu';
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuBtn.textContent = 'Menu';
  }));
}

// 5. BOOTSTRAP
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMouseInteractions();
  initScrollAndNav();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});