const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// Serve static files from the current directory
app.use(express.static('.'));

// Serve videos from x and y folders
app.use('/videos/x', express.static('x'));
app.use('/videos/y', express.static('y'));

app.use(express.json());

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination folder based on upload type
    const folder = req.path.includes('featured') ? 'y' : 'x';
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
    cb(null, `${timestamp}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'));
    }
  }
});

// API endpoints
// Get featured videos
app.get('/api/videos/featured', async (req, res) => {
  try {
    const files = await fs.readdir('y');
    const videos = files
      .filter(file => file.match(/\.(mp4|webm|ogg)$/i))
      .map(filename => ({
        filename,
        title: path.parse(filename).name,
        url: `/videos/y/${filename}`
      }));
    res.json(videos);
  } catch (error) {
    console.error('Error reading featured videos:', error);
    res.status(500).json({ error: 'Failed to load featured videos' });
  }
});

// Get category videos
app.get('/api/videos/category/:category', async (req, res) => {
  try {
    const files = await fs.readdir('x');
    const videos = files
      .filter(file => file.match(/\.(mp4|webm|ogg)$/i))
      .map(filename => ({
        filename,
        title: path.parse(filename).name,
        url: `/videos/x/${filename}`
      }));
    res.json(videos);
  } catch (error) {
    console.error('Error reading category videos:', error);
    res.status(500).json({ error: 'Failed to load category videos' });
  }
});

// Upload featured video
app.post('/api/videos/featured/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }
  res.json({ 
    filename: req.file.filename,
    url: `/videos/y/${req.file.filename}`
  });
});

// Upload category video
app.post('/api/videos/category/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }
  res.json({ 
    filename: req.file.filename,
    url: `/videos/x/${req.file.filename}`
  });
});

// Delete featured video
app.delete('/api/videos/featured/delete', async (req, res) => {
  try {
    const { filename } = req.body;
    await fs.unlink(path.join('y', filename));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting featured video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// Delete category video
app.delete('/api/videos/category/delete', async (req, res) => {
  try {
    const { filename } = req.body;
    await fs.unlink(path.join('x', filename));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 