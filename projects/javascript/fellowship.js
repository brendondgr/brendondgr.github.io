document.addEventListener('DOMContentLoaded', () => {
    // JavaScript for copy button functionality
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const pre = button.parentElement;
            const code = pre.querySelector('code');
            if (code) {
                navigator.clipboard.writeText(code.innerText).then(() => {
                    button.innerText = 'Copied!';
                    setTimeout(() => {
                        button.innerText = 'Copy';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        });
    });

    // JavaScript for CLI tabs
    const tabButtonsContainer = document.getElementById('tab-buttons');
    if (tabButtonsContainer) {
        const tabButtons = tabButtonsContainer.querySelectorAll('.tab-button');
        const tabContents = document.getElementById('tab-contents').querySelectorAll('.tab-content');

        tabButtonsContainer.addEventListener('click', (event) => {
            const clickedButton = event.target.closest('.tab-button');
            if (!clickedButton) return;

            const tabId = clickedButton.dataset.tab;
            
            tabButtons.forEach(button => button.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            clickedButton.classList.add('active');
            document.getElementById(`tab-content-${tabId}`)?.classList.add('active');
        });
    }

    // JavaScript for Carousel
    const carouselContainer = document.getElementById('carousel-container');
    const carouselDescription = document.getElementById('carousel-description');
    const carouselTitleContainer = document.getElementById('carousel-title-container');

    if (carouselContainer && carouselDescription && carouselTitleContainer) {
        fetch('../data/Fellowship.csv')
            .then(response => response.text())
            .then(csvText => {
                const rows = csvText.trim().split('\n').slice(1);
                rows.forEach((row, index) => {
                    if (!row) return; // Skip empty rows

                    const firstCommaIndex = row.indexOf(',');
                    const secondCommaIndex = row.indexOf(',', firstCommaIndex + 1);

                    const imageUrl = row.substring(0, firstCommaIndex);
                    const title = row.substring(firstCommaIndex + 1, secondCommaIndex);
                    let description = row.substring(secondCommaIndex + 1);
                    
                    // Handle CSV strings that are quoted
                    if (description.startsWith('"') && description.endsWith('"')) {
                        description = description.substring(1, description.length - 1).replace(/""/g, '"');
                    }

                    // Create slide
                    const slide = document.createElement('div');
                    slide.id = `slide-${index + 1}`;
                    slide.classList.add('carousel-slide', 'absolute', 'w-full', 'h-full', 'top-0', 'left-0');
                    if (index === 0) {
                        slide.classList.add('opacity-100');
                    } else {
                        slide.classList.add('opacity-0');
                    }
                    
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = title; // Use title for alt text for better accessibility
                    img.classList.add('w-full', 'h-full', 'object-cover');
                    slide.appendChild(img);
                    carouselContainer.appendChild(slide);

                    // Create title
                    const titleEl = document.createElement('h3');
                    titleEl.id = `title-${index + 1}`;
                    titleEl.textContent = title;
                    titleEl.classList.add('carousel-title', 'absolute', 'w-full', 'h-full', 'top-0', 'left-0', 'text-2xl', 'font-bold', 'text-slate-900', 'transition-opacity', 'duration-500', 'ease-in-out');
                    if (index === 0) {
                        titleEl.classList.add('opacity-100');
                    } else {
                        titleEl.classList.add('opacity-0');
                    }
                    carouselTitleContainer.appendChild(titleEl);

                    // Create description
                    const desc = document.createElement('p');
                    desc.id = `desc-${index + 1}`;
                    desc.textContent = description;
                    if (index !== 0) {
                        desc.classList.add('hidden');
                    }
                    carouselDescription.appendChild(desc);
                });
                
                initializeCarousel();
            })
            .catch(error => console.error('Error fetching or parsing CSV:', error));
    }

    function initializeCarousel() {
        const carouselContainer = document.getElementById('carousel-container');
        if (carouselContainer) {
            let currentSlide = 0;
            const slides = carouselContainer.querySelectorAll('.carousel-slide');
            const titles = document.getElementById('carousel-title-container').querySelectorAll('.carousel-title');
            const descriptions = document.getElementById('carousel-description').querySelectorAll('p');
            const totalSlides = slides.length;

            if (totalSlides === 0) return;

            const showSlide = (index) => {
                slides.forEach((slide, i) => {
                    slide.style.opacity = i === index ? '1' : '0';
                });
                titles.forEach((title, i) => {
                    title.style.opacity = i === index ? '1' : '0';
                });
                descriptions.forEach((desc, i) => {
                     desc.classList.toggle('hidden', i !== index);
                });
            };

            document.getElementById('next-btn').addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                showSlide(currentSlide);
            });

            document.getElementById('prev-btn').addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                showSlide(currentSlide);
            });
        }
    }
});
