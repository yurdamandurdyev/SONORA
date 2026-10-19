import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/instrument-sans/wght.css';
import './style.css';
import './account.css';
import { products } from './catalog.js';
import { cartImage } from './cartDrawer.js';

const session = JSON.parse(sessionStorage.getItem('sonora-demo-user') || localStorage.getItem('sonora-demo-user') || 'null');
if (!session?.email) location.replace('/login.html?next=%2Faccount.html');
else init();

function init() {
  const storageKey = `sonora-profile:${session.email.toLowerCase()}`;
  const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const profile = { first: '', last: '', formats: ['Vinyl', 'CD'], genres: ['Ambient', 'Post-Punk', 'Dream Pop'], notifications: { newsletter: true, orders: true, arrivals: false }, addresses: [], ...saved };
  const tabs = [['overview','Overview'],['orders','Orders'],['collection','Your Collection'],['addresses','Addresses'],['payment','Payment Methods'],['preferences','Preferences'],['settings','Account Settings']];
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const persist = () => localStorage.setItem(storageKey, JSON.stringify(profile));
  const favorites = () => JSON.parse(localStorage.getItem('sonora-favorites') || '[]').map(id => products.find(product => product.id === id)).filter(Boolean);
  const displayName = () => [profile.first, profile.last].filter(Boolean).join(' ') || session.email.split('@')[0];
  const initials = () => (profile.first?.[0] || session.email[0]).toUpperCase() + (profile.last?.[0] || '').toUpperCase();
  const tags = values => values.map(value => `<span class="account-tag">${escape(value)}</span>`).join('');
  const notice = text => { document.querySelector('#account-notice').textContent = text; };
  const image = product => [1,2,4].includes(product.id) ? `/wishlist/product-${product.id}.png` : cartImage(product);
  document.querySelector('#app').innerHTML = `<header class="account-header"><a class="account-logo" href="/index.html">SONORA</a><nav aria-label="Main navigation"><a href="/shop.html">SHOP</a><a href="/shop.html?format=Vinyl">VINYL</a><a href="/shop.html?format=CD">CDs</a><a href="/shop.html?format=Cassette">CASSETTES</a><a href="/shop.html?format=Audio">AUDIO</a><a href="/discover.html">DISCOVER</a></nav><div class="account-icons"><a href="/shop.html" aria-label="Search">⌕</a><a href="/wishlist.html" aria-label="Wishlist">♡</a><a href="/shop.html" aria-label="Shop">♧</a><span class="account-avatar account-mini-avatar">${escape(initials())}</span></div></header><main class="account-shell"><div class="account-user"><span class="account-avatar" id="profile-avatar">${escape(initials())}</span><div><h1 id="profile-name">${escape(displayName())}</h1><p>${escape(session.email)} · Demo profile in this browser</p></div></div><div class="account-columns"><nav class="account-side" aria-label="Account sections">${tabs.map(([key,label]) => `<button type="button" data-tab="${key}">${label}</button>`).join('')}<button type="button" id="sign-out">Sign Out</button></nav><section class="account-content" id="account-content" aria-live="polite"></section></div><p class="account-notice" id="account-notice" role="status"></p></main>`;
  const currentTab = () => new URLSearchParams(location.search).get('tab') || 'overview';
  function render(tab = currentTab()) {
    if (!tabs.some(([key]) => key === tab)) tab = 'overview';
    document.querySelectorAll('[data-tab]').forEach(button => { button.classList.toggle('active', button.dataset.tab === tab); button.setAttribute('aria-current', button.dataset.tab === tab ? 'page' : 'false'); });
    const title = tabs.find(([key]) => key === tab)[1];
    let body = '';
    if (tab === 'overview') body = `<div class="account-stats"><div><strong>0</strong><span>ORDERS</span></div><div><strong>${favorites().length}</strong><span>SAVED ITEMS</span></div><div><strong>${profile.formats.length}</strong><span>PREFERRED FORMATS</span></div></div><div class="account-section-head"><h3>RECENT ORDERS</h3><button data-go="orders">VIEW ALL →</button></div><div class="account-tile muted">No orders yet. Purchases are not connected in this demo.</div><div class="account-section-head"><h3>YOUR PREFERENCES</h3><button data-go="preferences">EDIT →</button></div><div class="account-tags">${tags([...profile.formats,...profile.genres])}</div>`;
    if (tab === 'orders') body = `<div class="account-empty"><h3>No orders yet.</h3><p>Orders will appear here when checkout is connected.</p><a class="account-primary" href="/shop.html">BROWSE SHOP →</a></div>`;
    if (tab === 'collection') body = favorites().length ? `<div class="account-collection">${favorites().map(product => `<a href="/shop.html?format=${encodeURIComponent(product.format)}"><img src="${escape(image(product))}" alt="${escape(product.artist + ' — ' + product.title)}" loading="lazy"><small>${escape(product.format.toUpperCase())}</small><span>${escape(product.artist)}</span><strong>${escape(product.title)}</strong></a>`).join('')}</div><a class="account-text-link" href="/wishlist.html">MANAGE YOUR COLLECTION →</a>` : `<div class="account-empty"><h3>Nothing saved yet.</h3><p>Start building your next listening session.</p><a class="account-primary" href="/shop.html">BROWSE SHOP →</a></div>`;
    if (tab === 'addresses') body = `${profile.addresses.map((address,index) => `<div class="account-tile address-tile"><div><strong>${escape(address.label || 'HOME')}</strong>${index === 0 ? ' <span class="default-badge">DEFAULT</span>' : ''}<p>${escape(address.name)}<br>${escape(address.street)}<br>${escape(address.city)}<br>${escape(address.country)}</p></div><button type="button" data-edit-address="${index}">Edit</button></div>`).join('')}<button class="account-add" type="button" id="add-address">+ Add New Address</button><div id="address-editor"></div>`;
    if (tab === 'payment') body = `<div class="account-empty"><h3>No payment methods saved.</h3><p>Payments are not connected in this demo. Card details are never collected or stored.</p></div><button class="account-add" type="button" id="add-payment">+ Add Payment Method</button>`;
    if (tab === 'preferences') {
      const choices = (items, selected, group) => items.map(value => `<button type="button" class="preference-chip ${selected.includes(value) ? 'selected' : ''}" data-pref="${group}" data-value="${escape(value)}" aria-pressed="${selected.includes(value)}">${escape(value.toUpperCase())}</button>`).join('');
      body = `<h3 class="account-eyebrow">PREFERRED FORMATS</h3><div class="account-choices">${choices(['Vinyl','CD','Cassette','Audio Equipment'], profile.formats,'formats')}</div><h3 class="account-eyebrow">PREFERRED GENRES</h3><div class="account-choices">${choices(['Ambient','Post-Punk','Dream Pop','Shoegaze','Jazz','Electronic','Art Pop','Folk','Krautrock'],profile.genres,'genres')}</div><h3 class="account-eyebrow">NOTIFICATIONS</h3>${[['newsletter','SONORA Newsletter','New releases, editorial, and staff picks'],['orders','Order Updates','Shipping and delivery notifications'],['arrivals','New Arrivals','First to know when new stock arrives']].map(([key,label,hint]) => `<div class="account-notification"><div><strong>${label}</strong><small>${hint}</small></div><button type="button" class="account-toggle ${profile.notifications[key] ? 'on' : ''}" data-notification="${key}" role="switch" aria-checked="${!!profile.notifications[key]}" aria-label="${label}"><span></span></button></div>`).join('')}`;
    }
    if (tab === 'settings') body = `<h3 class="account-eyebrow">PROFILE</h3><form id="profile-form"><div class="account-form-row"><label>FIRST NAME<input name="first" value="${escape(profile.first)}" autocomplete="given-name"></label><label>LAST NAME<input name="last" value="${escape(profile.last)}" autocomplete="family-name"></label></div><label>EMAIL ADDRESS<input name="email" type="email" value="${escape(session.email)}" autocomplete="email" required></label><button class="account-primary" type="submit">SAVE CHANGES</button></form><div class="account-divider"></div><h3 class="account-eyebrow">PASSWORD</h3><p class="account-muted">Password changes are unavailable in demo mode. No password is stored by this site.</p><div class="account-divider"></div><h3 class="account-danger">DANGER ZONE</h3><p class="account-muted">Remove this browser's demo profile and sign out. Saved products will remain on this device.</p><button type="button" class="account-delete" id="delete-account">DELETE DEMO PROFILE</button>`;
    document.querySelector('#account-content').innerHTML = `<h2>${title === 'Addresses' ? 'Saved Addresses' : title}</h2>${body}`;
    if (tab === 'collection') document.querySelectorAll('.account-collection a').forEach((link, index) => {
      const item = favorites()[index];
      if (!item) return;
      link.href = `/product.html?id=${item.id}`;
      const wrapper = document.createElement('div');
      wrapper.className = 'account-collection-card';
      link.replaceWith(wrapper);
      wrapper.append(link);
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.accountAdd = item.id;
      button.textContent = item.stock ? 'ADD TO CART →' : 'SOLD OUT';
      button.disabled = !item.stock;
      wrapper.append(button);
    });
    history.replaceState(null, '', `/account.html?tab=${tab}`);
  }
  document.querySelector('.account-side').addEventListener('click', event => { const tab = event.target.closest('[data-tab]'); if (tab) render(tab.dataset.tab); });
  document.querySelector('#account-content').addEventListener('click', event => {
    const target = event.target;
    const add = target.closest('[data-account-add]');
    if (add) {
      const id = Number(add.dataset.accountAdd);
      const cart = JSON.parse(localStorage.getItem('sonora-cart') || '[]');
      const item = cart.find(entry => entry.id === id);
      item ? item.qty++ : cart.push({ id, qty: 1 });
      localStorage.setItem('sonora-cart', JSON.stringify(cart));
      notice('Added to your bag.');
      return;
    }
    const go = target.closest('[data-go]'); if (go) { render(go.dataset.go); return; }
    const chip = target.closest('[data-pref]'); if (chip) { const list = profile[chip.dataset.pref]; const index = list.indexOf(chip.dataset.value); if (index < 0) list.push(chip.dataset.value); else list.splice(index,1); persist(); render('preferences'); return; }
    const toggle = target.closest('[data-notification]'); if (toggle) { profile.notifications[toggle.dataset.notification] = !profile.notifications[toggle.dataset.notification]; persist(); render('preferences'); notice('Preference saved in this browser. Email notifications are not connected.'); return; }
    if (target.closest('#add-payment')) { notice('Payment methods cannot be added until secure checkout is connected.'); return; }
    const edit = target.closest('[data-edit-address]');
    if (target.closest('#add-address') || edit) {
      const index = edit ? Number(edit.dataset.editAddress) : -1;
      const address = profile.addresses[index] || {};
      document.querySelector('#address-editor').innerHTML = `<form id="address-form" class="address-form" data-index="${index}"><label>LABEL<input name="label" value="${escape(address.label || '')}" placeholder="Home" required></label><label>NAME<input name="name" value="${escape(address.name || '')}" required></label><label>STREET ADDRESS<input name="street" value="${escape(address.street || '')}" required></label><label>CITY / POSTAL CODE<input name="city" value="${escape(address.city || '')}" required></label><label>COUNTRY<input name="country" value="${escape(address.country || '')}" required></label><button class="account-primary">SAVE ADDRESS</button><button type="button" class="account-secondary" id="cancel-address">CANCEL</button></form>`;
      document.querySelector('#address-form input').focus(); return;
    }
    if (target.closest('#cancel-address')) { document.querySelector('#address-editor').innerHTML = ''; return; }
    if (target.closest('#delete-account')) {
      if (!confirm('Delete this local demo profile and sign out? Saved products will remain.')) return;
      localStorage.removeItem(storageKey); localStorage.removeItem('sonora-demo-user'); sessionStorage.removeItem('sonora-demo-user'); location.href = '/index.html';
    }
  });
  document.querySelector('#account-content').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.target;
    const values = Object.fromEntries(new FormData(form));
    if (form.id === 'profile-form') {
      profile.first = values.first.trim(); profile.last = values.last.trim();
      if (values.email.trim().toLowerCase() !== session.email.toLowerCase()) { notice('Email changes need server verification and are unavailable in demo mode.'); form.elements.email.value = session.email; }
      else notice('Profile saved in this browser.');
      persist(); document.querySelector('#profile-name').textContent = displayName(); document.querySelector('#profile-avatar').textContent = initials(); document.querySelector('.account-mini-avatar').textContent = initials();
    }
    if (form.id === 'address-form') {
      const address = Object.fromEntries(Object.entries(values).map(([key,value]) => [key,value.trim()]));
      const index = Number(form.dataset.index);
      if (index < 0) profile.addresses.push(address); else profile.addresses[index] = address;
      persist(); render('addresses'); notice('Address saved in this browser only.');
    }
  });
  document.querySelector('#sign-out').addEventListener('click', () => { localStorage.removeItem('sonora-demo-user'); sessionStorage.removeItem('sonora-demo-user'); location.href = '/index.html'; });
  render();
}
