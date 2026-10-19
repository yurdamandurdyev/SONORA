const firstShopImages = ['heads', 'eno', 'tones', 'cocteau', 'aphex', 'technics', 'joy', 'grouper', 'kate', 'jazz', 'broadcast', 'audio-technica'];

export function cartImage(product) {
  if (product.id <= 6) return `/home/raw-product-${firstShopImages[product.id - 1]}.png`;
  if (product.id <= 12) return `/shop-assets/${firstShopImages[product.id - 1]}${product.id === 9 || product.id === 10 ? '-clean' : ''}.png`;
  return `/${product.collection}-assets/product-${product.id}.png`;
}

export function drawerMarkup(kind, products, cart, favorites, money) {
  const productById = new Map(products.map(product => [product.id, product]));
  const entries = kind === 'cart'
    ? cart.map(item => ({ product: productById.get(item.id), qty: item.qty })).filter(item => item.product && item.qty > 0)
    : favorites.map(id => ({ product: productById.get(id), qty: 0 })).filter(item => item.product);
  const count = kind === 'cart' ? entries.reduce((sum, item) => sum + item.qty, 0) : entries.length;
  const title = kind === 'cart' ? 'YOUR CART' : 'SAVED SOUNDS';
  const countLabel = `${count} ${count === 1 ? 'item' : 'items'}`;
  const content = entries.length ? `<ul class="cart-items">${entries.map(({ product, qty }) => `<li class="cart-item"><img class="cart-item-image" src="${cartImage(product)}" alt="${product.artist} — ${product.title}" width="64" height="64"><div class="cart-item-copy"><small>${product.format === 'Audio' ? 'AUDIO EQUIPMENT' : product.format.toUpperCase()}</small><span>${product.artist}</span><strong>${product.title}</strong><div class="cart-item-actions">${kind === 'cart' ? `<div class="quantity"><button type="button" data-qty="${product.id}" data-delta="-1" aria-label="Remove one ${product.title}">−</button><span>${qty}</span><button type="button" data-qty="${product.id}" data-delta="1" aria-label="Add one ${product.title}">+</button></div><button type="button" class="cart-remove" data-remove="${product.id}">Remove</button>` : product.stock ? `<button type="button" class="cart-remove" data-add="${product.id}">Add to bag</button>` : '<span class="cart-unavailable">Sold out</span>'}</div></div><strong class="cart-item-price">${money(product.price * (qty || 1))}</strong></li>`).join('')}</ul>` : `<div class="empty-state"><span>◎</span><h3>${kind === 'cart' ? 'Your bag is waiting.' : 'Nothing saved yet.'}</h3><p>Find something worth keeping.</p><a class="button button-dark" href="/shop.html">Explore the store →</a></div>`;
  const total = entries.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const footer = kind === 'cart' && entries.length ? `<div class="subtotal"><span>Subtotal</span><strong>${money(total)}</strong></div><p>Shipping calculated at checkout.</p><button type="button" class="checkout" id="checkout">PROCEED TO CHECKOUT</button><button type="button" class="continue-shopping" id="continue-shopping">CONTINUE SHOPPING</button>` : '';
  return { title, countLabel, content, footer };
}
