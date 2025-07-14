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

document.addEventListener('DOMContentLoaded', function() {
    loadHTML('navbar-container', 'navbar.html', () => {
        // Mobile menu toggler
        const navbarToggler = document.getElementById('navbar-toggler');
        const navbarCollapse = document.getElementById('navbarCollapse');

        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', function() {
                navbarCollapse.classList.toggle('hidden');
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
            if ((normalizedCurrentPath === '' || normalizedCurrentPath === '/index.html') && (normalizedLinkPath === '/index.html' || normalizedLinkPath === '')) {
                link.classList.add('active');
            } else if (normalizedLinkPath !== '' && normalizedCurrentPath.endsWith(normalizedLinkPath)) {
                link.classList.add('active');
            }
        });
    });
}); 