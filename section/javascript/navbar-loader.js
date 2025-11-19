document.addEventListener('DOMContentLoaded', function() {
    // --- Page Transition Logic ---
    // 1. Fade in the page when loaded
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 50); // Small delay to ensure transition triggers

    // 2. Intercept link clicks for fade out
    document.body.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        
        // Check if it's a valid link and not an anchor on the same page or external link
        if (link && link.href && link.target !== '_blank' && !link.href.includes('#')) {
            // If it's a link to a different page on the same site
            if (link.hostname === window.location.hostname) {
                e.preventDefault(); // Stop immediate navigation
                const targetUrl = link.href;

                // Fade out
                document.body.classList.remove('loaded');

                // Wait for animation to finish (matches CSS transition time)
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 500); 
            }
        }
    });

    // Handle browser back/forward buttons (pageshow event)
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            document.body.classList.add('loaded');
        }
    });

    fetch('/section/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;

            // Re-run the script from the navbar HTML to attach event listeners
            const scriptElement = document.createElement('script');
            const scriptTag = /<script>([\s\S]*)<\/script>/i.exec(data);
            if (scriptTag && scriptTag[1]) {
                scriptElement.textContent = scriptTag[1];
                document.body.appendChild(scriptElement);
            }
        })
        .catch(error => {
            console.error('Error loading the navbar:', error);
        });
});
