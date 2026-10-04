// components/StatusBar.js
// Bottom status bar showing pipeline stats

import React from 'react';
import { useStore } from '../store';

export const StatusBar = () => {
  const { nodes, edges, historyIndex, history } = useStore();
  
  const selectedNodes = nodes.filter(n => n.selected).length;
  const selectedEdges = edges.filter(e => e.selected).length;

  return (
    <div style={styles.statusBar}>
      <div style={styles.section}>
        <span style={styles.label}>📊 Nodes:</span>
        <span style={styles.value}>{nodes.length}</span>
      </div>
      
      <div style={styles.divider} />
      
      <div style={styles.section}>
        <span style={styles.label}>🔗 Edges:</span>
        <span style={styles.value}>{edges.length}</span>
      </div>
      
      {selectedNodes > 0 && (
        <>
          <div style={styles.divider} />
          <div style={styles.section}>
            <span style={styles.label}>✓ Selected:</span>
            <span style={styles.value}>{selectedNodes} node(s)</span>
          </div>
        </>
      )}
      
      <div style={styles.divider} />
      
      <div style={styles.section}>
        <span style={styles.label}>↶ History:</span>
        <span style={styles.value}>{historyIndex + 1} / {history.length}</span>
      </div>
      
      <div style={styles.spacer} />
      
      <div style={styles.section}>
        <span style={styles.info}>💡 Tip: Use Ctrl+C/V to copy/paste nodes</span>
      </div>
    </div>
  );
};

const styles = {
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 20px',
    background: '#f7fafc',
    borderTop: '1px solid #e2e8f0',
    fontSize: '13px',
    color: '#4a5568',
    height: '40px'
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  label: {
    fontWeight: '500'
  },
  value: {
    fontWeight: '600',
    color: '#2d3748'
  },
  divider: {
    width: '1px',
    height: '20px',
    background: '#cbd5e0',
    margin: '0 15px'
  },
  spacer: {
    flex: 1
  },
  info: {
    fontSize: '12px',
    color: '#718096',
    fontStyle: 'italic'
  }
};
