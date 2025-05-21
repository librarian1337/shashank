// Main JavaScript functionality for SnappyFrames Portfolio

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initSmoothScroll();
  initCustomCursor();
  initScrollReveal();
  initContactForm();
  initHeaderScrollEffect();
});

// Navigation functionality
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile menu
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }

  // Close menu when clicking a nav link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      nav.classList.remove('active');
      menuToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
      
      // Update active link
      navLinks.forEach(item => item.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Update active nav item based on scroll position
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // Get all sections
    const sections = document.querySelectorAll('section[id]');
    
    // Find the current section
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to corresponding nav link
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  });
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Custom cursor
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  
  if (!cursor || !cursorFollower) return;
  
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Follower with slight delay
    setTimeout(function() {
      cursorFollower.style.left = e.clientX + 'px';
      cursorFollower.style.top = e.clientY + 'px';
    }, 50);
  });
  
  // Change cursor style on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .video-wrapper, input, textarea, .category-button');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', function() {
      cursor.style.transform = 'scale(1.5)';
      cursorFollower.style.transform = 'scale(1.5)';
      cursorFollower.style.borderColor = 'var(--primary-light)';
    });
    
    el.addEventListener('mouseleave', function() {
      cursor.style.transform = 'scale(1)';
      cursorFollower.style.transform = 'scale(1)';
      cursorFollower.style.borderColor = 'var(--primary)';
    });
  });

  // Hide cursor on document leave
  document.addEventListener('mouseleave', function() {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', function() {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
  });
}

// Reveal elements on scroll
function initScrollReveal() {
  // Add reveal class to elements you want to animate
  const revealElements = document.querySelectorAll('.section-header, .showcase-video, .category-video, .about-info, .about-image, .testimonial, .contact-info, .contact-form, .skill');
  
  revealElements.forEach(element => {
    element.classList.add('reveal');
  });
  
  // Initialize animation on scroll
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);
  
  // Show elements that are in viewport
  function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(reveal => {
      const windowHeight = window.innerHeight;
      const elementTop = reveal.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });

    // Animate skill bars when they come into view
    const skills = document.querySelectorAll('.skill-level');
    skills.forEach(skill => {
      const windowHeight = window.innerHeight;
      const elementTop = skill.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        const width = skill.style.width;
        skill.style.width = "0";
        setTimeout(() => {
          skill.style.width = width;
        }, 300);
      }
    });
  }
}

// Handle contact form
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulate form submission
      const submitButton = contactForm.querySelector('.submit-button');
      const originalText = submitButton.textContent;
      
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      
      // Simulate API call
      setTimeout(function() {
        // Reset form
        contactForm.reset();
        
        // Show success message
        submitButton.textContent = 'Message Sent!';
        submitButton.style.backgroundColor = 'var(--success)';
        
        // Reset button after delay
        setTimeout(function() {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
          submitButton.style.backgroundColor = '';
        }, 3000);
      }, 1500);
    });
  }
}

// Header scroll effect
function initHeaderScrollEffect() {
  const header = document.querySelector('header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}