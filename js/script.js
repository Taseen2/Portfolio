/**
 * -------------------------------------------------------------------
 *  1. THEME TOGGLE (VIEW TRANSITIONS API)
 * -------------------------------------------------------------------
 */
function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  const doc = document.documentElement;

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  doc.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      const currentTheme = doc.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      toggleThemeWithTransition(newTheme, e);
    });
  }
}

function updateThemeIcon(theme) {
  const sunIcon = document.querySelector('.sun-icon');
  if (sunIcon) {
    sunIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function toggleThemeWithTransition(newTheme, event) {
  const doc = document.documentElement;

  // Fallback for browsers that don't support View Transitions
  if (!document.startViewTransition) {
    applyTheme(newTheme);
    return;
  }

  // Get click coordinates for circular reveal
  const x = event.clientX;
  const y = event.clientY;
  doc.style.setProperty('--reveal-x', `${x}px`);
  doc.style.setProperty('--reveal-y', `${y}px`);

  document.startViewTransition(() => {
    applyTheme(newTheme);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
  updateThemeIcon(theme);
}

/**
 * -------------------------------------------------------------------
 *  2. CUSTOM CURSOR
 * -------------------------------------------------------------------
 */
function initCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const mouseGlow = document.querySelector('.mouse-glow');
  
  if (!dot || !ring) return;

  window.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;
    
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;

    if (mouseGlow) {
      mouseGlow.style.opacity = '1';
      mouseGlow.style.left = `${x}px`;
      mouseGlow.style.top = `${y}px`;
    }
  });

  document.addEventListener('mouseleave', () => {
    if (mouseGlow) mouseGlow.style.opacity = '0';
  });

  const interactiveElements = 'a, button, .project-card, .skill-pill, .social-icon, .stat-card, .btn';
  document.querySelectorAll(interactiveElements).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
  });
}

/**
 * -------------------------------------------------------------------
 *  3. SCROLL EFFECTS & REVEALS
 * -------------------------------------------------------------------
 */
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  
  // Intersection Observer for reveals
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal, .stagger').forEach((el) => revealObserver.observe(el));

  // Stagger children delay
  document.querySelectorAll('.stagger').forEach((container) => {
    Array.from(container.children).forEach((child, index) => {
      child.style.transitionDelay = `${index * 0.1}s`;
    });
  });

  // Active Nav Link Observer
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav a');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-10% 0px -50% 0px' }
  );

  sections.forEach((section) => navObserver.observe(section));

  // Simple scroll listener for header/indicator
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 50);
    if (scrollIndicator) scrollIndicator.classList.toggle('scrolled', y > 100);
    
    // Parallax orbs
    const orb1 = document.querySelector('.orb-one');
    const orb2 = document.querySelector('.orb-two');
    if (orb1) orb1.style.transform = `translateY(${y * 0.1}px)`;
    if (orb2) orb2.style.transform = `translateY(${y * -0.1}px)`;
  }, { passive: true });
}

/**
 * -------------------------------------------------------------------
 *  4. MOBILE NAVIGATION
 * -------------------------------------------------------------------
 */
function initMobileNav() {
  const menuBtn = document.querySelector('.menu-btn');
  const siteNav = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.site-nav a');

  if (!menuBtn || !siteNav) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuBtn.textContent = isOpen ? 'Close' : 'Menu';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuBtn.textContent = 'Menu';
    });
  });
}

/**
 * -------------------------------------------------------------------
 *  5. 3D EFFECTS & MAGNETIC
 * -------------------------------------------------------------------
 */
function initMicroInteractions() {
  // 3D Tilt for Hero Terminal
  const terminal = document.querySelector('.hero-terminal');
  const hero = document.querySelector('.hero');

  if (terminal && hero) {
    let mouseX = 0, mouseY = 0;
    let currentRotateX = 0, currentRotateY = 0;
    let isHovering = false;
    const lerpAmount = 0.08; // Smoothness factor
    const sensitivity = 25; // Range of motion

    hero.addEventListener('mousemove', (e) => {
      // Disable on touch devices or small screens for performance/usability
      if (window.innerWidth < 992) return;

      isHovering = true;
      const { width, height, left, top } = hero.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      // Calculate offset from center for 3D tilt
      mouseX = (y - height / 2) / sensitivity;
      mouseY = (width / 2 - x) / sensitivity;

      // Calculate follow movement (center following mouse)
      const moveX = (x - width / 2) * 0.05;
      const moveY = (y - height / 2) * 0.05;
      
      terminal.style.setProperty('--move-x', `${moveX}px`);
      terminal.style.setProperty('--move-y', `${moveY}px`);
    });

    hero.addEventListener('mouseleave', () => {
      isHovering = false;
      mouseX = 0;
      mouseY = 0;
      terminal.style.setProperty('--move-x', '0px');
      terminal.style.setProperty('--move-y', '0px');
    });

    function animateTilt() {
      if (isHovering || Math.abs(currentRotateX) > 0.01 || Math.abs(currentRotateY) > 0.01) {
        // Apply LERP
        currentRotateX += (mouseX - currentRotateX) * lerpAmount;
        currentRotateY += (mouseY - currentRotateY) * lerpAmount;
        
        const moveX = parseFloat(terminal.style.getPropertyValue('--move-x')) || 0;
        const moveY = parseFloat(terminal.style.getPropertyValue('--move-y')) || 0;

        terminal.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
        terminal.style.animation = 'none';

        // If returned to center and not hovering, resume floating animation
        if (!isHovering && Math.abs(currentRotateX) < 0.05 && Math.abs(currentRotateY) < 0.05 && Math.abs(moveX) < 0.1) {
          terminal.style.transform = '';
          terminal.style.animation = 'float-card 8s ease-in-out infinite';
          currentRotateX = 0;
          currentRotateY = 0;
        }
      }
      requestAnimationFrame(animateTilt);
    }
    
    animateTilt();
  }

  // Magnetic Buttons
  const magneticElements = document.querySelectorAll('.btn-primary, .btn-outline, .social-icon');
  magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // Spotlight effect for cards
  const cards = document.querySelectorAll('.project-card, .skill-pill, .stat-card, .day-box');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * -------------------------------------------------------------------
 *  INITIALIZATION
 * -------------------------------------------------------------------
 */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCursor();
  initScrollEffects();
  initMobileNav();
  initMicroInteractions();

  // Footer Year
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});