// --- Navbar Loader ---
fetch('../section/navbar.html')
    .then(response => response.text())
    .then(data => {
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            navbarContainer.innerHTML = data;
        }
    });

// --- Content Loader ---
fetch('html/fsusc_scraping_content.html')
    .then(response => response.text())
    .then(data => {
        const contentContainer = document.getElementById('content-container');
        if (contentContainer) {
            contentContainer.innerHTML = data;
        }
    });

// --- Copy to Clipboard Functionality ---
document.addEventListener('DOMContentLoaded', () => {
    // Use event delegation on a parent element.
    document.body.addEventListener('click', event => {
        // Check if a copy button was clicked.
        const copyBtn = event.target.closest('.copy-btn');
        if (!copyBtn) return;

        const codeBlock = copyBtn.closest('.code-block');
        if (!codeBlock) return;
        
        const codeElement = codeBlock.querySelector('code');
        if (!codeElement) return;

        const textToCopy = codeElement.innerText;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const copyText = copyBtn.querySelector('.copy-text');
            const copyCheck = copyBtn.querySelector('.copy-check');
            
            if (copyText && copyCheck) {
                copyText.classList.add('hidden');
                copyCheck.classList.remove('hidden');

                setTimeout(() => {
                    copyText.classList.remove('hidden');
                    copyCheck.classList.add('hidden');
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });
}); 