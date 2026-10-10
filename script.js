// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

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
// (with the text from data-fallback, if you set one)
document.querySelectorAll('img[data-fallback]').forEach(img => {
  const swap = () => {
    const box = document.createElement('div');
    box.className = 'img-fallback';
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', img.alt || '');
    box.style.cssText = 'display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.4rem;color:var(--muted);';
    box.textContent = img.dataset.fallback || '';
    img.replaceWith(box);
  };
  img.addEventListener('error', swap);
  if (img.complete && img.naturalWidth === 0) swap();
});
