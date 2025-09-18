document.addEventListener('DOMContentLoaded', function () {
    const productData = {
        sizes: [
            { name: '8ft x 10ft', price: 1299.00 },
            { name: '10ft x 10ft', price: 1499.00 },
            { name: '12ft x 10ft', price: 1699.00 },
            { name: '16ft x 10ft', price: 1999.00 },
        ],
        colors: [
            { name: 'Forest Green', hex: '#22543d', sku: 'SS-AWN-P102-GRN', images: ['https://placehold.co/800x600/22543d/ffffff?text=Forest+Green'] },
            { name: 'Navy Blue', hex: '#2c5282', sku: 'SS-AWN-P102-NAV', images: ['https://placehold.co/800x600/2c5282/ffffff?text=Navy+Blue'] },
            { name: 'Burgundy', hex: '#800020', sku: 'SS-AWN-P102-BRG', images: ['https://placehold.co/800x600/800020/ffffff?text=Burgundy'] },
            { name: 'Beige', hex: '#f5f5dc', sku: 'SS-AWN-P102-BGE', images: ['https://placehold.co/800x600/f5f5dc/333333?text=Beige'] },
            { name: 'Charcoal', hex: '#36454F', sku: 'SS-AWN-P102-CHR', images: ['https://placehold.co/800x600/36454F/ffffff?text=Charcoal'] },
            { name: 'Teal', hex: '#008080', sku: 'SS-AWN-P102-TEL', images: ['https://placehold.co/800x600/008080/ffffff?text=Teal'] },
            { name: 'Terracotta', hex: '#E2725B', sku: 'SS-AWN-P102-TER', images: ['https://placehold.co/800x600/E2725B/ffffff?text=Terracotta'] },
            { name: 'Sage Green', hex: '#B2AC88', sku: 'SS-AWN-P102-SGE', images: ['https://placehold.co/800x600/B2AC88/ffffff?text=Sage+Green'] },
            { name: 'Slate Gray', hex: '#708090', sku: 'SS-AWN-P102-SLG', images: ['https://placehold.co/800x600/708090/ffffff?text=Slate+Gray'] },
            { name: 'Cream', hex: '#FFFDD0', sku: 'SS-AWN-P102-CRM', images: ['https://placehold.co/800x600/FFFDD0/333333?text=Cream'] },
            { name: 'Mustard', hex: '#FFDB58', sku: 'SS-AWN-P102-MYL', images: ['https://placehold.co/800x600/FFDB58/333333?text=Mustard'] },
            { name: 'Royal Blue', hex: '#4169E1', sku: 'SS-AWN-P102-RBL', images: ['https://placehold.co/800x600/4169E1/ffffff?text=Royal+Blue'] },
            { name: 'Crimson Red Crystal', hex: '#BC243C', sku: 'SS-AWN-P102-CRC', images: ['https://placehold.co/800x600/BC243C/ffffff?text=Crimson+Red'] },
            { name: 'Chocolate', hex: '#7B3F00', sku: 'SS-AWN-P102-BRN', images: ['https://placehold.co/800x600/7B3F00/ffffff?text=Chocolate'] },
            { name: 'Black', hex: '#000000', sku: 'SS-AWN-P102-BLK', images: ['https://placehold.co/800x600/000000/ffffff?text=Black'] }
        ]
    };

    // --- Elements ---
            const carousel = document.getElementById('carousel');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const selectedColorNameSpan = document.getElementById('selectedColorName');
            const sizeSelector = document.getElementById('size');
            const productPriceEl = document.getElementById('productPrice');
            const productSkuEl = document.getElementById('productSku');
            
            const colorPanelWrapper = document.getElementById('colorPanelWrapper');
            const smallScreenPlaceholder = document.getElementById('smallScreenPlaceholder');
            const largeScreenPlaceholder = document.getElementById('largeScreenPlaceholder');
            const colorSelector = document.getElementById('colorSelector');
            const hiddenColors = document.getElementById('hiddenColors');
            const toggleColorsBtn = document.getElementById('toggleColorsBtn');

            let currentIndex = 0;

            function formatPrice(price) {
                return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            }

            function updateCarousel(imageUrls) {
                carousel.querySelectorAll('.carousel-image').forEach(img => img.remove());
                imageUrls.forEach((url, index) => {
                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = `Awning view ${index + 1}`;
                    img.classList.add('carousel-image');
                    carousel.insertBefore(img, prevBtn);
                });
                currentIndex = 0;
                showImage(currentIndex);
                const showButtons = imageUrls.length > 1;
                prevBtn.style.display = showButtons ? 'block' : 'none';
                nextBtn.style.display = showButtons ? 'block' : 'none';
            }

            function showImage(index) {
                const images = carousel.querySelectorAll('.carousel-image');
                if (images.length > 0) {
                    images.forEach((img, i) => img.classList.toggle('active', i === index));
                }
            }
            
            function createColorButtons(visibleCount) {
                colorSelector.innerHTML = '';
                hiddenColors.innerHTML = '';

                const longNameThreshold = 15;
                
                productData.colors.forEach((color, index) => {
                    const button = document.createElement('button');
                    button.className = 'color-button flex flex-row items-center gap-3 border border-gray-300 rounded-lg px-3 py-2 transition hover:border-gray-500 focus:outline-none w-full';
                    if (color.name.length > longNameThreshold) {
                         button.classList.add('col-span-2');
                    }
                    button.dataset.colorName = color.name;
                    if (index === 0 && selectedColorNameSpan.textContent === color.name) {
                        button.classList.add('active');
                    }
                    
                    button.innerHTML = `
                        <span class="block w-6 h-6 rounded-full border border-gray-200 flex-shrink-0" style="background-color: ${color.hex}"></span>
                        <span class="text-sm text-left truncate">${color.name}</span>
                    `;
                    
                    button.addEventListener('click', () => {
                        document.querySelectorAll('.color-button').forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        
                        const selectedColorData = productData.colors.find(c => c.name === color.name);
                        if (selectedColorData) {
                            selectedColorNameSpan.textContent = selectedColorData.name;
                            productSkuEl.textContent = `SKU: ${selectedColorData.sku}`;
                            updateCarousel(selectedColorData.images);
                        }
                    });

                    if (index < visibleCount) {
                        colorSelector.appendChild(button);
                    } else {
                        hiddenColors.appendChild(button);
                    }
                });

                if (productData.colors.length > visibleCount) {
                    toggleColorsBtn.style.display = 'block';
                } else {
                    toggleColorsBtn.style.display = 'none';
                }
                
                hiddenColors.style.maxHeight = null;
                toggleColorsBtn.textContent = "Show All Colors";
            }

            function createSizeOptions() {
                productData.sizes.forEach((size, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = `${size.name} (${formatPrice(size.price)})`;
                    if (size.name === '10ft x 10ft') {
                        option.selected = true;
                    }
                    sizeSelector.appendChild(option);
                });
            }

            function updatePrice() {
                const selectedSizeIndex = sizeSelector.value;
                const selectedSize = productData.sizes[selectedSizeIndex];
                if(selectedSize) {
                    productPriceEl.textContent = formatPrice(selectedSize.price);
                }
            }
            
            function updateColorPanelLayout() {
                let visibleCount, targetPlaceholder, gridColsClass;

                if (window.innerWidth <= 1000) {
                    targetPlaceholder = smallScreenPlaceholder;
                    gridColsClass = 'grid-cols-2';
                    visibleCount = 6; // 3 rows
                } else {
                    targetPlaceholder = largeScreenPlaceholder;
                    gridColsClass = 'grid-cols-5';
                    visibleCount = 15; // 3 rows
                }
                
                targetPlaceholder.appendChild(colorPanelWrapper);
                colorPanelWrapper.classList.remove('hidden');
                
                colorSelector.className = 'grid gap-3 ' + gridColsClass;
                hiddenColors.className = 'grid gap-3 mt-3 ' + gridColsClass;
                
                createColorButtons(visibleCount);
                 // Re-apply active class after recreation
                const currentActiveColor = selectedColorNameSpan.textContent;
                document.querySelector(`.color-button[data-color-name="${currentActiveColor}"]`)?.classList.add('active');
            }

            function initialize() {
                createSizeOptions();
                updateCarousel(productData.colors[0].images);
                productSkuEl.textContent = `SKU: ${productData.colors[0].sku}`;
                selectedColorNameSpan.textContent = productData.colors[0].name;
                updatePrice();
                updateColorPanelLayout();
            }

            initialize();

            // --- Event Listeners ---
            window.addEventListener('resize', updateColorPanelLayout);
            sizeSelector.addEventListener('change', updatePrice);

            toggleColorsBtn.addEventListener('click', () => {
                const isHidden = !hiddenColors.style.maxHeight || hiddenColors.style.maxHeight === '0px';
                if (isHidden) {
                    hiddenColors.style.maxHeight = hiddenColors.scrollHeight + "px";
                    toggleColorsBtn.textContent = "Hide Colors";
                } else {
                    hiddenColors.style.maxHeight = null;
                    toggleColorsBtn.textContent = "Show All Colors";
                }
            });

            prevBtn.addEventListener('click', () => {
                const imageCount = carousel.querySelectorAll('.carousel-image').length;
                if(imageCount > 0){
                    currentIndex = (currentIndex - 1 + imageCount) % imageCount;
                    showImage(currentIndex);
                }
            });

            nextBtn.addEventListener('click', () => {
                 const imageCount = carousel.querySelectorAll('.carousel-image').length;
                 if(imageCount > 0){
                    currentIndex = (currentIndex + 1) % imageCount;
                    showImage(currentIndex);
                 }
            });

            // Quantity Selector
            const quantitySpan = document.getElementById('quantity');
            const minusBtn = document.getElementById('quantityMinus');
            const plusBtn = document.getElementById('quantityPlus');

            minusBtn.addEventListener('click', () => {
                let currentQuantity = parseInt(quantitySpan.textContent);
                if (currentQuantity > 1) {
                    quantitySpan.textContent = currentQuantity - 1;
                }
            });

            plusBtn.addEventListener('click', () => {
                let currentQuantity = parseInt(quantitySpan.textContent);
                quantitySpan.textContent = currentQuantity + 1;
            });

            // Accordion
            const accordionButtons = document.querySelectorAll('.accordion-button');
            accordionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const content = button.parentElement.nextElementSibling;
                    button.classList.toggle('active');

                    if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            });
        });
