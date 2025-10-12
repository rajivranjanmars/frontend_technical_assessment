// components/KeyboardHandler.js
// Global keyboard shortcuts handler

import { useEffect } from 'react';
import { useStore } from '../store';

export const KeyboardHandler = () => {
  const {
    undo,
    redo,
    copySelectedNodes,
    pasteNodes,
    deleteSelectedNodes,
    selectAll,
    savePipeline
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl+Z - Undo
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl+Y or Ctrl+Shift+Z - Redo
      if ((ctrl && e.key === 'y') || (ctrl && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
      }

      // Ctrl+C - Copy
      if (ctrl && e.key === 'c') {
        e.preventDefault();
        copySelectedNodes();
      }

      // Ctrl+V - Paste
      if (ctrl && e.key === 'v') {
        e.preventDefault();
        pasteNodes();
      }

      // Ctrl+D - Duplicate (Copy + Paste)
      if (ctrl && e.key === 'd') {
        e.preventDefault();
        copySelectedNodes();
        setTimeout(() => pasteNodes(), 0);
      }

      // Delete or Backspace - Delete selected
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelectedNodes();
      }

      // Ctrl+A - Select All
      if (ctrl && e.key === 'a') {
        e.preventDefault();
        selectAll();
      }

      // Ctrl+S - Save (with auto-generated name)
      if (ctrl && e.key === 's') {
        e.preventDefault();
        const name = `Pipeline_${new Date().toISOString().split('T')[0]}_${Date.now()}`;
        savePipeline(name);
        alert(`Pipeline saved as "${name}"`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, copySelectedNodes, pasteNodes, deleteSelectedNodes, selectAll, savePipeline]);

  return null; // This component doesn't render anything
};
