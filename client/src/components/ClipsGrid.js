import React from 'react';
import './ClipsGrid.css';

const API_URL = process.env.REACT_APP_API_URL || '';

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ClipCard({ clip }) {
  const downloadUrl = `${API_URL}/api/download/${clip.clipId}`;
  const thumbnailUrl = clip.thumbnail ? `${API_URL}${clip.thumbnail}` : null;

  return (
    <div className="clip-card" aria-label={`Clip ${clip.clipNumber}`}>
      <div className="clip-thumbnail-wrap">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Thumbnail for clip ${clip.clipNumber}`}
            className="clip-thumbnail"
            loading="lazy"
          />
        ) : (
          <div className="clip-thumbnail-placeholder" aria-hidden="true">
            🎬
          </div>
        )}
        <div className="clip-number-badge">#{clip.clipNumber}</div>
        {clip.duration && (
          <div className="clip-duration-badge">{formatDuration(clip.duration)}</div>
        )}
      </div>

      <div className="clip-info">
        <p className="clip-title">Clip {clip.clipNumber}</p>
        <div className="clip-meta">
          {clip.duration && (
            <span className="clip-meta-item">
              <span className="clip-meta-icon">⏱</span>
              {formatDuration(clip.duration)}
            </span>
          )}
          {clip.size && (
            <span className="clip-meta-item">
              <span className="clip-meta-icon">💾</span>
              {formatFileSize(clip.size)}
            </span>
          )}
        </div>
        <a
          href={downloadUrl}
          className="btn-download"
          download={`clip_${clip.clipNumber}.mp4`}
          aria-label={`Download clip ${clip.clipNumber}`}
        >
          📥 Download
        </a>
      </div>
    </div>
  );
}

function ClipsGrid({ clips, processingInfo }) {
  if (!clips || clips.length === 0) return null;

  return (
    <section className="clips-section" aria-labelledby="clips-heading">
      <div className="clips-header">
        <div>
          <h2 id="clips-heading" className="clips-title">
            Your Clips
            <span className="clips-count">{clips.length}</span>
          </h2>
          {processingInfo && (
            <p className="clips-subtitle">
              Divided into {clips.length} clip{clips.length !== 1 ? 's' : ''} from{' '}
              {formatDuration(processingInfo.totalDuration)} of video
            </p>
          )}
        </div>
        <div className="clips-actions">
          <a
            href="#clips-grid"
            className="btn-scroll"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('clips-grid')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            ↓ View All
          </a>
        </div>
      </div>

      <div className="clips-grid" id="clips-grid">
        {clips.map((clip) => (
          <ClipCard key={clip.clipId} clip={clip} />
        ))}
      </div>

      <div className="clips-footer">
        <p className="clips-footer-text">
          ✅ All {clips.length} clips are ready to download individually
        </p>
      </div>
    </section>
  );
}

export default ClipsGrid;
