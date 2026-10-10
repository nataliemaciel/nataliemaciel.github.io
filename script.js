// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle (remembers choice; otherwise follows the device setting)
const root = document.documentElement;
const themeBtn = document.querySelector('.theme-btn');

function currentTheme() {
  return root.dataset.theme ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}
function applyTheme(theme) {
  root.dataset.theme = theme;
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
try {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') root.dataset.theme = saved;
} catch (e) { /* storage unavailable: ignore */ }
applyTheme(currentTheme());

themeBtn.addEventListener('click', () => {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
});

// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.getElementById('nav-links');

function setMenu(open) {
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navLinks.classList.toggle('is-open', open);
}
menuBtn.addEventListener('click', () => {
  setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// Highlight the nav link for the section on screen
const sections = [...navLinks.querySelectorAll('a')]
  .map(a => ({ a, el: document.querySelector(a.getAttribute('href')) }))
  .filter(s => s.el);
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sections.forEach(s => s.a.classList.toggle('is-current', s.el === entry.target));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => io.observe(s.el));
}

// Project filters
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    filters.forEach(f => {
      const active = f === btn;
      f.classList.toggle('is-active', active);
      f.setAttribute('aria-pressed', String(active));
    });
    projects.forEach(p => {
      p.hidden = !(cat === 'all' || p.dataset.cat === cat);
    });
  });
});

// Image fallback: if an image is missing, show a neutral block
document.querySelectorAll('img[data-fallback]').forEach(img => {
  const swap = () => {
    const box = document.createElement('div');
    box.className = 'img-fallback';
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', img.alt || '');
    box.style.cssText = 'display:flex;align-items:center;justify-content:center;font-weight:600;font-size:1.4rem;color:var(--muted);';
    box.textContent = img.dataset.fallback || '';
    img.replaceWith(box);
  };
  img.addEventListener('error', swap);
  if (img.complete && img.naturalWidth === 0) swap();
});
