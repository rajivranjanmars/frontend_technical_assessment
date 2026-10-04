// submit.js

import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (nodes.length === 0) {
            alert('⚠️ No nodes to submit! Add some nodes to your pipeline first.');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const pipeline = {
                nodes: nodes,
                edges: edges
            };

            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pipeline),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Display styled alert with results
            const dagStatus = result.is_dag ? 'Yes ✓' : 'No ✗';
            const emoji = result.is_dag ? '✅' : '⚠️';
            
            alert(
                `${emoji} Pipeline Analysis:\n\n` +
                `📊 Number of Nodes: ${result.num_nodes}\n` +
                `🔗 Number of Edges: ${result.num_edges}\n` +
                `🔄 Is Valid DAG: ${dagStatus}\n\n` +
                (result.is_dag 
                    ? '✨ Your pipeline is a valid directed acyclic graph!' 
                    : '⚠️ Warning: Your pipeline contains cycles or is not a valid DAG.')
            );
        } catch (error) {
            alert(
                `❌ Error submitting pipeline:\n\n${error.message}\n\n` +
                `Make sure the backend server is running on http://localhost:8000`
            );
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExport = () => {
        const json = JSON.stringify({ nodes, edges }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pipeline_export_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '15px',
            padding: '15px',
            background: '#f7fafc',
            borderTop: '1px solid #e2e8f0'
        }}>
            <button 
                type="button" 
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                    backgroundColor: isSubmitting ? '#9ca3af' : '#667eea',
                    color: 'white',
                    padding: '12px 32px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                    if (!isSubmitting) {
                        e.target.style.backgroundColor = '#5a67d8';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 8px rgba(102, 126, 234, 0.4)';
                    }
                }}
                onMouseOut={(e) => {
                    if (!isSubmitting) {
                        e.target.style.backgroundColor = '#667eea';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 6px rgba(102, 126, 234, 0.3)';
                    }
                }}
            >
                {isSubmitting ? '⏳ Submitting...' : '🚀 Submit Pipeline'}
            </button>

            <button 
                type="button" 
                onClick={handleExport}
                disabled={nodes.length === 0}
                style={{
                    backgroundColor: nodes.length === 0 ? '#e2e8f0' : '#10b981',
                    color: nodes.length === 0 ? '#9ca3af' : 'white',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: nodes.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                    if (nodes.length > 0) {
                        e.target.style.backgroundColor = '#059669';
                        e.target.style.transform = 'translateY(-2px)';
                    }
                }}
                onMouseOut={(e) => {
                    if (nodes.length > 0) {
                        e.target.style.backgroundColor = '#10b981';
                        e.target.style.transform = 'translateY(0)';
                    }
                }}
            >
                📥 Quick Export
            </button>

            <div style={{ 
                fontSize: '13px', 
                color: '#64748b',
                marginLeft: '10px'
            }}>
                {nodes.length} node{nodes.length !== 1 ? 's' : ''}, {edges.length} edge{edges.length !== 1 ? 's' : ''}
            </div>
        </div>
    );
};
