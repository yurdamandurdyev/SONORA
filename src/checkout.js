import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/instrument-sans/wght.css';
import './style.css';
import './checkout.css';
import './motion.js';
import { products } from './catalog.js';
import { cartImage } from './cartDrawer.js';

const cart = JSON.parse(localStorage.getItem('sonora-cart') || '[]')
  .map(item => ({ product: products.find(product => product.id === item.id), qty: Math.max(0, Number(item.qty) || 0) }))
  .filter(item => item.product && item.qty);
const demoUser = JSON.parse(sessionStorage.getItem('sonora-demo-user') || localStorage.getItem('sonora-demo-user') || 'null');
const state = { step: 0, contact: { email: demoUser?.email || '', phone: '' }, shipping: { first: '', last: '', address: '', city: '', zip: '' }, delivery: 'standard' };
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
const shippingCost = () => state.delivery === 'express' ? 9.95 : 0;
const steps = ['CONTACT','SHIPPING','DELIVERY','PAYMENT'];
const icon = name => name === 'search' ? '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>' : name === 'heart' ? '<path d="M20.8 8.5c0 4.2-8.8 10.2-8.8 10.2S3.2 12.7 3.2 8.5a4.6 4.6 0 0 1 8.8-1.8 4.6 4.6 0 0 1 8.8 1.8Z"/>' : name === 'user' ? '<circle cx="12" cy="8" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>' : '<path d="M4 8h16l-1 13H5L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>';
const symbol = name => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon(name)}</svg>`;

document.querySelector('#app').innerHTML = `<header class="checkout-header"><a class="checkout-brand" href="/index.html">SONORA</a><nav aria-label="Main navigation"><a href="/shop.html">SHOP</a><a href="/shop.html?format=Vinyl">VINYL</a><a href="/shop.html?format=CD">CDs</a><a href="/shop.html?format=Cassette">CASSETTES</a><a href="/shop.html?format=Audio">AUDIO</a><a href="/discover.html">DISCOVER</a></nav><div class="checkout-icons"><a href="/shop.html" aria-label="Search">${symbol('search')}</a><a href="/wishlist.html" aria-label="Wishlist">${symbol('heart')}</a><a href="/wishlist.html" aria-label="Cart">${symbol('bag')}</a><a href="/account.html" aria-label="Account">${symbol('user')}</a></div></header><main id="checkout-main"></main>`;

function field(label, key, value, { type = 'text', placeholder = '', autocomplete = '', required = true } = {}) {
  return `<label class="checkout-field">${label}<input name="${key}" type="${type}" value="${escape(value)}" placeholder="${placeholder}" autocomplete="${autocomplete}" ${required ? 'required' : ''}></label>`;
}
function summary() {
  return `<aside class="checkout-summary"><h2>ORDER SUMMARY</h2>${cart.map(({product,qty}) => `<div class="checkout-item"><div class="checkout-image"><img src="${cartImage(product)}" alt="" width="56" height="56"><span>${qty}</span></div><div><small>${escape(product.artist)}</small><strong>${escape(product.title)}</strong><small>${escape(product.format.toUpperCase())}</small></div><b>${money(product.price * qty)}</b></div>`).join('')}<div class="checkout-totals"><div><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div><span>Shipping</span><strong>${shippingCost() ? money(shippingCost()) : 'Free'}</strong></div><div class="checkout-grand"><span>Total</span><strong>${money(subtotal + shippingCost())}</strong></div></div><p>Demo checkout · no payment will be collected.</p></aside>`;
}
function render() {
  const main = document.querySelector('#checkout-main');
  if (state.step === 4) {
    main.innerHTML = `<section class="checkout-confirm"><div class="confirm-check">✓</div><small>DEMO CHECKOUT</small><h1>CHECKOUT PREVIEW.<br><span>PLAY IT LOUD.</span></h1><p>Your details were not submitted. No order was placed, no email was sent and no payment was taken.</p><a class="checkout-button" href="/shop.html">CONTINUE SHOPPING →</a></section>`;
    return;
  }
  const progress = steps.map((name,index) => `<div class="checkout-progress-step ${index === state.step ? 'current' : ''} ${index < state.step ? 'done' : ''}"><span>${index < state.step ? '✓' : index+1}</span>${name}</div>`).join('');
  let content = '';
  if (state.step === 0) content = `<h2>Contact Information</h2>${field('EMAIL ADDRESS','email',state.contact.email,{type:'email',placeholder:'hello@example.com',autocomplete:'email'})}${field('PHONE (OPTIONAL)','phone',state.contact.phone,{type:'tel',placeholder:'+1 (555) 000-0000',autocomplete:'tel',required:false})}`;
  if (state.step === 1) content = `<h2>Shipping Address</h2><div class="checkout-row">${field('FIRST NAME','first',state.shipping.first,{placeholder:'Jane',autocomplete:'given-name'})}${field('LAST NAME','last',state.shipping.last,{placeholder:'Smith',autocomplete:'family-name'})}</div>${field('ADDRESS','address',state.shipping.address,{placeholder:'123 Record Street',autocomplete:'street-address'})}<div class="checkout-row">${field('CITY','city',state.shipping.city,{placeholder:'New York',autocomplete:'address-level2'})}${field('ZIP CODE','zip',state.shipping.zip,{placeholder:'10001',autocomplete:'postal-code'})}</div>`;
  if (state.step === 2) content = `<h2>Delivery Method</h2><label class="delivery-choice ${state.delivery === 'standard' ? 'chosen' : ''}"><input type="radio" name="delivery" value="standard" ${state.delivery === 'standard' ? 'checked' : ''}><span><strong>Standard Shipping</strong><small>3–5 business days (preview)</small></span><b>Free</b></label><label class="delivery-choice ${state.delivery === 'express' ? 'chosen' : ''}"><input type="radio" name="delivery" value="express" ${state.delivery === 'express' ? 'checked' : ''}><span><strong>Express Shipping</strong><small>1–2 business days (preview)</small></span><b>$9.95</b></label>`;
  if (state.step === 3) content = `<h2>Payment</h2><p class="checkout-secure">ⓘ This is a design preview. Payment processing is not connected.</p><div class="checkout-payment-preview"><h3>No card details required</h3><p>Review the total on the right, then continue to a demo confirmation. No order or charge will be made.</p></div>`;
  main.innerHTML = `<div class="checkout-layout"><section class="checkout-form-column"><a class="checkout-title" href="/index.html">SONORA</a><div class="checkout-progress">${progress}</div>${cart.length ? `<form id="checkout-form">${content}<div class="checkout-actions">${state.step ? '<button class="checkout-back" type="button" id="checkout-back">← BACK</button>' : ''}<button class="checkout-button ${state.step === 3 ? 'checkout-blue' : ''}" type="submit">${state.step === 3 ? 'VIEW DEMO CONFIRMATION →' : 'CONTINUE →'}</button></div></form>` : `<div class="checkout-empty"><h2>Your bag is waiting.</h2><p>Add something worth keeping before checkout.</p><a class="checkout-button" href="/shop.html">BROWSE SHOP →</a></div>`}</section>${cart.length ? summary() : ''}</div>`;
}
document.querySelector('#checkout-main').addEventListener('input', event => {
  const target = event.target;
  if (target.form?.id !== 'checkout-form') return;
  if (state.step === 0 && target.name in state.contact) state.contact[target.name] = target.value;
  if (state.step === 1 && target.name in state.shipping) state.shipping[target.name] = target.value;
});
document.querySelector('#checkout-main').addEventListener('change', event => { if (event.target.name === 'delivery') { state.delivery = event.target.value; render(); } });
document.querySelector('#checkout-main').addEventListener('click', event => { if (event.target.closest('#checkout-back')) { state.step--; render(); } });
document.querySelector('#checkout-main').addEventListener('submit', event => { event.preventDefault(); if (state.step < 4) { state.step++; render(); window.scrollTo({top:0,behavior:'smooth'}); } });
render();
