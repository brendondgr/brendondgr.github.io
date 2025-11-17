// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Image Carousel Logic
const carouselTrack = document.getElementById('carousel-track');
const carouselButtons = document.querySelectorAll('.carousel-button');
const carouselDots = document.querySelectorAll('.dot');
let currentIndex = 0;
let autoSlideInterval;

function updateCarousel() {
    carouselTrack.style.transform = `translateX(${-currentIndex * 100}%)`;
    carouselDots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function startAutoSlide() {
    clearInterval(autoSlideInterval); // Clear any existing interval
    autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % carouselDots.length;
        updateCarousel();
    }, 5000); // Change image every 5 seconds
}

carouselButtons.forEach(button => {
    button.addEventListener('click', () => {
        const direction = button.dataset.direction;
        if (direction === 'prev') {
            currentIndex = (currentIndex - 1 + carouselDots.length) % carouselDots.length;
        } else {
            currentIndex = (currentIndex + 1) % carouselDots.length;
        }
        updateCarousel();
        startAutoSlide(); // Reset auto-slide on manual interaction
    });
});

carouselDots.forEach(dot => {
    dot.addEventListener('click', (event) => {
        currentIndex = parseInt(event.target.dataset.index);
        updateCarousel();
        startAutoSlide(); // Reset auto-slide on manual interaction
    });
});

// Initialize carousel and start auto-slide
updateCarousel();
startAutoSlide();