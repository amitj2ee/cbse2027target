# BoardPrep 2027 — System Design & Architecture

**Architecture:** MERN modular monolith | **Development:** Local Ubuntu + MongoDB Atlas

## 1. Architecture summary
- Frontend: React + Vite + Tailwind CSS.
- Backend: Node.js + Express REST API.
- Database: MongoDB Atlas via Mongoose.
- Authentication: server-managed sessions and role-based access control.
- Source monitoring: `node-cron` checks sources and creates review signals; it runs only while the server process is running.
- Local URLs: frontend `http://localhost:5173`; API `http://localhost:5000/api`; health endpoint `http://localhost:5000/api/health`.

## 2. Logical flow
```text
Browser → React → API client → Express routes
  → validation/auth/RBAC middleware
  → controllers → services → Mongoose models → MongoDB Atlas

Scheduled source check → allowed public source
  → sourceChecks record / review queue
  → admin verifies and publishes
  → public API serves published content only
```
Keep the MVP as a modular monolith; do not introduce microservices or Kubernetes.

## 3. Suggested repository structure
```text
boardprep-2027/
├── client/src/
│   ├── components/
│   ├── pages/
│   ├── features/{updates,papers,exams,auth,dashboard}/
│   ├── services/
│   ├── hooks/
│   └── utils/
├── server/src/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── jobs/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── docs/
├── tests/
├── .env.example
├── .gitignore
└── README.md
```

## 4. Frontend responsibilities
Render homepage, updates and details, paper library and details, exam tracker and details, search, auth, student dashboard/preferences and admin review. Use a centralized API client and consistent errors. Never expose Atlas URI or server secrets in frontend variables, including `VITE_` variables.

## 5. Backend responsibilities
- Expose REST endpoints under `/api`.
- Validate request parameters/bodies and enforce auth/RBAC.
- Filter public queries to prevent draft/pending/rejected/archived records leaking.
- Keep business logic in services and HTTP handling in controllers.
- Use centralized JSON error handling, pagination and whitelisted sorting/filtering.

## 6. Security
- Hash passwords with a standard library such as bcrypt or Argon2.
- Use server sessions; cookies should be `HttpOnly`, `SameSite`, and `Secure` in production over HTTPS.
- Protect state-changing routes against CSRF as appropriate; rate-limit auth; normalize email.
- Check admin role on every protected request.
- Restrict CORS to the frontend origin.
- Ignore `.env` in Git; commit only `.env.example`.
- Never log passwords, session secrets, database URIs or session tokens.

## 7. Source checks and review
- Start with an allowlist of official sources; respect terms, rate limits, applicable robots directives and copyright.
- Record source URL, `checkedAt`, outcome, status code when available, and change fingerprint/message.
- A changed/unavailable source should trigger review, not automatic overwrite or publication.
- Admin verifies source, date, relevance and rights before publication.

## 8. Environment and local setup
Example server `.env`:
```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=<your MongoDB Atlas connection string>
SESSION_SECRET=<long random secret>
CLIENT_ORIGIN=http://localhost:5173
```
Atlas is remote; local MongoDB on port 27017 is unnecessary unless you choose to install it. Document Atlas IP access, database user permissions, connection test, seed scripts and run commands.

## 9. Health, logs and tests
Add `/api/health` without exposing secrets. Log errors and source-check outcomes safely. Test public filtering, admin authorization, validation, pagination, session behavior and source review. Use service unit tests and API integration tests where practical.

## 10. Future deployment
Before public deployment, choose hosting, HTTPS, production session storage, backups, monitoring, rate limits and privacy/contact pages. Local `node-cron` is not an always-on production scheduler. Confirm free-tier limits and terms before deployment.
