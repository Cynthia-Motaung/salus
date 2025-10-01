const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const navOverlay = document.querySelector('.nav-overlay');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
const openContactModalButtons = document.querySelectorAll('.open-contact-modal');

const contactModal = document.getElementById('contact-modal');
const closeModalButton = document.querySelector('.modal-close-button');
const contactForm = document.querySelector('.contact-form');
const formMessage = document.getElementById('form-message');

mobileNavToggle.addEventListener('click', () => {
  const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
  mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
  mobileNav.classList.toggle('active');
  navOverlay.classList.toggle('active');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

navOverlay.addEventListener('click', () => {
  mobileNavToggle.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('active');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
});

mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
});

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

window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dots .dot');

let scene, camera, renderer, particles, particlesMaterial;
const particleColors = [0x667eea, 0xf093fb, 0x4facfe];

function initHero3D() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const particlesCount = 10000;
  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  particlesMaterial = new THREE.PointsMaterial({ 
    color: particleColors[0], 
    size: 0.005,
    transparent: true,
    opacity: 0.8
  });

  particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  let mouse = new THREE.Vector2();
  document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  function animate() {
    requestAnimationFrame(animate);

    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
      const index = i * 3;
      let px = positions[index];
      let py = positions[index + 1];
      let pz = positions[index + 2];

      const dx = mouse.x * 10 - px;
      const dy = mouse.y * 10 - py;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 2) {
        px += dx * 0.01;
        py += dy * 0.01;
      }

      px += (Math.random() - 0.5) * 0.002;
      py += (Math.random() - 0.5) * 0.002;
      pz += (Math.random() - 0.5) * 0.005;

      positions[index] = px;
      positions[index + 1] = py;
      positions[index + 2] = pz;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  if (particlesMaterial) {
    particlesMaterial.color.setHex(particleColors[index]);
  }
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

window.addEventListener('load', () => {
  initHero3D();
  showGreeting();
});

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

document.getElementById('current-year').textContent = new Date().getFullYear();

const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

function initDarkMode() {
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  body.setAttribute('data-theme', savedTheme);
  darkModeToggle.querySelector('i').className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function toggleDarkMode() {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  darkModeToggle.querySelector('i').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

darkModeToggle.addEventListener('click', toggleDarkMode);
initDarkMode();

function showGreeting() {
  const visits = parseInt(getCookie('visits') || '0') + 1;
  setCookie('visits', visits, 30);
  const greetingEl = document.getElementById('personalized-greeting');
  const message = visits > 1 ? 'Welcome back—ready to build?' : 'Welcome to SALUS!';
  greetingEl.textContent = message;
  greetingEl.classList.add('show');
  setTimeout(() => greetingEl.classList.remove('show'), 5000);
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('ripple-btn')) {
    const btn = e.target;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
});

function openModal() {
  contactModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const nameInput = document.getElementById('name');
    if (nameInput) {
      nameInput.focus();
    }
  }, 300);
}

function closeModal() {
  contactModal.classList.remove('active');
  document.body.style.overflow = '';
  if (formMessage) {
    formMessage.textContent = '';
    formMessage.className = 'form-message';
  }
  const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
  formInputs.forEach(input => {
    input.classList.remove('error', 'success', 'focused');
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
  const steps = document.querySelectorAll('.multi-step-form .step');
  steps.forEach(step => step.classList.remove('active'));
  steps[0].classList.add('active');
  document.querySelector('.review-summary').innerHTML = '';
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

const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
formInputs.forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.classList.add('focused');
  });
  
  input.addEventListener('blur', () => {
    if (!input.value.trim()) {
      input.parentElement.classList.remove('focused');
    }
    validateField(input);
  });
});

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
  } else if (field.id === 'phone' && value && !/^\+?[\d\s-()]{10,}$/.test(value)) {
    isValid = false;
    errorMsg = 'Please enter a valid phone number.';
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

const steps = document.querySelectorAll('.multi-step-form .step');
const nextBtns = document.querySelectorAll('.next-step');
const prevBtns = document.querySelectorAll('.prev-step');
const submitBtn = document.querySelector('.submit-step');

nextBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentStep = document.querySelector('.step.active');
    const currentStepNum = parseInt(currentStep.dataset.step);
    if (validateStep(currentStep)) {
      currentStep.classList.remove('active');
      const nextStepNum = currentStepNum + 1;
      if (nextStepNum < steps.length) {
        steps[nextStepNum].classList.add('active');
        updateReviewSummary();
      }
    }
  });
});

prevBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentStep = document.querySelector('.step.active');
    const currentStepNum = parseInt(currentStep.dataset.step);
    if (currentStepNum > 0) {
      currentStep.classList.remove('active');
      steps[currentStepNum - 1].classList.add('active');
    }
  });
});

function updateReviewSummary() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const summary = document.querySelector('.review-summary');
  summary.innerHTML = `
    <p><strong>Review:</strong></p>
    <p>Name: ${name || 'Not provided'}</p>
    <p>Email: ${email || 'Not provided'}</p>
    ${phone ? `<p>Phone: ${phone}</p>` : ''}
  `;
}

function validateStep(step) {
  let valid = true;
  step.querySelectorAll('input[required], textarea[required]').forEach(field => {
    if (!validateField(field)) valid = false;
  });
  return valid;
}

function encode(data) {
  return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
}

async function handleNetlifySubmit(event) {
  event.preventDefault();

  const submitButton = event.target.querySelector('.submit-step');
  const originalText = submitButton.innerHTML;
  
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

  try {
    // Replace 'YOUR_SITE_KEY' with actual reCAPTCHA site key
    const recaptchaToken = await grecaptcha.execute('YOUR_SITE_KEY', {action: 'contact_submit'});
    const formData = new FormData(contactForm);
    formData.append('g-recaptcha-response', recaptchaToken);

    submitButton.innerHTML = '<div class="loading-spinner"></div>Sending...';
    submitButton.disabled = true;

    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode(Object.fromEntries(formData)),
    });
    formMessage.textContent = 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.';
    formMessage.classList.add('success');
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

if (contactForm) {
  contactForm.addEventListener('submit', handleNetlifySubmit);
}

updateActiveNavLink();