import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/instrument-sans/wght.css';
import './style.css';
import './shop.css';
import { products } from './catalog.js';

const formatNames = ['Vinyl', 'CD', 'Cassette', 'Audio'];
const genreNames = ['Post-Punk', 'Ambient', 'Jazz', 'Dream Pop', 'Electronic', 'Art Pop', 'Shoegaze'];
const params = new URLSearchParams(location.search);
const initialFormat = params.get('format');
const isVinylPage = initialFormat === 'Vinyl';
const isCdPage = initialFormat === 'CD';
const isCassettePage = initialFormat === 'Cassette';
document.body.classList.toggle('vinyl-page', isVinylPage);
document.body.classList.toggle('cd-page', isCdPage);
document.body.classList.toggle('cassette-page', isCassettePage);
const heroKey = isVinylPage ? 'vinyl' : isCdPage ? 'cd' : isCassettePage ? 'cassette' : 'shop';
const shopArtNames = ['heads', 'eno', 'tones', 'cocteau', 'aphex', 'technics', 'joy', 'grouper', 'kate', 'jazz', 'broadcast', 'audio-technica'];
const heroAlt = {
  shop: 'Vinyl record, cassette, CD, headphones and turntable',
  vinyl: 'Vinyl record and an electric blue sound wave',
  cd: 'Black and silver compact discs on a blue graphic background',
  cassette: 'Cassette tape surrounded by flowing ribbon and blue sound waves'
};
const heroArt = `<img class="collection-hero-image" src="${heroKey === 'shop' ? '/shop-assets/hero.png' : heroKey === 'vinyl' ? '/vinyl-assets/hero.png' : heroKey === 'cd' ? '/cd-assets/hero.png' : `/illustrations/${heroKey}.png`}" alt="${heroAlt[heroKey]}" width="${heroKey === 'shop' ? 477 : heroKey === 'vinyl' ? 524 : heroKey === 'cd' ? 525 : 1536}" height="${heroKey === 'shop' ? 318 : heroKey === 'vinyl' ? 349 : heroKey === 'cd' ? 350 : 1024}">`;
const state = {
  formats: new Set(formatNames.includes(initialFormat) ? [initialFormat] : []),
  genres: new Set(),
  maxPrice: 500,
  inStock: false,
  search: '',
  sort: 'featured',
  cart: JSON.parse(localStorage.getItem('sonora-cart') || '[]'),
  favorites: JSON.parse(localStorage.getItem('sonora-favorites') || '[]')
};
const money = value => `$${value.toFixed(2)}`;
const icons = {
  heart: '<path d="M20.8 8.5c0 4.2-8.8 10.2-8.8 10.2S3.2 12.7 3.2 8.5a4.6 4.6 0 0 1 8.8-1.8 4.6 4.6 0 0 1 8.8 1.8Z"/>',
  bag: '<path d="M4 8h16l-1 13H5L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  close: '<path d="M5 5l14 14M19 5 5 19"/>',
  menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
  arrow: '<path d="M4 12h16m-7-7 7 7-7 7"/>',
  plus: '<path d="M4 12h16M12 4v16"/>',
  minus: '<path d="M4 12h16"/>'
};
const icon = (name, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

document.querySelector('#app').innerHTML = `
  <header class="site-header" id="top"><a class="brand" href="/index.html" aria-label="SONORA home">SONORA<span>●</span></a><nav class="desktop-nav" aria-label="Main navigation"><a href="/shop.html" ${!initialFormat ? 'aria-current="page"' : ''}>Shop</a><a href="/shop.html?format=Vinyl" ${isVinylPage ? 'aria-current="page"' : ''}>Vinyl</a><a href="/shop.html?format=CD" ${isCdPage ? 'aria-current="page"' : ''}>CDs</a><a href="/shop.html?format=Cassette" ${isCassettePage ? 'aria-current="page"' : ''}>Cassettes</a><a href="/shop.html?format=Audio">Audio</a><a href="/index.html#discover">Discover</a></nav><div class="header-actions"><button class="text-icon" id="favorites-toggle" aria-label="Show favorites">${icon('heart')}<span class="count" id="favorite-count">0</span></button><button class="text-icon" id="cart-toggle" aria-label="Open cart">${icon('bag')}<span class="count" id="cart-count">0</span></button><button class="text-icon mobile-menu" id="menu-toggle" aria-label="Open menu">${icon('menu')}</button></div></header>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation"><a href="/shop.html">Shop</a><a href="/index.html#formats">Formats</a><a href="/index.html#discover">Discover</a><a href="/index.html#about">About</a></nav>
  <main>
    <section class="shop-hero"><div class="shop-hero-copy"><p class="eyebrow">${isVinylPage ? 'VINYL' : isCdPage ? 'CD' : isCassettePage ? 'CASSETTE' : 'ALL FORMATS'}</p><h1>${isVinylPage ? 'VINYL' : isCdPage ? 'CD' : isCassettePage ? 'CASSETTE' : 'ALL MUSIC'}<br><em>&amp; AUDIO</em></h1><p>Explore records, tapes, CDs, and equipment selected for curious listeners and dedicated collectors.</p></div>${heroArt}</section>
    <div class="shop-layout"><aside class="shop-sidebar" id="shop-sidebar" aria-label="Catalog filters"><div class="mobile-filter-head"><strong>Filters</strong><button id="close-filters" aria-label="Close filters">${icon('close')}</button></div><fieldset><legend>FORMAT</legend>${formatNames.map(format => `<label><input type="checkbox" name="format" value="${format}" ${state.formats.has(format) ? 'checked' : ''}><span>${format === 'Audio' ? 'Audio Equipment' : format}</span></label>`).join('')}</fieldset><fieldset><legend>GENRE</legend>${genreNames.map(genre => `<label><input type="checkbox" name="genre" value="${genre}"><span>${genre}</span></label>`).join('')}</fieldset><fieldset><legend>MAX PRICE</legend><div class="price-value"><span>Up to</span><strong id="price-label">$500</strong></div><input id="price-range" type="range" min="0" max="500" step="10" value="500" aria-label="Maximum price"></fieldset><fieldset><legend>AVAILABILITY</legend><label><input id="in-stock" type="checkbox"><span>In stock only</span></label></fieldset><button class="clear-filters" id="clear-filters">Clear filters</button></aside><div class="shop-content"><div class="shop-toolbar"><button class="open-filters" id="open-filters">Filters</button><label class="shop-search"><span class="shop-search-icon"><img src="/shop-assets/search-circle.svg" alt=""><img src="/shop-assets/search-handle.svg" alt=""></span><input id="shop-search" type="search" placeholder="Search artists, albums..." aria-label="Search artists and albums"></label><div class="shop-count" id="shop-count" aria-live="polite"></div><label class="sr-only" for="shop-sort">Sort products</label><select id="shop-sort"><option value="featured">FEATURED</option><option value="price-asc">PRICE: LOW TO HIGH</option><option value="price-desc">PRICE: HIGH TO LOW</option><option value="artist">ARTIST A–Z</option><option value="newest">NEWEST</option></select></div><div class="shop-products" id="shop-products"></div><p class="no-results" id="no-results" hidden>No products match these filters. Try another search or clear your filters.</p></div></div>
  </main>
  <footer><div class="footer-top"><div><a class="brand footer-brand" href="/index.html">SONORA</a><p>A curated music marketplace for curious listeners and dedicated collectors.</p></div><div><h4>Shop</h4><a href="/shop.html">All Products</a><a href="/shop.html?format=Vinyl">Vinyl</a><a href="/shop.html?format=CD">CDs</a><a href="/shop.html?format=Cassette">Cassettes</a><a href="/shop.html?format=Audio">Audio</a></div><div><h4>Discover</h4><a href="/index.html#discover">Editorial</a><a href="/index.html#discover">Staff Picks</a><a href="/shop.html">New Arrivals</a><a href="/index.html#formats">Genre Guides</a></div><div><h4>About</h4><a href="/index.html#about">Our Story</a><a href="/index.html#formats">Curation</a><a href="mailto:hello@sonora.shop">Contact</a><a href="/index.html#discover">Press</a></div></div><div class="footer-bottom"><span>© 2026 SONORA. Play it loud. Keep it close.</span><span>Vinyl / CDs / Cassettes / Audio Equipment</span></div></footer>
  <div class="drawer-backdrop" id="drawer-backdrop"></div><aside class="drawer" id="drawer" aria-label="Shopping panel" aria-hidden="true"><div class="drawer-header"><h2 id="drawer-title">Your Bag</h2><button id="drawer-close" aria-label="Close panel">${icon('close')}</button></div><div class="drawer-content" id="drawer-content"></div><div class="drawer-footer" id="drawer-footer"></div></aside><div class="toast" id="toast" role="status" aria-live="polite"></div>
`;

function productCard(product) {
  const hasVinylPhoto = isVinylPage && product.collection === 'vinyl' && product.id >= 13 && product.id <= 28;
  const hasCdPhoto = isCdPage && product.collection === 'cd' && product.id >= 29 && product.id <= 44;
  const hasPhoto = (!initialFormat && product.id <= shopArtNames.length) || hasVinylPhoto || hasCdPhoto;
  const artName = shopArtNames[product.id - 1];
  const photoBase = hasVinylPhoto ? `/vinyl-assets/product-${product.id}` : hasCdPhoto ? `/cd-assets/product-${product.id}` : product.id <= 6 ? `/home/raw-product-${artName}` : `/shop-assets/${artName}${product.id === 9 || product.id === 10 ? '-clean' : ''}`;
  const hasHighRes = !hasVinylPhoto && !hasCdPhoto && (product.id <= 8 || product.id === 11 || product.id === 12);
  const photo = hasPhoto ? `<img class="shop-product-image" src="${photoBase}.png" ${hasHighRes ? `srcset="${photoBase}-hires.png 2x"` : ''} alt="${product.artist} — ${product.title}" loading="lazy">` : `<div class="album-art"><span>${product.artist}<small>${product.title}</small></span></div>`;
  const badge = product.badge ? `<span class="product-badge ${product.stock ? '' : 'sold'}">${product.badge}</span>` : '';
  const saved = state.favorites.includes(product.id);
  return `<article class="shop-product-card"><div class="product-art ${product.art} ${hasPhoto ? 'has-shop-image' : ''}">${photo}${badge}<button class="favorite ${saved ? 'selected' : ''}" data-favorite="${product.id}" aria-label="${saved ? 'Remove from' : 'Add to'} favorites" aria-pressed="${saved}">${hasPhoto ? '<img src="/shop-assets/heart.svg" alt="">' : icon('heart',15)}</button><button class="quick-add" data-add="${product.id}" ${product.stock ? '' : 'disabled'}>${product.stock ? 'Quick Add' : 'Sold Out'} ${product.stock ? icon('plus',15) : ''}</button></div><div class="product-meta"><span>${product.format === 'Audio' ? 'AUDIO EQUIPMENT' : `${product.format.toUpperCase()} · ${product.year}`}</span><strong>${money(product.price)}</strong></div><h3>${product.artist}</h3><p>${product.title}</p>${product.stock ? '' : '<small class="out-of-stock">OUT OF STOCK</small>'}</article>`;
}
function filteredProducts() {
  const result = products.filter(product => {
    const isCurrentCollection = initialFormat ? product.collection === { Vinyl: 'vinyl', CD: 'cd', Cassette: 'cassette' }[initialFormat] : state.formats.size > 0 || !product.collection;
    return isCurrentCollection && (!state.formats.size || state.formats.has(product.format)) && (!state.genres.size || state.genres.has(product.genre)) && product.price <= state.maxPrice && (!state.inStock || product.stock) && `${product.artist} ${product.title} ${product.format} ${product.genre}`.toLowerCase().includes(state.search);
  });
  if (state.sort === 'price-asc') result.sort((a,b) => a.price - b.price);
  if (state.sort === 'price-desc') result.sort((a,b) => b.price - a.price);
  if (state.sort === 'artist') result.sort((a,b) => a.artist.localeCompare(b.artist));
  if (state.sort === 'newest') result.sort((a,b) => Number(b.year) - Number(a.year));
  return result;
}
function renderProducts() {
  const result = filteredProducts();
  document.querySelector('#shop-products').innerHTML = result.map(productCard).join('');
  document.querySelector('#shop-count').textContent = `${result.length} ${result.length === 1 ? 'item' : 'items'}`;
  document.querySelector('#no-results').hidden = result.length !== 0;
}
function persist() {
  localStorage.setItem('sonora-cart', JSON.stringify(state.cart));
  localStorage.setItem('sonora-favorites', JSON.stringify(state.favorites));
  document.querySelector('#cart-count').textContent = state.cart.reduce((sum,item) => sum + item.qty, 0);
  document.querySelector('#favorite-count').textContent = state.favorites.length;
}
function toast(message) { const node = document.querySelector('#toast'); node.textContent = message; node.classList.add('show'); clearTimeout(toast.timer); toast.timer = setTimeout(() => node.classList.remove('show'), 2800); }
function openDrawer(kind) { const drawer = document.querySelector('#drawer'); drawer.dataset.kind = kind; drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); document.querySelector('#drawer-backdrop').classList.add('open'); document.body.classList.add('no-scroll'); renderDrawer(); }
function closeDrawer() { const drawer = document.querySelector('#drawer'); drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); document.querySelector('#drawer-backdrop').classList.remove('open'); document.body.classList.remove('no-scroll'); }
function renderDrawer() {
  const kind = document.querySelector('#drawer').dataset.kind;
  const ids = kind === 'favorites' ? state.favorites : state.cart.map(item => item.id);
  const items = ids.map(id => products.find(product => product.id === id)).filter(Boolean);
  document.querySelector('#drawer-title').textContent = kind === 'favorites' ? 'Saved Sounds' : 'Your Bag';
  document.querySelector('#drawer-content').innerHTML = items.length ? items.map(product => `<div class="drawer-item"><div class="mini-art ${product.art}"><span>${product.artist}</span></div><div><small>${product.format} · ${product.year}</small><h3>${product.artist}</h3><p>${product.title}</p><strong>${money(product.price)}</strong>${kind === 'cart' ? `<div class="quantity"><button data-qty="${product.id}" data-delta="-1" aria-label="Decrease quantity">${icon('minus',14)}</button><span>${state.cart.find(item => item.id === product.id)?.qty || 0}</span><button data-qty="${product.id}" data-delta="1" aria-label="Increase quantity">${icon('plus',14)}</button></div>` : product.stock ? `<button class="drawer-add" data-add="${product.id}">Add to bag ${icon('arrow',14)}</button>` : '<small>Sold out</small>'}</div></div>`).join('') : `<div class="empty-state"><span>◎</span><h3>${kind === 'favorites' ? 'Nothing saved yet.' : 'Your bag is waiting.'}</h3><p>Find something worth keeping.</p><button class="button button-dark" id="continue-shopping">Explore the store ${icon('arrow',16)}</button></div>`;
  const total = state.cart.reduce((sum,item) => sum + (products.find(product => product.id === item.id)?.price || 0) * item.qty, 0);
  document.querySelector('#drawer-footer').innerHTML = kind === 'cart' && items.length ? `<div class="subtotal"><span>Subtotal</span><strong>${money(total)}</strong></div><p>Shipping calculated at checkout.</p><button class="checkout" id="checkout">Continue to Checkout ${icon('arrow',17)}</button>` : '';
}
document.querySelector('#shop-sidebar').addEventListener('change', event => {
  const target = event.target;
  if (target.name === 'format' || target.name === 'genre') { const selected = target.name === 'format' ? state.formats : state.genres; target.checked ? selected.add(target.value) : selected.delete(target.value); }
  if (target.id === 'in-stock') state.inStock = target.checked;
  renderProducts();
});
document.querySelector('#price-range').addEventListener('input', event => { state.maxPrice = Number(event.target.value); document.querySelector('#price-label').textContent = `$${state.maxPrice}`; renderProducts(); });
document.querySelector('#shop-search').addEventListener('input', event => { state.search = event.target.value.trim().toLowerCase(); renderProducts(); });
document.querySelector('#shop-sort').addEventListener('change', event => { state.sort = event.target.value; renderProducts(); });
document.querySelector('#clear-filters').addEventListener('click', () => { state.formats.clear(); state.genres.clear(); state.maxPrice = 500; state.inStock = false; state.search = ''; document.querySelectorAll('#shop-sidebar input[type="checkbox"]').forEach(input => input.checked = false); document.querySelector('#price-range').value = '500'; document.querySelector('#price-label').textContent = '$500'; document.querySelector('#shop-search').value = ''; history.replaceState(null,'',location.pathname); renderProducts(); });
document.addEventListener('click', event => {
  const add = event.target.closest('[data-add]'); if (add) { const id = Number(add.dataset.add); const product = products.find(item => item.id === id); if (!product?.stock) return; const item = state.cart.find(entry => entry.id === id); item ? item.qty++ : state.cart.push({id,qty:1}); persist(); toast(`${product.artist} added to bag`); if (document.querySelector('#drawer').classList.contains('open')) renderDrawer(); return; }
  const favorite = event.target.closest('[data-favorite]'); if (favorite) { const id = Number(favorite.dataset.favorite); state.favorites = state.favorites.includes(id) ? state.favorites.filter(value => value !== id) : [...state.favorites,id]; persist(); renderProducts(); if (document.querySelector('#drawer').classList.contains('open')) renderDrawer(); return; }
  const quantity = event.target.closest('[data-qty]'); if (quantity) { const id = Number(quantity.dataset.qty); const item = state.cart.find(entry => entry.id === id); item.qty += Number(quantity.dataset.delta); state.cart = state.cart.filter(entry => entry.qty > 0); persist(); renderDrawer(); return; }
  if (event.target.closest('#continue-shopping')) closeDrawer();
  if (event.target.closest('#checkout')) toast('Checkout is coming soon. Your selections are saved in this browser.');
});
document.querySelector('#favorites-toggle').addEventListener('click', () => openDrawer('favorites'));
document.querySelector('#cart-toggle').addEventListener('click', () => openDrawer('cart'));
document.querySelector('#drawer-close').addEventListener('click', closeDrawer);
document.querySelector('#drawer-backdrop').addEventListener('click', closeDrawer);
document.querySelector('#menu-toggle').addEventListener('click', () => document.querySelector('#mobile-nav').classList.toggle('open'));
document.querySelectorAll('#mobile-nav a').forEach(link => link.addEventListener('click', () => document.querySelector('#mobile-nav').classList.remove('open')));
document.querySelector('#open-filters').addEventListener('click', () => document.querySelector('#shop-sidebar').classList.add('open'));
document.querySelector('#close-filters').addEventListener('click', () => document.querySelector('#shop-sidebar').classList.remove('open'));
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeDrawer(); document.querySelector('#shop-sidebar').classList.remove('open'); } });
renderProducts(); persist();
