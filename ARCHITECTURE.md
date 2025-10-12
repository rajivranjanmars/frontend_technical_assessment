# System Architecture Diagram

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│                      http://localhost:3000                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                                              │
│  │   App.js     │                                              │
│  └──────┬───────┘                                              │
│         │                                                       │
│    ┌────┴────┬─────────────┬──────────────┐                   │
│    │         │             │              │                    │
│  ┌─▼────┐ ┌─▼────┐  ┌─────▼──────┐  ┌───▼────┐              │
│  │Toolbar│ │ UI   │  │  Submit    │  │ Store  │              │
│  │       │ │      │  │  Button    │  │(Zustand)│             │
│  └───┬───┘ └──┬───┘  └─────┬──────┘  └────────┘              │
│      │        │            │                                   │
│  ┌───▼────────▼────────────▼──────────────┐                   │
│  │        ReactFlow Canvas                │                   │
│  │  ┌──────────────────────────────────┐  │                   │
│  │  │         Node Types:              │  │                   │
│  │  │  • Input      • Transform        │  │                   │
│  │  │  • Output     • Filter           │  │                   │
│  │  │  • LLM        • Aggregate        │  │                   │
│  │  │  • Text       • Validator        │  │                   │
│  │  │  • Delay                         │  │                   │
│  │  │                                  │  │                   │
│  │  │  All use BaseNode abstraction    │  │                   │
│  │  └──────────────────────────────────┘  │                   │
│  └─────────────────────────────────────────┘                   │
│                       │                                         │
│                       │ HTTP POST                               │
│                       │ /pipelines/parse                        │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                          │
│                    http://localhost:8000                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    main.py                                │ │
│  │                                                           │ │
│  │  ┌─────────────────┐      ┌──────────────────┐          │ │
│  │  │  CORS Middleware│      │ Pydantic Models  │          │ │
│  │  │  (localhost:3000)      │ • Node           │          │ │
│  │  └─────────────────┘      │ • Edge           │          │ │
│  │                           │ • Pipeline       │          │ │
│  │  ┌─────────────────┐      └──────────────────┘          │ │
│  │  │  GET /          │                                     │ │
│  │  │  Health Check   │      ┌──────────────────┐          │ │
│  │  └─────────────────┘      │ is_dag()         │          │ │
│  │                           │                  │          │ │
│  │  ┌─────────────────┐      │ DFS Algorithm    │          │ │
│  │  │POST /pipelines/ │◄─────│ Cycle Detection  │          │ │
│  │  │     parse       │      │ O(V+E) Time      │          │ │
│  │  │                 │      └──────────────────┘          │ │
│  │  │ Returns:        │                                     │ │
│  │  │ • num_nodes     │                                     │ │
│  │  │ • num_edges     │                                     │ │
│  │  │ • is_dag        │                                     │ │
│  │  └─────────────────┘                                     │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── PipelineToolbar
│   └── DraggableNode (×9)
│       ├── Input
│       ├── Output
│       ├── LLM
│       ├── Text
│       ├── Transform
│       ├── Filter
│       ├── Aggregate
│       ├── Validator
│       └── Delay
│
├── PipelineUI
│   └── ReactFlow
│       ├── Background
│       ├── Controls
│       ├── MiniMap
│       └── Nodes (dynamic)
│           └── BaseNode (abstraction)
│               ├── Handles (inputs/outputs)
│               ├── Fields (inputs/selects)
│               └── Styling
│
└── SubmitButton
    └── onClick → API call → Alert
```

## Data Flow

```
┌──────────────┐
│   User       │
│   Actions    │
└──────┬───────┘
       │
       ▼
┌──────────────┐      ┌───────────────┐
│ Drag & Drop  │─────▶│  Zustand      │
│ Node onto    │      │  Store        │
│ Canvas       │      │  • nodes[]    │
└──────────────┘      │  • edges[]    │
                      └───────┬───────┘
┌──────────────┐              │
│ Connect      │──────────────┘
│ Nodes        │
└──────────────┘
       │
       ▼
┌──────────────┐      ┌───────────────┐
│ Click Submit │─────▶│ API Request   │
└──────────────┘      │ POST /parse   │
                      └───────┬───────┘
                              │
                              ▼
                      ┌───────────────┐
                      │ Backend       │
                      │ Process       │
                      │ • Count nodes │
                      │ • Count edges │
                      │ • Check DAG   │
                      └───────┬───────┘
                              │
                              ▼
                      ┌───────────────┐
                      │ API Response  │
                      │ { num_nodes,  │
                      │   num_edges,  │
                      │   is_dag }    │
                      └───────┬───────┘
                              │
                              ▼
                      ┌───────────────┐
                      │  Alert Dialog │
                      │  Display      │
                      │  Results      │
                      └───────────────┘
```

## BaseNode Abstraction Pattern

```
┌─────────────────────────────────────────────────────────┐
│                   BaseNode Component                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Input: config object                                   │
│  ┌───────────────────────────────────────────────────┐ │
│  │ {                                                 │ │
│  │   type: 'NodeType',                               │ │
│  │   fields: [                                       │ │
│  │     { name, label, type, defaultValue, options } │ │
│  │   ],                                              │ │
│  │   handles: {                                      │ │
│  │     inputs: [{ id, top, color }],                 │ │
│  │     outputs: [{ id, top, color }]                 │ │
│  │   },                                              │ │
│  │   content: 'Description',                         │ │
│  │   style: { borderColor, backgroundColor... }     │ │
│  │ }                                                 │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Output: Rendered node with:                           │
│  • Input handles (left side)                           │
│  • Output handles (right side)                         │
│  • Form fields (text/select/number/textarea)          │
│  • Custom styling per node type                       │
│  • Consistent behavior                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Used by all 9 node types
                         ▼
        ┌────────────────────────────────────┐
        │  InputNode, OutputNode, LLMNode,   │
        │  TextNode, TransformNode,          │
        │  FilterNode, AggregateNode,        │
        │  ValidatorNode, DelayNode          │
        └────────────────────────────────────┘
```

## Text Node Variable Detection

```
User Types:           Variable Detection:        Handle Creation:
                     
"Hello {{name}}"  ──▶  Regex Match           ──▶  ┌─────────┐
                       /\{\{(\s*\w+\s*)\}\}/       │ ○ name  │
                                                   │         │
                       Extract: ["name"]           │  Text   │
                                                   │  Node   │
                                                   └────○────┘
                                                        └─ output

"{{user}}, age    ──▶  Extract:               ──▶  ┌─────────┐
{{age}}, city          ["user", "age",             │ ○ user  │
{{city}}"              "city"]                     │ ○ age   │
                                                   │ ○ city  │
                       No duplicates               │  Text   │
                       Real-time update            │  Node   │
                                                   └────○────┘
                                                        └─ output
```

## DAG Detection Algorithm

```
Input Pipeline:
  A ──▶ B ──▶ C
  │           │
  └───────────┘

Graph Representation:
  A → [B, C]
  B → [C]
  C → []

DFS Traversal:
  Start at A
  ├─ Visit B (add to stack)
  │  └─ Visit C (add to stack)
  │     └─ No more neighbors
  │     └─ Remove C from stack
  │  └─ Remove B from stack
  └─ Visit C (already visited, not in stack)
     └─ CYCLE DETECTED! (C already visited, in stack)

Result: is_dag = False
```

## Color Scheme

```
┌──────────────┬─────────────┬──────────┐
│ Node Type    │ Color       │ Hex      │
├──────────────┼─────────────┼──────────┤
│ Input        │ 🟢 Green    │ #10B981  │
│ Output       │ 🔴 Red      │ #EF4444  │
│ LLM          │ 🟣 Purple   │ #8B5CF6  │
│ Text         │ 🔵 Blue     │ #3B82F6  │
│ Transform    │ 🟠 Orange   │ #F59E0B  │
│ Filter       │ 🔷 Cyan     │ #06B6D4  │
│ Aggregate    │ 🌸 Pink     │ #EC4899  │
│ Validator    │ 🟢 Lime     │ #84CC16  │
│ Delay        │ 🟣 Indigo   │ #6366F1  │
└──────────────┴─────────────┴──────────┘

Toolbar Gradient: #667eea → #764ba2
Submit Button: #667eea (hover: #5a67d8)
```

## File Structure Tree

```
frontend_technical_assessment/
│
├── backend/
│   └── main.py ⭐ FastAPI + DAG algorithm
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── ...
│   │
│   ├── src/
│   │   ├── nodes/
│   │   │   ├── BaseNode.js ⭐ Abstraction
│   │   │   ├── inputNode.js
│   │   │   ├── outputNode.js
│   │   │   ├── llmNode.js
│   │   │   ├── textNode.js ⭐ Variable detection
│   │   │   ├── transformNode.js ⭐ New
│   │   │   ├── filterNode.js ⭐ New
│   │   │   ├── aggregateNode.js ⭐ New
│   │   │   ├── validatorNode.js ⭐ New
│   │   │   └── delayNode.js ⭐ New
│   │   │
│   │   ├── App.js
│   │   ├── ui.js ⭐ Enhanced
│   │   ├── toolbar.js ⭐ Styled
│   │   ├── submit.js ⭐ API integration
│   │   ├── store.js (Zustand)
│   │   ├── draggableNode.js ⭐ Styled
│   │   ├── index.js
│   │   └── index.css ⭐ Enhanced
│   │
│   └── package.json
│
├── Documentation/
│   ├── START_HERE.md
│   ├── PROJECT_README.md
│   ├── IMPLEMENTATION.md
│   ├── COMPLETION_SUMMARY.md
│   ├── TESTING_GUIDE.md
│   ├── FINAL_STATUS.md
│   └── this file! (ARCHITECTURE.md)
│
└── start.sh ⭐ Quick start script
```

---

**Legend:**
- ⭐ = New or significantly enhanced
- ○ = Connection handle
- → = Data flow
- ──▶ = Edge/connection
