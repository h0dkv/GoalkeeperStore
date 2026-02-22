const products = [
    { id: 1, name: "Pro Gloves X1", price: 89, image: "https://via.placeholder.com/300x200" },
    { id: 2, name: "Elite GK Jersey", price: 69, image: "https://via.placeholder.com/300x200" },
    { id: 3, name: "GK Protection Pads", price: 49, image: "https://via.placeholder.com/300x200" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("products");

function renderProducts() {
    container.innerHTML = "";
    products.forEach(p => {
        container.innerHTML += `
            <div class="product">
                <img src="${p.image}">
                <h3>${p.name}</h3>
                <p>${p.price} лв</p>
                <button onclick="addToCart(${p.id})">Добави в кошницата</button>
            </div>
        `;
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    document.getElementById("cart-count").innerText = cart.length;
}

function openCart() {
    document.getElementById("cart-modal").style.display = "flex";
    renderCart();
}

function closeCart() {
    document.getElementById("cart-modal").style.display = "none";
}

function renderCart() {
    const list = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    list.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price;
        list.innerHTML += `<li>${item.name} - ${item.price} лв</li>`;
    });

    totalEl.innerText = total;
}

function checkout() {
    alert("Поръчката е успешна!");
    cart = [];
    localStorage.removeItem("cart");
    updateCart();
    closeCart();
}

function scrollToProducts(){
    document.getElementById("products").scrollIntoView({behavior:"smooth"});
}

renderProducts();
updateCart();

function loadProductPage() {
    const container = document.getElementById("product-page");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));
    const product = products.find(p => p.id === id);

    if (product) {
        container.innerHTML = `
            <img src="${product.image}">
            <div>
                <h1>${product.name}</h1>
                <p>${product.price} лв</p>
                <p>Професионално качество за максимално представяне.</p>
                <button onclick="addToCart(${product.id})">Добави в кошницата</button>
            </div>
        `;
    }
}

function loadCartPage(){
    const list = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if(!list) return;

    list.innerHTML = "";
    let total = 0;

    cart.forEach(item=>{
        total += item.price;
        list.innerHTML += `<li>${item.name} - ${item.price} лв</li>`;
    });

    totalEl.innerText = total;
}

loadProductPage();
loadCartPage();