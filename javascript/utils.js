
function loadHTML(elementId, url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
            } else {
                console.error(`Element with id "${elementId}" not found.`);
            }
        })
        .catch(error => console.error('Error loading HTML:', error));
} 