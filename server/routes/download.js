const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// GET /api/download/:clipId - Download a specific clip
router.get('/download/:clipId', (req, res) => {
  const { clipId } = req.params;

  // Sanitize clipId: only allow UUID-like alphanumeric/dash/underscore characters
  if (!/^[a-zA-Z0-9_-]+$/.test(clipId)) {
    return res.status(400).json({ error: 'Invalid clipId.' });
  }

  const clipsDir = path.join(__dirname, '..', 'clips');
  const filename = `${clipId}.mp4`;
  const filePath = path.join(clipsDir, filename);

  // Verify the resolved path is within clipsDir to prevent path traversal
  const resolvedPath = path.resolve(filePath);
  const resolvedClipsDir = path.resolve(clipsDir);
  if (!resolvedPath.startsWith(resolvedClipsDir + path.sep)) {
    return res.status(400).json({ error: 'Invalid clipId.' });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Clip not found.' });
  }

  const stat = fs.statSync(filePath);
  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on('error', (err) => {
    console.error('Download stream error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to download clip.' });
    }
  });
});

module.exports = router;
