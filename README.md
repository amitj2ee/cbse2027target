# BoardPrep 2027

BoardPrep 2027 is a student-focused project for CBSE Class 12 students preparing for the 2026–2027 board examinations and selected engineering entrance examinations. This repository currently contains the initial local-development scaffold and the product and technical design documents in `docs/`.

## Prerequisites

- Node.js 22.12.0 or newer (Node.js 22 LTS or newer is recommended)
- npm

Check your versions with `node --version` and `npm --version`.

## Project structure

- `client/` — React, Vite, and Tailwind CSS frontend
- `server/` — Express REST API scaffold
- `docs/` — product requirements and detailed system, database, and API designs
- `tests/` — reserved for future tests
- `.env.example` — server environment variable names; copy to `server/.env` when local configuration is needed

The application is a modular monolith. Feature behavior, authentication, database connections, and other product functionality are not implemented yet.

## Install dependencies

Run these commands from the repository root:

```bash
cd client
npm install
cd ../server
npm install
```

Copy `.env.example` to `server/.env` if you need to change local server settings. Keep real secrets in `server/.env`; never put them in client environment variables or commit them.

## Run locally

In one terminal, start the API:

```bash
cd server
npm run dev
```

In another terminal, start the frontend:

```bash
cd client
npm run dev
```

- Frontend: <http://localhost:5173>
- API health check: <http://localhost:5000/api/health>

The health route only confirms that the API process is running. It does not connect to MongoDB.

## Further documentation

- [Product requirements](docs/PRD.md)
- [System design](docs/SYSTEM_DESIGN.md)
- [Database design](docs/DATABASE_DESIGN.md)
- [REST API design](docs/API_DESIGN.md)

These documents describe the planned product. Resolve their listed open decisions before implementing the related features.
