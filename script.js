// =======================
// PRODUCTS
// =======================
const products = [
    { id: 1, name: "Pro Gloves X1", price: 89, image: "https://via.placeholder.com/300x200" },
    { id: 2, name: "Elite GK Jersey", price: 69, image: "https://via.placeholder.com/300x200" },
    { id: 3, name: "GK Protection Pads", price: 49, image: "https://via.placeholder.com/300x200" }
];

// =======================
// STATE (NO localStorage)
// =======================
let cart = [];

// =======================
// RENDER PRODUCTS
// =======================
function renderProducts() {
    const container = document.getElementById("products");
    if (!container) return;

    container.innerHTML = "";

    products.forEach((product, index) => {
        const card = document.createElement("div");
        card.classList.add("product", "fade-up");
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <img src="${product.image}">
            <h3>${product.name}</h3>
            <p>${product.price} лв</p>
            <button class="add-btn">Добави</button>
        `;

        card.querySelector(".add-btn").addEventListener("click", () => {
            addToCart(product.id);
        });

        container.appendChild(card);
    });
}

// =======================
// CART LOGIC
// =======================
function addToCart(id) {
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        const product = products.find(p => p.id === id);
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    animateCartIcon();
    loadCartPage();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    loadCartPage();
}

function updateCartCount() {
    const el = document.getElementById("cart-count");
    if (el) el.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// =======================
// RENDER CART PAGE
// =======================
function loadCartPage() {
    const list = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!list) return;

    list.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const li = document.createElement("li");
        li.classList.add("cart-item", "fade-in");

        li.innerHTML = `
            <span>${item.name} (${item.quantity}x)</span>
            <span>${item.price * item.quantity} лв</span>
            <button class="remove-btn">✕</button>
        `;

        li.querySelector(".remove-btn").addEventListener("click", () => {
            removeFromCart(item.id);
        });

        list.appendChild(li);
    });

    if (totalEl) totalEl.innerText = total;
}

// =======================
// PRODUCT PAGE
// =======================
function loadProductPage() {
    const container = document.getElementById("product-page");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));
    const product = products.find(p => p.id === id);

    if (!product) return;

    container.innerHTML = `
        <div class="product-detail fade-up">
            <img src="${product.image}">
            <div>
                <h1>${product.name}</h1>
                <p class="price">${product.price} лв</p>
                <p>Професионално качество за максимално представяне.</p>
                <button id="detail-add">Добави в кошницата</button>
            </div>
        </div>
    `;

    document.getElementById("detail-add").addEventListener("click", () => {
        addToCart(product.id);
    });
}

// =======================
// CHECKOUT
// =======================
function checkout() {
    if (cart.length === 0) {
        alert("Количката е празна.");
        return;
    }

    alert("Поръчката е приета!");
    cart = [];
    updateCartCount();
    loadCartPage();
}

// =======================
// ANIMATIONS
// =======================
function animateCartIcon() {
    const icon = document.getElementById("cart-count");
    if (!icon) return;

    icon.classList.add("bounce");
    setTimeout(() => icon.classList.remove("bounce"), 400);
}

// =======================
// INIT
// =======================
renderProducts();
updateCartCount();
loadProductPage();
loadCartPage();