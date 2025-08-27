document.addEventListener("DOMContentLoaded", function() {
    // Fetch and insert the main navbar
    fetch("section/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
            // Mobile menu toggle for main navbar
            const mobileMenuButton = document.getElementById("mobile-menu-button");
            const mobileMenu = document.getElementById("mobile-menu");
            if (mobileMenuButton) {
                mobileMenuButton.addEventListener("click", function() {
                    mobileMenu.classList.toggle("hidden");
                });
            }
        })
        .catch(error => {
            console.error('Error fetching main navbar:', error);
        });
}); 