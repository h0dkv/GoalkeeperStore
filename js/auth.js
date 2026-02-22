import { state } from "./state.js";

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