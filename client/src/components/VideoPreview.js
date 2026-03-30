import React from 'react';
import axios from 'axios';
import './VideoPreview.css';

const API_URL = process.env.REACT_APP_API_URL || '';

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function VideoPreview({ video, onReset, onProcessingStart, onProcessingComplete, onError, isProcessing }) {
  const handleProcess = async () => {
    onProcessingStart();
    try {
      const response = await axios.post(`${API_URL}/api/process`, { videoId: video.videoId });
      onProcessingComplete(response.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Processing failed. Ensure FFmpeg is installed on the server.';
      onError(msg);
    }
  };

  return (
    <section className="preview-section">
      <div className="preview-header">
        <h2 className="preview-title">Video Uploaded</h2>
        <button className="btn-reset" onClick={onReset} disabled={isProcessing} aria-label="Upload new video">
          ↩ New Video
        </button>
      </div>

      <div className="preview-card">
        <div className="video-wrap">
          <video
            src={video.localUrl}
            controls
            className="video-player"
            aria-label={`Preview of ${video.originalName}`}
          />
        </div>
        <div className="video-meta">
          <div className="meta-row">
            <span className="meta-label">File</span>
            <span className="meta-value" title={video.originalName}>{video.originalName}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Size</span>
            <span className="meta-value">{formatFileSize(video.size)}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Format</span>
            <span className="meta-value">{video.mimetype}</span>
          </div>
          <div className="meta-row meta-success">
            <span className="meta-label">Status</span>
            <span className="meta-value meta-badge-green">✓ Ready to process</span>
          </div>
        </div>
      </div>

      <div className="process-cta">
        <p className="process-hint">
          Click below to split your video into <strong>3-minute clips</strong>
        </p>
        <button
          className="btn-process"
          onClick={handleProcess}
          disabled={isProcessing}
          aria-busy={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="btn-spinner" aria-hidden="true" />
              Processing…
            </>
          ) : (
            <>✂️ Generate Clips</>
          )}
        </button>
      </div>
    </section>
  );
}

export default VideoPreview;
