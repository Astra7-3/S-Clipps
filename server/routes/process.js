const express = require('express');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const CLIP_DURATION = 180; // 3 minutes in seconds

/**
 * Get video duration using ffprobe
 */
function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration);
    });
  });
}

/**
 * Generate a thumbnail for a clip at a given time offset
 */
function generateThumbnail(inputPath, outputPath, timeOffset) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: [timeOffset],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '320x180',
      })
      .on('end', resolve)
      .on('error', (err) => {
        // Thumbnail generation failure is non-fatal
        console.warn('Thumbnail generation failed:', err.message);
        resolve();
      });
  });
}

/**
 * Extract a clip segment from a video
 */
function extractClip(inputPath, outputPath, startTime, duration) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions(['-movflags', '+faststart'])
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
}

// POST /api/process - Process video into 3-minute clips
router.post('/process', async (req, res) => {
  const { videoId } = req.body;

  if (!videoId) {
    return res.status(400).json({ error: 'videoId is required.' });
  }

  // Sanitize videoId: only allow UUID-like alphanumeric/dash characters
  if (!/^[a-zA-Z0-9_-]+$/.test(videoId)) {
    return res.status(400).json({ error: 'Invalid videoId.' });
  }

  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const clipsDir = path.join(__dirname, '..', 'clips');
  const thumbnailsDir = path.join(__dirname, '..', 'thumbnails');

  // Find the uploaded file (may have any extension)
  const files = fs.readdirSync(uploadsDir);
  const videoFile = files.find((f) => path.basename(f, path.extname(f)) === videoId);

  if (!videoFile) {
    return res.status(404).json({ error: 'Video file not found. Please upload again.' });
  }

  const inputPath = path.join(uploadsDir, videoFile);

  try {
    const totalDuration = await getVideoDuration(inputPath);
    const clipCount = Math.ceil(totalDuration / CLIP_DURATION);

    const clips = [];

    for (let i = 0; i < clipCount; i++) {
      const startTime = i * CLIP_DURATION;
      const duration = Math.min(CLIP_DURATION, totalDuration - startTime);
      const clipId = `${videoId}_clip_${i + 1}`;
      const clipFilename = `${clipId}.mp4`;
      const outputPath = path.join(clipsDir, clipFilename);
      const thumbnailFilename = `${clipId}.jpg`;
      const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);

      await extractClip(inputPath, outputPath, startTime, duration);
      await generateThumbnail(inputPath, thumbnailPath, startTime + Math.min(5, duration / 2));

      const clipStat = fs.statSync(outputPath);

      clips.push({
        clipId,
        clipNumber: i + 1,
        filename: clipFilename,
        startTime,
        duration: Math.round(duration),
        size: clipStat.size,
        thumbnail: `/thumbnails/${thumbnailFilename}`,
      });
    }

    res.json({
      success: true,
      videoId,
      totalDuration: Math.round(totalDuration),
      clipCount: clips.length,
      clips,
    });
  } catch (err) {
    console.error('Processing error:', err);
    res.status(500).json({ error: 'Failed to process video. Ensure FFmpeg is installed.' });
  }
});

module.exports = router;
