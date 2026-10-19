import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/instrument-sans/wght.css';
import './style.css';
import './home.css';
import './cart.css';
import { products as catalog } from './catalog.js';
import { drawerMarkup } from './cartDrawer.js';

const products = catalog;
const featuredProducts = catalog.slice(0, 6);
const homeProductImages = ['heads', 'eno', 'tones', 'cocteau', 'aphex', 'technics'];
const categories = [
  { name: 'VINYL', count: '340+ records', detail: 'LPs, 7"s, limited pressings', art: 'vinyl' },
  { name: 'CDs', count: '180+ titles', detail: 'Digipaks, jewel cases, box sets', art: 'cd' },
  { name: 'CASSETTES', count: '90+ tapes', detail: 'Chrome tapes, lo-fi culture', art: 'cassette' },
  { name: 'AUDIO', count: '60+ items', detail: 'Turntables, amps, accessories', art: 'audio' }
];
const articles = [
  { tag: 'LISTENING GUIDE · 4 min read', title: '5 Records for a Slow Sunday', excerpt: 'When the pace drops and the light goes soft, these are the records we reach for.', art: 'sunday' },
  { tag: 'FORMAT CULTURE · 6 min read', title: 'Why Cassettes Are Still Interesting', excerpt: 'The cassette revival was supposed to be a passing phase. It never really left.', art: 'tape' },
  { tag: 'STAFF PICKS · 3 min read', title: "Staff Picks: Autumn's Essential Releases", excerpt: 'As the light changes, so does what we reach for. Meet the season’s favorites.', art: 'autumn' }
];
let activeFormat = 'All';
let cart = JSON.parse(localStorage.getItem('sonora-cart') || '[]');
let favorites = JSON.parse(localStorage.getItem('sonora-favorites') || '[]');
const money = n => `$${n.toFixed(2)}`;
const icon = (name, size = 20) => {
  const paths = {
    bag: '<path d="M4 8h16l-1 13H5L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
    heart: '<path d="M20.8 8.5c0 4.2-8.8 10.2-8.8 10.2S3.2 12.7 3.2 8.5a4.6 4.6 0 0 1 8.8-1.8 4.6 4.6 0 0 1 8.8 1.8Z"/>',
    arrow: '<path d="M4 12h16m-7-7 7 7-7 7"/>',
    close: '<path d="M5 5l14 14M19 5 5 19"/>',
    menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
    minus: '<path d="M4 12h16"/>',
    plus: '<path d="M4 12h16M12 4v16"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};

document.querySelector('#app').innerHTML = `
  <header class="site-header" id="top">
    <a class="brand" href="#top" aria-label="SONORA home">SONORA<span>●</span></a>
    <nav class="desktop-nav" aria-label="Main navigation"><a href="/shop.html">Shop</a><a href="#formats">Formats</a><a href="/discover.html">Discover</a><a href="#about">About</a></nav>
    <div class="header-actions"><button class="text-icon" id="favorites-toggle" aria-label="Show favorites">${icon('heart')}<span class="count" id="favorite-count">0</span></button><button class="text-icon" id="cart-toggle" aria-label="Open cart">${icon('bag')}<span class="count" id="cart-count">0</span></button><button class="text-icon mobile-menu" id="menu-toggle" aria-label="Open menu">${icon('menu')}</button></div>
  </header>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation"><a href="/shop.html">Shop</a><a href="#formats">Formats</a><a href="/discover.html">Discover</a><a href="#about">About</a></nav>
  <main>
    <section class="hero"><div class="hero-copy reveal"><p class="eyebrow">Curated Physical Media — Est. 2026</p><h1>PHYSICAL<br>SOUNDS.<br><em>REAL</em><br>OBJECTS.</h1><p class="hero-description">Vinyl, CDs, cassettes and the objects that keep music alive.</p><div class="button-row"><a class="button button-dark" href="/shop.html">Shop Music ${icon('arrow', 17)}</a><a class="button button-outline" href="/shop.html?format=Audio">Explore Audio</a></div></div><div class="hero-art" role="img" aria-label="Editorial illustration of a vinyl record with blue rays and vivid geometric shapes"></div></section>
    <div class="ticker" aria-hidden="true"><div class="ticker-track">${Array(4).fill('VINYL · CDs · CASSETTES · AUDIO · CURATED LISTENING · PHYSICAL MEDIA · EST. 2026 · ').join('')}</div></div>
    <section class="section" id="formats"><div class="section-heading reveal"><div><p class="eyebrow">THE COLLECTION</p><h2>CHOOSE YOUR<br><em>FORMAT.</em></h2></div><p>The format matters. Each one sounds and feels different. Find the one that speaks to you.</p></div><div class="category-grid">${categories.map(c => `<a class="category-card reveal" href="/shop.html?format=${c.name === 'VINYL' ? 'Vinyl' : c.name === 'CDs' ? 'CD' : c.name === 'CASSETTES' ? 'Cassette' : 'Audio'}">${c.art === 'vinyl' ? '' : `<img class="category-photo" src="/home/raw-category-${c.art}.png" srcset="/home/raw-category-${c.art}-hires.png 2x" alt="" loading="lazy">`}<div class="category-info"><span class="eyebrow">${c.count}</span><div class="category-bottom"><h3>${c.name}</h3><p>${c.detail}</p><span class="category-link">Explore ${icon('arrow', 15)}</span></div></div></a>`).join('')}</div></section>
    <section class="section section-products" id="shop"><div class="section-heading reveal"><div><p class="eyebrow">OUR CURRENT FAVORITES</p><h2>CURRENTLY IN<br><em>ROTATION.</em></h2></div><a class="inline-link" href="/shop.html" id="view-all">View All ${icon('arrow', 17)}</a></div><div class="filter-row" aria-label="Filter products">${['All','Vinyl','CD','Cassette','Audio'].map(f => `<button class="filter ${f === 'All' ? 'active' : ''}" data-filter="${f}">${f}</button>`).join('')}</div><div class="product-grid" id="product-grid"></div></section>
    <section class="editorial section" id="discover"><div class="section-heading reveal"><div><p class="eyebrow">STORIES & SOUNDS</p><h2>FROM THE<br><em>DISCOVER DESK.</em></h2></div><a class="inline-link" href="/discover.html">All Articles ${icon('arrow', 17)}</a></div><div class="article-grid">${articles.map((a,i) => `<article class="article-card reveal"><img class="article-photo" src="/home/raw-article-${a.art === 'tape' ? 'cassette' : a.art}.png" srcset="/home/raw-article-${a.art === 'tape' ? 'cassette' : a.art}-hires.png 2x" alt="" loading="lazy"><div class="article-body"><p class="eyebrow">${a.tag}</p><h3>${a.title}</h3><p>${a.excerpt}</p><button class="read-link" data-article="${i}">Read Story ${icon('arrow',16)}</button></div></article>`).join('')}</div></section>
    <section class="spotlight section"><div class="section-heading reveal"><div><p class="eyebrow">FORMAT SPOTLIGHT</p><h2>KNOW YOUR<br><em>MEDIUM.</em></h2></div></div><div class="spotlight-grid"><article class="spotlight-card reveal"><span class="format-symbol">●</span><h3>VINYL</h3><strong>The warm standard.</strong><p>Analog audio pressed into lacquer. Vinyl rewards focused listening and the ritual of putting on a record.</p><ul><li>33⅓ or 45 RPM</li><li>12" or 7" diameter</li><li>Up to 22 min per side</li></ul><a href="#shop" data-filter="Vinyl">Shop VINYL ${icon('arrow',16)}</a></article><article class="spotlight-card reveal"><span class="format-symbol">◎</span><h3>CD</h3><strong>Digital precision.</strong><p>Perfect fidelity in a compact package. The most underrated way to build a collection that lasts.</p><ul><li>74 minutes of audio</li><li>No degradation in quality</li><li>Built to last 100+ years</li></ul><a href="#shop" data-filter="CD">Shop CD ${icon('arrow',16)}</a></article><article class="spotlight-card reveal"><span class="format-symbol">▷</span><h3>CASSETTE</h3><strong>Lo-fi character.</strong><p>Hiss, warmth, and a tactile intimacy unlike any other format. A little imperfect in all the right ways.</p><ul><li>C-30 to C-120 tapes</li><li>Chrome or ferric oxide</li><li>Walkman-ready always</li></ul><a href="#shop" data-filter="Cassette">Shop CASSETTE ${icon('arrow',16)}</a></article></div></section>
    <section class="newsletter"><div class="newsletter-inner reveal"><div class="newsletter-copy"><h2>STAY IN THE<br><em>LOOP.</em></h2><p>New arrivals, editorial, and staff picks. No noise, no spam — just music worth knowing about.</p></div><div class="newsletter-action"><form id="newsletter-form"><label class="sr-only" for="email">Email address</label><input id="email" type="email" placeholder="Your email address" autocomplete="email" required><button type="submit">Subscribe</button></form><p class="form-message" id="form-message" aria-live="polite"></p></div></div></section>
    <section class="closing" id="about"><h2>FOR LISTENERS,<br>COLLECTORS,<br>AND CURIOUS<br>MINDS.</h2><div class="closing-aside"><p>We curate music that is worth owning. Not just collecting — listening to, returning to, discovering something new every time.</p><a class="button button-dark" href="/shop.html">Explore the Store ${icon('arrow',17)}</a></div></section>
  </main>
  <footer><div class="footer-top"><div><a class="brand footer-brand" href="#top">SONORA</a><p>A curated music marketplace for curious listeners and dedicated collectors.</p></div><div><h4>Shop</h4><a href="/shop.html">All Products</a><a href="/shop.html?format=Vinyl">Vinyl</a><a href="/shop.html?format=CD">CDs</a><a href="/shop.html?format=Cassette">Cassettes</a><a href="/shop.html?format=Audio">Audio</a></div><div><h4>Discover</h4><a href="/discover.html">Editorial</a><a href="/discover.html#staff-heading">Staff Picks</a><a href="/shop.html">New Arrivals</a><a href="/discover.html">Genre Guides</a></div><div><h4>About</h4><a href="#about">Our Story</a><a href="#formats">Curation</a><a href="mailto:hello@sonora.shop">Contact</a><a href="/discover.html">Press</a></div></div><div class="footer-bottom"><span>© 2026 SONORA. Play it loud. Keep it close.</span><span>Vinyl / CDs / Cassettes / Audio Equipment</span></div></footer>
  <div class="drawer-backdrop" id="drawer-backdrop"></div><aside class="drawer" id="drawer" aria-label="Shopping panel" aria-hidden="true"><div class="drawer-header"><div class="drawer-heading"><h2 id="drawer-title">YOUR CART</h2><span id="drawer-count"></span></div><button id="drawer-close" aria-label="Close panel">${icon('close')}</button></div><div class="drawer-content" id="drawer-content"></div><div class="drawer-footer" id="drawer-footer"></div></aside>
  <div class="modal-backdrop" id="modal-backdrop"><div class="story-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" id="modal-close" aria-label="Close story">${icon('close')}</button><p class="eyebrow" id="modal-tag"></p><h2 id="modal-title"></h2><p id="modal-copy"></p><a class="button button-dark" href="#shop" id="modal-shop">Explore the collection ${icon('arrow',16)}</a></div></div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
`;

function renderProducts() {
  document.querySelector('#product-grid').innerHTML = featuredProducts.filter(p => activeFormat === 'All' || p.format === activeFormat).map(p => `<article class="product-card reveal visible"><div class="product-art ${p.art}"><img class="home-product-image" src="/home/raw-product-${homeProductImages[p.id - 1]}.png" srcset="/home/raw-product-${homeProductImages[p.id - 1]}-hires.png 2x" alt="${p.artist} — ${p.title}" loading="lazy">${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}<button class="favorite ${favorites.includes(p.id) ? 'selected' : ''}" data-favorite="${p.id}" aria-label="${favorites.includes(p.id) ? 'Remove from' : 'Add to'} favorites" aria-pressed="${favorites.includes(p.id)}">${icon('heart',15)}</button><button class="quick-add" data-add="${p.id}">Quick Add ${icon('plus',16)}</button></div><div class="product-meta"><span>${p.format} · ${p.year}</span><strong>${money(p.price)}</strong></div><h3>${p.artist}</h3><p>${p.title}</p></article>`).join('');
}
function persist() { localStorage.setItem('sonora-cart', JSON.stringify(cart)); localStorage.setItem('sonora-favorites', JSON.stringify(favorites)); document.querySelector('#cart-count').textContent = cart.reduce((n,i) => n+i.qty, 0); document.querySelector('#favorite-count').textContent = favorites.length; }
function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2800); }
function openDrawer(kind) { const drawer = document.querySelector('#drawer'); drawer.dataset.kind = kind; drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); document.querySelector('#drawer-backdrop').classList.add('open'); document.body.classList.add('no-scroll'); renderDrawer(); }
function closeDrawer() { document.querySelector('#drawer').classList.remove('open'); document.querySelector('#drawer').setAttribute('aria-hidden','true'); document.querySelector('#drawer-backdrop').classList.remove('open'); document.body.classList.remove('no-scroll'); }
function renderDrawer() {
  const panel = drawerMarkup(document.querySelector('#drawer').dataset.kind, products, cart, favorites, money);
  document.querySelector('#drawer-title').textContent = panel.title;
  document.querySelector('#drawer-count').textContent = panel.countLabel;
  document.querySelector('#drawer-content').innerHTML = panel.content;
  document.querySelector('#drawer-footer').innerHTML = panel.footer;
}
function setFilter(filter) { activeFormat = filter; document.querySelectorAll('.filter').forEach(b => b.classList.toggle('active',b.dataset.filter === filter)); renderProducts(); }
document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]'); if (add) { const id = Number(add.dataset.add); const item = cart.find(i => i.id === id); item ? item.qty++ : cart.push({id,qty:1}); persist(); toast(`${products.find(p => p.id === id).artist} added to bag`); if (document.querySelector('#drawer').classList.contains('open')) renderDrawer(); return; }
  const fav = e.target.closest('[data-favorite]'); if (fav) { const id = Number(fav.dataset.favorite); favorites = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites,id]; persist(); renderProducts(); if (document.querySelector('#drawer').classList.contains('open')) renderDrawer(); return; }
  const qty = e.target.closest('[data-qty]'); if (qty) { const id = Number(qty.dataset.qty); const item = cart.find(i => i.id === id); item.qty += Number(qty.dataset.delta); cart = cart.filter(i => i.qty > 0); persist(); renderDrawer(); return; }
  const remove = e.target.closest('[data-remove]'); if (remove) { cart = cart.filter(item => item.id !== Number(remove.dataset.remove)); persist(); renderDrawer(); return; }
  const filter = e.target.closest('[data-filter]'); if (filter) { setFilter(filter.dataset.filter); }
  const story = e.target.closest('[data-article]'); if (story) { const a = articles[Number(story.dataset.article)]; document.querySelector('#modal-tag').textContent = a.tag; document.querySelector('#modal-title').textContent = a.title; document.querySelector('#modal-copy').textContent = `${a.excerpt} At SONORA, listening is something you make time for. Every format has its own pace and every record has a story. Browse our collection to find the next one you'll want to keep close.`; document.querySelector('#modal-backdrop').classList.add('open'); document.body.classList.add('no-scroll'); }
  if (e.target.closest('#checkout')) toast('Checkout is coming soon. Your selections are saved in this browser.');
  if (e.target.closest('#continue-shopping')) closeDrawer();
});
document.querySelector('#cart-toggle').addEventListener('click', () => openDrawer('cart'));
document.querySelector('#favorites-toggle').addEventListener('click', () => openDrawer('favorites'));
document.querySelector('#drawer-close').addEventListener('click', closeDrawer);
document.querySelector('#drawer-backdrop').addEventListener('click', closeDrawer);
document.querySelector('#menu-toggle').addEventListener('click', () => document.querySelector('#mobile-nav').classList.toggle('open'));
document.querySelectorAll('#mobile-nav a').forEach(a => a.addEventListener('click', () => document.querySelector('#mobile-nav').classList.remove('open')));
document.querySelector('#modal-close').addEventListener('click', () => { document.querySelector('#modal-backdrop').classList.remove('open'); document.body.classList.remove('no-scroll'); });
document.querySelector('#modal-backdrop').addEventListener('click', e => { if (e.target.id === 'modal-backdrop') document.querySelector('#modal-close').click(); });
document.querySelector('#modal-shop').addEventListener('click', () => document.querySelector('#modal-close').click());
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); document.querySelector('#modal-close').click(); } });
document.querySelector('#newsletter-form').addEventListener('submit', e => { e.preventDefault(); const email = document.querySelector('#email').value.trim(); const subscribed = JSON.parse(localStorage.getItem('sonora-subscribers') || '[]'); if (!subscribed.includes(email)) subscribed.push(email); localStorage.setItem('sonora-subscribers', JSON.stringify(subscribed)); document.querySelector('#form-message').textContent = 'Saved on this device. Email delivery will be available when a mailing service is connected.'; e.target.reset(); });
document.querySelector('#view-all').addEventListener('click', () => setFilter('All'));
renderProducts(); persist();
if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:0.08}); document.querySelectorAll('.reveal').forEach(el => observer.observe(el)); } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
