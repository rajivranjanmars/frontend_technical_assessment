// components/WelcomeModal.js
// First-time user welcome modal

import React, { useState, useEffect } from 'react';

export const WelcomeModal = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>👋 Welcome to Pipeline Builder!</h2>
        
        <div style={styles.content}>
          <p style={styles.intro}>
            Build powerful data pipelines with our intuitive node-based editor.
          </p>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🚀 Quick Start</h3>
            <ul style={styles.list}>
              <li>Drag nodes from the toolbar onto the canvas</li>
              <li>Connect nodes by dragging from output handles to input handles</li>
              <li>Configure each node's properties</li>
              <li>Submit your pipeline to validate it</li>
            </ul>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>⌨️ Keyboard Shortcuts</h3>
            <div style={styles.shortcuts}>
              <div style={styles.shortcut}>
                <kbd style={styles.kbd}>Ctrl+C</kbd>
                <span>Copy</span>
              </div>
              <div style={styles.shortcut}>
                <kbd style={styles.kbd}>Ctrl+V</kbd>
                <span>Paste</span>
              </div>
              <div style={styles.shortcut}>
                <kbd style={styles.kbd}>Ctrl+Z</kbd>
                <span>Undo</span>
              </div>
              <div style={styles.shortcut}>
                <kbd style={styles.kbd}>Del</kbd>
                <span>Delete</span>
              </div>
            </div>
          </div>

          <div style={styles.features}>
            <div style={styles.feature}>✨ Auto-save enabled</div>
            <div style={styles.feature}>💾 Save/Load pipelines</div>
            <div style={styles.feature}>📥 Export/Import JSON</div>
            <div style={styles.feature}>🔍 Node search & filter</div>
          </div>
        </div>

        <button onClick={handleClose} style={styles.button}>
          Get Started! 🎉
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100000,
    backdropFilter: 'blur(4px)'
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'slideIn 0.3s ease-out'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1a202c',
    textAlign: 'center'
  },
  content: {
    marginBottom: '30px'
  },
  intro: {
    fontSize: '16px',
    color: '#4a5568',
    marginBottom: '25px',
    textAlign: 'center'
  },
  section: {
    marginBottom: '25px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#2d3748'
  },
  list: {
    margin: '0',
    paddingLeft: '20px',
    color: '#4a5568',
    lineHeight: '1.8'
  },
  shortcuts: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px'
  },
  shortcut: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    background: '#f7fafc',
    borderRadius: '6px'
  },
  kbd: {
    padding: '4px 8px',
    background: '#2d3748',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    minWidth: '60px',
    textAlign: 'center'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '20px'
  },
  feature: {
    padding: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    textAlign: 'center'
  },
  button: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
  }
};
