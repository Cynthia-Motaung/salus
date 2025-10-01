// JavaScript Document
// Enhanced Navigation Functionality
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const navOverlay = document.querySelector('.nav-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
const openContactModalButtons = document.querySelectorAll('.open-contact-modal');

const contactModal = document.getElementById('contact-modal');
const closeModalButton = document.querySelector('.modal-close-button');
const contactForm = document.querySelector('.contact-form');
const formMessage = document.getElementById('form-message');

// Toggle mobile navigation
mobileNavToggle.addEventListener('click', () => {
  const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
  mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
  mobileNav.classList.toggle('active');
  navOverlay.classList.toggle('active');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

// Close mobile nav when clicking overlay
navOverlay.addEventListener('click', () => {
  mobileNavToggle.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('active');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
});

// Close mobile nav when clicking links
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Active navigation link based on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

function updateActiveNavLink() {
  let current = '';
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dots .dot');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    currentSlide = i;
    showSlide(currentSlide);
  });
});

setInterval(nextSlide, 7000);

// Enhanced intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Back to top button
const backToTopButton = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopButton.classList.add('show');
  } else {
    backToTopButton.classList.remove('show');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Dynamic Year for Footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Fixed Modal Functionality
function openModal() {
  contactModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const nameInput = document.getElementById('name');
    if (nameInput) {
      nameInput.focus();
    }
  }, 300); // Slight delay for modal animation
}

function closeModal() {
  contactModal.classList.remove('active');
  document.body.style.overflow = '';
  if (formMessage) {
    formMessage.textContent = '';
    formMessage.className = 'form-message';
  }
  // Reset all fields and errors
  const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
  formInputs.forEach(input => {
    input.classList.remove('error', 'success', 'focused');
    input.value = '';
    const errorSpan = document.getElementById(input.id + '-error');
    if (errorSpan) {
      errorSpan.classList.remove('show');
      errorSpan.textContent = '';
    }
  });
  const charCountSpan = document.getElementById('message-char-count');
  if (charCountSpan) {
    charCountSpan.textContent = '0/1000';
    charCountSpan.className = 'char-count';
  }
  contactForm.reset();
}

openContactModalButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
    if (mobileNav.classList.contains('active')) {
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('active');
      navOverlay.classList.remove('active');
    }
  });
});

if (closeModalButton) {
  closeModalButton.addEventListener('click', closeModal);
}

contactModal.addEventListener('click', (e) => {
  if (e.target === contactModal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && contactModal.classList.contains('active')) {
    closeModal();
  }
});

// Enhanced form interactions
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
formInputs.forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.classList.add('focused');
  });
  
  input.addEventListener('blur', () => {
    if (!input.value.trim()) {
      input.parentElement.classList.remove('focused');
    }
    validateField(input); // Validate on blur
  });
});

// Character count for message
const messageTextarea = document.getElementById('message');
const charCountSpan = document.getElementById('message-char-count');
if (messageTextarea && charCountSpan) {
  messageTextarea.addEventListener('input', (e) => {
    const length = e.target.value.length;
    charCountSpan.textContent = `${length}/1000`;
    charCountSpan.className = 'char-count';
    if (length > 800) {
      charCountSpan.classList.add('warning');
    }
    if (length > 950) {
      charCountSpan.classList.add('danger');
    }
  });
}

// Real-time validation function
function validateField(field) {
  const value = field.value.trim();
  const errorSpan = document.getElementById(field.id + '-error');
  field.classList.remove('error', 'success');
  if (errorSpan) {
    errorSpan.classList.remove('show');
    errorSpan.textContent = '';
  }

  let isValid = true;
  let errorMsg = '';

  if (field.id === 'name' && (!value || value.length < 2)) {
    isValid = false;
    errorMsg = 'Name must be at least 2 characters long.';
  } else if (field.id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    isValid = false;
    errorMsg = 'Please enter a valid email address.';
  } else if (field.id === 'message' && (!value || value.length < 10)) {
    isValid = false;
    errorMsg = 'Message must be at least 10 characters long.';
  }

  if (!isValid) {
    field.classList.add('error');
    if (errorSpan) {
      errorSpan.textContent = errorMsg;
      errorSpan.classList.add('show');
    }
  } else if (value) {
    field.classList.add('success');
  }

  return isValid;
}

// Netlify Form Submission
function encode(data) {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");
}

async function handleNetlifySubmit(event) {
  event.preventDefault();

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  
  // Validate all fields first
  let isFormValid = true;
  formInputs.forEach(input => {
    if (!validateField(input)) {
      isFormValid = false;
    }
  });

  if (!isFormValid) {
    formMessage.textContent = 'Please fix the errors above and try again.';
    formMessage.classList.add('error');
    return false;
  }

  // Show loading state
  submitButton.innerHTML = '<div class="loading-spinner"></div>Sending...';
  submitButton.disabled = true;

  const formData = new FormData(contactForm);
  try {
      await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode(Object.fromEntries(formData)),
      });
      formMessage.textContent = 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.';
      formMessage.classList.add('success');
      // Mark fields as success
      formInputs.forEach(input => input.classList.add('success'));
      setTimeout(() => {
          closeModal();
      }, 3000);
  } catch (error) {
      formMessage.textContent = 'Sorry, there was an error sending your message. Please try again or email us at hello@salus.com.';
      formMessage.classList.add('error');
  } finally {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
  }
  return false;
}

// Add form submission handler
if (contactForm) {
  contactForm.addEventListener('submit', handleNetlifySubmit);
}

// Initialize
updateActiveNavLink();