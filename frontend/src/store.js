// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

const MAX_HISTORY = 50;

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    history: [],
    historyIndex: -1,
    clipboard: null,
    
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
        get().saveToHistory();
    },
    
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
      // Save to history only for removal changes
      if (changes.some(change => change.type === 'remove')) {
        get().saveToHistory();
      }
    },
    
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
      if (changes.some(change => change.type === 'remove')) {
        get().saveToHistory();
      }
    },
    
    onConnect: (connection) => {
      set({
        edges: addEdge({
          ...connection, 
          type: 'smoothstep', 
          animated: true, 
          markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}
        }, get().edges),
      });
      get().saveToHistory();
    },
    
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
          return node;
        }),
      });
    },
    
    // History Management
    saveToHistory: () => {
      const { nodes, edges, history, historyIndex } = get();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
      
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }
      
      set({
        history: newHistory,
        historyIndex: newHistory.length - 1
      });
      
      // Auto-save to localStorage
      get().autoSave();
    },
    
    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const prevState = history[historyIndex - 1];
        set({
          nodes: JSON.parse(JSON.stringify(prevState.nodes)),
          edges: JSON.parse(JSON.stringify(prevState.edges)),
          historyIndex: historyIndex - 1
        });
      }
    },
    
    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const nextState = history[historyIndex + 1];
        set({
          nodes: JSON.parse(JSON.stringify(nextState.nodes)),
          edges: JSON.parse(JSON.stringify(nextState.edges)),
          historyIndex: historyIndex + 1
        });
      }
    },
    
    // Copy/Paste
    copySelectedNodes: () => {
      const selectedNodes = get().nodes.filter(node => node.selected);
      const selectedNodeIds = selectedNodes.map(node => node.id);
      const selectedEdges = get().edges.filter(edge => 
        selectedNodeIds.includes(edge.source) && selectedNodeIds.includes(edge.target)
      );
      
      set({
        clipboard: {
          nodes: JSON.parse(JSON.stringify(selectedNodes)),
          edges: JSON.parse(JSON.stringify(selectedEdges))
        }
      });
    },
    
    pasteNodes: () => {
      const { clipboard, nodes, edges } = get();
      if (!clipboard) return;
      
      const idMap = {};
      const newNodes = clipboard.nodes.map(node => {
        const newId = get().getNodeID(node.type);
        idMap[node.id] = newId;
        return {
          ...node,
          id: newId,
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50
          },
          selected: true
        };
      });
      
      const newEdges = clipboard.edges.map(edge => ({
        ...edge,
        id: `${idMap[edge.source]}-${idMap[edge.target]}`,
        source: idMap[edge.source],
        target: idMap[edge.target]
      }));
      
      // Deselect all existing nodes
      const updatedNodes = nodes.map(node => ({ ...node, selected: false }));
      
      set({
        nodes: [...updatedNodes, ...newNodes],
        edges: [...edges, ...newEdges]
      });
      get().saveToHistory();
    },
    
    deleteSelectedNodes: () => {
      const selectedNodeIds = get().nodes.filter(node => node.selected).map(node => node.id);
      set({
        nodes: get().nodes.filter(node => !node.selected),
        edges: get().edges.filter(edge => 
          !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target)
        )
      });
      get().saveToHistory();
    },
    
    // Select All
    selectAll: () => {
      set({
        nodes: get().nodes.map(node => ({ ...node, selected: true }))
      });
    },
    
    // Clear Pipeline
    clearPipeline: () => {
      set({
        nodes: [],
        edges: []
      });
      get().saveToHistory();
    },
    
    // Save/Load
    autoSave: () => {
      const { nodes, edges } = get();
      localStorage.setItem('pipeline_autosave', JSON.stringify({ nodes, edges }));
    },
    
    loadAutoSave: () => {
      const saved = localStorage.getItem('pipeline_autosave');
      if (saved) {
        const { nodes, edges } = JSON.parse(saved);
        set({ nodes, edges });
        get().saveToHistory();
      }
    },
    
    savePipeline: (name) => {
      const { nodes, edges } = get();
      const pipelines = JSON.parse(localStorage.getItem('saved_pipelines') || '{}');
      pipelines[name] = { nodes, edges, timestamp: new Date().toISOString() };
      localStorage.setItem('saved_pipelines', JSON.stringify(pipelines));
      return Object.keys(pipelines);
    },
    
    loadPipeline: (name) => {
      const pipelines = JSON.parse(localStorage.getItem('saved_pipelines') || '{}');
      if (pipelines[name]) {
        const { nodes, edges } = pipelines[name];
        set({ nodes, edges });
        get().saveToHistory();
        return true;
      }
      return false;
    },
    
    getSavedPipelines: () => {
      return JSON.parse(localStorage.getItem('saved_pipelines') || '{}');
    },
    
    deletePipeline: (name) => {
      const pipelines = JSON.parse(localStorage.getItem('saved_pipelines') || '{}');
      delete pipelines[name];
      localStorage.setItem('saved_pipelines', JSON.stringify(pipelines));
    },
    
    // Export
    exportAsJSON: () => {
      const { nodes, edges } = get();
      return JSON.stringify({ nodes, edges }, null, 2);
    },
    
    importFromJSON: (jsonString) => {
      try {
        const { nodes, edges } = JSON.parse(jsonString);
        set({ nodes, edges });
        get().saveToHistory();
        return true;
      } catch (e) {
        return false;
      }
    }
  }));
