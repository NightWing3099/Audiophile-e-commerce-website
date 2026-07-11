import { getCart, getCartTotal, clearCart } from './cart.js';

function formatPrice(num) {
  return '$ ' + num.toLocaleString();
}

function renderCheckoutSummary() {
  const cart = getCart();
  const container = document.querySelector('[data-checkout-items]');
  const totalEl = document.querySelector('[data-total]');
  const vatEl = document.querySelector('[data-vat]');
  const grandTotalEl = document.querySelector('[data-grand-total]');

  if (!container) return;

  const total = getCartTotal();
  const shipping = 50;
  const vat = Math.round(total * 0.2);

  container.innerHTML = cart.map(item => `
    <div class="flex items-center gap-4">
      <img src="${item.cartImage}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover">
      <div class="flex-1">
        <p class="font-bold text-[15px]">${item.name}</p>
        <p class="font-bold text-sm text-black/50">${formatPrice(item.price)}</p>
      </div>
      <span class="font-bold text-[15px] text-black/50">x${item.quantity}</span>
    </div>
  `).join('');

  if (totalEl) totalEl.textContent = formatPrice(total);
  if (vatEl) vatEl.textContent = formatPrice(vat);
  if (grandTotalEl) grandTotalEl.textContent = formatPrice(total + shipping);
}

function renderOrderConfirmation() {
  const cart = getCart();
  const container = document.querySelector('[data-order-items]');
  const otherCount = document.querySelector('[data-other-count]');
  const otherRow = document.querySelector('[data-other-row]');
  const grandTotal = document.querySelector('[data-modal-grand-total]');

  if (!container || cart.length === 0) return;

  const total = getCartTotal();
  const shipping = 50;

  // Show first item prominently, count others
  const first = cart[0];
  const rest = cart.slice(1);
  const otherTotal = rest.reduce((sum, i) => sum + i.quantity, 0);

  container.innerHTML = `
    <div class="flex items-center gap-4">
      <img src="${first.cartImage}" alt="${first.name}" class="w-12 h-12 rounded-lg object-cover">
      <div class="flex-1">
        <p class="font-bold text-[15px]">${first.name}</p>
        <p class="font-bold text-sm text-black/50">${formatPrice(first.price)}</p>
      </div>
      <span class="font-bold text-[15px] text-black/50">x${first.quantity}</span>
    </div>
  `;

  if (otherCount) otherCount.textContent = otherTotal;
  if (otherRow) otherRow.classList.toggle('hidden', otherTotal === 0);
  if (grandTotal) grandTotal.textContent = formatPrice(total + shipping);
}

function validateForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return true;
  
  let valid = true;
  const fields = form.querySelectorAll('input[required]');
  
  fields.forEach(field => {
    const error = document.querySelector(`[data-error="${field.name}"]`);
    if (!field.value.trim()) {
      field.classList.add('border-error');
      field.classList.remove('border-border-gray');
      if (error) error.classList.remove('hidden');
      valid = false;
    } else if (field.type === 'email' && !field.value.includes('@')) {
      field.classList.add('border-error');
      field.classList.remove('border-border-gray');
      if (error) error.classList.remove('hidden');
      valid = false;
    } else {
      field.classList.remove('border-error');
      field.classList.add('border-border-gray');
      if (error) error.classList.add('hidden');
    }
  });

  // Validate eMoney fields if selected
  const payment = form.querySelector('input[name="payment"]:checked');
  if (payment && payment.value === 'emoney') {
    ['emoney-number', 'emoney-pin'].forEach(name => {
      const f = form.querySelector(`[name="${name}"]`);
      const err = document.querySelector(`[data-error="${name}"]`);
      if (!f.value.trim()) {
        f.classList.add('border-error');
        f.classList.remove('border-border-gray');
        if (err) err.classList.remove('hidden');
        valid = false;
      }
    });
  }

  return valid;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();

  // Payment method toggle
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const emoneyFields = document.getElementById('emoney-fields');
  const codMessage = document.getElementById('cod-message');

  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'cod') {
        emoneyFields.classList.add('hidden');
        codMessage.classList.remove('hidden');
      } else {
        emoneyFields.classList.remove('hidden');
        codMessage.classList.add('hidden');
      }
    });
  });

  // Continue & pay
  document.getElementById('continue-pay')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const cart = getCart();
    if (cart.length === 0) return;

    const modal = document.getElementById('success-modal');
    if (modal) {
      renderOrderConfirmation();
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      clearCart();
    }
  });

  // Close modal on overlay click
  document.getElementById('success-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
});