document.addEventListener('DOMContentLoaded', function() {
    // --- Hero Slider Logic ---
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const slides = heroSlider.querySelectorAll('.slide');
        const dots = heroSlider.querySelectorAll('.slider-dot');
        const prev = heroSlider.querySelector('.slider-prev');
        const next = heroSlider.querySelector('.slider-next');
        let currentSlide = 0;
        let slideInterval;

        function showSlide(n) {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                dots[index].classList.remove('opacity-100');
                dots[index].classList.add('opacity-50');
            });
            
            slides[n].classList.add('active');
            dots[n].classList.add('opacity-100');
            dots[n].classList.remove('opacity-50');
            currentSlide = n;
        }
        
        function nextSlide() {
            let newSlide = (currentSlide + 1) % slides.length;
            showSlide(newSlide);
        }
        
        function prevSlide() {
            let newSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(newSlide);
        }
        
        function startSlideShow() {
            slideInterval = setInterval(nextSlide, 5000); // Auto-rotate every 5 seconds
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        // Initialize Hero Slider
        if (slides.length > 0) {
            showSlide(0);
            startSlideShow();
            
            next.addEventListener('click', () => { nextSlide(); stopSlideShow(); startSlideShow(); });
            prev.addEventListener('click', () => { prevSlide(); stopSlideShow(); startSlideShow(); });
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => { showSlide(index); stopSlideShow(); startSlideShow(); });
            });
        }
    }


    // --- Packages Slider Logic ---
    const packagesTrack = document.getElementById('packages-track');
    if (packagesTrack) {
        const packagesPrevBtn = document.getElementById('packages-prev');
        const packagesNextBtn = document.getElementById('packages-next');
        
        const packagesData = [
            { title: 'Chequeo control mujer', oldPrice: '73.60', newPrice: '51.52', discount: '-30%', img: '../public/images/package-1.jpg' },
            { title: 'Vitamina C + Consulta', oldPrice: null, newPrice: '64.11', discount: null, img: '../public/images/package-2.jpg' },
            { title: 'Cuidado auditivo integral', oldPrice: null, newPrice: '59.20', discount: null, img: '../public/images/package-3.jpg' },
            { title: 'Control sistema digestivo', oldPrice: null, newPrice: '577.95', discount: null, img: '../public/images/package-4.jpg' },
            { title: 'Plan Médico Dermatológico', oldPrice: '71.00', newPrice: '35.50', discount: '-50%', img: '../public/images/package-5.jpg' },
            { title: 'Corazón Sano 360', oldPrice: '76.50', newPrice: '45.90', discount: '-40%', img: '../public/images/package-6.jpg' }
        ];

        // Inject package cards into the DOM
        packagesTrack.innerHTML = packagesData.map(pkg => `
            <div class="package-slide p-2" style="flex: 0 0 100%; sm:flex: 0 0 50%; lg:flex: 0 0 25%;">
                <div class="card-hover bg-white rounded-xl shadow-md overflow-hidden transition-transform h-full flex flex-col">
                    <div class="relative">
                        <img src="${pkg.img}" alt="${pkg.title}" class="w-full h-48 object-cover">
                        ${pkg.discount ? `<span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">${pkg.discount}</span>` : ''}
                    </div>
                    <div class="p-4 flex flex-col flex-grow">
                        <a href="#" class="text-blue-800 font-medium hover:underline">${pkg.title}</a>
                        <div class="mt-2 flex-grow">
                            ${pkg.oldPrice ? `<span class="text-sm text-gray-500 line-through">Antes $${pkg.oldPrice}</span>` : ''}
                            <p class="text-xl font-bold text-blue-800">$${pkg.newPrice}</p>
                        </div>
                        <a href="#" class="mt-4 inline-block text-blue-800 font-bold hover:underline">Ver más</a>
                    </div>
                </div>
            </div>
        `).join('');

        const packageSlides = packagesTrack.querySelectorAll('.package-slide');
        let packagesCurrentIndex = 0;

        function getVisibleSlides() {
            const viewportWidth = packagesTrack.parentElement.offsetWidth;
            const slideWidth = packageSlides[0].offsetWidth;
            return Math.floor(viewportWidth / slideWidth);
        }

        function updatePackagesSlider() {
            const slideWidth = packageSlides[0].offsetWidth;
            packagesTrack.style.transform = `translateX(-${packagesCurrentIndex * slideWidth}px)`;
            
            const visibleSlides = getVisibleSlides();

            packagesPrevBtn.disabled = packagesCurrentIndex === 0;
            packagesNextBtn.disabled = packagesCurrentIndex >= packageSlides.length - visibleSlides;
        }

        packagesNextBtn.addEventListener('click', () => {
            const visibleSlides = getVisibleSlides();
            if (packagesCurrentIndex < packageSlides.length - visibleSlides) {
                packagesCurrentIndex++;
                updatePackagesSlider();
            }
        });

        packagesPrevBtn.addEventListener('click', () => {
            if (packagesCurrentIndex > 0) {
                packagesCurrentIndex--;
                updatePackagesSlider();
            }
        });

        // Initial setup and responsive handling
        updatePackagesSlider();
        window.addEventListener('resize', updatePackagesSlider);
    }
});
