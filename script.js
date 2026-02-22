// ======================
// PRODUCTS DATA
// ======================
const products = [
    { id: 1, name: "Pro Gloves X1", price: 89, image: "https://via.placeholder.com/400x250" },
    { id: 2, name: "Elite GK Jersey", price: 69, image: "https://via.placeholder.com/400x250" },
    { id: 3, name: "GK Protection Pads", price: 49, image: "https://via.placeholder.com/400x250" },
    { id: 4, name: "Premium GK Shorts", price: 39, image: "https://via.placeholder.com/400x250" }
];

// ======================
// STATE (NO localStorage)
// ======================
let cart = [];

// ======================
// RENDER PRODUCTS
// ======================
function renderProducts() {
    const container = document.getElementById("products");
    if (!container) return;

    container.innerHTML = "";

    products.forEach((p, index) => {
        const card = document.createElement("div");
        card.classList.add("product", "fade-up");
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <img src="${p.image}">
            <h3>${p.name}</h3>
            <p>${p.price} лв</p>
            <button onclick="addToCart(${p.id})">Добави</button>
        `;

        container.appendChild(card);
    });
}

// ======================
// CART
// ======================
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartCount();
    animateCartIcon();
}

function updateCartCount() {
    const el = document.getElementById("cart-count");
    if (el) el.innerText = cart.length;
}

function loadCartPage() {
    const list = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!list) return;

    list.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price;
        list.innerHTML += `
            <li class="cart-item fade-in">
                ${item.name} - ${item.price} лв
            </li>
        `;
    });

    totalEl.innerText = total;
}

function checkout() {
    alert("Поръчката е приета!");
    cart = [];
    updateCartCount();
    loadCartPage();
}

// ======================
// ANIMATIONS
// ======================

// Scroll reveal
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll(".fade-up").forEach(el => {
    observer.observe(el);
});

// Cart bounce animation
function animateCartIcon() {
    const icon = document.getElementById("cart-count");
    icon.classList.add("bounce");
    setTimeout(() => icon.classList.remove("bounce"), 500);
}

// Page load animation
window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

// INIT
renderProducts();
updateCartCount();
loadCartPage();