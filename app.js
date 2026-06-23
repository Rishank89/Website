/* ==========================================
   Ritik Chauhan Portfolio Application Logic
   Smooth scroll hooks, viewport counters,
   Intersection Observers, and tilt effects.
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Sticky Navigation & Active State Highlighting ---
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Scroll state for header styling
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Highlight active nav link in multi-page environment
  const currentUrl = window.location.href;
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkHref = link.getAttribute('href');
    if (!linkHref) return;
    
    // Resolve absolute href to compare
    const tempAnchor = document.createElement('a');
    tempAnchor.href = linkHref;
    
    // Check if URLs match, ignoring trailing slashes or index.html
    const cleanCurrent = currentUrl.replace(/index\.html$/, '').replace(/\/$/, '');
    const cleanLink = tempAnchor.href.replace(/index\.html$/, '').replace(/\/$/, '');
    
    if (cleanCurrent === cleanLink) {
      link.classList.add('active');
    }
  });

  // --- 2. Mobile Drawer Navigation Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksWrapper = document.querySelector('.nav-links-wrapper');

  if (mobileToggle && navLinksWrapper) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navLinksWrapper.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navLinksWrapper.classList.remove('open');
      });
    });
  }

  // --- 3. Scroll Reveal Animations (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve to trigger transition once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. Dynamic Metric Counters ---
  const metricsSection = document.getElementById('proof');
  const counterNumbers = document.querySelectorAll('.metric-number');
  let countersAnimated = false;

  function startCounters() {
    counterNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      let count = 0;
      const duration = 2000; // Animation length (2s)
      const increment = target / (duration / 16); // ~60fps
      
      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.innerText = Math.floor(count);
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target;
        }
      };
      
      updateCount();
    });
  }

  // Observe the proof section to trigger metric animations
  if (metricsSection) {
    const metricsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          startCounters();
          countersAnimated = true;
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });
    metricsObserver.observe(metricsSection);
  }

  // --- 5. 3D Tilt Hover Effect Initialization ---
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 8,              // Max tilt angle
      speed: 800,          // Transition speed
      glare: true,         // Enable reflection glare
      "max-glare": 0.12,   // Glare opacity
      scale: 1.02,         // Slightly scale card on hover
      gyroscope: true      // support mobile tilt sensors
    });
  } else {
    console.warn("Vanilla-Tilt CDN could not be resolved. Skipping tilt logic.");
  }

  // --- 5b. Scroll Reveal In-and-Out Observer ---
  const revealInOutElements = document.querySelectorAll('.scroll-reveal-in-out');
  
  const inOutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        entry.target.classList.remove('in-view');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "-5% 0px -5% 0px"
  });

  revealInOutElements.forEach(el => inOutObserver.observe(el));
});

// --- 6. Form Submission Simulation & Feedback ---
function handleContactSubmit(event) {
  event.preventDefault();
  
  const form = document.getElementById('portfolio-contact-form');
  const statusMsg = document.getElementById('form-status');
  const submitBtn = document.getElementById('btn-submit');
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  // Clear previous message classes
  statusMsg.className = 'form-status-msg';
  statusMsg.innerText = '';
  
  // Show loading indicator
  statusMsg.classList.add('loading');
  statusMsg.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing your inquiry...';
  submitBtn.disabled = true;

  // Simulate server/network latency
  setTimeout(() => {
    // Show success details
    statusMsg.classList.remove('loading');
    statusMsg.classList.add('success');
    statusMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, ${name}! Your inquiry has been sent. I will get back to you at ${email} within 24 hours.`;
    
    // Reset buttons and input forms
    submitBtn.disabled = false;
    form.reset();
  }, 1800);
}
