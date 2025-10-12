// components/ContextMenu.js
// Right-click context menu for nodes and canvas

import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store';

export const ContextMenu = ({ children }) => {
  const [menu, setMenu] = useState(null);
  
  const {
    copySelectedNodes,
    pasteNodes,
    deleteSelectedNodes,
    nodes,
    clipboard
  } = useStore();

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    
    // Check if right-clicked on a node
    const target = e.target.closest('[data-id]');
    const nodeId = target?.getAttribute('data-id');
    const clickedNode = nodeId ? nodes.find(n => n.id === nodeId) : null;

    setMenu({
      x: e.clientX,
      y: e.clientY,
      nodeId,
      isNode: !!clickedNode
    });
  }, [nodes]);

  const closeMenu = useCallback(() => {
    setMenu(null);
  }, []);

  useEffect(() => {
    if (menu) {
      window.addEventListener('click', closeMenu);
      window.addEventListener('contextmenu', closeMenu);
      return () => {
        window.removeEventListener('click', closeMenu);
        window.removeEventListener('contextmenu', closeMenu);
      };
    }
  }, [menu, closeMenu]);

  const menuItems = menu?.isNode
    ? [
        { label: '📋 Copy', action: copySelectedNodes, disabled: false },
        { label: '🗑️ Delete', action: deleteSelectedNodes, disabled: false },
        { label: '📄 Duplicate', action: () => { copySelectedNodes(); setTimeout(pasteNodes, 0); }, disabled: false }
      ]
    : [
        { label: '📄 Paste', action: pasteNodes, disabled: !clipboard },
        { label: '☑️ Select All', action: useStore.getState().selectAll, disabled: nodes.length === 0 }
      ];

  return (
    <div onContextMenu={handleContextMenu}>
      {children}
      {menu && (
        <div
          style={{
            ...styles.menu,
            left: `${menu.x}px`,
            top: `${menu.y}px`
          }}
        >
          {menuItems.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.menuItem,
                opacity: item.disabled ? 0.5 : 1,
                cursor: item.disabled ? 'not-allowed' : 'pointer'
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!item.disabled) {
                  item.action();
                  closeMenu();
                }
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  menu: {
    position: 'fixed',
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 10000,
    minWidth: '180px',
    overflow: 'hidden'
  },
  menuItem: {
    padding: '10px 15px',
    fontSize: '14px',
    transition: 'background 0.15s',
    userSelect: 'none'
  }
};
