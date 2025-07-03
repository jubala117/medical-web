<script>
        document.addEventListener('DOMContentLoaded', function() {
            const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.slider-dot');
            const prev = document.querySelector('.slider-prev');
            const next = document.querySelector('.slider-next');
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

            // Initialize
            showSlide(0);
            startSlideShow();
            
            // Event listeners
            next.addEventListener('click', () => {
                nextSlide();
                stopSlideShow();
                startSlideShow();
            });
            prev.addEventListener('click', () => {
                prevSlide();
                stopSlideShow();
                startSlideShow();
            });
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    showSlide(index);
                    stopSlideShow();
                    startSlideShow();
                });
            });
        });
    </script>