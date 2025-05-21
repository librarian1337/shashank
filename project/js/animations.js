// Animations for SnappyFrames Portfolio

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all animations
  initCategoryTabs();
  initTestimonialSlider();
  initVideoModal();
  initHeroAnimation();
});

// Category tabs functionality
function initCategoryTabs() {
  const categoryButtons = document.querySelectorAll('.category-button');
  const categoryContents = document.querySelectorAll('.category-videos');
  
  if (categoryButtons.length === 0 || categoryContents.length === 0) return;
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get category to show
      const category = this.getAttribute('data-category');
      
      // Hide all category contents
      categoryContents.forEach(content => {
        content.classList.remove('active');
      });
      
      // Show selected category content
      const selectedContent = document.getElementById(`${category}-videos`);
      if (selectedContent) {
        selectedContent.classList.add('active');
      }
    });
  });
}

// Testimonial slider
function initTestimonialSlider() {
  const testimonialsContainer = document.querySelector('.testimonials-slider');
  const testimonials = document.querySelectorAll('.testimonial');
  const dotsContainer = document.querySelector('.testimonial-dots');
  const dots = document.querySelectorAll('.dot');
  const prevButton = document.querySelector('.testimonial-control.prev');
  const nextButton = document.querySelector('.testimonial-control.next');
  
  if (!testimonialsContainer || testimonials.length === 0) return;
  
  let currentIndex = 0;
  
  // Hide all testimonials except the first one
  testimonials.forEach((testimonial, index) => {
    if (index !== 0) {
      testimonial.style.display = 'none';
    }
  });
  
  // Function to show testimonial by index
  function showTestimonial(index) {
    // Hide current testimonial with animation
    testimonials[currentIndex].classList.add('slide-out');
    
    setTimeout(() => {
      testimonials[currentIndex].style.display = 'none';
      testimonials[currentIndex].classList.remove('slide-out');
      
      // Update current index
      currentIndex = index;
      
      // Show new testimonial with animation
      testimonials[currentIndex].style.display = 'block';
      testimonials[currentIndex].classList.add('slide-in');
      
      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }, 300);
  }
  
  // Event listeners for controls
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      const newIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(newIndex);
    });
  }
  
  if (prevButton) {
    prevButton.addEventListener('click', function() {
      const newIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      showTestimonial(newIndex);
    });
  }
  
  // Event listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      if (index !== currentIndex) {
        showTestimonial(index);
      }
    });
  });
  
  // Auto slide
  let intervalId;
  
  function startAutoSlide() {
    intervalId = setInterval(() => {
      const newIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(newIndex);
    }, 6000);
  }
  
  function stopAutoSlide() {
    clearInterval(intervalId);
  }
  
  // Start auto slide
  startAutoSlide();
  
  // Pause on hover
  testimonialsContainer.addEventListener('mouseenter', stopAutoSlide);
  testimonialsContainer.addEventListener('mouseleave', startAutoSlide);
}

// Video modal functionality
function initVideoModal() {
  const videoWrappers = document.querySelectorAll('.video-wrapper');
  const modal = document.getElementById('videoModal');
  const closeModal = document.querySelector('.close-modal');
  
  if (!modal || videoWrappers.length === 0) return;
  
  videoWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', function() {
      // Get video URL (in a real implementation, you would use this to embed the video)
      const videoUrl = this.getAttribute('data-video');
      
      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Close modal on button click
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  
  // Close modal on click outside content
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Close modal on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Hero section animations
function initHeroAnimation() {
  // Add floating animation to timeline elements
  const timelineElement = document.querySelector('.timeline-element');
  if (timelineElement) {
    timelineElement.classList.add('float');
  }
  
  // Add parallax effect to hero section
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;
      hero.style.backgroundPosition = `50% ${50 + scrollPosition * 0.05}%`;
    });
  }
  
  // Glitch effect animation
  const glitchElement = document.querySelector('.glitch');
  if (glitchElement) {
    // Set data-text attribute for glitch effect
    glitchElement.setAttribute('data-text', glitchElement.textContent);
    
    // Trigger glitch effect periodically
    setInterval(function() {
      glitchElement.classList.add('glitch-animate');
      
      setTimeout(function() {
        glitchElement.classList.remove('glitch-animate');
      }, 1000);
    }, 5000);
  }
}

// Add animated highlights to specific text elements
function initTextAnimations() {
  const elementsToAnimate = document.querySelectorAll('.highlight');
  
  elementsToAnimate.forEach(element => {
    element.classList.add('animated-highlight');
  });
}

// Parallax effect for background elements
function initParallaxEffect() {
  window.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const parallaxElements = document.querySelectorAll('.timeline-element, .image-outline');
    
    parallaxElements.forEach(element => {
      const offsetX = (mouseX - 0.5) * 20;
      const offsetY = (mouseY - 0.5) * 20;
      
      element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  });
}