// Function to load HTML content into a container
function loadHTML(containerId, filePath) {
    return fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(containerId).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    loadHTML('navbar-container', 'navbar.html');
}); 