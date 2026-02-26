/* Unified JavaScript bundle for GoalkeeperStore */

/* ===== State ===== */
const state = {
    cart: [],
    user: null
};

/* ===== Currency ===== */
const CURRENCY = {
    symbol: '€',
    code: 'EUR',
    rateFromBGN: 1.95583 // if you ever convert legacy BGN amounts
};

function formatPrice(amount) {
    return amount.toFixed(2) + ' ' + CURRENCY.symbol;
}


/* ===== Navigation (index) ===== */
function showPage(page) {
    const app = document.getElementById('app');
    if (!app) return;
    if (page === 'home') {
        app.innerHTML = `
            <section class="hero reveal">
                <h1>Добре дошли в GKS Store</h1>
                <div style="margin-top:20px">
                    <a href="products.html" class="btn-primary">Виж продукти</a>
                    <a href="#about-section" class="btn-primary" style="margin-left:12px">За нас</a>
                    <a href="#contact-section" class="btn-primary" style="margin-left:12px">Контакти</a>
                </div>
            </section>

            <section id="about-section" class="about-section reveal">
                <h2>Кои сме ние?</h2>
                <p>GKS Store е премиум бранд за вратарска екипировка, създаден с една мисия – да дадем на всеки вратар увереността да доминира на терена.</p>
            </section>

            <section id="contact-section" class="contact-wrapper reveal">
                <div class="contact-info">
                    <h2>Контактна информация</h2>
                    <p>📍 Варна, България</p>
                    <p>📞 +359 888 123 456</p>
                    <p>✉️ info@gksstore.com</p>
                </div>
                <div class="contact-form">
                    <h2>Изпрати съобщение</h2>
                    <form id="contact-form-inline">
                        <input type="text" placeholder="Име" required>
                        <input type="email" placeholder="Имейл" required>
                        <textarea placeholder="Съобщение" required></textarea>
                        <button type="submit" class="btn-primary">Изпрати</button>
                    </form>
                </div>
            </section>
        `;
        initReveal();
    } else if (page === 'products') {
        window.location.href = 'products.html';
    } else if (page === 'cart') {
        window.location.href = 'cart.html';
    }
}

// initialize nav links to support SPA scrolling when on the index/home app
function initNavLinks() {
    document.querySelectorAll('a.nav-item, header a').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');

            // if we have the single-page app container, handle scroll to anchors
            const app = document.getElementById('app');
            if (app && (href === 'about.html' || href === 'contact.html' || href === '#about-section' || href === '#contact-section')) {
                e.preventDefault();
                // ensure home content is rendered
                showPage('home');
                // wait for DOM update
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    if (href.includes('about') || href === '#about-section') {
                        const el = document.getElementById('about-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    if (href.includes('contact') || href === '#contact-section') {
                        const el = document.getElementById('contact-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }));
            }
            // products link with SPA hook
            if (app && href === 'index.html') {
                e.preventDefault();
                showPage('home');
            }
        });
    });
}

function initContactForms() {
    // handle inline contact form on home
    const inline = document.getElementById('contact-form-inline');
    if (inline) {
        inline.addEventListener('submit', e => {
            e.preventDefault();
            inline.innerHTML = '<h3>Благодарим! Ще се свържем с Вас скоро.</h3>';
        });
    }

    // handle standalone contact page form
    const pageForm = document.getElementById('contact-form');
    if (pageForm) {
        pageForm.addEventListener('submit', e => {
            e.preventDefault();
            pageForm.innerHTML = '<h3>Благодарим! Ще се свържем с Вас скоро.</h3>';
        });
    }
}

/* ===== API ===== */
async function fetchProducts() {
    return [
        { id: 1, name: "Професионални Ръкавици X1", price: 89 },
        { id: 2, name: "Елитен Джърси", price: 69 },
        { id: 3, name: "Защита за вратаря", price: 49 },
        { id: 4, name: "Тренировъчни Ръкавици", price: 59 }
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
    // custom cursor disabled
}

function initHeader() {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav-links');
    const toggle = document.querySelector('.menu-toggle');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
        window.addEventListener('click', e => {
            if (!nav.contains(e.target) && !toggle.contains(e.target)) {
                nav.classList.remove('open');
            }
        });
    }
}

/* ===== Cart ===== */
function addToCart(product) {
    state.cart.push(product);
    saveCart();
    updateCartCount();
    animateAdd();
}

function updateCartCount() {
    const count = document.getElementById("cart-count");
    if (count) {
        count.textContent = state.cart.length;
        count.classList.add('pulse');
        setTimeout(() => count.classList.remove('pulse'), 600);
    }
}

function renderCart() {
    const list = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!list) return;
    list.innerHTML = "";
    let total = 0;
    state.cart.forEach((p, idx) => {
        total += p.price;
        const li = document.createElement("li");
        li.textContent = `${p.name} - ${formatPrice(p.price)}`;
        li.classList.add('reveal');
        li.style.transitionDelay = `${idx * 0.1}s`;
        // allow removal on click
        li.addEventListener('click', () => {
            removeFromCart(idx);
        });
        list.appendChild(li);
    });
    if (totalEl) {
        totalEl.textContent = formatPrice(total);
        totalEl.classList.add('pulse');
        setTimeout(() => totalEl.classList.remove('pulse'), 800);
    }
}

function checkout() {
    window.location.href = "checkout.html";
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    saveCart();
    renderCart();
    updateCartCount();
}
function initCheckout() {
    const content = document.getElementById("checkout-content");
    if (!content) return;

    if (state.cart.length === 0) {
        content.innerHTML = '<p class="reveal">Няма продукти в количката.</p>';
        return;
    }

    // show summary
    let total = state.cart.reduce((sum, p) => sum + p.price, 0);
    content.innerHTML = `
        <div class="order-summary reveal">
            <h3>Вашата поръчка</h3>
            <ul>${state.cart.map(p => `<li>${p.name} - ${formatPrice(p.price)}</li>`).join('')}</ul>
            <p><strong>Общо: ${formatPrice(total)}</strong></p>
        </div>
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
        saveCart();
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

/* ===== Persistence ===== */
function saveCart() {
    try {
        localStorage.setItem('gks_cart', JSON.stringify(state.cart));
    } catch (e) {
        console.warn('could not save cart', e);
    }
}

function loadCart() {
    try {
        const data = localStorage.getItem('gks_cart');
        if (data) state.cart = JSON.parse(data);
    } catch (e) {
        console.warn('could not load cart', e);
    }
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
console.log("Блог движок готов");

/* ===== Dashboard ===== */
console.log("Таблото е заредено");

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
            <p>${formatPrice(product.price)}</p>
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
        quickView.classList.add("show");

        quickView.innerHTML = `
        <div class="modal-content reveal">
            <h2>${product.name}</h2>
            <p>${formatPrice(product.price)}</p>
            <button id="add" class="btn-primary">Добави в количката</button>
            <button id="close">Затвори</button>
        </div>
    `;

        document.getElementById("add").onclick = () => {
            addToCart(product);
            quickView.classList.remove("show");
            quickView.classList.add("hidden");
        };

        document.getElementById("close").onclick = () => {
            quickView.classList.remove("show");
            quickView.classList.add("hidden");
        };
    }

    if (container) init();
})();

/* ===== App initialization ===== */
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    initReveal();
    initCounter();
    initScrollProgress();
    //initCursor(); // disabled custom cursor
    initHeader();
    protectRoute();
    updateCartCount();

    // page-specific actions
    renderCart();
    initCheckout();

    if (document.getElementById('app')) showPage('home');
    // init SPA-friendly nav links and contact forms
    initNavLinks();
    initContactForms();
});
