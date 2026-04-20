/* ========================================
   ViewEC Marketing Homepage Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  // ========================================
  // Before/After Comparison Slider
  // ========================================
  
  const compareWrapper = document.querySelector('.compare-wrapper');
  
  if (compareWrapper) {
    const slider = compareWrapper.querySelector('.compare-slider');
    const beforeImage = compareWrapper.querySelector('.compare-before');
    const afterImage = compareWrapper.querySelector('.compare-after');
    
    let isDragging = false;
    
    function updateSliderPosition(x) {
      const rect = compareWrapper.getBoundingClientRect();
      let position = ((x - rect.left) / rect.width) * 100;
      position = Math.max(10, Math.min(90, position));
      
      slider.style.left = `${position}%`;
      beforeImage.style.right = `${100 - position}%`;
      afterImage.style.left = `${position}%`;
    }
    
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (isDragging) updateSliderPosition(e.clientX);
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    slider.addEventListener('touchstart', () => {
      isDragging = true;
    });
    
    document.addEventListener('touchmove', (e) => {
      if (isDragging) updateSliderPosition(e.touches[0].clientX);
    });
    
    document.addEventListener('touchend', () => {
      isDragging = false;
    });
    
    compareWrapper.addEventListener('click', (e) => {
      if (e.target === slider || e.target.closest('.compare-handle')) return;
      updateSliderPosition(e.clientX);
    });
  }
  
  // ========================================
  // Marquee Pause on Hover
  // ========================================
  
  const marqueeTrack = document.querySelector('.marquee-track');
  
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }
  
  // ========================================
  // Scroll Animations
  // ========================================

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Unobserve after triggering so it stays visible
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Legacy animate-on-scroll targets
  document.querySelectorAll('.faq-item, .stat-item').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });

  // data-reveal targets (journey cards, service blocks, about sections)
  document.querySelectorAll('[data-reveal]').forEach(el => {
    observer.observe(el);
  });
  
  // ========================================
  // Showcase Carousel
  // ========================================

  const track     = document.querySelector('.showcase-track');
  const trackWrap = document.querySelector('.showcase-track-wrap');
  const prevBtn   = document.querySelector('.sc-prev');
  const nextBtn   = document.querySelector('.sc-next');

  if (track && prevBtn && nextBtn) {
    const slides      = track.querySelectorAll('.sc-slide');
    const totalSlides = slides.length;
    let currentIdx    = 0;

    function getVisible() {
      const w = trackWrap.offsetWidth;
      if (w >= 900) return 3;
      if (w >= 600) return 2;
      return 1;
    }

    function getStep() {
      if (!slides[0]) return 0;
      return slides[0].offsetWidth + 24; // 24 = gap
    }

    function updateCarousel() {
      const visible   = getVisible();
      const maxIdx    = Math.max(0, totalSlides - visible);
      currentIdx      = Math.min(currentIdx, maxIdx);
      track.style.transform = `translateX(-${currentIdx * getStep()}px)`;
      prevBtn.disabled = currentIdx === 0;
      nextBtn.disabled = currentIdx >= maxIdx;
      prevBtn.style.opacity = currentIdx === 0 ? '0.35' : '1';
      nextBtn.style.opacity = currentIdx >= maxIdx ? '0.35' : '1';
    }

    prevBtn.addEventListener('click', () => {
      if (currentIdx > 0) { currentIdx--; updateCarousel(); }
    });
    nextBtn.addEventListener('click', () => {
      const maxIdx = Math.max(0, totalSlides - getVisible());
      if (currentIdx < maxIdx) { currentIdx++; updateCarousel(); }
    });

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
  }

  // ========================================
  // Stats Counter Animation
  // ========================================
  
  function animateCounter(element) {
    const target = element.innerText;
    const hasPlus = target.includes('+');
    const hasM = target.includes('M');
    const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
    
    if (isNaN(numericValue)) return;
    
    let current = 0;
    const duration = 1500;
    const steps = 50;
    const increment = numericValue / steps;
    const stepTime = duration / steps;
    
    element.innerText = '0';
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        current = numericValue;
        clearInterval(timer);
      }
      
      let displayValue = hasM 
        ? Math.floor(current) + 'M' 
        : Math.floor(current);
      
      if (hasPlus) displayValue += '+';
      
      element.innerText = displayValue;
    }, stepTime);
  }
  
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
          if (!stat.dataset.animated) {
            stat.dataset.animated = 'true';
            animateCounter(stat);
          }
        });
      }
    });
  }, { threshold: 0.5 });
  
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) {
    statsObserver.observe(statsGrid);
  }
  
});

// Legacy animate-on-scroll styles (for faq-item, stat-item)
const style = document.createElement('style');
style.textContent = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .animate-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
