document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".year-nav").forEach(function (nav) {
        var links = Array.from(nav.querySelectorAll('a[href^="#year-"]'));
        var sections = links.map(function (link) {
            return document.querySelector(link.getAttribute("href"));
        }).filter(Boolean);

        if (!links.length || !sections.length) return;

        var activeId = "";

        function setActive(id) {
            if (id === activeId) return;
            activeId = id;

            links.forEach(function (link) {
                var active = link.getAttribute("href") === "#" + id;
                link.classList.toggle("active", active);
                if (active) {
                    link.setAttribute("aria-current", "true");

                    // On narrow screens the year selector is horizontally
                    // scrollable. Keep the active year visible without moving
                    // the page vertically.
                    if (nav.scrollWidth > nav.clientWidth) {
                        var targetLeft = link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2;
                        nav.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
                    }
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        }

        function updateActiveYear() {
            var marker = window.scrollY + 180;
            var current = sections[0];
            sections.forEach(function (section) {
                if (section.offsetTop <= marker) current = section;
            });
            setActive(current.id);
        }

        links.forEach(function (link) {
            link.addEventListener("click", function () {
                setActive(link.getAttribute("href").slice(1));
            });
        });

        var ticking = false;
        window.addEventListener("scroll", function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    updateActiveYear();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        updateActiveYear();
    });
});
