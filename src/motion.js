import './motion.css';
import './mobile.css';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const targets = [
  '.hero-copy', '.hero-art', '.shop-hero-copy', '.shop-hero-art',
  '.discover-hero', '.feature-main', '.feature-side-story',
  '.category-card', '.shop-product-card', '.product-card', '.wishlist-card',
  '.article-card', '.staff-product', '.detail-columns', '.detail-recommend-card',
  '.account-user', '.account-content>h2', '.account-content>form', '.account-stats', '.account-tile',
  '.checkout-form-column', '.checkout-summary', '.checkout-confirm',
  '.login-content', '.login-art-copy', '.register-content', '.register-art-copy',
  '.section-heading', '.spotlight-card', '.newsletter-inner', '.closing', '.detail-tab-body',
  '.account-collection-card'
];

let observer;
let mutationObserver;
let frame = 0;

function revealAll() {
  document.querySelectorAll('.motion-enter').forEach(element => element.classList.add('motion-visible'));
}

function addTargets() {
  if (!observer) return;
  const selector = targets.join(',');
  document.querySelectorAll(selector).forEach((element, index) => {
    if (element.dataset.motionBound) return;
    element.dataset.motionBound = 'true';
    element.classList.add('motion-enter');
    element.style.setProperty('--motion-delay', `${Math.min(index % 4, 3) * 65}ms`);
    observer.observe(element);
  });
}

function start() {
  if (reduceMotion.matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('motion-enabled');
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -28px 0px', threshold: 0.04 });
  addTargets();
  mutationObserver = new MutationObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(addTargets);
  });
  mutationObserver.observe(document.querySelector('#app') || document.body, { childList: true, subtree: true });
}

queueMicrotask(() => requestAnimationFrame(start));
reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches) {
    observer?.disconnect();
    mutationObserver?.disconnect();
    observer = undefined;
    mutationObserver = undefined;
    document.documentElement.classList.remove('motion-enabled');
    revealAll();
  } else if (!observer || !mutationObserver) start();
});
