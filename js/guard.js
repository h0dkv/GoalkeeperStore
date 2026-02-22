import { state } from "./state.js";

export function protectRoute() {
    if (!state.user) {
        window.location.href = "login.html";
    }
}