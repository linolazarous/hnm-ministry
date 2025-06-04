  // YouTube API would be needed for actual live status detection
  // This is a simplified version for demonstration
  
  document.addEventListener('DOMContentLoaded', function() {
    const livestreamStatus = document.getElementById('livestream-status');
    const statusText = document.getElementById('status-text');
    const countdownContainer = document.getElementById('countdown-container');
    const unmuteBtn = document.getElementById('unmute-btn');
    const youtubeEmbed = document.getElementById('youtube-embed');
    
    // For demo purposes - in reality you would check YouTube API
    // To actually implement, you need YouTube API key and check liveBroadcast contentDetails
    checkLiveStatus();
    
    // Simulate checking live status
    function checkLiveStatus() {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday
      const hours = now.getHours();
      
      // Simulate live on Sundays between 8am-12pm CAT (UTC+2)
      const isLive = (day === 0 && hours >= 6 && hours < 10); // 6-10 UTC = 8-12 CAT
      
      if(isLive) {
        statusText.textContent = "Live Now - Sunday Service";
        livestreamStatus.style.display = 'flex';
        countdownContainer.style.display = 'none';
      } else {
        statusText.textContent = "Currently Offline";
        livestreamStatus.style.backgroundColor = '#666';
        livestreamStatus.style.display = 'none';
        setupCountdown();
        countdownContainer.style.display = 'block';
      }
    }
    
    // Countdown to next Sunday 9:00 AM CAT
    function setupCountdown() {
      function updateCountdown() {
        const now = new Date();
        const nextSunday = new Date();
        
        // Set to next Sunday
        nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
        nextSunday.setHours(7, 0, 0, 0); // 7 UTC = 9 CAT
        
        // If today is Sunday but before 9am CAT
        if(now.getDay() === 0 && now.getHours() < 7) {
          nextSunday.setDate(now.getDate());
        }
        
        // If we've passed today's service, go to next week
        if(now > nextSunday) {
          nextSunday.setDate(nextSunday.getDate() + 7);
        }
        
        const diff = nextSunday - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
      }
      
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
    
    // Unmute button functionality
    unmuteBtn.addEventListener('click', function() {
      youtubeEmbed.src = youtubeEmbed.src.replace('mute=1', 'mute=0');
      unmuteBtn.style.display = 'none';
    });
    
    // Hide unmute button after 5 seconds
    setTimeout(() => {
      unmuteBtn.style.display = 'none';
    }, 5000);
  });

    // Initialize animations
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
      menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
      });
    }
    
    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Testimonials rotation (if you add testimonials section)
    const testimonials = [
      { text: "Heavenly Nature Ministry changed my life forever.", author: "Mary J." },
      { text: "I found peace, family, and faith here.", author: "Daniel M." },
      { text: "The sermons and prayers revived my spirit.", author: "Grace A." },
      { text: "An incredible place of healing and growth.", author: "Peter O." }
    ];
    
    let currentTestimonial = 0;
    const testimonialText = document.getElementById("testimonial-text");
    const testimonialAuthor = document.getElementById("testimonial-author");
    
    function rotateTestimonial() {
      if (testimonialText && testimonialAuthor) {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonialText.textContent = `"${testimonials[currentTestimonial].text}"`;
        testimonialAuthor.textContent = `– ${testimonials[currentTestimonial].author}`;
      }
    }
    
    if (testimonialText && testimonialAuthor) {
      setInterval(rotateTestimonial, 6000);
    }
 
