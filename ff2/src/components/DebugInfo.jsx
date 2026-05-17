import React from 'react';

const DebugInfo = () => {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h6>Debug Info</h6>
      <p>React App: ✅ Running</p>
      <p>Current URL: {window.location.href}</p>
      <p>Screen Width: {window.innerWidth}px</p>
      <p>Screen Height: {window.innerHeight}px</p>
      <p>User Agent: {navigator.userAgent.substring(0, 50)}...</p>
    </div>
  );
};

export default DebugInfo;
