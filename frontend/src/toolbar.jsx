// toolbar.js

import { useState } from 'react';
import { DraggableNode } from './draggableNode';

const allNodes = [
    { type: 'customInput', label: 'Input', category: 'I/O', description: 'Input data source' },
    { type: 'customOutput', label: 'Output', category: 'I/O', description: 'Output destination' },
    { type: 'llm', label: 'LLM', category: 'AI', description: 'Language model processing' },
    { type: 'text', label: 'Text', category: 'Data', description: 'Text processing with variables' },
    { type: 'transform', label: 'Transform', category: 'Processing', description: 'Transform text data' },
    { type: 'filter', label: 'Filter', category: 'Processing', description: 'Filter data by condition' },
    { type: 'aggregate', label: 'Aggregate', category: 'Processing', description: 'Aggregate multiple sources' },
    { type: 'validator', label: 'Validator', category: 'Validation', description: 'Validate data format' },
    { type: 'delay', label: 'Delay', category: 'Utility', description: 'Add time delay' },
];

export const PipelineToolbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(allNodes.map(n => n.category))];

    const filteredNodes = allNodes.filter(node => {
        const matchesSearch = node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            node.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || node.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{ 
            padding: '20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderBottom: '3px solid #5a67d8'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ 
                    color: '#ffffff', 
                    margin: '0',
                    fontSize: '24px',
                    fontWeight: 'bold'
                }}>
                    📦 Node Library
                </h2>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="🔍 Search nodes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            padding: '8px 15px',
                            borderRadius: '20px',
                            border: 'none',
                            fontSize: '14px',
                            width: '250px',
                            outline: 'none'
                        }}
                    />
                    
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                            padding: '8px 15px',
                            borderRadius: '20px',
                            border: 'none',
                            fontSize: '14px',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ 
                marginTop: '15px', 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '12px' 
            }}>
                {filteredNodes.length > 0 ? (
                    filteredNodes.map(node => (
                        <div key={node.type} title={node.description}>
                            <DraggableNode type={node.type} label={node.label} />
                        </div>
                    ))
                ) : (
                    <div style={{ 
                        color: 'white', 
                        padding: '20px',
                        opacity: 0.7
                    }}>
                        No nodes found matching your search
                    </div>
                )}
            </div>

            {searchTerm === '' && selectedCategory === 'All' && (
                <div style={{ 
                    marginTop: '15px', 
                    fontSize: '12px', 
                    color: 'rgba(255,255,255,0.7)',
                    fontStyle: 'italic'
                }}>
                    💡 Drag and drop nodes onto the canvas to build your pipeline
                </div>
            )}
        </div>
    );
};
