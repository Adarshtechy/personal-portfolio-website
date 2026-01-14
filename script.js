// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const currentYear = document.getElementById('current-year');
const sections = document.querySelectorAll('.section');
const header = document.querySelector('.header');

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

// Navigation Management
function toggleMobileMenu() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navList.classList.toggle('active');
}

function closeMobileMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navList.classList.remove('active');
}

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Form Validation
function validateForm() {
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
        error.textContent = '';
    });
    
    // Validate name
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (!nameInput.value.trim()) {
        nameError.textContent = 'Name is required';
        nameError.style.display = 'block';
        isValid = false;
    }
    
    // Validate email
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailInput.value.trim()) {
        emailError.textContent = 'Email is required';
        emailError.style.display = 'block';
        isValid = false;
    } else if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.style.display = 'block';
        isValid = false;
    }
    
    // Validate message
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('message-error');
    if (!messageInput.value.trim()) {
        messageError.textContent = 'Message is required';
        messageError.style.display = 'block';
        isValid = false;
    } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Message must be at least 10 characters';
        messageError.style.display = 'block';
        isValid = false;
    }
    
    return isValid;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        // Simulate form submission
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }
}

// Intersection Observer for Section Animations
function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Sticky Header
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    updateActiveNavLink();
}

// Initialize Current Year
function initCurrentYear() {
    currentYear.textContent = new Date().getFullYear();
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                closeMobileMenu();
            }
        });
    });
}

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
navToggle.addEventListener('click', toggleMobileMenu);
contactForm.addEventListener('submit', handleFormSubmit);
window.addEventListener('scroll', handleScroll);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCurrentYear();
    initIntersectionObserver();
    initSmoothScroll();
    handleScroll(); // Initial call to set active nav link
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // Add keyboard navigation for nav links
    navLinks.forEach(link => {
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });
    
    // Form input real-time validation
    const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim()) {
                const errorId = input.id + '-error';
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
        });
    });
});