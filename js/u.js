export function initReveal() {
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

export function initCounter() {
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

export function initScrollProgress() {
    window.addEventListener("scroll", () => {
        const scroll = window.scrollY;
        const height = document.body.scrollHeight - window.innerHeight;
        const progress = (scroll / height) * 100;
        document.querySelector(".scroll-progress").style.width = progress + "%";
    });
}

export function initCursor() {
    const cursor = document.querySelector(".cursor");
    document.addEventListener("mousemove", e => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });
}