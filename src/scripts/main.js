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
        let isMouseOverCarousel = false;

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
            clearInterval(slideInterval); // Clear any existing interval
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        function resetTimer() {
            stopSlideShow();
            if (!isMouseOverCarousel) {
                startSlideShow();
            }
        }

        showSlide(0);
        startSlideShow();

        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => {
                isMouseOverCarousel = true;
                stopSlideShow();
            });
            heroSection.addEventListener('mouseleave', () => {
                isMouseOverCarousel = false;
                startSlideShow();
            });
        }
        
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetTimer();
            });
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
                    </div>
                    <div class="p-4 flex flex-col flex-grow">
                        <p class="font-semibold text-blue-800">${pkg.title}</p>
                        ${pkg.oldPrice ? `<p class="text-sm text-gray-500 line-through">Antes: $${pkg.oldPrice}</p>` : ''}
                        
                        <div class="mt-4 flex-grow space-y-2">
                            <div>
                                <p class="text-sm text-gray-600">Paciente Regular</p>
                                <div class="flex items-center justify-between">
                                    <p class="text-xl font-bold text-blue-800">$${pkg.prices.regular.value}</p>
                                    ${pkg.prices.regular.discount ? `<span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">${pkg.prices.regular.discount}</span>` : ''}
                                </div>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Club Medical</p>
                                <div class="flex items-center justify-between">
                                    <p class="text-xl font-bold text-blue-800">$${pkg.prices.club.value}</p>
                                    ${pkg.prices.club.discount ? `<span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">${pkg.prices.club.discount}</span>` : ''}
                                </div>
                            </div>
                        </div>

                        <a href="paquetes-preventivos.html#${pkg.id}" class="mt-4 inline-block text-blue-800 font-bold hover:underline">Ver más</a>
                    </div>
                </div>
            </div>
        `).join('');

        let packageSlides = Array.from(packagesTrack.children);
        let isTransitioning = false;
        let packagesCurrentIndex = 1; // Start at the first real slide
        let slideInterval;
        let isMouseOverCarousel = false;

        const cloneCount = 4; // Number of slides to clone on each side

        // Clone slides for infinite loop
        const slidesToPrepend = packageSlides.slice(-cloneCount).map(slide => slide.cloneNode(true));
        const slidesToAppend = packageSlides.slice(0, cloneCount).map(slide => slide.cloneNode(true));
        
        packagesTrack.append(...slidesToAppend);
        packagesTrack.prepend(...slidesToPrepend);

        // Recalculate slides after cloning
        packageSlides = Array.from(packagesTrack.children);

        function getSlideWidth() {
            return packageSlides.length > 0 ? packageSlides[0].offsetWidth : 0;
        }

        function updatePackagesSlider(transition = true) {
            if (packageSlides.length === 0) return;
            const slideWidth = getSlideWidth();
            
            packagesTrack.style.transition = transition ? 'transform 0.5s ease-in-out' : 'none';
            packagesTrack.style.transform = `translateX(-${packagesCurrentIndex * slideWidth}px)`;
        }

        function shiftSlides() {
            isTransitioning = false;
            const originalSlidesCount = packagesData.length;
            
            if (packagesCurrentIndex <= cloneCount -1) {
                packagesCurrentIndex = originalSlidesCount + cloneCount - 1;
                updatePackagesSlider(false);
            } else if (packagesCurrentIndex >= originalSlidesCount + cloneCount) {
                packagesCurrentIndex = cloneCount;
                updatePackagesSlider(false);
            }
        }

        function nextPackage() {
            if (isTransitioning) return;
            isTransitioning = true;
            packagesCurrentIndex++;
            updatePackagesSlider();
        }

        function prevPackage() {
            if (isTransitioning) return;
            isTransitioning = true;
            packagesCurrentIndex--;
            updatePackagesSlider();
        }

        function startSlideShow() {
            stopSlideShow();
            slideInterval = setInterval(nextPackage, 3500);
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        function resetTimer() {
            stopSlideShow();
            if (!isMouseOverCarousel) {
                startSlideShow();
            }
        }

        packagesNextBtn.addEventListener('click', () => {
            nextPackage();
            resetTimer();
        });

        packagesPrevBtn.addEventListener('click', () => {
            prevPackage();
            resetTimer();
        });

        packagesTrack.addEventListener('transitionend', shiftSlides);

        const packagesSliderContainer = packagesTrack.parentElement.parentElement;
        packagesSliderContainer.addEventListener('mouseenter', () => {
            isMouseOverCarousel = true;
            stopSlideShow();
        });
        packagesSliderContainer.addEventListener('mouseleave', () => {
            isMouseOverCarousel = false;
            startSlideShow();
        });

        // Initial position
        packagesCurrentIndex = cloneCount;
        updatePackagesSlider(false);
        startSlideShow();

        window.addEventListener('resize', () => updatePackagesSlider(false));
    }

    // --- Header Logic ---
    function initHeader() {
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenuPanel = document.getElementById('mobile-menu');
        const desktopNav = document.getElementById('desktop-nav');
        const mainLogoLink = document.querySelector('header a');
        const loginButtonDesktop = document.getElementById('desktop-login-btn');

        if (!menuBtn || !mobileMenuPanel || !desktopNav || !mainLogoLink || !loginButtonDesktop) {
            console.error('Header elements not found. Mobile menu cannot be built.');
            return;
        }

        // --- Panel Open/Close Logic ---
        const openMenu = () => mobileMenuPanel.classList.add('open');
        const closeMenu = () => mobileMenuPanel.classList.remove('open');

        menuBtn.addEventListener('click', openMenu);

        // --- Dynamic Menu Building ---
        mobileMenuPanel.innerHTML = ''; // Clear previous content

        // 1. Create Header
        const menuHeader = document.createElement('div');
        menuHeader.className = 'mobile-menu-header';
        const logoClone = mainLogoLink.cloneNode(true);
        logoClone.querySelector('img').className = 'h-10';
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times text-2xl text-gray-600"></i>';
        closeBtn.onclick = closeMenu;
        menuHeader.append(logoClone, closeBtn);

        // 2. Create Body
        const menuBody = document.createElement('div');
        menuBody.className = 'mobile-menu-body';
        
        // Process desktop nav links
        Array.from(desktopNav.children).forEach(navElement => {
            // Handle dropdowns (which are DIVs)
            if (navElement.classList.contains('dropdown')) {
                const link = navElement.querySelector('a');
                const subMenu = navElement.querySelector('.dropdown-menu');
                if (!link || !subMenu) return;

                const newLink = link.cloneNode(true);
                newLink.className = 'mobile-menu-link';
                
                const newSubMenu = subMenu.cloneNode(true);
                newSubMenu.className = 'mobile-submenu';
                
                newLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    newLink.classList.toggle('open');
                    newSubMenu.classList.toggle('open');
                });
                menuBody.append(newLink, newSubMenu);
            } 
            // Handle direct links (which are A tags)
            else if (navElement.tagName === 'A') {
                const newLink = navElement.cloneNode(true);
                newLink.className = 'mobile-menu-link';
                menuBody.appendChild(newLink);
            }
        });

        // 3. Add Login Button
        const loginButton = loginButtonDesktop.cloneNode(true);
        loginButton.className = 'w-full text-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center mt-6';
        menuBody.appendChild(loginButton);

        // 4. Assemble Menu
        mobileMenuPanel.append(menuHeader, menuBody);
    }

    // --- Especialidades Page Logic ---
    function initEspecialidadesPage() {
        // FAQ accordion
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('i');
                
                answer.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            });
        });

        // Animation on scroll
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.animate-fade-in');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        window.addEventListener('load', animateOnScroll);
        window.addEventListener('scroll', animateOnScroll);
    }

    // --- Locations Section Logic ---
    function initLocationsSection() {
        const btnQuito = document.getElementById('btn-quito');
        const btnSantoDomingo = document.getElementById('btn-santo-domingo');
        const contentQuito = document.getElementById('content-quito');
        const contentSantoDomingo = document.getElementById('content-santo-domingo');

        if (!btnQuito || !btnSantoDomingo || !contentQuito || !contentSantoDomingo) {
            return;
        }

        // Función para cambiar de pestaña
        function switchTab(activeBtn, inactiveBtn, activeContent, inactiveContent) {
            activeBtn.classList.add('active-tab', 'text-blue-800', 'border-blue-800');
            activeBtn.classList.remove('text-gray-500');
            inactiveBtn.classList.remove('active-tab', 'text-blue-800', 'border-blue-800');
            inactiveBtn.classList.add('text-gray-500');
            
            activeContent.classList.remove('hidden');
            inactiveContent.classList.add('hidden');
        }

        btnQuito.addEventListener('click', () => {
            switchTab(btnQuito, btnSantoDomingo, contentQuito, contentSantoDomingo);
        });

        btnSantoDomingo.addEventListener('click', () => {
            switchTab(btnSantoDomingo, btnQuito, contentSantoDomingo, contentQuito);
        });
    }

    // --- Locations Section Logic ---
    function initLocationsSection() {
        const btnQuito = document.getElementById('btn-quito');
        const btnSantoDomingo = document.getElementById('btn-santo-domingo');
        const contentQuito = document.getElementById('content-quito');
        const contentSantoDomingo = document.getElementById('content-santo-domingo');

        if (!btnQuito || !btnSantoDomingo || !contentQuito || !contentSantoDomingo) {
            return;
        }

        // Función para cambiar de pestaña
        function switchTab(activeBtn, inactiveBtn, activeContent, inactiveContent) {
            activeBtn.classList.add('active-tab', 'text-blue-800', 'border-blue-800');
            activeBtn.classList.remove('text-gray-500');
            inactiveBtn.classList.remove('active-tab', 'text-blue-800', 'border-blue-800');
            inactiveBtn.classList.add('text-gray-500');
            
            activeContent.classList.remove('hidden');
            inactiveContent.classList.add('hidden');
        }

        btnQuito.addEventListener('click', () => {
            switchTab(btnQuito, btnSantoDomingo, contentQuito, contentSantoDomingo);
        });

        btnSantoDomingo.addEventListener('click', () => {
            switchTab(btnSantoDomingo, btnQuito, contentSantoDomingo, contentQuito);
        });
    }

    // --- Locations Section Logic ---
    function initLocationsSection() {
        const btnQuito = document.getElementById('btn-quito');
        const btnSantoDomingo = document.getElementById('btn-santo-domingo');
        const contentQuito = document.getElementById('content-quito');
        const contentSantoDomingo = document.getElementById('content-santo-domingo');

        if (!btnQuito || !btnSantoDomingo || !contentQuito || !contentSantoDomingo) {
            return;
        }

        // Función para cambiar de pestaña
        function switchTab(activeBtn, inactiveBtn, activeContent, inactiveContent) {
            activeBtn.classList.add('active-tab', 'text-blue-800', 'border-blue-800');
            activeBtn.classList.remove('text-gray-500');
            inactiveBtn.classList.remove('active-tab', 'text-blue-800', 'border-blue-800');
            inactiveBtn.classList.add('text-gray-500');
            
            activeContent.classList.remove('hidden');
            inactiveContent.classList.add('hidden');
        }

        btnQuito.addEventListener('click', () => {
            switchTab(btnQuito, btnSantoDomingo, contentQuito, contentSantoDomingo);
        });

        btnSantoDomingo.addEventListener('click', () => {
            switchTab(btnSantoDomingo, btnQuito, contentSantoDomingo, contentQuito);
        });
    }

    // --- Main Initialization ---
    async function main() {
        const content = await fetchContent();
        if (content) {
            if (content.heroSlides && document.getElementById('hero-slider-container')) {
                initHeroSlider(content.heroSlides);
            }
            if (content.packages && document.getElementById('packages-track')) {
                initPackagesSlider(content.packages);
            }
        }
        
        // Initialize header logic on all pages
        initHeader();

        // Run page-specific logic
        if (document.getElementById('especialidades')) {
            initEspecialidadesPage();
        }
        if (document.getElementById('ubicaciones')) {
            initLocationsSection();
        }
    }

    main();
});
