document.addEventListener('DOMContentLoaded', function() {
  // --- FIXED: Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      // Toggle 'active' class on both the button and the menu
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      
      // Prevent background scroll when menu is open
      document.body.classList.toggle('no-scroll', mobileMenu.classList.contains('active'));

      // Update ARIA attribute for accessibility
      const isExpanded = menuToggle.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when a link is clicked inside it
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
          menuToggle.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.classList.remove('no-scroll');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // --- AOS Initialization ---
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 50
  });

  // --- Back to Top Button ---
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      backToTopButton.classList.toggle('visible', window.pageYOffset > 300);
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
      // Ensure it's a valid anchor link and not just '#'
      if (href === '#' || href.length < 2) return;
      
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 85; // Fallback height
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({ 
          top: targetPosition, 
          behavior: 'smooth' 
        });
      }
    });
  });

  // --- Current Year in Footer ---
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Donation Button Placeholder Alert ---
  document.querySelectorAll('#donate .cta-button').forEach(button => {
    button.addEventListener('click', () => {
      alert('Thank you for your interest! The online donation system is currently being set up. Please check back soon.');
    });
  });
});
