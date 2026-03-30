import React, { useState } from 'react';
import Header from './components/Header';
import VideoUploader from './components/VideoUploader';
import VideoPreview from './components/VideoPreview';
import ClipsGrid from './components/ClipsGrid';
import ProcessingStatus from './components/ProcessingStatus';
import './App.css';

function App() {
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [clips, setClips] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingInfo, setProcessingInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleUploadSuccess = (videoData) => {
    setUploadedVideo(videoData);
    setClips([]);
    setError(null);
    setProcessingInfo(null);
  };

  const handleProcessingStart = () => {
    setIsProcessing(true);
    setError(null);
  };

  const handleProcessingComplete = (data) => {
    setIsProcessing(false);
    setClips(data.clips);
    setProcessingInfo({
      totalDuration: data.totalDuration,
      clipCount: data.clipCount,
    });
  };

  const handleError = (msg) => {
    setIsProcessing(false);
    setError(msg);
  };

  const handleReset = () => {
    setUploadedVideo(null);
    setClips([]);
    setIsProcessing(false);
    setProcessingInfo(null);
    setError(null);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        {error && (
          <div className="error-banner" role="alert">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button className="error-close" onClick={() => setError(null)} aria-label="Dismiss error">
              ✕
            </button>
          </div>
        )}

        {!uploadedVideo ? (
          <VideoUploader
            onUploadSuccess={handleUploadSuccess}
            onError={handleError}
          />
        ) : (
          <>
            <VideoPreview
              video={uploadedVideo}
              onReset={handleReset}
              onProcessingStart={handleProcessingStart}
              onProcessingComplete={handleProcessingComplete}
              onError={handleError}
              isProcessing={isProcessing}
            />

            {isProcessing && <ProcessingStatus />}

            {clips.length > 0 && (
              <ClipsGrid
                clips={clips}
                processingInfo={processingInfo}
              />
            )}
          </>
        )}
      </main>
      <footer className="footer">
        <p>S/Clipps &mdash; Automatic video clipping tool &mdash; <span className="footer-highlight">3-minute clips, effortlessly</span></p>
      </footer>
    </div>
  );
}

export default App;
