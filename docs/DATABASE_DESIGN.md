# BoardPrep 2027 — Database Design

**Database:** MongoDB Atlas Free (subject to current limits) | **ODM:** Mongoose

## 1. Approach
Use Atlas through Mongoose. Store `MONGODB_URI` only in the server `.env`. Use ObjectIds for IDs/references. Keep exam definitions separate from dated events and keep verification status separate from publication status.

## 2. Collections
| Collection | Purpose |
|---|---|
| `users` | Identity, role, preferences and account status |
| `subjects` | Five canonical subjects |
| `updates` | CBSE announcements and relevant news |
| `papers` | Sample papers, previous-year papers, marking schemes |
| `exams` | Exam definitions, initially JEE Main and JEE Advanced |
| `examEvents` | Dated events belonging to an exam |
| `sourceChecks` | Source-check history |
| `notifications` | In-app user notifications |
| `savedItems` | Persistent saved resources; required by saved-item API |

## 3. Field outlines

### `users`
`name`, normalized unique `email`, `passwordHash`, `role` (`student`/`admin`), `accountStatus`, `preferences` (`subjectIds[]`, `examIds[]`, `notificationSettings`), `lastLoginAt`, timestamps.

### `subjects`
Unique `slug`, `name`, `description`, `isActive`, `sortOrder`, timestamps. Seed: `english`, `mathematics`, `physics`, `chemistry`, `computer-science`.

### `updates`
`title`, `slug`, `summary`, `body`, `category`, `sourceType` (`official`/`news`/`other`), `sourceName`, `sourceUrl`, `canonicalUrl`, `sourcePublishedAt`, `checkedAt`, `verificationStatus` (`unverified`/`needs_review`/`verified`/`rejected`), `publicationStatus` (`draft`/`pending_review`/`published`/`archived`), `reviewedBy`, `reviewedAt`, `publishedAt`, `tags[]`, timestamps.

### `papers`
`title`, `subjectId`, `paperType` (`sample_paper`/`previous_year`/`marking_scheme`/`practice`/`other`), `academicYear`, `examYear`, `session`, `language`, `sourceName`, `sourceUrl`, optional permitted `fileUrl`, `fileType`, optional `fileSizeBytes`, verification/publication statuses, review metadata, timestamps.

### `exams`
Unique `slug`, `name`, `shortName`, `description`, `officialWebsite`, `conductingBody`, `isActive`, timestamps.

### `examEvents`
`examId`, `title`, `eventType` (`application_start`/`application_deadline`/`correction_window`/`admit_card`/`exam_date`/`result`/`counselling`/`other`), `dateStart`, optional `dateEnd`, `dateStatus` (`confirmed`/`tentative`/`not_announced`/`cancelled`), source fields, `checkedAt`, verification/publication statuses, review metadata, `notes`, timestamps.

### `sourceChecks`
`sourceUrl`, `canonicalUrl`, `sourceType`, `checkedAt`, `outcome` (`ok`/`changed`/`unavailable`/`error`/`needs_review`), optional `httpStatus` and `contentFingerprint`, `message`, related entity type/ID, timestamp.

### `notifications`
`userId`, `type`, `title`, `message`, related entity type/ID, nullable `readAt`, `createdAt`, optional `expiresAt`.

### `savedItems`
`userId`, `resourceType` (`paper`/`update`/`examEvent`), `resourceId`, `createdAt`. Add unique compound index on `userId + resourceType + resourceId`.

## 4. Relationships
- User preference subject IDs → `subjects`; exam IDs → `exams`.
- `papers.subjectId` → `subjects._id`.
- `examEvents.examId` → `exams._id`.
- Notifications and source checks can refer to related entities by type + ID; validate in application logic.
- `savedItems` refers to a user and a resource; verify the resource exists and is saveable.

## 5. Indexes
- `users`: unique normalized email.
- `subjects`: unique slug; `isActive + sortOrder`.
- `updates`: `publicationStatus + sourcePublishedAt` descending; `category + publicationStatus`; unique/partial canonical URL.
- `papers`: `publicationStatus + subjectId + paperType + academicYear`; `examYear`; canonical URL where applicable.
- `exams`: unique slug.
- `examEvents`: `examId + dateStart`; `publicationStatus + dateStatus + dateStart`.
- `sourceChecks`: `canonicalUrl + checkedAt` descending. Add TTL only with an explicit retention policy.
- `notifications`: `userId + createdAt` descending; `userId + readAt`.
- `savedItems`: unique `userId + resourceType + resourceId`; `userId + createdAt` descending.

## 6. Business rules
- Require titles, source identity/URL and appropriate review metadata before publishing.
- Allow only `http`/`https` source URLs; validate dates and ensure `dateEnd >= dateStart`.
- Only admins may publish, archive or mark content verified.
- Public APIs must filter out drafts, pending review, rejected and archived content.
- Never return `passwordHash`, session IDs or internal audit-only fields.
- Validate ObjectIds, bound pagination and prefer archival when history matters.
- Store dates as BSON Date in UTC; distinguish source publication date from event date.

## 7. Seed data and model files
Subjects: English, Mathematics, Physics, Chemistry, Computer Science. Exams: JEE Main and JEE Advanced. Demo data must be labelled demo/unverified and must not look like current official facts.

```text
server/src/models/User.js
server/src/models/Subject.js
server/src/models/Update.js
server/src/models/Paper.js
server/src/models/Exam.js
server/src/models/ExamEvent.js
server/src/models/SourceCheck.js
server/src/models/Notification.js
server/src/models/SavedItem.js
```

## 8. Decisions before production
Choose a production session store; define audit/notification retention; default to official source links; confirm Atlas tier/search capability before relying on full-text search.
