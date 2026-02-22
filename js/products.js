import { fetchProducts } from "./api.js";
import { state } from "./state.js";
import { addToCart } from "./cart.js";

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

function openQuickView(product) {
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

init();