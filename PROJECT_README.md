# VectorShift Pipeline Builder

A powerful drag-and-drop pipeline builder with React frontend and FastAPI backend. Create, visualize, and validate complex data processing pipelines with an intuitive interface.

![Pipeline Builder](https://img.shields.io/badge/React-18.2-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green) ![Status](https://img.shields.io/badge/Status-Complete-success)

## 🎯 Features

### ✨ Core Functionality
- **Drag-and-Drop Interface**: Intuitive node-based pipeline creation
- **9 Node Types**: Input, Output, LLM, Text, Transform, Filter, Aggregate, Validator, Delay
- **Dynamic Text Nodes**: Automatic variable detection and handle creation
- **Auto-resizing Nodes**: Nodes expand based on content
- **DAG Validation**: Automatic detection of cyclic dependencies
- **Real-time Visualization**: See your pipeline structure instantly

### 🎨 Modern UI/UX
- Color-coded node types for easy identification
- Gradient toolbar with modern styling
- Smooth animations and transitions
- Professional design language
- Responsive layout

### 🔧 Technical Highlights
- **Node Abstraction**: Reusable base component for easy node creation
- **State Management**: Zustand for efficient global state
- **Type Safety**: Pydantic models for backend validation
- **CORS Support**: Secure frontend-backend communication

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- npm or yarn

### Option 1: Use the Start Script (Recommended)
```bash
./start.sh
```

This will:
1. Install all dependencies
2. Start the backend on http://localhost:8000
3. Start the frontend on http://localhost:3000

### Option 2: Manual Setup

#### Backend
```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload
```

Backend will be available at `http://localhost:8000`

#### Frontend
```bash
cd frontend
npm install
npm start
```

Frontend will be available at `http://localhost:3000`

## 📖 Usage Guide

### Creating a Pipeline

1. **Drag Nodes**: Drag node types from the toolbar onto the canvas
2. **Connect Nodes**: Click and drag from output handles to input handles
3. **Configure Nodes**: Edit node properties using the built-in forms
4. **Submit**: Click "Submit Pipeline" to analyze your pipeline

### Node Types

| Node | Color | Description |
|------|-------|-------------|
| 🟢 Input | Green | Define input data sources |
| 🔴 Output | Red | Define output destinations |
| 🟣 LLM | Purple | Language model processing |
| 🔵 Text | Blue | Text with dynamic variables |
| 🟠 Transform | Orange | Data transformation operations |
| 🔷 Filter | Cyan | Filter data by conditions |
| 🌸 Aggregate | Pink | Combine multiple data sources |
| 🟢 Validator | Lime | Validate input data |
| 🟣 Delay | Indigo | Add execution delays |

### Using Text Node Variables

The Text node supports dynamic variables:

```
Hello {{username}}, your email is {{email}}
```

This automatically creates two input handles:
- `username`
- `email`

Connect other nodes to these handles to provide values.

## 🏗️ Architecture

### Frontend Structure
```
frontend/src/
├── nodes/
│   ├── BaseNode.js         # Reusable node abstraction
│   ├── inputNode.js        # Input node
│   ├── outputNode.js       # Output node
│   ├── llmNode.js          # LLM node
│   ├── textNode.js         # Text node with variables
│   ├── transformNode.js    # Transform node
│   ├── filterNode.js       # Filter node
│   ├── aggregateNode.js    # Aggregate node
│   ├── validatorNode.js    # Validator node
│   └── delayNode.js        # Delay node
├── App.js                  # Main app component
├── ui.js                   # ReactFlow canvas
├── toolbar.js              # Node toolbar
├── submit.js               # Submit button with API integration
├── store.js                # Zustand state management
└── draggableNode.js        # Draggable node component
```

### Backend Structure
```
backend/
└── main.py                 # FastAPI application with DAG validation
```

## 🔌 API Reference

### GET /
Health check endpoint
```json
{"Ping": "Pong"}
```

### POST /pipelines/parse
Analyze pipeline structure

**Request:**
```json
{
  "nodes": [...],
  "edges": [...]
}
```

**Response:**
```json
{
  "num_nodes": 5,
  "num_edges": 4,
  "is_dag": true
}
```

## 🎓 Implementation Details

### Part 1: Node Abstraction
Created a flexible `BaseNode` component that accepts a configuration object:
- Supports multiple field types (text, textarea, select, number)
- Dynamic handle positioning
- Customizable styling per node type
- Easy to create new nodes

### Part 2: Styling
- Color-coded system for 9 different node types
- Modern gradient toolbar
- Professional button styling with hover effects
- Enhanced ReactFlow canvas with custom background

### Part 3: Text Node Logic
- Real-time variable detection using regex
- Dynamic handle creation for each variable
- Auto-resizing based on content length
- Visual feedback showing detected variables

### Part 4: Backend Integration
- RESTful API with FastAPI
- CORS middleware for security
- DFS-based DAG detection algorithm
- Type-safe request/response models

## 🧪 Testing the Application

### Test DAG Detection
1. Create a simple linear pipeline: Input → Text → Output
2. Submit and verify `is_dag: true`
3. Create a cycle: A → B → C → A
4. Submit and verify `is_dag: false`

### Test Text Node Variables
1. Add a Text node
2. Type: `Hello {{name}}, you are {{age}} years old`
3. Verify two input handles appear: `name` and `age`
4. Connect other nodes to these handles

## 🐛 Troubleshooting

### Backend not connecting
- Ensure backend is running on http://localhost:8000
- Check CORS settings in `backend/main.py`
- Verify no firewall blocking port 8000

### Frontend errors
- Clear browser cache
- Delete `node_modules` and run `npm install`
- Check console for specific errors

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

## 📝 Development Notes

### Adding New Node Types
1. Create a new file in `frontend/src/nodes/`
2. Define configuration object
3. Return `<BaseNode id={id} data={data} config={config} />`
4. Import in `ui.js` and add to `nodeTypes`
5. Add to toolbar in `toolbar.js`

Example:
```javascript
export const CustomNode = ({ id, data }) => {
  const config = {
    type: 'Custom',
    fields: [
      { name: 'param', label: 'Parameter', type: 'text' }
    ],
    handles: {
      inputs: [{ id: 'input' }],
      outputs: [{ id: 'output' }]
    },
    style: { borderColor: '#FF6B6B' }
  };
  return <BaseNode id={id} data={data} config={config} />;
};
```

## 📦 Dependencies

### Frontend
- react: ^18.2.0
- reactflow: ^11.8.3
- zustand: ^4.4.1

### Backend
- fastapi
- uvicorn
- pydantic

## 🤝 Contributing
This is a technical assessment project. See `IMPLEMENTATION.md` for detailed implementation notes.

## 📄 License
This project is part of a technical assessment for VectorShift.

## 🙏 Acknowledgments
- VectorShift for the assessment opportunity
- React Flow for the excellent graph library
- FastAPI for the modern Python framework

---

**Built with ❤️ for VectorShift**
