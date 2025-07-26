document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 50
  });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      const isExpanded = menuToggle.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Back to Top Button ---
  const backToTopButton = document.getElementById('back-to-top');
  
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      
      e.preventDefault();
      const targetElement = document.querySelector(href);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Set current year in footer ---
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Placeholder for Donation Button Clicks ---
  document.querySelectorAll('.donation-card .cta-button').forEach(button => {
    button.addEventListener('click', () => {
      // In a real implementation, this would integrate with a payment gateway like Stripe
      alert('Thank you for your interest! Donation system is being set up.');
    });
  });

});
