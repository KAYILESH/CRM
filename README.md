# NexusFlow CRM — Modern SaaS Dashboard

A production-ready, responsive CRM dashboard built with React + Vite + TypeScript featuring a unique **Aurora Dark** design system, connected to an Express API backend.

---

## 🚀 Installation and Local Setup

Follow these commands to run both the frontend and backend services locally.

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm (v9 or higher)

### 1. Clone & Setup Backend
Open a terminal in the root folder and run:
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Build the TypeScript files
npm run build

# Start the server locally in development mode (watcher)
npm run dev
```
*The backend API will run on [http://localhost:3001](http://localhost:3001).*

### 2. Setup Frontend
Open a new terminal in the root folder and run:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*Open your browser and visit [http://localhost:5173](http://localhost:5173).*

### 🔑 Demo Credentials
* **Email**: `admin@nexusflow.io`
* **Password**: `password123`

---

## 🧠 Assumptions and Known Limitations

### Assumptions
* **Mock Authentication**: Authentication is simulated locally in the frontend state manager (`useAuthStore`) using a predefined super-admin user. No JWT or backend-level session state check is currently enforced.
* **CORS Settings**: The backend relies on the `FRONTEND_URL` environment variable for CORS policies. If undefined in local environments, it defaults to allowing requests from the standard Vite development port (`http://localhost:5173`).
* **Render Service Structure**: The monorepo layout assumes two distinct Render services: a Static Site for `frontend` and a Web Service for `backend`.

### Known Limitations
* **Ephemeral Backend State**: The backend server runs in-memory without persistent database storage (such as MongoDB or Postgres). Any data updates (e.g., changing order status, creating customers) are reset when the backend process restarts.
* **Build-time Env Variables**: React/Vite parses environment variables during the build stage. If the backend API URL changes, the frontend must be re-compiled and re-deployed.

---

## 🤖 AI Usage Disclosure

### 1. AI Tools Used
* **Antigravity Coding Assistant** powered by **Gemini 3.5 Flash** (Medium).

### 2. AI-Assisted Tasks
* **Render Deployment System**: Guided the creation of the root [render.yaml](render.yaml) configuration file to handle multi-service hosting.
* **API Configuration**: Refactored [frontend/src/api/index.ts](frontend/src/api/index.ts) to utilize environment-driven base URLs (`VITE_API_BASE_URL`) instead of hardcoded values.
* **Bug Fixes**: Troubleshooted and corrected input validations on the [Login.tsx](frontend/src/pages/Login.tsx) component by introducing `.trim()` validation on credentials.

### 3. Human-Written Code
* The overall React application logic, routing, component hierarchy (Aurora design system, charts, custom page layouts), state management integrations (Zustand + React Query), form schemas, styling systems, and the Express.js backend routing/endpoints.

### 4. Independent Technical Decision
* **Unified Build Environment Injection**: Configured Vite build processes to dynamically resolve the production backend URL using `import.meta.env` while keeping a local fallback. This enables the frontend static site to be easily portable across different hosting environments (e.g., Vercel, Netlify, Render) without rewriting source files.
