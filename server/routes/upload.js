const express = require('express');
const path = require('path');
const router = express.Router();
const { upload } = require('../middleware/multer');

// POST /api/upload - Upload a video file
router.post('/upload', (req, res) => {
  upload.single('video')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 500 MB.' });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded.' });
    }

    const videoId = path.basename(req.file.filename, path.extname(req.file.filename));

    res.json({
      success: true,
      videoId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      message: 'Video uploaded successfully.',
    });
  });
});

module.exports = router;
