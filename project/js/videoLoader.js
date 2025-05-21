// Video loading and handling for SnappyFrames

document.addEventListener('DOMContentLoaded', () => {
  // Load featured videos from the 'y' folder
  loadFeaturedVideos();
  
  // Set up category button click handlers
  setupCategoryButtons();
});

// Function to load featured videos from the 'y' folder
async function loadFeaturedVideos() {
  try {
    const response = await fetch('/api/videos/featured');
    const videos = await response.json();
    
    const showcaseContainer = document.querySelector('.showcase-container');
    if (!showcaseContainer) return;
    
    showcaseContainer.innerHTML = '';
    
    videos.forEach(video => {
      const videoElement = createVideoElement(video, 'featured');
      showcaseContainer.appendChild(videoElement);
    });
  } catch (error) {
    console.error('Error loading featured videos:', error);
  }
}

// Function to set up category button click handlers
function setupCategoryButtons() {
  const categoryButtons = document.querySelectorAll('.category-button');
  const categoryModal = document.getElementById('categoryModal');
  const categoryModalTitle = document.getElementById('categoryModalTitle');
  const categoryVideosGrid = document.getElementById('categoryVideosGrid');
  const closeModalButtons = document.querySelectorAll('.close-modal');
  
  // Close modal when clicking the close button
  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
      });
    });
  });
  
  // Close modal when clicking outside the content
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('active');
    }
  });
  
  // Set up category button click handlers
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      
      // Update active button
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update modal title
      categoryModalTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Videos`;
      
      // Load videos for the selected category
      loadCategoryVideos(category, categoryVideosGrid);
      
      // Show the modal
      categoryModal.classList.add('active');
    });
  });
}

// Function to load videos for a specific category
async function loadCategoryVideos(category, container) {
  try {
    // Clear the container
    container.innerHTML = '';
    
    // Show loading state
    container.innerHTML = '<div class="loading">Loading videos...</div>';
    
    // Fetch videos for the category
    const response = await fetch(`/api/videos/category/${category}`);
    const videos = await response.json();
    
    // Clear loading state
    container.innerHTML = '';
    
    // Create video elements
    videos.forEach(video => {
      const videoElement = createCategoryVideoElement(video);
      container.appendChild(videoElement);
    });
  } catch (error) {
    console.error('Error loading category videos:', error);
    container.innerHTML = '<div class="error">Error loading videos</div>';
  }
}

// Function to create a video element for the category modal
function createCategoryVideoElement(video) {
  const videoItem = document.createElement('div');
  videoItem.className = 'category-video-item';
  videoItem.innerHTML = `
    <video src="${video.url}" controls preload="metadata"></video>
    <h3>${video.title || video.filename}</h3>
  `;
  return videoItem;
}

// Function to create a video element
function createVideoElement(video, type) {
  const videoItem = document.createElement('div');
  videoItem.className = type === 'featured' ? 'showcase-video' : 'category-video';
  
  videoItem.innerHTML = `
    <div class="video-wrapper">
      <video src="${video.url}" controls preload="metadata"></video>
    </div>
    <h3>${video.title || video.filename}</h3>
  `;
  
  return videoItem;
}

// Add smooth animations to videos when they appear
function addVideoAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.video-wrapper, .category-video-item').forEach(video => {
    observer.observe(video);
  });
}

// Initialize animations
addVideoAnimations();

// Lazy load videos when they come into view
function initLazyVideoLoading() {
  // Create IntersectionObserver to detect when video thumbnails enter viewport
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const videoWrapper = entry.target;
          
          // Add a preload class to enhance user experience
          videoWrapper.classList.add('preload');
          
          // Add hover effects for video thumbnails
          enhanceVideoThumbnail(videoWrapper);
          
          // Stop observing after enhancing
          observer.unobserve(videoWrapper);
        }
      });
    }, {
      rootMargin: '0px 0px 200px 0px' // Load videos 200px before they enter viewport
    });
    
    // Observe all video wrappers
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    videoWrappers.forEach(wrapper => {
      videoObserver.observe(wrapper);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    videoWrappers.forEach(wrapper => {
      enhanceVideoThumbnail(wrapper);
    });
  }
}

// Enhance video thumbnails with hover effects
function enhanceVideoThumbnail(videoWrapper) {
  // Add pulsing effect to play button
  const playButton = videoWrapper.querySelector('.play-button');
  if (playButton) {
    playButton.classList.add('pulse');
  }
  
  // Add hover effect to thumbnail
  videoWrapper.addEventListener('mouseenter', function() {
    const thumbnail = this.querySelector('.video-thumbnail');
    if (thumbnail) {
      thumbnail.style.transform = 'scale(1.05)';
    }
    
    if (playButton) {
      playButton.style.opacity = '1';
    }
  });
  
  videoWrapper.addEventListener('mouseleave', function() {
    const thumbnail = this.querySelector('.video-thumbnail');
    if (thumbnail) {
      thumbnail.style.transform = 'scale(1)';
    }
    
    if (playButton) {
      playButton.style.opacity = '0';
    }
  });
}

// Video autoplay functionality for the showcase section
function initVideoAutoplay() {
  // This would be used in a production environment with actual video elements
  // For demonstration purposes, we'll just log that this function would control video autoplay
  console.log('Video autoplay would be initialized here in a production environment');
  
  // Example implementation (commented out since we're using thumbnails instead of real videos)
  /*
  const videoElements = document.querySelectorAll('video');
  
  videoElements.forEach(video => {
    // Add hover event listeners
    video.addEventListener('mouseenter', function() {
      // Only autoplay if video is visible in viewport
      const rect = video.getBoundingClientRect();
      const isVisible = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
      
      if (isVisible) {
        video.play();
      }
    });
    
    video.addEventListener('mouseleave', function() {
      video.pause();
    });
  });
  */
}

// Video categories filtering functionality
function handleVideoFiltering() {
  // In a real implementation, this function would load different videos based on category selection
  // For the demo, this functionality is handled by CSS/JS in the category tabs
  
  // Example advanced implementation for actual video loading (commented out)
  /*
  function loadCategoryVideos(category) {
    const categoryVideosContainer = document.getElementById(`${category}-videos`);
    
    // Show loading state
    categoryVideosContainer.innerHTML = '<div class="loading-spinner"></div>';
    
    // Simulate API call to get videos
    setTimeout(() => {
      // For demo purposes, we're just showing the pre-defined videos
      categoryVideosContainer.classList.add('active');
    }, 500);
  }
  */
}

// Handle video playback analytics
function trackVideoAnalytics() {
  // In a real implementation, this would track video engagement metrics
  
  // Example implementation (commented out)
  /*
  function logVideoInteraction(videoId, action) {
    // This would send data to an analytics service
    console.log(`Video interaction: ${videoId}, Action: ${action}`);
  }
  
  // Track video starts
  document.querySelectorAll('.video-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', function() {
      const videoId = this.getAttribute('data-video-id');
      logVideoInteraction(videoId, 'play');
    });
  });
  */
}