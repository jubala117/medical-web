document.addEventListener('DOMContentLoaded', function() {

    // Function to fetch content from JSON
    async function fetchContent() {
        try {
            const response = await fetch('data/content.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Could not fetch content:", error);
            return null;
        }
    }

    // --- Hero Slider Logic ---
    function initHeroSlider(heroSlidesData) {
        const heroSliderContainer = document.getElementById('hero-slider-container');
        if (!heroSliderContainer) return;

        heroSliderContainer.innerHTML = heroSlidesData.map((slideData, index) => `
            <div class="slide ${index === 0 ? 'active' : ''}" style="background-image: url('${slideData.bgImage}');">
                <div class="container mx-auto px-4 h-full">
                    <div class="flex flex-col justify-between md:flex-row items-center h-full">
                        <div class="w-full md:w-3/5 lg:w-1/2 text-center md:text-left z-10 pt-8 md:pt-0">
                            <p class="hero-subtitle mb-4">${slideData.subtitle}</p>
                            <h1 class="hero-title font-bold mb-8">${slideData.title}</h1>
                            <a href="#" class="btn-primary px-8 py-3 rounded-lg text-white font-medium inline-block">${slideData.buttonText}</a>
                        </div>
                        ${slideData.foregroundImage ? `
                        <div class="w-full md:w-2/5 lg:w-1/2 h-auto md:h-full flex justify-center items-end">
                            <img src="${slideData.foregroundImage}" alt="${slideData.altText}" class="hero-foreground-img object-contain">
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        const dotsContainer = document.getElementById('hero-dots-container');
        dotsContainer.innerHTML = heroSlidesData.map((_, index) =>
            `<button class="slider-dot w-3 h-3 rounded-full bg-white opacity-50 focus:outline-none" aria-label="Ir al slide ${index + 1}" data-index="${index}"></button>`
        ).join('');

        const slides = heroSliderContainer.querySelectorAll('.slide');
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        const prevBtn = document.getElementById('hero-prev-btn');
        const nextBtn = document.getElementById('hero-next-btn');
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
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        showSlide(0);
        startSlideShow();

        heroSliderContainer.addEventListener('mouseenter', stopSlideShow);
        heroSliderContainer.addEventListener('mouseleave', startSlideShow);
        
        nextBtn.addEventListener('click', () => { nextSlide(); stopSlideShow(); startSlideShow(); });
        prevBtn.addEventListener('click', () => { prevSlide(); stopSlideShow(); startSlideShow(); });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => { showSlide(index); stopSlideShow(); startSlideShow(); });
        });
    }

    // --- Packages Slider Logic ---
    function initPackagesSlider(packagesData) {
        const packagesTrack = document.getElementById('packages-track');
        if (!packagesTrack) return;

        const packagesPrevBtn = document.getElementById('packages-prev');
        const packagesNextBtn = document.getElementById('packages-next');

        packagesTrack.innerHTML = packagesData.map(pkg => `
            <div class="package-slide p-2">
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
            if (packageSlides.length === 0) return 0;
            const viewportWidth = packagesTrack.parentElement.offsetWidth;
            const slideWidth = packageSlides[0].offsetWidth;
            return slideWidth > 0 ? Math.floor(viewportWidth / slideWidth) : 0;
        }

        function updatePackagesSlider() {
            if (packageSlides.length === 0) return;
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

        updatePackagesSlider();
        window.addEventListener('resize', updatePackagesSlider);
    }

    // --- Main Initialization ---
    async function main() {
        const content = await fetchContent();
        if (content) {
            if (content.heroSlides) {
                initHeroSlider(content.heroSlides);
            }
            if (content.packages) {
                initPackagesSlider(content.packages);
            }
        }
    }

    main();
});
