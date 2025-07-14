// Function to load HTML content into a container
function loadHTML(containerId, filePath, callback) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
            if (callback) {
                callback();
            }
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// --- Typing Animation ---
const typingText = document.getElementById('typing-text');
const phrases = ["intelligent systems.", "medical AI.", "computer vision.", "interactive robotics."];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        // Deleting characters
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
    } else {
        // Typing characters
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentPhrase.length) {
            isDeleting = true;
            // Pause before deleting
            setTimeout(type, 2000);
            return;
        }
    }
    // Speed of typing/deleting
    const typeSpeed = isDeleting ? 100 : 200;
    setTimeout(type, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Start typing animation
    if (typingText && phrases.length > 0) {
        setTimeout(type, 500);
    }

    // Load Navbar
    loadHTML('navbar-container', 'section/navbar.html', () => {
        // Mobile menu toggler
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Set active nav link
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-item, .mobile-nav-item');

        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            // Normalize paths to remove trailing slashes for comparison
            const normalizedCurrentPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
            const normalizedLinkPath = linkPath.endsWith('/') ? linkPath.slice(0, -1) : linkPath;
            
            // Handle root path case (e.g., / or /index.html)
            const isRoot = normalizedCurrentPath === '' || normalizedCurrentPath === '/index.html' || normalizedCurrentPath.toLowerCase() === '/brendondgr.github.io';
            const linkIsRoot = normalizedLinkPath === '/index.html' || normalizedLinkPath === '' || normalizedLinkPath === '/';

            if (isRoot && linkIsRoot) {
                link.classList.add('active');
            } else if (normalizedLinkPath !== '' && normalizedLinkPath !== '/' && normalizedCurrentPath.endsWith(normalizedLinkPath)) {
                link.classList.add('active');
            }
        });
    });
});

// --- Fade-in on Scroll ---
const faders = document.querySelectorAll('.fade-in');
const appearOptions = {
    threshold: 0.2, // 20% of the element is visible
    rootMargin: "0px 0px -50px 0px" // trigger a little earlier
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScrollObserver) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('visible');
            appearOnScrollObserver.unobserve(entry.target);
        }
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
}); 