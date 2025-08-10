class CookieConsent {
  constructor() {
    this.cookieName = 'hnm_cookie_consent';
    this.consentGiven = this.getConsent();
    
    if (!this.consentGiven) {
      this.showBanner();
    }
  }
  
  getConsent() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.cookieName) {
        return value === 'true';
      }
    }
    return false;
  }
  
  showBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.innerHTML = `
      <p>We use essential cookies to ensure our website functions properly. By continuing to browse, you agree to our use of cookies.</p>
      <div class="cookie-consent-buttons">
        <button id="accept-cookies">Accept</button>
        <button class="secondary" id="learn-more">Learn More</button>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    document.getElementById('accept-cookies').addEventListener('click', () => {
      this.setConsent(true);
      banner.remove();
    });
    
    document.getElementById('learn-more').addEventListener('click', () => {
      window.location.href = '/privacy-policy.html#cookies';
    });
  }
  
  setConsent(consent) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = `${this.cookieName}=${consent}; expires=${date.toUTCString()}; path=/; SameSite=Lax; Secure`;
    this.consentGiven = consent;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CookieConsent();
});

// Cookie Consent
class CookieConsent {
  constructor() {
    this.cookieName = 'hnm_cookie_consent';
    this.consentGiven = this.getConsent();
    
    if (!this.consentGiven) {
      this.showBanner();
    }
  }
  
  getConsent() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.cookieName) {
        return value === 'true';
      }
    }
    return false;
  }
  
  showBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-consent';
    banner.innerHTML = `
      <p>We use essential cookies to ensure our website functions properly. By continuing to browse, you agree to our use of cookies.</p>
      <div class="cookie-consent-buttons">
        <button id="accept-cookies">Accept</button>
        <button class="secondary" id="learn-more">Learn More</button>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    document.getElementById('accept-cookies').addEventListener('click', () => {
      this.setConsent(true);
      banner.remove();
    });
    
    document.getElementById('learn-more').addEventListener('click', () => {
      window.location.href = '/privacy-policy.html#cookies';
    });
  }
  
  setConsent(consent) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = `${this.cookieName}=${consent}; expires=${date.toUTCString()}; path=/; SameSite=Lax; Secure`;
    this.consentGiven = consent;
  }
}

// Form Validation
class FormValidator {
  constructor(form) {
    this.form = form;
    this.fields = Array.from(form.querySelectorAll('[required]'));
    this.errors = [];
    
    this.init();
  }
  
  init() {
    this.form.setAttribute('novalidate', true);
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    
    this.fields.forEach(field => {
      field.addEventListener('blur', this.validateField.bind(this));
      field.addEventListener('input', this.clearError.bind(this));
    });
  }
  
  handleSubmit(e) {
    e.preventDefault();
    this.errors = [];
    
    this.fields.forEach(field => this.validateField({ target: field }));
    
    if (this.errors.length === 0) {
      this.form.submit();
    } else {
      this.displayErrors();
    }
  }
  
  validateField(e) {
    const field = e.target;
    const error = this.getError(field);
    
    if (error) {
      this.errors.push({ field, error });
      this.showError(field, error);
    }
  }
  
  getError(field) {
    if (field.validity.valid) return null;
    
    if (field.validity.valueMissing) {
      return 'This field is required';
    }
    
    if (field.validity.typeMismatch) {
      if (field.type === 'email') return 'Please enter a valid email address';
    }
    
    return 'Please check this field';
  }
  
  showError(field, error) {
    this.clearError(field);
    
    const errorElement = document.createElement('p');
    errorElement.className = 'error-message';
    errorElement.textContent = error;
    errorElement.id = `${field.id}-error`;
    errorElement.setAttribute('aria-live', 'polite');
    
    field.classList.add('error');
    field.insertAdjacentElement('afterend', errorElement);
  }
  
  clearError(e) {
    const field = e.target || e;
    field.classList.remove('error');
    
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
      errorElement.remove();
    }
  }
  
  displayErrors() {
    const firstError = this.errors[0].field;
    firstError.focus();
  }
}

// Main Application
class HeavenlyNatureMinistry {
  constructor() {
    this.initMobileMenu();
    this.initBackToTop();
    this.initSmoothScrolling();
    this.initAOS();
    this.initDonationButtons();
    this.initCopyButtons();
    this.initCurrentYear();
    this.initForms();
    new CookieConsent();
  }
  
  initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuToggle || !mobileMenu) return;
    
    const toggleMenu = () => {
      const isExpanded = menuToggle.classList.toggle('is-active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll', isExpanded);
      menuToggle.setAttribute('aria-expanded', isExpanded);
    };
    
    const closeMenu = () => {
      menuToggle.classList.remove('is-active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
      menuToggle.setAttribute('aria-expanded', 'false');
    };
    
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
    
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('active') {
        if (!menuToggle.contains(e.target) {
          closeMenu();
        }
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }
  
  initBackToTop() {
    const button = document.getElementById('back-to-top');
    if (!button) return;
    
    const toggleVisibility = () => {
      const isVisible = window.scrollY > 300;
      button.classList.toggle('show', isVisible);
      button.setAttribute('aria-hidden', !isVisible);
    };
    
    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility();
    
    button.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.querySelector('header')?.focus();
    });
  }
  
  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId.startsWith('javascript:')) return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 85;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }
          
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    });
  }
  
  initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 50,
        disable: () => window.innerWidth < 768
      });
    }
  }
  
  initDonationButtons() {
    document.querySelectorAll('#donate .cta-button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Thank you for your interest in supporting our ministry! Our online donation system is currently being set up. Please check back soon or contact us directly for donation options.');
      });
    });
  }
  
  initCopyButtons() {
    document.querySelectorAll('.copy-button').forEach(button => {
      button.addEventListener('click', function() {
        const text = this.getAttribute('data-clipboard-text');
        if (!text) return;
        
        navigator.clipboard.writeText(text).then(() => {
          const original = this.innerHTML;
          this.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => { this.innerHTML = original; }, 2000);
        }).catch(err => {
          console.error('Copy failed:', err);
          alert('Failed to copy. Please try again or copy manually.');
        });
      });
    });
  }
  
  initCurrentYear() {
    document.getElementById('current-year')?.textContent = new Date().getFullYear();
  }
  
  initForms() {
    document.querySelectorAll('form').forEach(form => {
      new FormValidator(form);
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HeavenlyNatureMinistry();
});
