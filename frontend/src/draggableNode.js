// draggableNode.js

export const DraggableNode = ({ type, label }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    // Color mapping for different node types
    const getNodeColor = (nodeType) => {
      const colors = {
        'customInput': '#10B981',
        'customOutput': '#EF4444',
        'llm': '#8B5CF6',
        'text': '#3B82F6',
        'transform': '#F59E0B',
        'filter': '#06B6D4',
        'aggregate': '#EC4899',
        'validator': '#84CC16',
        'delay': '#6366F1',
      };
      return colors[nodeType] || '#1C2536';
    };
  
    return (
      <div
        className={type}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        style={{ 
          cursor: 'grab', 
          minWidth: '100px', 
          height: '70px',
          display: 'flex', 
          alignItems: 'center', 
          borderRadius: '10px',
          backgroundColor: getNodeColor(type),
          justifyContent: 'center', 
          flexDirection: 'column',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease',
          border: '2px solid rgba(255, 255, 255, 0.3)',
        }} 
        draggable
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 10px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
        }}
      >
          <span style={{ 
            color: '#fff', 
            fontWeight: '600',
            fontSize: '14px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
          }}>
            {label}
          </span>
      </div>
    );
  };
  