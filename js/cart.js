import { state } from "./state.js";

export function addToCart(product) {
    state.cart.push(product);
    updateCartCount();
    animateAdd();
}

function updateCartCount() {
    const count = document.getElementById("cart-count");
    if (count) count.textContent = state.cart.length;
}

function animateAdd() {
    const icon = document.querySelector(".cart-icon");
    if (!icon) return;

    icon.style.transform = "scale(1.3)";
    setTimeout(() => icon.style.transform = "scale(1)", 300);
}