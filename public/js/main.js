document.addEventListener('DOMContentLoaded', () => {
  // --- AOS Initialization ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800, // values from 0 to 3000, with step 50ms
      easing: 'ease-in-out', // default easing for AOS animations
      once: true, // whether animation should happen only once - while scrolling down
      mirror: false, // whether elements should animate out while scrolling past them
    });
  }

  // --- Header Scroll Effect ---
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNavigation = document.getElementById('main-navigation');
  const navLinks = document.querySelectorAll('#main-navigation .nav-link');

  if (menuToggle && mainNavigation) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainNavigation.classList.toggle('nav-active');
      menuToggle.classList.toggle('active'); // CSS handles the icon switch

      // Prevent body scroll when menu is open
      document.body.classList.toggle('no-scroll', mainNavigation.classList.contains('nav-active'));
    });

    // Close menu when a nav link is clicked (for single-page navigation)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mainNavigation.classList.contains('nav-active')) {
          menuToggle.click(); // Simulate a click on the toggle to close
        }
      });
    });
  }

  // --- Back to Top Button ---
  const backToTopButton = document.getElementById('back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Current Year in Footer ---
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- Livestream Status & Countdown ---
  const livestreamStatusEl = document.getElementById('livestream-status');
  const countdownContainer = document.getElementById('countdown-container');

  // Sunday is 0, ..., Saturday is 6
  const SUNDAY_SERVICE_DAY = 0;
  const SERVICE_START_HOUR_CAT = 9; // 9:00 AM CAT
  const SERVICE_END_HOUR_CAT = 13;   // 1:00 PM CAT

  function updateLivestreamStatus() {
    if (!livestreamStatusEl) return;
    const statusTextEl = document.getElementById('status-text');
    const liveIndicatorEl = livestreamStatusEl.querySelector('.live-indicator');
    if (!statusTextEl || !liveIndicatorEl) return;

    const now = new Date();
    // Convert CAT to UTC for reliable comparison (CAT is UTC+2)
    const serviceStartUTCHour = SERVICE_START_HOUR_CAT - 2; // 7 AM UTC
    const serviceEndUTCHour = SERVICE_END_HOUR_CAT - 2;     // 11 AM UTC

    const isServiceDay = now.getUTCDay() === SUNDAY_SERVICE_DAY;
    const isServiceTime = now.getUTCHours() >= serviceStartUTCHour && now.getUTCHours() < serviceEndUTCHour;

    if (isServiceDay && isServiceTime) {
      statusTextEl.textContent = 'Currently LIVE';
      liveIndicatorEl.classList.add('live');
      if (countdownContainer) countdownContainer.hidden = true;
    } else {
      statusTextEl.textContent = 'Currently Offline';
      liveIndicatorEl.classList.remove('live');
      if (countdownContainer) {
        countdownContainer.hidden = false;
        updateCountdown();
      }
    }
  }

  function updateCountdown() {
    if (!countdownContainer || countdownContainer.hidden) return;
    const daysEl = document.getElementById('days'), hoursEl = document.getElementById('hours'),
          minutesEl = document.getElementById('minutes'), secondsEl = document.getElementById('seconds');
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const now = new Date();
    let nextServiceDate = new Date();
    nextServiceDate.setUTCHours(SERVICE_START_HOUR_CAT - 2, 0, 0, 0); // Target is 7 AM UTC

    let daysUntilSunday = SUNDAY_SERVICE_DAY - now.getUTCDay();
    if (daysUntilSunday < 0 || (daysUntilSunday === 0 && now.getUTCHours() >= (SERVICE_START_HOUR_CAT - 2))) {
      daysUntilSunday += 7;
    }
    nextServiceDate.setUTCDate(now.getUTCDate() + daysUntilSunday);
    
    const timeDifference = nextServiceDate.getTime() - now.getTime();

    if (timeDifference > 0) {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    } else {
      updateLivestreamStatus();
    }
  }

  // Initial checks and intervals
  updateLivestreamStatus();
  setInterval(updateLivestreamStatus, 60000); // Check status every minute
  setInterval(() => {
    if (countdownContainer && !countdownContainer.hidden) {
      updateCountdown();
    }
  }, 1000); // Update countdown every second


  // --- YouTube Iframe Unmute Button (UI Only) ---
  const unmuteBtn = document.getElementById('unmute-btn');
  const youtubeEmbed = document.getElementById('youtube-embed');
  if (unmuteBtn && youtubeEmbed) {
    unmuteBtn.addEventListener('click', () => {
      // NOTE: This will not actually unmute the video due to browser security restrictions.
      // It serves as a UI example. Full control requires the YouTube Player API.
      console.log("Attempting to toggle mute state (UI only). Full functionality requires the YouTube Player API.");
      
      const isPressed = unmuteBtn.getAttribute('aria-pressed') === 'true';
      unmuteBtn.setAttribute('aria-pressed', String(!isPressed));
      const icon = unmuteBtn.querySelector('i');
      const btnText = unmuteBtn.querySelector('.btn-text');

      if (!isPressed) { // If it was muted, show unmute state
        if (icon) icon.classList.replace('fa-volume-mute', 'fa-volume-up');
        if (btnText) btnText.textContent = 'Mute';
      } else { // If it was unmuted, show mute state
        if (icon) icon.classList.replace('fa-volume-up', 'fa-volume-mute');
        if (btnText) btnText.textContent = 'Unmute';
      }
    });
  }

function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      const imgSrc = this.querySelector('img').src;
      const caption = this.querySelector('.gallery-caption').textContent;
      
      // Create lightbox
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <img src="${imgSrc}" alt="${caption}">
          <div class="lightbox-caption">${caption}</div>
          <button class="close-lightbox" aria-label="Close lightbox">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
      
      document.body.appendChild(lightbox);
      
      // Close lightbox
      const closeBtn = lightbox.querySelector('.close-lightbox');
      closeBtn.addEventListener('click', () => {
        lightbox.remove();
      });
      
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          lightbox.remove();
        }
      });
    });
  });
}

// Add this to your DOMContentLoaded event listener
initGallery();


  // --- Skip Link Focus Fix (Accessibility) ---
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true }); // preventScroll can avoid conflicts
          targetElement.addEventListener('blur', () => targetElement.removeAttribute('tabindex'), { once: true });
        }
      }
    });
  }
});
