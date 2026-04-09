let menuData = [];
let restaurantsData = [];

async function loadMenuData() {
    try {
        const response = await fetch('data/menu.json');
        menuData = await response.json();
        displayMenuItems();
    } catch (error) {
        console.error('Errore caricamento menu:', error);
    }
}

async function loadRestaurantsData() {
    try {
        const response = await fetch('data/ristoranti.json');
        restaurantsData = await response.json();
        displayRegions();
    } catch (error) {
        console.error('Errore caricamento ristoranti:', error);
    }
}

function displayMenuItems() {
    const categories = ['burger', 'steaks', 'contorni', 'insalate', 'dessert', 'bevande', 'aperitivi'];
    categories.forEach(category => {
        const container = document.getElementById(`${category}-items`);
        if (container) {
            const items = menuData.filter(item => item.category === category);
            container.innerHTML = items.map(item => createMenuItem(item)).join('');
        }
    });
}

function createMenuItem(item) {
    const isBevanda = item.category === 'bevande' || item.category === 'aperitivi';
    const imgHeight = isBevanda ? '160px' : '220px';
    const imgFit = isBevanda ? 'contain' : 'cover';
    const imgBg = isBevanda ? '#f8f8f8' : '#1a1a1a';

    return `
        <div class="menu-item${isBevanda ? ' menu-item--drink' : ''}">
            <div class="menu-item-img-wrap" style="height:${imgHeight};background:${imgBg};overflow:hidden;border-radius:8px 8px 0 0;">
                <img
                    src="${item.image}"
                    alt="${item.name}"
                    style="width:100%;height:100%;object-fit:${imgFit};display:block;"
                    loading="lazy"
                >
            </div>
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
    `;
}

function displayRegions() {
    const regionsList = document.getElementById('regions-list');
    if (regionsList && restaurantsData.length > 0) {
        const regions = Object.keys(restaurantsData[0]);
        regionsList.innerHTML = regions.map(region =>
            `<button class="region-btn" onclick="showRestaurants('${region}')">${region}</button>`
        ).join('');
    }
    populateRestaurantSelect();
}

function showRestaurants(region) {
    const restaurantsList = document.getElementById('restaurants-list');
    const restaurants = restaurantsData[0][region];

    if (restaurantsList && restaurants) {
        restaurantsList.innerHTML = restaurants.map(restaurant => `
            <div class="restaurant-card">
                <img src="${restaurant.image}" alt="${restaurant.name}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:15px;">
                <h3>${restaurant.name}</h3>
                <p>📍 ${restaurant.address}</p>
                <p>📞 ${restaurant.phone}</p>
                <p>🕐 Orari: ${restaurant.hours}</p>
                <a href="prenota.html" class="btn btn-primary">Prenota</a>
            </div>
        `).join('');
    }

    document.querySelectorAll('.region-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function searchLocation() {
    const searchTerm = document.getElementById('location-search').value.toLowerCase();
    const allRestaurants = [];

    Object.values(restaurantsData[0]).forEach(restaurants => {
        restaurants.forEach(r => {
            if (r.name.toLowerCase().includes(searchTerm) ||
                r.address.toLowerCase().includes(searchTerm)) {
                allRestaurants.push(r);
            }
        });
    });

    const restaurantsList = document.getElementById('restaurants-list');
    if (restaurantsList) {
        restaurantsList.innerHTML = allRestaurants.map(restaurant => `
            <div class="restaurant-card">
                <img src="${restaurant.image}" alt="${restaurant.name}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:15px;">
                <h3>${restaurant.name}</h3>
                <p>📍 ${restaurant.address}</p>
                <p>📞 ${restaurant.phone}</p>
                <p>🕐 Orari: ${restaurant.hours}</p>
                <a href="prenota.html" class="btn btn-primary">Prenota</a>
            </div>
        `).join('');
    }
}

function populateRestaurantSelect() {
    const select = document.getElementById('restaurant-select');
    if (select && restaurantsData.length > 0) {
        const allRestaurants = [];
        Object.entries(restaurantsData[0]).forEach(([region, restaurants]) => {
            restaurants.forEach(r => {
                allRestaurants.push({ region, ...r });
            });
        });

        select.innerHTML = '<option value="">Scegli un ristorante</option>' +
            allRestaurants.map(r =>
                `<option value="${r.name}">${r.name} - ${r.region}</option>`
            ).join('');
    }
}

function submitBooking(event) {
    event.preventDefault();

    const formData = {
        restaurant: document.getElementById('restaurant-select').value,
        date: document.getElementById('booking-date').value,
        time: document.getElementById('booking-time').value,
        people: document.getElementById('booking-people').value,
        name: document.getElementById('booking-name').value,
        email: document.getElementById('booking-email').value,
        phone: document.getElementById('booking-phone').value,
        notes: document.getElementById('booking-notes').value
    };

    const modal = document.getElementById('confirmation-modal');
    const summary = document.getElementById('booking-summary');

    summary.innerHTML = `
        <p><strong>Ristorante:</strong> ${formData.restaurant}</p>
        <p><strong>Data:</strong> ${formData.date}</p>
        <p><strong>Ora:</strong> ${formData.time}</p>
        <p><strong>Persone:</strong> ${formData.people}</p>
        <p><strong>Nome:</strong> ${formData.name}</p>
    `;

    modal.classList.add('active');
    return false;
}

function closeConfirmation() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.remove('active');
    window.location.href = 'index.html';
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();
    alert('Login effettuato con successo!');
    window.location.href = 'index.html';
    return false;
}

function handleRegister(event) {
    event.preventDefault();
    alert('Registrazione completata! Hai ricevuto 50 punti di benvenuto!');
    window.location.href = 'index.html';
    return false;
}

function setMinDate() {
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadMenuData();
    loadRestaurantsData();
    setMinDate();
});