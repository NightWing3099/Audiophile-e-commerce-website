// Cart state management module
let cart = [];

// Load cart from localStorage on init
function loadCart() {
  try {
    const stored = localStorage.getItem('audiophile-cart');
    cart = stored ? JSON.parse(stored) : [];
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem('audiophile-cart', JSON.stringify(cart));
}

loadCart();

// Product data mapping (slug -> product info)
const productMap = {
  'xx99-mark-two-headphones': { name: 'XX99 Mark II', price: 2999, cartImage: './assets/cart/image-xx99-mark-two-headphones.jpg' },
  'xx99-mark-one-headphones': { name: 'XX99 Mark I', price: 1750, cartImage: './assets/cart/image-xx99-mark-one-headphones.jpg' },
  'xx59-headphones': { name: 'XX59', price: 899, cartImage: './assets/cart/image-xx59-headphones.jpg' },
  'zx9-speaker': { name: 'ZX9 Speaker', price: 4500, cartImage: './assets/cart/image-zx9-speaker.jpg' },
  'zx7-speaker': { name: 'ZX7 Speaker', price: 3500, cartImage: './assets/cart/image-zx7-speaker.jpg' },
  'yx1-earphones': { name: 'YX1', price: 599, cartImage: './assets/cart/image-yx1-earphones.jpg' },
};

export function getCart() {
  return [...cart];
}

export function addToCart(slug, quantity = 1) {
  const existing = cart.find(item => item.slug === slug);
  if (existing) {
    existing.quantity += quantity;
  } else {
    const product = productMap[slug];
    if (!product) return;
    cart.push({ slug, quantity, name: product.name, price: product.price, cartImage: product.cartImage });
  }
  saveCart();
  dispatchCartUpdate();
}

export function removeFromCart(slug) {
  cart = cart.filter(item => item.slug !== slug);
  saveCart();
  dispatchCartUpdate();
}

export function updateQuantity(slug, quantity) {
  const item = cart.find(i => i.slug === slug);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(slug);
      return;
    }
    item.quantity = quantity;
    saveCart();
    dispatchCartUpdate();
  }
}

export function clearCart() {
  cart = [];
  saveCart();
  dispatchCartUpdate();
}

export function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function dispatchCartUpdate() {
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: { cart: [...cart] } }));
}

// Render cart modal
export function renderCartModal(container) {
  const cartItems = getCart();
  const total = getCartTotal();
  
  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center">
        <p class="text-[15px] font-bold text-black/50">Your cart is empty</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="p-6 sm:p-8">
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-lg font-bold tracking-wide uppercase">Cart (${getCartCount()})</h3>
        <button class="text-[15px] text-black/50 underline hover:text-primary transition-colors" data-remove-all>Remove All</button>
      </div>
      <div class="space-y-6 mb-8" data-cart-items>
        ${cartItems.map(item => `
          <div class="flex items-center gap-4" data-cart-item="${item.slug}">
            <img src="${item.cartImage}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover">
            <div class="flex-1">
              <p class="font-bold text-[15px]">${item.name}</p>
              <p class="font-bold text-sm text-black/50">$ ${item.price.toLocaleString()}</p>
            </div>
            <div class="flex items-center bg-light-gray h-8">
              <button class="w-8 h-full text-sm font-bold text-black/25 hover:text-primary transition-colors" data-qty-dec="${item.slug}">-</button>
              <span class="w-10 text-center text-sm font-bold" data-qty="${item.slug}">${item.quantity}</span>
              <button class="w-8 h-full text-sm font-bold text-black/25 hover:text-primary transition-colors" data-qty-inc="${item.slug}">+</button>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="flex items-center justify-between mb-6">
        <span class="text-[15px] text-black/50 uppercase">Total</span>
        <span class="text-lg font-bold">$ ${total.toLocaleString()}</span>
      </div>
      <a href="./checkout.html" class="block w-full bg-primary text-white text-center py-3 text-sm font-bold tracking-wide uppercase hover:bg-primary-hover transition-colors">
        Checkout
      </a>
    </div>
  `;

  // Event listeners
  container.querySelector('[data-remove-all]')?.addEventListener('click', () => {
    clearCart();
  });

  container.querySelectorAll('[data-qty-dec]').forEach(btn => {
    btn.addEventListener('click', () => {
      const slug = btn.dataset.qtyDec;
      const item = cart.find(i => i.slug === slug);
      if (item) updateQuantity(slug, item.quantity - 1);
    });
  });

  container.querySelectorAll('[data-qty-inc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const slug = btn.dataset.qtyInc;
      const item = cart.find(i => i.slug === slug);
      if (item) updateQuantity(slug, item.quantity + 1);
    });
  });
}

// Initialize cart UI
export function initCartUI() {
  const cartBtn = document.getElementById('cart-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartPanel = document.getElementById('cart-panel');
  const cartClose = document.getElementById('cart-close');
  const cartCount = document.getElementById('cart-count');

  if (!cartBtn || !cartOverlay || !cartPanel) return;

  function openCart() {
    cartOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    const cartContainer = cartPanel.querySelector('[data-cart-container]');
    if (cartContainer) renderCartModal(cartContainer);
  }

  function closeCart() {
    cartOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  cartBtn.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', (e) => {
    if (!cartPanel.contains(e.target)) closeCart();
  });

  // Close cart on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !cartOverlay.classList.contains('hidden')) {
      closeCart();
    }
  });

  function updateCount() {
    const count = getCartCount();
    cartCount.textContent = count;
    cartCount.classList.toggle('hidden', count === 0);
  }

  window.addEventListener('cart-updated', () => {
    updateCount();
    if (!cartOverlay.classList.contains('hidden')) {
      const cartContainer = cartPanel.querySelector('[data-cart-container]');
      if (cartContainer) renderCartModal(cartContainer);
    }
  });

  updateCount();
}

// Init on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initCartUI();
  });
}