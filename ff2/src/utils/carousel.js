// Carousel utility functions for React components

export const initializeOwlCarousel = (selector, options = {}) => {
  // Check if jQuery and Owl Carousel are available
  if (typeof window !== 'undefined' && window.$ && window.$.fn.owlCarousel) {
    const defaultOptions = {
      loop: true,
      margin: 10,
      nav: true,
      navText: [
        '<i class="fas fa-chevron-left"></i>',
        '<i class="fas fa-chevron-right"></i>'
      ],
      dots: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 2
        },
        1000: {
          items: 3
          
        }
      }
    };

    const finalOptions = { ...defaultOptions, ...options };
    
    try {
      window.$(selector).owlCarousel(finalOptions);
    } catch (error) {
      console.error('Error initializing Owl Carousel:', error);
    }
  } else {
    console.warn('jQuery or Owl Carousel not available');
  }
};

export const destroyOwlCarousel = (selector) => {
  if (typeof window !== 'undefined' && window.$ && window.$.fn.owlCarousel) {
    try {
      window.$(selector).trigger('destroy.owl.carousel');
    } catch (error) {
      console.error('Error destroying Owl Carousel:', error);
    }
  }
};

// Custom carousel navigation for React
export const initializeCustomCarousel = (containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const slides = container.querySelectorAll('.cardo');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  
  if (slides.length === 0) return;

  let currentSlide = 0;
  const totalSlides = slides.length;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
    });
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
  };

  // Initialize
  showSlide(currentSlide);

  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }

  // Auto-play
  const autoPlay = setInterval(nextSlide, 5000);

  // Return cleanup function
  return () => {
    clearInterval(autoPlay);
    if (nextBtn) nextBtn.removeEventListener('click', nextSlide);
    if (prevBtn) prevBtn.removeEventListener('click', prevSlide);
  };
};
