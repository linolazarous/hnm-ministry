/**
 * Heavenly Nature Ministry - Main JavaScript
 * Production-ready with all fixes and optimizations
 */

document.addEventListener('DOMContentLoaded', function() {
  // ======================
  // Mobile Menu Functionality
  // ======================
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  /**
   * Toggles the mobile menu state
   */
  function toggleMobileMenu() {
    const isExpanded = menuToggle.classList.toggle('is-active');
    mobileMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll', isExpanded);
    menuToggle.setAttribute('aria-expanded', isExpanded);
  }

  /**
   * Closes the mobile menu
   */
  function closeMobileMenu() {
    menuToggle.classList.remove('is-active');
    mobileMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && mobileMenu) {
    // Initialize menu toggle button
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', 'mobile-menu');
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleMobileMenu();
    });
    
    // Close menu when clicking on links
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (mobileMenu.classList.contains('active') && 
          !menuToggle.contains(e.target) && 
          !mobileMenu.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close menu on Escape key press
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // ======================
  // Animation on Scroll (AOS)
  // ======================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 50,
      disable: function() {
        return window.innerWidth < 768;
      }
    });
  }

  // ======================
  // Back to Top Button
  // ======================
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    /**
     * Toggles back-to-top button visibility
     */
    function toggleBackToTop() {
      const isVisible = window.scrollY > 300;
      backToTopButton.classList.toggle('show', isVisible);
      backToTopButton.setAttribute('aria-hidden', !isVisible);
    }

    // Initialize button
    backToTopButton.setAttribute('aria-label', 'Back to top');
    backToTopButton.setAttribute('aria-hidden', 'true');

    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop(); // Check on initial load

    backToTopButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      // Move focus to the top of the page for accessibility
      document.querySelector('header').setAttribute('tabindex', '-1');
      document.querySelector('header').focus();
    });
  }

  // ======================
  // Smooth Scrolling
  // ======================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Skip empty anchors or javascript links
      if (targetId === '#' || targetId === '#!' || targetId.startsWith('javascript:')) {
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate scroll position accounting for header height
        const headerHeight = document.querySelector('.site-header').offsetHeight || 85;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }

        // Move focus to the target element for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
      }
    });
  });

  // ======================
  // Current Year in Footer
  // ======================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ======================
  // Donation Button Placeholder
  // ======================
  const donationButtons = document.querySelectorAll('#donate .cta-button');
  donationButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      // Replace with actual donation modal/flow when ready
      alert('Thank you for your interest in supporting our ministry! Our online donation system is currently being set up. Please check back soon or contact us directly for donation options.');
    });
  });

  // ======================
  // Performance Optimization
  // ======================
  // Debounce scroll events
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      // Handle scroll-end events here if needed
    }, 100);
  });

  // ======================
  // Lazy Loading for Images
  // ======================
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    // Fallback for browsers without native lazy loading
    const lazyLoadInstance = new LazyLoad({
      elements_selector: '[loading="lazy"]',
      threshold: 100
    });
  }
});
