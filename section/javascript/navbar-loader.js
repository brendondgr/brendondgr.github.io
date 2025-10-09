document.addEventListener('DOMContentLoaded', function() {
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
