/* Unified JavaScript bundle for GoalkeeperStore */

/* ===== State ===== */
const state = {
    cart: [],
    user: null
};

/* ===== Navigation (index) ===== */
function showPage(page) {
    const app = document.getElementById('app');
    if (!app) return;
    if (page === 'home') {
        app.innerHTML = `
            <section class="hero reveal">
                <h1>Добре дошли в GKS Store</h1>
                <a href="products.html" class="btn-primary">Виж продукти</a>
            </section>
        `;
        initReveal();
    } else if (page === 'products') {
        window.location.href = 'products.html';
    } else if (page === 'cart') {
        window.location.href = 'cart.html';
    }
}

/* ===== API ===== */
async function fetchProducts() {
    return [
        { id: 1, name: "Pro Gloves X1", price: 89 },
        { id: 2, name: "Elite Jersey", price: 69 },
        { id: 3, name: "GK Protection", price: 49 },
        { id: 4, name: "Training Gloves", price: 59 }
    ];
}

/* ===== UI helpers ===== */
function initReveal() {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    });

    elements.forEach(el => observer.observe(el));
}

function initCounter() {
    const counters = document.querySelectorAll("[data-count]");

    counters.forEach(counter => {
        const update = () => {
            const target = +counter.dataset.count;
            const count = +counter.innerText;
            const increment = target / 100;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(update, 20);
            } else {
                counter.innerText = target;
            }
        };
        update();
    });
}

function initScrollProgress() {
    window.addEventListener("scroll", () => {
        const scroll = window.scrollY;
        const height = document.body.scrollHeight - window.innerHeight;
        const progress = (scroll / height) * 100;
        const bar = document.querySelector(".scroll-progress");
        if (bar) bar.style.width = progress + "%";
    });
}

function initCursor() {
    const cursor = document.querySelector(".cursor");
    if (!cursor) return;
    document.addEventListener("mousemove", e => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });
}

/* ===== Cart ===== */
function addToCart(product) {
    state.cart.push(product);
    updateCartCount();
    animateAdd();
}

function updateCartCount() {
    const count = document.getElementById("cart-count");
    if (count) count.textContent = state.cart.length;
}

function renderCart() {
    const list = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!list) return;
    list.innerHTML = "";
    let total = 0;
    state.cart.forEach(p => {
        total += p.price;
        const li = document.createElement("li");
        li.textContent = `${p.name} - ${p.price} лв`;
        list.appendChild(li);
    });
    if (totalEl) totalEl.textContent = total;
}

function checkout() {
    window.location.href = "checkout.html";
}

function initCheckout() {
    const content = document.getElementById("checkout-content");
    if (!content) return;

    if (state.cart.length === 0) {
        content.innerHTML = '<p class="reveal">Няма продукти в количката.</p>';
        return;
    }

    content.innerHTML = `
        <form id="checkout-form" class="reveal">
            <div class="input-group">
                <input type="text" required><label>Име</label>
            </div>
            <div class="input-group">
                <input type="text" required><label>Адрес</label>
            </div>
            <div class="input-group">
                <input type="text" required><label>Телефон</label>
            </div>
            <button class="btn-primary">Плати</button>
        </form>
    `;

    const form = document.getElementById("checkout-form");
    form.addEventListener("submit", e => {
        e.preventDefault();
        state.cart = [];
        updateCartCount();
        content.innerHTML = '<h2 class="reveal">Благодарим за покупката!</h2>';
    });
}

function animateAdd() {
    const icon = document.querySelector(".cart-icon");
    if (!icon) return;

    icon.style.transform = "scale(1.3)";
    setTimeout(() => icon.style.transform = "scale(1)", 300);
}

/* ===== Guard ===== */
function protectRoute() {
    if (!state.user && window.location.pathname.includes("dashboard.html")) {
        window.location.href = "login.html";
    }
}

/* ===== Authentication ===== */
(function () {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            if (!email || !password) {
                document.getElementById("login-error").textContent = "Попълни всички полета.";
                return;
            }

            state.user = { email, token: "fake-jwt-token" };
            window.location.href = "dashboard.html";
        });
    }

    if (registerForm) {
        const passwordInput = document.getElementById("reg-password");
        const strengthBar = document.querySelector(".strength-bar span");

        passwordInput.addEventListener("input", () => {
            const value = passwordInput.value;
            let strength = 0;

            if (value.length > 5) strength += 30;
            if (/[A-Z]/.test(value)) strength += 30;
            if (/[0-9]/.test(value)) strength += 20;
            if (/[^A-Za-z0-9]/.test(value)) strength += 20;

            strengthBar.style.width = strength + "%";

            if (strength < 50) strengthBar.style.background = "red";
            else if (strength < 80) strengthBar.style.background = "orange";
            else strengthBar.style.background = "#00ff88";
        });

        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            state.user = { email: document.getElementById("reg-email").value };
            window.location.href = "dashboard.html";
        });
    }
})();

/* ===== Blog ===== */
console.log("Blog engine ready");

/* ===== Dashboard ===== */
console.log("Dashboard loaded");

/* ===== Products page ===== */
(function () {
    const container = document.getElementById("products-container");
    const sortSelect = document.getElementById("sort");
    const quickView = document.getElementById("quick-view");

    let products = [];

    async function init() {
        products = await fetchProducts();
        state.products = products;
        renderProducts(products);
    }

    function renderProducts(list) {
        if (!container) return;
        container.innerHTML = "";

        list.forEach(product => {
            const card = document.createElement("div");
            card.className = "product-card reveal";

            card.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.price} лв</p>
            <button data-id="${product.id}">Добави</button>
        `;

            card.querySelector("button").addEventListener("click", (e) => {
                e.stopPropagation();
                addToCart(product);
            });

            card.addEventListener("click", () => openQuickView(product));

            container.appendChild(card);
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            let sorted = [...products];

            if (sortSelect.value === "low") {
                sorted.sort((a, b) => a.price - b.price);
            }
            if (sortSelect.value === "high") {
                sorted.sort((a, b) => b.price - a.price);
            }

            renderProducts(sorted);
        });
    }

    function openQuickView(product) {
        if (!quickView) return;
        quickView.classList.remove("hidden");

        quickView.innerHTML = `
        <div class="modal-content">
            <h2>${product.name}</h2>
            <p>${product.price} лв</p>
            <button id="add">Добави в количката</button>
            <button id="close">Затвори</button>
        </div>
    `;

        document.getElementById("add").onclick = () => {
            addToCart(product);
            quickView.classList.add("hidden");
        };

        document.getElementById("close").onclick = () => {
            quickView.classList.add("hidden");
        };
    }

    if (container) init();
})();

/* ===== App initialization ===== */
document.addEventListener("DOMContentLoaded", () => {
    initReveal();
    initCounter();
    initScrollProgress();
    initCursor();
    protectRoute();
    updateCartCount();

    // page-specific actions
    renderCart();
    initCheckout();

    if (document.getElementById('app')) showPage('home');
});
