// textNode.js

import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [dimensions, setDimensions] = useState({ width: 220, height: 100 });
  const textareaRef = useRef(null);

  // Extract variables from text (anything in double curly braces)
  const extractVariables = (text) => {
    const regex = /\{\{(\s*\w+\s*)\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      const varName = match[1].trim();
      if (varName && !matches.includes(varName)) {
        matches.push(varName);
      }
    }
    return matches;
  };

  const variables = extractVariables(currText);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  // Auto-resize based on content
  useEffect(() => {
    if (textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      const textLength = currText.length;
      
      // Calculate new dimensions
      const newWidth = Math.max(220, Math.min(400, 220 + textLength * 0.5));
      const newHeight = Math.max(120, scrollHeight + 60);
      
      setDimensions({ width: newWidth, height: newHeight });
    }
  }, [currText]);

  const nodeStyle = {
    width: dimensions.width,
    minHeight: dimensions.height,
    border: '2px solid #3B82F6',
    borderRadius: '8px',
    padding: '12px',
    backgroundColor: '#EFF6FF',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#1E40AF',
    borderBottom: '2px solid #BFDBFE',
    paddingBottom: '6px',
  };

  const textareaStyle = {
    width: '100%',
    minHeight: '60px',
    padding: '8px',
    border: '1px solid #93C5FD',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    resize: 'vertical',
    boxSizing: 'border-box',
  };

  return (
    <div style={nodeStyle}>
      {/* Dynamic Input Handles for Variables */}
      {variables.map((varName, index) => (
        <Handle
          key={`var-${varName}`}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{
            top: `${((index + 1) * 100) / (variables.length + 1)}%`,
            background: '#3B82F6',
          }}
        />
      ))}

      <div style={headerStyle}>
        <span>Text</span>
      </div>
      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500', color: '#4B5563', fontSize: '12px' }}>
          Text:
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            style={textareaStyle}
            placeholder="Enter text with variables like {{variableName}}"
          />
        </label>
      </div>
      {variables.length > 0 && (
        <div style={{ fontSize: '10px', color: '#6B7280', marginTop: '4px' }}>
          Variables: {variables.join(', ')}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
      />
    </div>
  );
};
