# Fullstack Log Sign

Full-stack login application with a React/Vite frontend and an Express/MongoDB backend.

## Project layout

- `backend/` — Express API, JWT authentication, and MongoDB integration.
- `frontend/` — React application built with Vite.

## Run locally

In the backend folder, install dependencies and start the API:

```powershell
cd backend
npm install
npm start
```

Configure `backend/.env` with `MONGO_URI` before starting the API. The server uses port `3003` by default.

In a second terminal, start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

The frontend connects to the API at `http://localhost:3003`.