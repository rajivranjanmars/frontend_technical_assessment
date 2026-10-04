// BaseNode.js - Abstraction for all node types

import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

export const BaseNode = ({ id, data, config }) => {
  const {
    type = 'Base',
    fields = [],
    handles = { inputs: [], outputs: [] },
    content,
    style = {},
    showDefaultLabel = true,
  } = config;

  // Initialize state for all fields
  const [fieldValues, setFieldValues] = useState(() => {
    const initialValues = {};
    fields.forEach(field => {
      initialValues[field.name] = data?.[field.name] || field.defaultValue || '';
    });
    return initialValues;
  });

  const handleFieldChange = (fieldName, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Update node data if updateNodeField is available
    if (data.updateNodeField) {
      data.updateNodeField(id, fieldName, value);
    }
  };

  const defaultStyle = {
    width: style.width || 220,
    minHeight: style.height || 100,
    border: '2px solid',
    borderColor: style.borderColor || '#4A5568',
    borderRadius: '8px',
    padding: '12px',
    backgroundColor: style.backgroundColor || '#FFFFFF',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    ...style
  };

  const headerStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: style.headerColor || '#2D3748',
    borderBottom: `2px solid ${style.borderColor || '#E2E8F0'}`,
    paddingBottom: '6px',
  };

  const fieldStyle = {
    marginBottom: '8px',
    fontSize: '12px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    fontWeight: '500',
    color: '#4A5568',
  };

  const inputStyle = {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #CBD5E0',
    borderRadius: '4px',
    fontSize: '12px',
    boxSizing: 'border-box',
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '60px',
    resize: 'vertical',
    fontFamily: 'inherit',
  };

  const renderField = (field) => {
    const value = fieldValues[field.name];

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            style={inputStyle}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            style={textareaStyle}
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            style={selectStyle}
          >
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            style={inputStyle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={defaultStyle}>
      {/* Input Handles */}
      {handles.inputs.map((handle, index) => (
        <Handle
          key={`input-${handle.id || index}`}
          type="target"
          position={Position.Left}
          id={`${id}-${handle.id || `input-${index}`}`}
          style={{
            top: handle.top || `${((index + 1) * 100) / (handles.inputs.length + 1)}%`,
            background: handle.color || '#555',
            ...handle.style
          }}
        />
      ))}

      {/* Header */}
      {showDefaultLabel && (
        <div style={headerStyle}>
          <span>{type}</span>
        </div>
      )}

      {/* Custom Content */}
      {content && (
        <div style={{ marginBottom: '8px', fontSize: '12px', color: '#718096' }}>
          {typeof content === 'function' ? content(fieldValues) : content}
        </div>
      )}

      {/* Fields */}
      {fields.map((field) => (
        <div key={field.name} style={fieldStyle}>
          <label style={labelStyle}>
            {field.label}:
            {renderField(field)}
          </label>
        </div>
      ))}

      {/* Output Handles */}
      {handles.outputs.map((handle, index) => (
        <Handle
          key={`output-${handle.id || index}`}
          type="source"
          position={Position.Right}
          id={`${id}-${handle.id || `output-${index}`}`}
          style={{
            top: handle.top || `${((index + 1) * 100) / (handles.outputs.length + 1)}%`,
            background: handle.color || '#555',
            ...handle.style
          }}
        />
      ))}
    </div>
  );
};
