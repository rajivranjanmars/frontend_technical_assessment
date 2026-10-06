# VectorShift Pipeline Builder

A visual pipeline editor with a React/React Flow frontend and a FastAPI backend. Users connect configurable nodes, submit a graph, and receive its node count, edge count, and directed-acyclic-graph validation.

## Usage

Install the frontend with `cd frontend && npm ci`, then run `npm start`. In a separate Python environment, install FastAPI, Uvicorn, and Pydantic and run `uvicorn main:app --reload` from `backend/`. See `PROJECT_README.md` and `ARCHITECTURE.md` for the node model and implementation.

## Author

[Rajiv Ranjan](https://rajivranjan.in)

## Frontend toolchain

The frontend uses Vite instead of the unmaintained Create React App toolchain. `npm start` keeps port 3000, `npm run build` still writes to `frontend/build`, and `npm test` runs Vitest. JSX source files use `.jsx` extensions.
