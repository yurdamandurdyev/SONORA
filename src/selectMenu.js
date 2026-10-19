import './selectMenu.css';

export function enhanceSelect(select) {
  if (!select || select.dataset.customized) return;
  select.dataset.customized = 'true';
  select.classList.add('custom-native-select');
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');

  const wrapper = document.createElement('div');
  wrapper.className = 'sonora-select';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'sonora-select-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-label', 'Sort products');
  trigger.innerHTML = `<span></span><svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true"><path d="m1 1 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
  const list = document.createElement('div');
  list.className = 'sonora-select-list';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', 'Sort products');
  list.id = `${select.id}-list`;
  trigger.setAttribute('aria-controls', list.id);
  const items = [...select.options].map(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sonora-select-option';
    button.setAttribute('role', 'option');
    button.dataset.value = option.value;
    button.textContent = option.textContent;
    list.append(button);
    return button;
  });
  wrapper.append(trigger, list);
  select.insertAdjacentElement('afterend', wrapper);

  function sync() {
    trigger.querySelector('span').textContent = select.selectedOptions[0]?.textContent || '';
    trigger.setAttribute('aria-label', `Sort products: ${select.selectedOptions[0]?.textContent || ''}`);
    items.forEach(item => {
      const selected = item.dataset.value === select.value;
      item.setAttribute('aria-selected', String(selected));
      item.classList.toggle('selected', selected);
    });
  }
  function open() {
    wrapper.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    list.style.visibility = 'visible';
    requestAnimationFrame(() => {
      if (wrapper.classList.contains('open')) (items.find(item => item.dataset.value === select.value) || items[0]).focus();
    });
  }
  function close(returnFocus = false) {
    wrapper.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    list.style.visibility = '';
    if (returnFocus) trigger.focus();
  }
  function choose(item) {
    select.value = item.dataset.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    sync();
    close(true);
  }
  trigger.addEventListener('click', () => wrapper.classList.contains('open') ? close() : open());
  trigger.addEventListener('keydown', event => {
    if (event.key === 'Escape') { close(); return; }
    if (['ArrowDown','ArrowUp','Enter',' '].includes(event.key)) { event.preventDefault(); open(); }
  });
  list.addEventListener('click', event => {
    const item = event.target.closest('.sonora-select-option');
    if (item) choose(item);
  });
  list.addEventListener('keydown', event => {
    const current = items.indexOf(document.activeElement);
    if (event.key === 'Escape') { event.preventDefault(); close(true); }
    else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      items[(current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      items[event.key === 'Home' ? 0 : items.length - 1].focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(document.activeElement);
    }
  });
  list.addEventListener('focusout', () => setTimeout(() => { if (!wrapper.contains(document.activeElement)) close(); }, 0));
  document.addEventListener('pointerdown', event => { if (!wrapper.contains(event.target)) close(); });
  select.addEventListener('change', sync);
  sync();
}
