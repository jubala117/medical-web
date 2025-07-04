document.addEventListener('DOMContentLoaded', function() {
    
    // --- Hero Slider Logic (FIXED) ---
    const heroSliderContainer = document.getElementById('hero-slider-container');
    if (heroSliderContainer) {
        const heroSlidesData = [
            {
                // SLIDE 1: Now has a foreground image
                bgImage: '', // The background is now the hero-gradient color
                foregroundImage: '../public/images/doctor.png', // <-- 1. AQUÍ PONES LA RUTA A TU IMAGEN PNG
                altText: 'Médico sonriendo con una paciente',
                subtitle: 'Hacemos fácil cuidarte',
                title: 'Salud familiar al alcance de todos',
                buttonText: 'Agendar cita',
            },
            {
                // SLIDE 2: To change the background, change this bgImage path
                bgImage: '../public/images/bg-slide2.jpg', // <-- 2. AQUÍ CAMBIAS LA IMAGEN DE FONDO DEL SLIDE 2
                foregroundImage: null, // No foreground image for this slide
                altText: 'Persona revisando resultados médicos en un celular',
                subtitle: 'Resultados en línea',
                title: 'Consulta tus exámenes cuando y donde quieras',
                buttonText: 'Ver resultados',
            },
            {
                // SLIDE 3
                bgImage: '../public/images/bg-slide3.jpg',
                foregroundImage: null,
                altText: 'Familia feliz y saludable',
                subtitle: 'Paquetes Preventivos',
                title: 'Cuidamos de ti con precios accesibles',
                buttonText: 'Ver paquetes',
            }
        ];

        // Create and inject slides and dots
        heroSliderContainer.innerHTML = heroSlidesData.map((slideData, index) => `
            <div class="slide ${index === 0 ? 'active' : ''}" style="background-image: url('${slideData.bgImage}');">
                <div class="container mx-auto px-4 h-full">
                    <div class="flex flex-col md:flex-row items-center h-full">
                        <div class="md:w-1/2 text-center md:text-left">
                            <p class="text-xl md:text-2xl mb-4">${slideData.subtitle}</p>
                            <h1 class="text-4xl md:text-5xl font-bold mb-8">${slideData.title}</h1>
                            <a href="#" class="btn-primary px-8 py-3 rounded-lg text-white font-medium inline-block">${slideData.buttonText}</a>
                        </div>
                        ${slideData.foregroundImage ? `
                        <div class="w-full md:w-1/2 h-1/2 md:h-full flex justify-center items-center mt-4 md:mt-0">
                            <img src="${slideData.foregroundImage}" alt="${slideData.altText}" class="max-h-full max-w-full object-contain">
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

        // Get references to newly created elements
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

        // Initialize Hero Slider
        showSlide(0);
        startSlideShow();
        
        nextBtn.addEventListener('click', () => { nextSlide(); stopSlideShow(); startSlideShow(); });
        prevBtn.addEventListener('click', () => { prevSlide(); stopSlideShow(); startSlideShow(); });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => { showSlide(index); stopSlideShow(); startSlideShow(); });
        });
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
});
