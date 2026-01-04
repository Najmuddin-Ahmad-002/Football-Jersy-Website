// Cart Management System
class ShoppingCart {
  constructor() {
    this.cartKey = 'jerseystore_cart';
    this.cart = this.loadCart();
  }

  // Load cart from localStorage
  loadCart() {
    const stored = localStorage.getItem(this.cartKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Save cart to localStorage
  saveCart() {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
  }

  // Add item to cart
  addItem(product) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || './view/mad.jpeg',
        quantity: product.quantity || 1
      });
    }
    
    this.saveCart();
    return true;
  }

  // Remove item from cart
  removeItem(itemId) {
    this.cart = this.cart.filter(item => item.id !== itemId);
    this.saveCart();
  }

  // Update quantity
  updateQuantity(itemId, quantity) {
    const item = this.cart.find(item => item.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveCart();
    }
  }

  // Get total price
  getTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Get cart length
  getCartLength() {
    return this.cart.length;
  }

  // Clear cart
  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // Get all items
  getItems() {
    return this.cart;
  }
}

// Initialize cart globally
const cartManager = new ShoppingCart();

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
  notification.style.position = 'fixed';
  notification.style.top = '100px';
  notification.style.right = '20px';
  notification.style.padding = '1rem 2rem';
  notification.style.borderRadius = '5px';
  notification.style.color = 'white';
  notification.style.zIndex = '1000';
  notification.style.animation = 'slideIn 0.3s ease-out';
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Update cart badge (if exists)
function updateCartBadge() {
  const cartBadge = document.getElementById('cart-badge');
  if (cartBadge) {
    const count = cartManager.getCartLength();
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'block' : 'none';
  }
}

// Initialize cart page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Update cart badge on page load
  updateCartBadge();

  // Only run cart page specific code if we're on the cart page
  const cartContainer = document.getElementById('cart-items-container');
  if (!cartContainer) return;

  const cartCount = document.getElementById('cart-count');
  const emptyCart = document.getElementById('empty-cart');

  // Render cart items
  function renderCart() {
    const items = cartManager.getItems();
    cartContainer.innerHTML = '';

    if (items.length === 0) {
      cartContainer.parentElement.classList.add('hidden');
      document.querySelector('.cart-summary').classList.add('hidden');
      emptyCart.classList.remove('hidden');
      cartCount.textContent = 'Your cart is empty';
      return;
    }

    cartContainer.parentElement.classList.remove('hidden');
    document.querySelector('.cart-summary').classList.remove('hidden');
    emptyCart.classList.add('hidden');
    cartCount.textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'} in your cart`;

    items.forEach((item) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `
        <button class="remove-item-btn" title="Remove item">✕</button>
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-size">Size: M</div>
          <div class="cart-item-price">₹${item.price.toFixed(0)}</div>
          <div class="quantity-controls">
            <button class="quantity-btn minus" title="Decrease quantity">−</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn plus" title="Increase quantity">+</button>
          </div>
        </div>
      `;

      // Remove button
      itemDiv.querySelector('.remove-item-btn').addEventListener('click', function() {
        itemDiv.classList.add('removing');
        setTimeout(() => {
          cartManager.removeItem(item.id);
          showNotification(`${item.name} removed from cart`);
          renderCart();
          updateCartBadge();
        }, 300);
      });

      // Minus button
      itemDiv.querySelector('.minus').addEventListener('click', function() {
        if (item.quantity > 1) {
          cartManager.updateQuantity(item.id, item.quantity - 1);
          renderCart();
          updateCartBadge();
        }
      });

      // Plus button
      itemDiv.querySelector('.plus').addEventListener('click', function() {
        cartManager.updateQuantity(item.id, item.quantity + 1);
        renderCart();
        updateCartBadge();
      });

      cartContainer.appendChild(itemDiv);
    });

    calculateTotals();
  }

  // Calculate totals
  function calculateTotals() {
    const items = cartManager.getItems();
    const subtotal = cartManager.getTotal();
    const shipping = items.length > 0 ? 99 : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(0)}`;
    document.getElementById('shipping').textContent = `₹${shipping.toFixed(0)}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(0)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(0)}`;
  }

  // Checkout button
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      const total = cartManager.getTotal();
      if (total > 0) {
        showNotification('Proceeding to checkout...', 'success');
        setTimeout(() => {
          // Here you would redirect to checkout page
          alert('Checkout page coming soon!');
        }, 500);
      }
    });
  }

  // Initial render
  renderCart();
});
