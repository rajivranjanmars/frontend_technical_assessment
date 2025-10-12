# Testing Guide

## Quick Test Scenarios

### Scenario 1: Basic Pipeline (DAG Test)
**Purpose**: Test that a simple linear pipeline is correctly identified as a DAG

**Steps:**
1. Start the application
2. Drag an **Input** node to the canvas
3. Drag a **Text** node to the canvas
4. Drag an **Output** node to the canvas
5. Connect: Input → Text → Output
6. Click "Submit Pipeline"

**Expected Result:**
```
Number of Nodes: 3
Number of Edges: 2
Is Valid DAG: Yes ✓
```

---

### Scenario 2: Cycle Detection (Non-DAG Test)
**Purpose**: Test that cycles are correctly detected

**Steps:**
1. Create 3 **Text** nodes
2. Connect them in a circle: Text1 → Text2 → Text3 → Text1
3. Click "Submit Pipeline"

**Expected Result:**
```
Number of Nodes: 3
Number of Edges: 3
Is Valid DAG: No ✗
Warning: Your pipeline contains cycles...
```

---

### Scenario 3: Dynamic Text Node Variables
**Purpose**: Test variable detection and dynamic handle creation

**Steps:**
1. Drag a **Text** node to the canvas
2. In the text field, type: `Hello {{username}}, you are {{age}} years old`
3. Observe the node

**Expected Result:**
- Two input handles appear on the left side
- Handles labeled: "username" and "age"
- Below the textarea: "Variables: username, age"
- Node width/height increases

**Advanced Test:**
1. Add more text: `{{username}}, {{age}}, {{email}}, {{city}}`
2. Watch handles update dynamically
3. Should see 4 handles

---

### Scenario 4: Node Abstraction Demo
**Purpose**: Show the variety of nodes created with the abstraction

**Steps:**
1. Drag each node type onto the canvas:
   - Input (Green)
   - Output (Red)
   - LLM (Purple)
   - Text (Blue)
   - Transform (Orange)
   - Filter (Cyan)
   - Aggregate (Pink)
   - Validator (Lime)
   - Delay (Indigo)

**Expected Result:**
- All nodes have consistent styling
- Each has unique color scheme
- All have proper handles and fields
- Forms work correctly

---

### Scenario 5: Complex Pipeline
**Purpose**: Test a realistic, complex pipeline

**Steps:**
1. Create this pipeline:
```
Input1 ──┐
         ├──> Aggregate ──> Transform ──> Validator ──┬──> Output1
Input2 ──┘                                           │
                                                     └──> Output2
```

2. Configure nodes:
   - Aggregate: Method = "sum"
   - Transform: Operation = "uppercase"
   - Validator: Type = "email"

3. Submit pipeline

**Expected Result:**
```
Number of Nodes: 6
Number of Edges: 6
Is Valid DAG: Yes ✓
```

---

### Scenario 6: LLM Pipeline
**Purpose**: Test the LLM node with system and prompt inputs

**Steps:**
1. Create this pipeline:
```
Text1 (system) ──> LLM ──> Output
Text2 (prompt) ─┘
```

2. In Text1, type: `You are a helpful assistant`
3. In Text2, type: `Explain {{topic}} in simple terms`
4. Notice "topic" handle appears on Text2
5. Connect another Input to the "topic" handle
6. Submit pipeline

**Expected Result:**
- LLM node has 2 input handles (system, prompt)
- Text2 has 1 dynamic input handle (topic)
- Pipeline is a valid DAG

---

### Scenario 7: Auto-Resize Text Node
**Purpose**: Test that Text node resizes properly

**Steps:**
1. Add a Text node
2. Type a short text: `hi`
3. Note the size
4. Type a very long text:
```
This is a very long text that should cause the node to expand in width and height automatically as I type more and more content into this textarea field
```
5. Observe size changes

**Expected Result:**
- Node starts at minimum size (220px width)
- Expands as you type
- Height increases with line breaks
- Smooth transitions

---

### Scenario 8: Error Handling
**Purpose**: Test backend connection error handling

**Steps:**
1. Stop the backend server (Ctrl+C in backend terminal)
2. Create any pipeline
3. Click "Submit Pipeline"

**Expected Result:**
```
Error submitting pipeline: [error message]

Make sure the backend server is running on http://localhost:8000
```

---

### Scenario 9: Empty Pipeline
**Purpose**: Test edge case of empty pipeline

**Steps:**
1. Start with empty canvas (no nodes)
2. Click "Submit Pipeline"

**Expected Result:**
```
Number of Nodes: 0
Number of Edges: 0
Is Valid DAG: Yes ✓
```

---

### Scenario 10: Styling Showcase
**Purpose**: Demonstrate the professional styling

**Steps:**
1. Create multiple nodes of different types
2. Hover over draggable nodes in toolbar
3. Connect nodes and observe edge animations
4. Use the minimap to navigate
5. Use zoom controls
6. Hover over Submit button

**Expected Result:**
- Smooth hover effects on toolbar nodes
- Animated edges with arrows
- Color-coded minimap
- Professional color scheme throughout
- Responsive UI elements

---

## Performance Tests

### Test 1: Large Pipeline
Create 20+ nodes and connect them. Should remain responsive.

### Test 2: Rapid Variable Changes
Type quickly in Text node, changing variables. Handles should update smoothly.

### Test 3: Multiple Connections
Create a node with many incoming connections. Should handle well.

---

## Browser Compatibility
Test in:
- Chrome (recommended)
- Firefox
- Safari
- Edge

---

## Quick Checklist

Before demo, verify:
- [ ] Backend running on :8000
- [ ] Frontend running on :3000
- [ ] All 9 node types visible in toolbar
- [ ] Can drag and drop nodes
- [ ] Can create connections
- [ ] Text node variables work
- [ ] Submit button works
- [ ] Alert displays correctly
- [ ] No console errors

---

## Demo Script (5 minutes)

**Minute 1:** Introduction
- "This is a pipeline builder with 9 different node types"
- Show the toolbar, explain color coding

**Minute 2:** Node Abstraction
- "All nodes use a common BaseNode abstraction"
- Drag 2-3 different nodes
- "Each node is configured with a simple config object"

**Minute 3:** Text Node Feature
- Add Text node
- Type: "Process {{input}} with {{method}}"
- Show dynamic handles appearing
- "Variables are detected automatically and handles created"

**Minute 4:** Build Pipeline
- Create: Input → Text → LLM → Output
- Connect them
- "ReactFlow handles the graph visualization"

**Minute 5:** Backend Integration
- Click Submit
- Show alert with DAG analysis
- "Backend uses DFS to detect cycles"
- Create a cycle, submit again
- Show "not a DAG" result

---

## Troubleshooting

**No nodes appearing after drag:**
- Check browser console for errors
- Verify all node types imported in ui.js

**Submit button not working:**
- Check backend is running
- Check browser console network tab
- Verify CORS settings

**Styling looks wrong:**
- Clear browser cache
- Check index.css is loaded
- Verify no CSS conflicts

**Variables not detected:**
- Format must be: {{variableName}}
- Variable name must be valid JS identifier
- No spaces in variable names work best
