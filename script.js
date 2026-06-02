document.addEventListener("DOMContentLoaded", () => {
    
    // Business Selector Logic (Land Rover Style Tab Switcher)
    const businessItems = document.querySelectorAll(".business-item");
    const businessPanels = document.querySelectorAll(".business-panel");

    if (businessItems.length > 0) {
        businessItems.forEach(item => {
            item.addEventListener("click", () => {
                // Remove active class from all items and panels
                businessItems.forEach(i => i.classList.remove("active"));
                businessPanels.forEach(p => p.classList.remove("active"));

                // Add active class to clicked item
                item.classList.add("active");

                // Find target panel and activate it
                const targetId = item.getAttribute("data-target");
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add("active");
                }
            });
        });
    }
    
    // Generic Parallax Engine (For all .parallax-img backgrounds)
    const parallaxImages = document.querySelectorAll('.parallax-img');
    window.addEventListener('scroll', () => {
        parallaxImages.forEach(img => {
            const rect = img.parentElement.getBoundingClientRect();
            // If the element is visible on the screen
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                // Calculate subtle depth movement based on its scroll position
                const parallaxDistance = rect.top * 0.2;
                img.style.transform = `scale(1.05) translateY(${parallaxDistance}px)`;
            }
        });
    });

    // Reveal Animation Logic (Intersections)
    const reveals = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
});
