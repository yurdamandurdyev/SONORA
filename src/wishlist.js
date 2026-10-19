import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/instrument-sans/wght.css';
import './style.css';
import './wishlist.css';
import './cart.css';
import { products } from './catalog.js';
import { cartImage, drawerMarkup } from './cartDrawer.js';

let favorites = JSON.parse(localStorage.getItem('sonora-favorites') || '[]');
let cart = JSON.parse(localStorage.getItem('sonora-cart') || '[]');
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const icon = (name, size = 20) => {
  const paths = {
    heart: '<path d="M20.8 8.5c0 4.2-8.8 10.2-8.8 10.2S3.2 12.7 3.2 8.5a4.6 4.6 0 0 1 8.8-1.8 4.6 4.6 0 0 1 8.8 1.8Z"/>',
    bag: '<path d="M4 8h16l-1 13H5L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    user: '<circle cx="12" cy="8" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
    menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
    close: '<path d="M5 5l14 14M19 5 5 19"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
};

document.querySelector('#app').innerHTML = `
  <header class="site-header"><a class="brand" href="/index.html" aria-label="SONORA home">SONORA<span>●</span></a><nav class="desktop-nav" aria-label="Main navigation"><a href="/shop.html">Shop</a><a href="/shop.html?format=Vinyl">Vinyl</a><a href="/shop.html?format=CD">CDs</a><a href="/shop.html?format=Cassette">Cassettes</a><a href="/shop.html?format=Audio">Audio</a><a href="/discover.html">Discover</a></nav><div class="header-actions"><a class="text-icon" href="/shop.html" aria-label="Search products">${icon('search')}</a><a class="text-icon wishlist-header-heart" href="/wishlist.html" aria-label="Your collection" aria-current="page">${icon('heart')}<span class="count" id="favorite-count">0</span></a><button class="text-icon" id="cart-toggle" aria-label="Open cart">${icon('bag')}<span class="count" id="cart-count">0</span></button><a class="text-icon account-link" href="/login.html" aria-label="Sign in">${icon('user')}</a><button class="text-icon mobile-menu" id="menu-toggle" aria-label="Open menu">${icon('menu')}</button></div></header>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation"><a href="/shop.html">Shop</a><a href="/shop.html?format=Vinyl">Vinyl</a><a href="/shop.html?format=CD">CDs</a><a href="/shop.html?format=Cassette">Cassettes</a><a href="/shop.html?format=Audio">Audio</a><a href="/discover.html">Discover</a></nav>
  <main class="wishlist-main"><div class="wishlist-intro"><p class="eyebrow">ACCOUNT</p><h1>YOUR<br><span>COLLECTION</span></h1><p id="saved-count" aria-live="polite"></p></div><div class="wishlist-grid" id="wishlist-grid"></div><div class="wishlist-empty" id="wishlist-empty" hidden><h2>Your collection starts here.</h2><p>Save records, tapes and audio you love with the heart on any product.</p><a href="/shop.html" class="button button-dark">EXPLORE THE STORE →</a></div></main>
  <footer><div class="footer-top"><div><a class="brand footer-brand" href="/index.html">SONORA</a><p>A curated music marketplace for curious listeners and dedicated collectors.</p></div><div><h4>Shop</h4><a href="/shop.html">All Products</a><a href="/shop.html?format=Vinyl">Vinyl</a><a href="/shop.html?format=CD">CDs</a><a href="/shop.html?format=Cassette">Cassettes</a><a href="/shop.html?format=Audio">Audio</a></div><div><h4>Discover</h4><a href="/discover.html">Editorial</a><a href="/discover.html#staff-heading">Staff Picks</a></div><div><h4>About</h4><a href="/index.html#about">Our Story</a><a href="mailto:hello@sonora.shop">Contact</a></div></div><div class="footer-bottom"><span>© 2026 SONORA. Play it loud. Keep it close.</span><span>Vinyl / CDs / Cassettes / Audio Equipment</span></div></footer>
  <div class="drawer-backdrop" id="drawer-backdrop"></div><aside class="drawer" id="drawer" aria-label="Shopping cart" aria-hidden="true"><div class="drawer-header"><div class="drawer-heading"><h2 id="drawer-title">YOUR CART</h2><span id="drawer-count"></span></div><button id="drawer-close" type="button" aria-label="Close cart">${icon('close')}</button></div><div class="drawer-content" id="drawer-content"></div><div class="drawer-footer" id="drawer-footer"></div></aside><div class="toast" id="cart-toast" role="status" aria-live="polite"></div>
`;

const productById = new Map(products.map(product => [product.id, product]));
function imageFor(product) {
  return [1, 2, 4].includes(product.id) ? `/wishlist/product-${product.id}.png` : cartImage(product);
}
function renderWishlist() {
  const saved = favorites.map(id => productById.get(id)).filter(Boolean);
  document.querySelector('#saved-count').textContent = `${saved.length} ${saved.length === 1 ? 'item' : 'items'} saved`;
  document.querySelector('#favorite-count').textContent = saved.length;
  document.querySelector('#cart-count').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelector('#wishlist-empty').hidden = saved.length !== 0;
  document.querySelector('#wishlist-grid').innerHTML = saved.map(product => `<article class="wishlist-card"><div class="wishlist-image-wrap"><a href="/shop.html?format=${encodeURIComponent(product.format)}" aria-label="Browse ${product.format}"><img src="${imageFor(product)}" alt="${product.artist} — ${product.title}" width="248" height="248" loading="lazy"></a><button type="button" class="wishlist-remove" data-unfavorite="${product.id}" aria-label="Remove ${product.artist} — ${product.title} from favorites" aria-pressed="true"><img src="/shop-assets/heart.svg" alt=""></button></div><div class="wishlist-meta"><span class="${product.format.toLowerCase()}">${product.format === 'Audio' ? 'AUDIO EQUIPMENT' : `${product.format.toUpperCase()} · ${product.year}`}</span><strong>${money(product.price)}</strong></div><p>${product.artist}</p><h2>${product.title}</h2></article>`).join('');
}
function renderCart() {
  const panel = drawerMarkup('cart', products, cart, favorites, money);
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
document.querySelector('#wishlist-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-unfavorite]');
  if (!button) return;
  favorites = favorites.filter(id => id !== Number(button.dataset.unfavorite));
  localStorage.setItem('sonora-favorites', JSON.stringify(favorites));
  renderWishlist();
});
document.querySelector('#cart-toggle').addEventListener('click', () => {
  cart = JSON.parse(localStorage.getItem('sonora-cart') || '[]');
  renderCart();
  document.querySelector('#drawer').classList.add('open');
  document.querySelector('#drawer').setAttribute('aria-hidden', 'false');
  document.querySelector('#drawer-backdrop').classList.add('open');
  document.body.classList.add('no-scroll');
  document.querySelector('#drawer-close').focus();
});
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
  renderWishlist();
});
document.querySelector('#menu-toggle').addEventListener('click', () => document.querySelector('#mobile-nav').classList.toggle('open'));
window.addEventListener('storage', event => {
  if (event.key === 'sonora-favorites') favorites = JSON.parse(event.newValue || '[]');
  if (event.key === 'sonora-cart') cart = JSON.parse(event.newValue || '[]');
  renderWishlist();
});
renderWishlist();
