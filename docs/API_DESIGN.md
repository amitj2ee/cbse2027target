# BoardPrep 2027 — REST API Design

**Backend:** Express + MongoDB Atlas | **Local base URL:** `http://localhost:5000/api`

## 1. Conventions
- JSON request/response bodies; link or redirect to permitted official files rather than uploading by default.
- Use plural resource names, stable IDs, server-side validation and consistent status codes.
- Lists support `page`, bounded `limit` (e.g. max 100), filters and sorting.
- Public endpoints return published content only; admin endpoints can return review metadata.
- Never expose `passwordHash`, session secrets or private admin-only fields.

Suggested list response:
```json
{ "data": [], "meta": { "page": 1, "limit": 20, "total": 0 } }
```
Suggested error:
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid request" } }
```

## 2. Public endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` (mounted as `/api/health`) | Health status |
| GET | `/subjects` | Active subjects |
| GET | `/updates?page=&limit=&category=&sourceType=&q=` | Published updates |
| GET | `/updates/:idOrSlug` | Published update detail |
| GET | `/papers?page=&limit=&subjectId=&paperType=&academicYear=&examYear=&q=` | Published papers |
| GET | `/papers/:id` | Published paper detail |
| GET | `/exams` | Active exams |
| GET | `/exams/:examId/events?from=&to=&eventType=` | Published events for one exam |
| GET | `/exam-events?examId=&from=&to=&dateStatus=` | Cross-exam tracker list |
| GET | `/exam-events/:id` | Published event detail |
| GET | `/search?q=&type=&page=&limit=` | Search public content; implement after core routes |

## 3. Authentication
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Create student account |
| POST | `/auth/login` | Verify credentials and create session |
| POST | `/auth/logout` | Destroy session |
| GET | `/auth/me` | Current user or `401` |

Normalize email, hash passwords, use generic login errors, rate-limit auth routes and implement an appropriate session/CSRF strategy.

## 4. Student endpoints (authenticated)
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/student/preferences` | Read preferences |
| PUT | `/student/preferences` | Update subject/exam IDs and notification settings |
| GET | `/student/dashboard` | Saved resources, upcoming events and relevant updates |
| GET | `/student/saved` | List saved resources |
| POST | `/student/saved` | Save using `resourceType` + `resourceId` |
| DELETE | `/student/saved/:savedId` | Remove saved resource |
| GET | `/student/notifications` | List notifications |
| PATCH | `/student/notifications/:id/read` | Mark one read |
| PATCH | `/student/notifications/read-all` | Mark all read |

**Database requirement:** create the `savedItems` collection before implementing saved-resource endpoints.

## 5. Admin endpoints (admin role required)
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/updates?status=&page=&limit=` | Updates for review |
| POST | `/admin/updates` | Create update draft |
| PATCH | `/admin/updates/:id` | Edit update |
| POST | `/admin/updates/:id/publish` | Publish after review |
| POST | `/admin/updates/:id/unpublish` | Remove from public view |
| GET | `/admin/papers?status=&page=&limit=` | Papers for review |
| POST | `/admin/papers` | Create paper draft |
| PATCH | `/admin/papers/:id` | Edit paper |
| POST | `/admin/papers/:id/publish` | Publish paper |
| GET | `/admin/exam-events?status=&page=&limit=` | Events for review |
| POST | `/admin/exam-events` | Create event draft |
| PATCH | `/admin/exam-events/:id` | Edit event |
| POST | `/admin/exam-events/:id/publish` | Publish event |
| GET | `/admin/source-checks?outcome=&page=&limit=` | Source-check history |
| POST | `/admin/source-checks/run` | Trigger a restricted/rate-limited check |

Every admin endpoint must verify the server-side role. Hiding a button in React is not authorization.

## 6. Validation and status codes
- `400` malformed IDs or invalid requests; `401` unauthenticated; `403` unauthorized role; `404` missing/unavailable public record; `409` unique conflict; `422` validation error if adopted consistently; `429` rate limited; `500` unexpected error.
- Never return draft/pending-review content through public detail endpoints, even if the caller knows the ID.
- Whitelist filters/sort fields; cap query lengths and page sizes.
- Publishing sets `reviewedBy`, `reviewedAt`, `publishedAt` and checks source/verification rules.

## 7. Suggested API files
```text
server/src/routes/
  subjectRoutes.js
  updateRoutes.js
  paperRoutes.js
  examRoutes.js
  examEventRoutes.js
  searchRoutes.js
  authRoutes.js
  studentRoutes.js
  adminRoutes.js
server/src/controllers/
server/src/services/
server/src/middleware/
server/src/models/
```

## 8. Implementation order
1. `/api/health` and database connection.
2. Public subjects, updates, papers, exams and event list/detail endpoints.
3. Seed subjects/exams and clearly labelled demo records.
4. Connect public pages to APIs.
5. Implement auth and authorization middleware.
6. Implement admin draft/review/publish workflow.
7. Add student preferences, saved resources, dashboard and notifications.
8. Add search, source checks, tests and API documentation.

## 9. Decisions to settle
Choose one canonical cross-exam event route (`/exam-events` or nested exam events). Add `savedItems` before implementing saved APIs. Define exact request schemas, pagination shape, session/CSRF implementation and error codes before frontend integration. File uploads are out of scope initially.
