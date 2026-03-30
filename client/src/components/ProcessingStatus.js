import React from 'react';
import './ProcessingStatus.css';

const STEPS = [
  { id: 1, label: 'Analyzing video', icon: '🔍' },
  { id: 2, label: 'Splitting into 3-min clips', icon: '✂️' },
  { id: 3, label: 'Encoding clips to MP4', icon: '🎞️' },
  { id: 4, label: 'Generating thumbnails', icon: '🖼️' },
];

function ProcessingStatus() {
  return (
    <div className="processing-wrap" role="status" aria-live="polite" aria-label="Processing video">
      <div className="processing-header">
        <div className="processing-spinner-ring" aria-hidden="true">
          <div className="ring-inner" />
        </div>
        <div>
          <h2 className="processing-title">Processing Your Video</h2>
          <p className="processing-subtitle">This may take a few minutes depending on video size…</p>
        </div>
      </div>

      <div className="processing-steps">
        {STEPS.map((step) => (
          <div className="step-item" key={step.id}>
            <span className="step-icon">{step.icon}</span>
            <span className="step-label">{step.label}</span>
            <span className="step-indicator" aria-hidden="true" />
          </div>
        ))}
      </div>

      <div className="processing-bar-track">
        <div className="processing-bar-fill" aria-hidden="true" />
      </div>
    </div>
  );
}

export default ProcessingStatus;
