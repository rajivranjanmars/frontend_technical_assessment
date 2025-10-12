# VectorShift Frontend Technical Assessment - Implementation

## Overview
This project is a complete implementation of the VectorShift Frontend Technical Assessment, featuring a drag-and-drop pipeline builder with React and FastAPI backend integration.

## Completed Features

### Part 1: Node Abstraction ✓
Created a flexible `BaseNode` component that serves as the foundation for all node types:
- **Location**: `frontend/src/nodes/BaseNode.js`
- **Features**:
  - Configurable fields (text, textarea, select, number)
  - Dynamic handle positioning
  - Customizable styling per node type
  - Reusable component architecture

**New Nodes Created** (5 total):
1. **TransformNode** - Text transformation operations
2. **FilterNode** - Data filtering with conditions
3. **AggregateNode** - Multiple data source aggregation
4. **ValidatorNode** - Input validation with multiple outputs
5. **DelayNode** - Pipeline execution delays

### Part 2: Styling ✓
Applied comprehensive styling across the application:
- **Color-coded node types** with distinct themes
- **Gradient toolbar** with modern design
- **Enhanced draggable nodes** with hover effects
- **Styled ReactFlow canvas** with custom background, controls, and minimap
- **Professional button styling** with hover animations
- **Responsive layout** with consistent spacing

### Part 3: Text Node Logic ✓
Enhanced the Text node with advanced functionality:
- **Dynamic resizing**: Width and height adjust based on content
- **Variable detection**: Automatically extracts variables in `{{variable}}` format
- **Dynamic handles**: Creates input handles for each detected variable
- **Real-time updates**: Updates as user types
- **Visual feedback**: Displays detected variables below the input

### Part 4: Backend Integration ✓
Implemented full-stack integration:

**Frontend** (`frontend/src/submit.js`):
- Sends nodes and edges to backend on submit
- Displays user-friendly alert with results
- Error handling with informative messages

**Backend** (`backend/main.py`):
- RESTful API endpoint `/pipelines/parse`
- CORS support for frontend communication
- **DAG detection algorithm** using DFS cycle detection
- Returns: `num_nodes`, `num_edges`, `is_dag`

## Installation & Setup

### Frontend
```bash
cd frontend
npm install
npm start
```
The frontend will run on `http://localhost:3000`

### Backend
```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload
```
The backend will run on `http://localhost:8000`

## Architecture

### Node Abstraction Pattern
The `BaseNode` component uses a configuration object pattern:
```javascript
const config = {
  type: 'NodeType',
  fields: [...],      // Input fields
  handles: {...},     // Input/output connections
  content: '...',     // Custom content
  style: {...}        // Styling overrides
};
```

### State Management
- Uses Zustand for global state management
- ReactFlow for canvas state and edge management
- Local state for node-specific data

### Styling Approach
- Color-coded system for different node types
- Consistent design language across components
- Modern gradient backgrounds
- Smooth transitions and hover effects

## Node Types

| Node | Color | Purpose |
|------|-------|---------|
| Input | Green | Data input points |
| Output | Red | Data output points |
| LLM | Purple | Language model processing |
| Text | Blue | Text with variable support |
| Transform | Orange | Text transformations |
| Filter | Cyan | Data filtering |
| Aggregate | Pink | Data aggregation |
| Validator | Lime | Input validation |
| Delay | Indigo | Execution delays |

## API Endpoints

### GET /
Health check endpoint
- Returns: `{"Ping": "Pong"}`

### POST /pipelines/parse
Analyzes pipeline structure
- **Request Body**: `{nodes: [], edges: []}`
- **Response**: `{num_nodes: int, num_edges: int, is_dag: bool}`

## DAG Detection Algorithm
The backend implements a depth-first search (DFS) algorithm to detect cycles:
1. Builds an adjacency list from edges
2. Maintains visited and recursion stack sets
3. Detects back edges (cycles) during traversal
4. Returns `true` if no cycles found (valid DAG)

## Features Showcase

### Dynamic Text Node
- Type `{{username}}` to create a handle named "username"
- Type `{{email}}` to create another handle named "email"
- Node automatically resizes to fit content

### Node Abstraction Benefits
- **Easy to create new nodes**: Just define a config object
- **Consistent styling**: Automatic theme application
- **Maintainable**: Single source of truth for node logic
- **Extensible**: Add new field types easily

## Technical Stack
- **Frontend**: React 18, ReactFlow, Zustand
- **Backend**: Python, FastAPI, Pydantic
- **Styling**: CSS-in-JS, Custom theming
- **State**: Zustand for global state

## Additional Improvements
- Professional color scheme
- Accessibility considerations
- Error handling and user feedback
- Responsive design
- Type safety with Pydantic models
- CORS configuration for security

## Notes
- All `.identifier` files have been removed
- PropTypes validation warnings are informational (React 18 pattern)
- Backend uses DFS for efficient cycle detection
- Frontend validates backend connection before submission
