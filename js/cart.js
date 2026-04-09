let cart = [];
const DELIVERY_COST = 2.50;

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
    }
}

function addToCart(name, price, category) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            category: category,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${name} aggiunto al carrello!`);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(name);
        } else {
            updateCart();
        }
    }
}

function updateCart() {
    updateCartCount();
    updateCartDisplay();
    updateOrderDisplay();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElements = document.querySelectorAll('#cart-count');
    countElements.forEach(el => {
        el.textContent = totalItems;
    });
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">Il carrello è vuoto</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div>€${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    const total = calculateTotal();
    if (cartTotal) {
        cartTotal.textContent = `€${total.toFixed(2)}`;
    }
}

function updateOrderDisplay() {
    const orderCartItems = document.getElementById('order-cart-items');
    const subtotal = document.getElementById('subtotal');
    const orderTotal = document.getElementById('order-total');
    const finalTotal = document.getElementById('final-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (orderCartItems) {
        if (cart.length === 0) {
            orderCartItems.innerHTML = '<p style="text-align:center; color:#999;">Nessun articolo</p>';
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            orderCartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div>€${item.price.toFixed(2)} x ${item.quantity}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                        <button class="qty-btn" onclick="removeFromCart('${item.name}')" style="color:red;">×</button>
                    </div>
                </div>
            `).join('');
            if (checkoutBtn) checkoutBtn.disabled = false;
        }
    }
    
    const subTotal = calculateSubtotal();
    const total = subTotal + DELIVERY_COST;
    
    if (subtotal) subtotal.textContent = `€${subTotal.toFixed(2)}`;
    if (orderTotal) orderTotal.textContent = `€${total.toFixed(2)}`;
    if (finalTotal) finalTotal.textContent = `€${total.toFixed(2)}`;
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateTotal() {
    return calculateSubtotal();
}

function proceedCheckout() {
    if (cart.length === 0) {
        alert('Il carrello è vuoto!');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function completeOrder(event) {
    event.preventDefault();
    
    const total = calculateSubtotal() + DELIVERY_COST;
    
    alert(`Ordine confermato!\nTotale: €${total.toFixed(2)}\n\nRiceverai una email di conferma a breve.\nTempo di consegna stimato: 30-45 minuti.`);
    
    cart = [];
    updateCart();
    closeCheckout();
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
    
    return false;
}

function loadOrderItems() {
    const container = document.getElementById('order-items-container');
    if (container && menuData.length > 0) {
        displayOrderItems('all');
    }
}

function displayOrderItems(category) {
    const container = document.getElementById('order-items-container');
    if (!container) return;
    
    let items = menuData;
    if (category !== 'all') {
        items = menuData.filter(item => item.category === category);
    }
    
    container.innerHTML = items.map(item => `
        <div class="menu-item">
            <div class="menu-item-img"></div>
            <div class="menu-item-content">
                <h3 class="menu-item-name">${item.name}</h3>
                <p class="menu-item-desc">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">€${item.price.toFixed(2)}</span>
                    <button class="btn btn-primary btn-sm" onclick="addToCart('${item.name}', ${item.price}, '${item.category}')">
                        Aggiungi
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterCategory(category) {
    displayOrderItems(category);
    
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function searchItems() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const container = document.getElementById('order-items-container');
    
    if (!container) return;
    
    const filteredItems = menuData.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );
    
    container.innerHTML = filteredItems.map(item => `
        <div class="menu-item">
            <div class="menu-item-img"></div>
            <div class="menu-item-content">
                <h3 class="menu-item-name">${item.name}</h3>
                <p class="menu-item-desc">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">€${item.price.toFixed(2)}</span>
                    <button class="btn btn-primary btn-sm" onclick="addToCart('${item.name}', ${item.price}, '${item.category}')">
                        Aggiungi
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

window.addEventListener('DOMContentLoaded', () => {
    updateCart();
    loadOrderItems();
});