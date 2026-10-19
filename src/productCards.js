import './productCards.css';

export function enhanceProductCards(container, selector = 'article') {
  container.querySelectorAll(selector).forEach(card => {
    const id = Number(card.querySelector('[data-favorite],[data-unfavorite]')?.dataset.favorite || card.querySelector('[data-unfavorite]')?.dataset.unfavorite);
    if (!id || card.querySelector('.card-under-actions')) return;
    const actions = document.createElement('div');
    actions.className = 'card-under-actions';
    const soldOut = !!card.querySelector('.out-of-stock,.product-badge.sold');
    actions.innerHTML = `<a href="/product.html?id=${id}" aria-label="View product details">VIEW DETAILS →</a><button type="button" data-add="${id}" ${soldOut ? 'disabled' : ''}>${soldOut ? 'SOLD OUT' : 'ADD TO CART →'}</button>`;
    card.append(actions);
    const productLink = document.createElement('a');
    productLink.href = `/product.html?id=${id}`;
    productLink.className = 'card-image-link';
    productLink.setAttribute('aria-label','View product details');
    const art = card.querySelector('.product-art');
    if (art) art.prepend(productLink);
    else {
      const existing = card.querySelector('.wishlist-image-wrap a');
      if (existing) existing.href = productLink.href;
    }
  });
}
