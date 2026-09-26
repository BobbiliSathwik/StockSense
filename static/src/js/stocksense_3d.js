/** =========================================================
 * StockSense — 3D Interaction Layer
 * ========================================================= */

(function () {
    "use strict";

    const CARD_SELECTOR = [
        ".ss-kpi-card",
        ".ss-card",
        ".ss-warehouse-card",
        ".ss-operation-box",
        ".ss-nav-item"
    ].join(",");

    const MAX_TILT = 7;

    function addTilt(card) {
        if (card.dataset.ss3dReady === "1") return;

        card.dataset.ss3dReady = "1";
        card.classList.add("ss-3d-card");

        card.addEventListener("pointerenter", () => {
            card.classList.add("ss-3d-active");
        });

        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const px = x / rect.width;
            const py = y / rect.height;

            const rotateY = (px - 0.5) * MAX_TILT * 2;
            const rotateX = (0.5 - py) * MAX_TILT * 2;

            card.style.setProperty(
                "--ss-rotate-x",
                `${rotateX}deg`
            );

            card.style.setProperty(
                "--ss-rotate-y",
                `${rotateY}deg`
            );

            card.style.setProperty(
                "--ss-glow-x",
                `${x}px`
            );

            card.style.setProperty(
                "--ss-glow-y",
                `${y}px`
            );
        });

        card.addEventListener("pointerleave", () => {
            card.classList.remove("ss-3d-active");

            card.style.setProperty(
                "--ss-rotate-x",
                "0deg"
            );

            card.style.setProperty(
                "--ss-rotate-y",
                "0deg"
            );

            card.style.setProperty(
                "--ss-glow-x",
                "50%"
            );

            card.style.setProperty(
                "--ss-glow-y",
                "50%"
            );
        });
    }

    function initializeCards() {
        document
            .querySelectorAll(CARD_SELECTOR)
            .forEach(addTilt);
    }

    function createBackground() {
        const app = document.querySelector(".ss-app");

        if (!app) return;

        if (app.querySelector(".ss-3d-orb-field")) {
            return;
        }

        const field = document.createElement("div");

        field.className = "ss-3d-orb-field";

        field.setAttribute(
            "aria-hidden",
            "true"
        );

        ["orb-one", "orb-two", "orb-three"].forEach(
            (name) => {
                const orb = document.createElement("span");

                orb.className =
                    `ss-3d-orb ${name}`;

                field.appendChild(orb);
            }
        );

        app.prepend(field);
    }

    function enableParallax() {
        if (
            window.matchMedia("(pointer: coarse)")
                .matches
        ) {
            return;
        }

        if (window.__stockSense3DParallax) {
            return;
        }

        window.__stockSense3DParallax = true;

        let frame = null;

        document.addEventListener(
            "pointermove",
            (event) => {
                if (frame) return;

                frame = requestAnimationFrame(() => {
                    const x =
                        event.clientX /
                            window.innerWidth -
                        0.5;

                    const y =
                        event.clientY /
                            window.innerHeight -
                        0.5;

                    document.documentElement
                        .style
                        .setProperty(
                            "--ss-parallax-x",
                            `${x * 14}px`
                        );

                    document.documentElement
                        .style
                        .setProperty(
                            "--ss-parallax-y",
                            `${y * 10}px`
                        );

                    frame = null;
                });
            }
        );
    }

    function boot() {
        initializeCards();
        createBackground();
        enableParallax();

        if (!window.__stockSense3DObserver) {
            const observer =
                new MutationObserver(() => {
                    initializeCards();
                    createBackground();
                });

            observer.observe(
                document.body,
                {
                    childList: true,
                    subtree: true
                }
            );

            window.__stockSense3DObserver =
                observer;
        }
    }

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            boot
        );
    } else {
        boot();
    }
})();