const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// GET /api/clips/:videoId - Get list of clips for a video
router.get('/clips/:videoId', (req, res) => {
  const { videoId } = req.params;

  // Sanitize videoId
  if (!/^[a-zA-Z0-9_-]+$/.test(videoId)) {
    return res.status(400).json({ error: 'Invalid videoId.' });
  }

  const clipsDir = path.join(__dirname, '..', 'clips');
  const thumbnailsDir = path.join(__dirname, '..', 'thumbnails');

  if (!fs.existsSync(clipsDir)) {
    return res.json({ videoId, clips: [] });
  }

  try {
    const files = fs.readdirSync(clipsDir);
    const clipFiles = files
      .filter((f) => f.startsWith(videoId + '_clip_') && f.endsWith('.mp4'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/_clip_(\d+)\.mp4$/)?.[1] || '0', 10);
        const numB = parseInt(b.match(/_clip_(\d+)\.mp4$/)?.[1] || '0', 10);
        return numA - numB;
      });

    if (clipFiles.length === 0) {
      return res.status(404).json({ error: 'No clips found for this video. Please process the video first.' });
    }

    const clips = clipFiles.map((filename) => {
      const clipId = path.basename(filename, '.mp4');
      const clipNumber = parseInt(clipId.match(/_clip_(\d+)$/)?.[1] || '0', 10);
      const filePath = path.join(clipsDir, filename);
      const stat = fs.statSync(filePath);
      const thumbnailFilename = `${clipId}.jpg`;
      const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);
      const hasThumbnail = fs.existsSync(thumbnailPath);

      return {
        clipId,
        clipNumber,
        filename,
        size: stat.size,
        thumbnail: hasThumbnail ? `/thumbnails/${thumbnailFilename}` : null,
      };
    });

    res.json({ videoId, clips });
  } catch (err) {
    console.error('Clips retrieval error:', err);
    res.status(500).json({ error: 'Failed to retrieve clips.' });
  }
});

module.exports = router;
