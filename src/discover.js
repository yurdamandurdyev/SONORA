import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/instrument-sans/wght.css';
import './style.css';
import './discover.css';
import './cart.css';
import { products } from './catalog.js';
import { drawerMarkup } from './cartDrawer.js';

const articles = [
  { id: 'slow-sunday', category: 'LISTENING GUIDES', label: 'LISTENING GUIDE', minutes: 4, title: '5 Records for a Slow Sunday', excerpt: 'When the pace drops and the light goes soft, these five albums know exactly what to do. No drums required.', author: 'Elena Marsh', date: 'Sep 12, 2026', image: 'slow-sunday.png' },
  { id: 'cassettes', category: 'FORMAT CULTURE', label: 'FORMAT CULTURE', minutes: 6, title: 'Why Cassettes Are Still Interesting', excerpt: 'The cassette revival was supposed to be a passing irony. Instead, it became a genuine listening culture.', author: 'SONORA Editors', date: 'Sep 5, 2026', image: 'cassettes.png' },
  { id: 'autumn', category: 'STAFF PICKS', label: 'STAFF PICKS', minutes: 3, title: "Staff Picks: Autumn's Essential Releases", excerpt: 'As the light changes, so does what we reach for. Our team shares the records and tapes carrying them through the season.', author: 'SONORA Staff', date: 'Sep 1, 2026', image: 'autumn.png' },
  { id: 'album-cover', category: 'EDITORIAL', label: 'VISUAL CULTURE', minutes: 8, title: 'The Art of the Album Cover', excerpt: "From Peter Saville to Vaughan Oliver, the album sleeve remains one of the most compressed and powerful forms of visual culture.", author: 'Suki Park', date: 'Aug 28, 2026', image: 'album-cover.png' },
  { id: 'ambient', category: 'EDITORIAL', label: 'EDITORIAL', minutes: 5, title: 'Ambient Music for Late-Night Listening', excerpt: "From Eno’s generative systems to Grouper’s fog-drenched guitar, ambient music rewards the listener who has nowhere else to be.", author: 'Elena Marsh', date: 'Aug 20, 2026', image: 'ambient.png' },
  { id: 'turntable-guide', category: 'AUDIO GUIDES', label: 'AUDIO GUIDE', minutes: 10, title: 'Setting Up Your First Turntable', excerpt: 'Getting a record player is the easy part. Getting it right takes a bit more care. Here is everything you need to know.', author: 'Marco Delgado', date: 'Aug 15, 2026', image: 'turntable-guide.png' }
];

const categories = ['LISTENING GUIDES', 'FORMAT CULTURE', 'EDITORIAL', 'AUDIO GUIDES', 'STAFF PICKS', 'GENRE GUIDES', 'ARTIST SPOTLIGHTS'];
const picks = [
  { image: 'aphex.png', format: 'CASSETTE', artist: 'Aphex Twin', title: 'Selected Ambient Works Volume II', href: '/shop.html?format=Cassette' },
  { image: 'technics.png', format: 'AUDIO EQUIPMENT', artist: 'Technics', title: 'SL-1200MK7 Direct Drive Turntable', href: '/shop.html?format=Audio' },
  { image: 'grouper.png', format: 'VINYL', artist: 'Grouper', title: 'Dragging a Dead Deer Up a Hill', href: '/shop.html?format=Vinyl' },
  { image: 'cocteau.png', format: 'VINYL', artist: 'Cocteau Twins', title: 'Heaven or Las Vegas', href: '/shop.html?format=Vinyl' }
];

const icon = (name, size = 20) => {
  const paths = {
    heart: '<path d="M20.8 8.5c0 4.2-8.8 10.2-8.8 10.2S3.2 12.7 3.2 8.5a4.6 4.6 0 0 1 8.8-1.8 4.6 4.6 0 0 1 8.8 1.8Z"/>',
    bag: '<path d="M4 8h16l-1 13H5L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
    menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
    close: '<path d="M5 5l14 14M19 5 5 19"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};

const articleButton = (article, className, content) => `<button class="${className}" type="button" data-article="${article.id}" aria-label="Read ${article.title}">${content}</button>`;

document.querySelector('#app').innerHTML = `
  <header class="site-header" id="top"><a class="brand" href="/index.html" aria-label="SONORA home">SONORA<span>●</span></a><nav class="desktop-nav" aria-label="Main navigation"><a href="/shop.html">Shop</a><a href="/shop.html?format=Vinyl">Vinyl</a><a href="/shop.html?format=CD">CDs</a><a href="/shop.html?format=Cassette">Cassettes</a><a href="/shop.html?format=Audio">Audio</a><a href="/discover.html" aria-current="page">Discover</a></nav><div class="header-actions"><a class="text-icon" href="/shop.html" aria-label="Shop favorites">${icon('heart')}</a><a class="text-icon" href="/shop.html" aria-label="Open shop">${icon('bag')}</a><button class="text-icon mobile-menu" id="menu-toggle" aria-label="Open menu">${icon('menu')}</button></div></header>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation"><a href="/shop.html">Shop</a><a href="/shop.html?format=Vinyl">Vinyl</a><a href="/shop.html?format=CD">CDs</a><a href="/shop.html?format=Cassette">Cassettes</a><a href="/shop.html?format=Audio">Audio</a><a href="/discover.html">Discover</a></nav>
  <main>
    <section class="discover-intro"><div><p class="eyebrow">EDITORIAL</p><h1>DIS<span>COVER</span></h1></div><p>Our editors on music worth listening to, formats worth owning, and the culture surrounding both.</p></section>
    <div class="discover-content">
      <section class="discover-featured" aria-label="Featured stories">
        ${articleButton(articles[0], 'feature-main', `<img src="/editorial/slow-sunday.png" alt="5 Records for a Slow Sunday" width="519" height="480">`)}
        <div class="feature-side">${articles.slice(1, 3).map(article => articleButton(article, 'feature-side-story', `<img src="/editorial/${article.image}" alt="" width="144" height="234"><span class="feature-side-copy"><small>${article.label}</small><strong>${article.title}</strong><span>${article.minutes} min read</span></span>`)).join('')}</div>
      </section>
      <div class="category-bar" role="group" aria-label="Filter articles">${categories.map(category => `<button type="button" class="category-chip" data-category="${category}" aria-pressed="false">${category}</button>`).join('')}</div>
      <section class="article-grid" id="article-grid" aria-label="Latest articles"></section>
      <p class="article-empty" id="article-empty" hidden>No articles in this category yet. Explore another topic.</p>
      <section class="staff-picks" aria-labelledby="staff-heading"><div class="staff-heading"><h2 id="staff-heading">STAFF PICKS<br><span>THIS WEEK.</span></h2><a href="/shop.html">SHOP ALL →</a></div><div class="staff-grid">${picks.map(pick => `<a class="staff-item" href="${pick.href}"><img src="/editorial/${pick.image}" alt="${pick.artist} — ${pick.title}" width="227" height="227" loading="lazy"><small>${pick.format}</small><span>${pick.artist}</span><strong>${pick.title}</strong></a>`).join('')}</div></section>
    </div>
  </main>
  <footer><div class="footer-top"><div><a class="brand footer-brand" href="/index.html">SONORA</a><p>A curated music marketplace for curious listeners and dedicated collectors.</p></div><div><h4>Shop</h4><a href="/shop.html">All Products</a><a href="/shop.html?format=Vinyl">Vinyl</a><a href="/shop.html?format=CD">CDs</a><a href="/shop.html?format=Cassette">Cassettes</a><a href="/shop.html?format=Audio">Audio</a></div><div><h4>Discover</h4><a href="/discover.html">Editorial</a><a href="/discover.html#staff-heading">Staff Picks</a><a href="/shop.html">New Arrivals</a></div><div><h4>About</h4><a href="/index.html#about">Our Story</a><a href="mailto:hello@sonora.shop">Contact</a></div></div><div class="footer-bottom"><span>© 2026 SONORA. Play it loud. Keep it close.</span><span>Vinyl / CDs / Cassettes / Audio Equipment</span></div></footer>
  <dialog class="article-dialog" id="article-dialog"><button class="dialog-close" type="button" aria-label="Close article">${icon('close')}</button><img id="dialog-image" alt=""><div class="dialog-copy"><small id="dialog-label"></small><h2 id="dialog-title"></h2><p id="dialog-excerpt"></p><span id="dialog-byline"></span></div></dialog>
`;

document.querySelector('#app').insertAdjacentHTML('beforeend', `<div class="drawer-backdrop" id="drawer-backdrop"></div><aside class="drawer" id="drawer" aria-label="Shopping cart" aria-hidden="true"><div class="drawer-header"><div class="drawer-heading"><h2 id="drawer-title">YOUR CART</h2><span id="drawer-count"></span></div><button id="drawer-close" type="button" aria-label="Close cart">${icon('close')}</button></div><div class="drawer-content" id="drawer-content"></div><div class="drawer-footer" id="drawer-footer"></div></aside><div class="toast" id="cart-toast" role="status" aria-live="polite"></div>`);
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
let cart = JSON.parse(localStorage.getItem('sonora-cart') || '[]');
function renderCart() {
  const panel = drawerMarkup('cart', products, cart, [], money);
  document.querySelector('#drawer-title').textContent = panel.title;
  document.querySelector('#drawer-count').textContent = panel.countLabel;
  document.querySelector('#drawer-content').innerHTML = panel.content;
  document.querySelector('#drawer-footer').innerHTML = panel.footer;
}
function closeCart() {
  document.querySelector('#drawer').classList.remove('open');
  document.querySelector('#drawer').setAttribute('aria-hidden', 'true');
  document.querySelector('#drawer-backdrop').classList.remove('open');
  document.body.classList.remove('no-scroll');
}
document.querySelector('.header-actions a[aria-label="Open shop"]').addEventListener('click', event => {
  event.preventDefault();
  cart = JSON.parse(localStorage.getItem('sonora-cart') || '[]');
  renderCart();
  document.querySelector('#drawer').classList.add('open');
  document.querySelector('#drawer').setAttribute('aria-hidden', 'false');
  document.querySelector('#drawer-backdrop').classList.add('open');
  document.body.classList.add('no-scroll');
  document.querySelector('#drawer-close').focus();
});
document.querySelector('.header-actions a[aria-label="Open shop"]').setAttribute('aria-label', 'Open cart');
document.querySelector('#drawer-close').addEventListener('click', closeCart);
document.querySelector('#drawer-backdrop').addEventListener('click', closeCart);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
document.querySelector('#drawer').addEventListener('click', event => {
  const quantity = event.target.closest('[data-qty]');
  const remove = event.target.closest('[data-remove]');
  if (quantity) {
    const item = cart.find(entry => entry.id === Number(quantity.dataset.qty));
    if (item) item.qty += Number(quantity.dataset.delta);
    cart = cart.filter(entry => entry.qty > 0);
  } else if (remove) cart = cart.filter(entry => entry.id !== Number(remove.dataset.remove));
  else if (event.target.closest('#continue-shopping')) { closeCart(); return; }
  else if (event.target.closest('#checkout')) {
    const toast = document.querySelector('#cart-toast');
    toast.textContent = 'Checkout is coming soon. Your selections are saved in this browser.';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
    return;
  } else return;
  localStorage.setItem('sonora-cart', JSON.stringify(cart));
  renderCart();
});

let activeCategory = '';
function renderArticles() {
  const visible = activeCategory ? articles.filter(article => article.category === activeCategory) : articles.slice(3);
  document.querySelector('#article-grid').innerHTML = visible.map(article => articleButton(article, 'article-card', `<img src="${article.id === 'slow-sunday' ? '/home/raw-article-sunday-hires.png' : `/editorial/${article.image}`}" alt="" width="334" height="251" loading="lazy"><small>${article.label} · ${article.minutes} MIN READ</small><strong>${article.title}</strong><p>${article.excerpt}</p><span>${article.author} · ${article.date}</span>`)).join('');
  document.querySelector('#article-empty').hidden = visible.length !== 0;
  document.querySelectorAll('.category-chip').forEach(chip => {
    const selected = chip.dataset.category === activeCategory;
    chip.classList.toggle('active', selected);
    chip.setAttribute('aria-pressed', selected);
  });
}
renderArticles();

document.querySelector('.category-bar').addEventListener('click', event => {
  const chip = event.target.closest('[data-category]');
  if (!chip) return;
  activeCategory = activeCategory === chip.dataset.category ? '' : chip.dataset.category;
  renderArticles();
});

const dialog = document.querySelector('#article-dialog');
document.addEventListener('click', event => {
  const articleButton = event.target.closest('[data-article]');
  if (!articleButton) return;
  const article = articles.find(item => item.id === articleButton.dataset.article);
  document.querySelector('#dialog-image').src = article.id === 'slow-sunday' ? '/home/raw-article-sunday-hires.png' : `/editorial/${article.image}`;
  document.querySelector('#dialog-image').alt = article.title;
  document.querySelector('#dialog-label').textContent = `${article.label} · ${article.minutes} MIN READ`;
  document.querySelector('#dialog-title').textContent = article.title;
  document.querySelector('#dialog-excerpt').textContent = article.excerpt;
  document.querySelector('#dialog-byline').textContent = `${article.author} · ${article.date}`;
  dialog.showModal();
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelector('#menu-toggle').addEventListener('click', () => document.querySelector('#mobile-nav').classList.toggle('open'));
