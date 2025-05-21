document.addEventListener('DOMContentLoaded', () => {
  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.tab;
      
      // Update active states
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      button.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Load videos from folders
  loadFeaturedVideos();
  loadCategoryVideos();

  // Form submission handlers
  const uploadFeaturedForm = document.getElementById('uploadFeaturedForm');
  const uploadCategoryForm = document.getElementById('uploadCategoryForm');

  uploadFeaturedForm.addEventListener('submit', handleFeaturedUpload);
  uploadCategoryForm.addEventListener('submit', handleCategoryUpload);
});

// Video management functions
async function loadFeaturedVideos() {
  try {
    const container = document.getElementById('featuredVideos');
    container.innerHTML = '<div class="loading">Loading videos...</div>';
    
    const response = await fetch('/api/videos/featured');
    const videos = await response.json();
    
    container.innerHTML = '';
    videos.forEach(video => {
      container.appendChild(createVideoElement(video, 'featured'));
    });
  } catch (error) {
    console.error('Error loading featured videos:', error);
    container.innerHTML = '<div class="error">Error loading videos</div>';
  }
}

async function loadCategoryVideos(category = 'travel') {
  try {
    const container = document.getElementById('categoryVideos');
    container.innerHTML = '<div class="loading">Loading videos...</div>';
    
    const response = await fetch(`/api/videos/category/${category}`);
    const videos = await response.json();
    
    container.innerHTML = '';
    videos.forEach(video => {
      container.appendChild(createVideoElement(video, 'category'));
    });
  } catch (error) {
    console.error('Error loading category videos:', error);
    container.innerHTML = '<div class="error">Error loading videos</div>';
  }
}

function createVideoElement(video, type) {
  const videoItem = document.createElement('div');
  videoItem.className = 'video-item';
  videoItem.dataset.id = video.filename;
  
  const videoPath = type === 'featured' ? `/videos/y/${video.filename}` : `/videos/x/${video.filename}`;
  
  videoItem.innerHTML = `
    <video src="${videoPath}" controls preload="metadata"></video>
    <div class="video-item-info">
      <h4 class="video-item-title">${video.title || video.filename}</h4>
    </div>
    <div class="video-item-actions">
      <button class="action-button delete" onclick="deleteVideo('${video.filename}', '${type}')">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  return videoItem;
}

// Form handlers
async function handleFeaturedUpload(e) {
  e.preventDefault();
  
  const title = document.getElementById('featuredTitle').value;
  const videoFile = document.getElementById('featuredVideo').files[0];
  
  if (!videoFile) {
    alert('Please select a video file');
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', videoFile);
    
    const response = await fetch('/api/videos/featured/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Upload failed');
    
    // Reload featured videos
    loadFeaturedVideos();
    
    // Reset form
    e.target.reset();
    
    alert('Video uploaded successfully!');
  } catch (error) {
    console.error('Error uploading video:', error);
    alert('Failed to upload video. Please try again.');
  }
}

async function handleCategoryUpload(e) {
  e.preventDefault();
  
  const title = document.getElementById('categoryTitle').value;
  const category = document.getElementById('categorySelect').value;
  const videoFile = document.getElementById('categoryVideo').files[0];
  
  if (!videoFile) {
    alert('Please select a video file');
    return;
  }
  
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('video', videoFile);
    
    const response = await fetch('/api/videos/category/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Upload failed');
    
    // Reload category videos if current category is selected
    const currentCategory = document.getElementById('categorySelect').value;
    if (currentCategory === category) {
      loadCategoryVideos(category);
    }
    
    // Reset form
    e.target.reset();
    
    alert('Video uploaded successfully!');
  } catch (error) {
    console.error('Error uploading video:', error);
    alert('Failed to upload video. Please try again.');
  }
}

// Video management functions
async function deleteVideo(filename, type) {
  if (!confirm('Are you sure you want to delete this video?')) return;
  
  try {
    const endpoint = type === 'featured' ? '/api/videos/featured/delete' : '/api/videos/category/delete';
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filename })
    });
    
    if (!response.ok) throw new Error('Delete failed');
    
    // Remove the video element from the DOM
    const videoElement = document.querySelector(`.video-item[data-id="${filename}"]`);
    if (videoElement) {
      videoElement.remove();
    }
    
    alert('Video deleted successfully!');
  } catch (error) {
    console.error('Error deleting video:', error);
    alert('Failed to delete video. Please try again.');
  }
}

// Category selector change handler
document.getElementById('categorySelect')?.addEventListener('change', function() {
  loadCategoryVideos(this.value);
}); 