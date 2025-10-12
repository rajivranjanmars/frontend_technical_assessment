// components/MenuBar.js
// Top menu bar with file operations and actions

import React, { useState } from 'react';
import { useStore } from '../store';

export const MenuBar = () => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [importJSON, setImportJSON] = useState('');
  
  const {
    undo,
    redo,
    copySelectedNodes,
    pasteNodes,
    deleteSelectedNodes,
    selectAll,
    clearPipeline,
    savePipeline,
    loadPipeline,
    getSavedPipelines,
    deletePipeline,
    exportAsJSON,
    importFromJSON,
    history,
    historyIndex,
    clipboard
  } = useStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleSave = () => {
    if (saveName.trim()) {
      savePipeline(saveName);
      alert(`Pipeline "${saveName}" saved successfully!`);
      setSaveName('');
      setShowSaveDialog(false);
    }
  };

  const handleLoad = (name) => {
    if (loadPipeline(name)) {
      alert(`Pipeline "${name}" loaded successfully!`);
      setShowLoadDialog(false);
    }
  };

  const handleExport = () => {
    const json = exportAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (importFromJSON(importJSON)) {
      alert('Pipeline imported successfully!');
      setImportJSON('');
      setShowImportDialog(false);
    } else {
      alert('Invalid JSON format!');
    }
  };

  const savedPipelines = getSavedPipelines();

  return (
    <>
      <div style={styles.menuBar}>
        <div style={styles.menuSection}>
          <span style={styles.logo}>⚡ Pipeline Builder</span>
        </div>
        
        <div style={styles.menuSection}>
          <button style={styles.menuButton} onClick={() => setShowSaveDialog(true)} title="Save Pipeline (Ctrl+S)">
            💾 Save
          </button>
          <button style={styles.menuButton} onClick={() => setShowLoadDialog(true)} title="Load Pipeline">
            📂 Load
          </button>
          <button style={styles.menuButton} onClick={handleExport} title="Export as JSON">
            📥 Export
          </button>
          <button style={styles.menuButton} onClick={() => setShowImportDialog(true)} title="Import from JSON">
            📤 Import
          </button>
        </div>

        <div style={styles.menuSection}>
          <button 
            style={{...styles.menuButton, opacity: canUndo ? 1 : 0.5}} 
            onClick={undo} 
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button 
            style={{...styles.menuButton, opacity: canRedo ? 1 : 0.5}} 
            onClick={redo} 
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
        </div>

        <div style={styles.menuSection}>
          <button style={styles.menuButton} onClick={copySelectedNodes} disabled={!clipboard} title="Copy (Ctrl+C)">
            📋 Copy
          </button>
          <button 
            style={{...styles.menuButton, opacity: clipboard ? 1 : 0.5}} 
            onClick={pasteNodes} 
            disabled={!clipboard}
            title="Paste (Ctrl+V)"
          >
            📄 Paste
          </button>
          <button style={styles.menuButton} onClick={deleteSelectedNodes} title="Delete (Del)">
            🗑️ Delete
          </button>
          <button style={styles.menuButton} onClick={selectAll} title="Select All (Ctrl+A)">
            ☑️ Select All
          </button>
        </div>

        <div style={styles.menuSection}>
          <button 
            style={{...styles.menuButton, backgroundColor: '#ef4444', color: 'white'}} 
            onClick={() => {
              if (window.confirm('Clear all nodes and edges?')) {
                clearPipeline();
              }
            }}
            title="Clear Pipeline"
          >
            🗑️ Clear
          </button>
        </div>

        <div style={styles.menuSection}>
          <button 
            style={styles.menuButton} 
            onClick={() => setShowShortcuts(!showShortcuts)}
            title="Keyboard Shortcuts"
          >
            ⌨️ Shortcuts
          </button>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Save Pipeline</h3>
            <input
              type="text"
              placeholder="Enter pipeline name..."
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              style={styles.input}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
            />
            <div style={styles.modalButtons}>
              <button onClick={handleSave} style={styles.primaryButton}>Save</button>
              <button onClick={() => setShowSaveDialog(false)} style={styles.secondaryButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Load Pipeline</h3>
            {Object.keys(savedPipelines).length === 0 ? (
              <p style={styles.emptyMessage}>No saved pipelines found</p>
            ) : (
              <div style={styles.pipelineList}>
                {Object.entries(savedPipelines).map(([name, data]) => (
                  <div key={name} style={styles.pipelineItem}>
                    <div>
                      <strong>{name}</strong>
                      <br />
                      <small style={styles.timestamp}>
                        {new Date(data.timestamp).toLocaleString()}
                      </small>
                    </div>
                    <div>
                      <button onClick={() => handleLoad(name)} style={styles.loadButton}>Load</button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Delete "${name}"?`)) {
                            deletePipeline(name);
                            setShowLoadDialog(false);
                            setTimeout(() => setShowLoadDialog(true), 0);
                          }
                        }} 
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={styles.modalButtons}>
              <button onClick={() => setShowLoadDialog(false)} style={styles.secondaryButton}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Import Pipeline (JSON)</h3>
            <textarea
              placeholder="Paste JSON here..."
              value={importJSON}
              onChange={(e) => setImportJSON(e.target.value)}
              style={styles.textarea}
            />
            <div style={styles.modalButtons}>
              <button onClick={handleImport} style={styles.primaryButton}>Import</button>
              <button onClick={() => setShowImportDialog(false)} style={styles.secondaryButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts Panel */}
      {showShortcuts && (
        <div style={styles.modal} onClick={() => setShowShortcuts(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>⌨️ Keyboard Shortcuts</h3>
            <div style={styles.shortcutsList}>
              <div style={styles.shortcutItem}>
                <kbd style={styles.kbd}>Ctrl + S</kbd>
                <span>Save Pipeline</span>
              </div>
              <div style={styles.shortcutItem}>
                <kbd style={styles.kbd}>Ctrl + Z</kbd>
                <span>Undo</span>
              </div>
              <div style={styles.shortcutItem}>
                <kbd style={styles.kbd}>Ctrl + Y</kbd>
                <span>Redo</span>
              </div>
              <div style={styles.shortcutItem}>
                <kbd style={styles.kbd}>Ctrl + C</kbd>
                <span>Copy Selected Nodes</span>
              </div>
              <div style={styles.shortcutItem}>
                <kbd style={styles.kbd}>Ctrl + V</kbd>
                <span>Paste Nodes</span>
              </div>
              <div style={styles.shortcutItem}>
                <kbd style={styles.kbd}>Ctrl + A</kbd>
                <span>Select All Nodes</span>
              </div>
              <div style={styles.shortcutItem}>
                <kbd style={styles.kbd}>Delete</kbd>
                <span>Delete Selected Nodes</span>
              </div>
              <div style={styles.shortcutItem}>
                <kbd style={styles.kbd}>Ctrl + D</kbd>
                <span>Duplicate Selected Nodes</span>
              </div>
            </div>
            <div style={styles.modalButtons}>
              <button onClick={() => setShowShortcuts(false)} style={styles.secondaryButton}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  menuBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    flexWrap: 'wrap'
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: '20px'
  },
  menuSection: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
    borderLeft: '1px solid rgba(255,255,255,0.2)',
    paddingLeft: '15px'
  },
  menuButton: {
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000
  },
  modalContent: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    minWidth: '400px',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    marginTop: '10px',
    marginBottom: '20px'
  },
  textarea: {
    width: '100%',
    minHeight: '200px',
    padding: '10px',
    fontSize: '12px',
    fontFamily: 'monospace',
    border: '2px solid #e2e8f0',
    borderRadius: '6px',
    marginTop: '10px',
    marginBottom: '20px'
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end'
  },
  primaryButton: {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  secondaryButton: {
    padding: '10px 20px',
    background: '#e2e8f0',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  pipelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '10px',
    marginBottom: '20px'
  },
  pipelineItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    background: '#f7fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  },
  timestamp: {
    color: '#718096',
    fontSize: '12px'
  },
  loadButton: {
    padding: '6px 12px',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginRight: '5px'
  },
  deleteButton: {
    padding: '6px 12px',
    background: '#f56565',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#718096',
    padding: '20px'
  },
  shortcutsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '15px',
    marginBottom: '20px'
  },
  shortcutItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
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
    fontWeight: 'bold'
  }
};
