import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './VideoUploader.css';

const API_URL = process.env.REACT_APP_API_URL || '';
const ACCEPTED_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/mpeg', 'video/x-matroska'];
const MAX_SIZE_MB = 500;

function VideoUploader({ onUploadSuccess, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Unsupported file type. Please upload a video file (MP4, MOV, AVI, WebM, MKV).';
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File too large. Maximum size is ${MAX_SIZE_MB} MB.`;
    }
    return null;
  };

  const handleFile = useCallback(async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      onError(validationError);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(percent);
        },
      });

      onUploadSuccess({
        ...response.data,
        localUrl: URL.createObjectURL(file),
      });
    } catch (err) {
      const msg = err.response?.data?.error || 'Upload failed. Please try again.';
      onError(msg);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [onUploadSuccess, onError]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => { const file = e.target.files[0]; if (file) handleFile(file); };

  return (
    <section className="uploader-section">
      <div className="uploader-heading">
        <h1 className="uploader-title">Clip Your Videos in Seconds</h1>
        <p className="uploader-subtitle">
          Upload any video and S/Clipps will automatically divide it into <strong>3-minute clips</strong> ready to download.
        </p>
      </div>

      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!isUploading ? handleClick : undefined}
        role="button"
        tabIndex={0}
        aria-label="Upload video file"
        onKeyDown={(e) => e.key === 'Enter' && !isUploading && handleClick()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="sr-only"
          aria-hidden="true"
        />

        {isUploading ? (
          <div className="upload-progress-wrap">
            <div className="upload-spinner" aria-label="Uploading" />
            <p className="upload-status-text">Uploading… {uploadProgress}%</p>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${uploadProgress}%` }}
                role="progressbar"
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        ) : (
          <div className="drop-zone-content">
            <div className="drop-icon">🎬</div>
            <p className="drop-main-text">
              {isDragging ? 'Drop your video here!' : 'Drag & drop your video here'}
            </p>
            <p className="drop-sub-text">or</p>
            <button className="btn-upload" type="button" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
              Browse Files
            </button>
            <p className="drop-hint">Supports MP4, MOV, AVI, WebM, MKV &mdash; up to 500 MB</p>
          </div>
        )}
      </div>

      <div className="feature-cards">
        <div className="feature-card">
          <span className="feature-icon">⚡</span>
          <span>Fast Processing</span>
        </div>
        <div className="feature-card">
          <span className="feature-icon">✂️</span>
          <span>Auto 3-min Clips</span>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📥</span>
          <span>Download Any Clip</span>
        </div>
      </div>
    </section>
  );
}

export default VideoUploader;
