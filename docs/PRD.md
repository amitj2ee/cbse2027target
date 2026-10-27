# BoardPrep 2027 — Product Requirements Document

**Version:** MVP v1 | **Updated:** 26 October 2026

## 1. Product overview
BoardPrep 2027 is a responsive web application for CBSE Class XII students preparing for the 2026–2027 board exams and selected engineering entrance exams. It centralizes trustworthy updates, question papers, exam information, and optional student personalization.

## 2. Goals
- Provide CBSE updates, sample papers, previous-year papers, marking schemes, and entrance exam information.
- Show sources, dates, verification states, and confirmed versus tentative deadlines.
- Allow public browsing without an account; sign-in enables saved resources, preferences, notifications, and a dashboard.
- Keep development costs at ₹0 where practical using local tools and MongoDB Atlas Free where available.
- Use a maintainable modular monolith.

## 3. Users
- **Guest:** Browse, search and filter public content.
- **Student:** Guest capabilities plus preferences, saved resources, dashboard and notifications.
- **Admin/editor:** Create, review, publish, unpublish and archive content; manage source checks.
- Enforce authorization in the API, not just in the UI.

## 4. MVP scope
- Subjects: English, Mathematics, Physics, Chemistry, Computer Science.
- Initial entrance exams: JEE Main and JEE Advanced.
- Content: CBSE announcements, verified relevant news, sample and previous-year papers, marking schemes, official notices, registration dates, exam dates and deadlines.
- Screens: Home, Updates, Question Papers, Paper Details, Exam Tracker, Exam Details, Search, Sign In, Register, Student Dashboard and Admin Review.
- Discovered/imported content must remain unpublished until reviewed.

## 5. Out of scope
Paid subscriptions, ads, payments, chat/community, coaching courses, AI-generated study answers, native apps, microservices, Kubernetes, paid ingestion APIs and paid hosting. Do not host copyrighted material unless permitted; prefer official links.

## 6. Functional requirements
- **FR-01:** Public content is available without authentication.
- **FR-02:** Search updates, papers, subjects, exams and events.
- **FR-03:** Updates show title, summary, source, publication date and review/verification state.
- **FR-04:** Filter papers by subject, year/session, paper type and availability.
- **FR-05:** Track application opening/closing, admit card, exam and result events; label confirmed, tentative or not announced.
- **FR-06:** Provide navigation for the five subjects.
- **FR-07:** Register, sign in/out and retrieve current user using server-managed sessions.
- **FR-08:** Store student subject/exam preferences and notification settings.
- **FR-09:** Show saved resources and relevant upcoming events on the dashboard.
- **FR-10:** Provide in-app notifications.
- **FR-11:** Admin can draft, review, publish, unpublish and archive content.
- **FR-12:** Record source URL, check time, result and errors.
- **FR-13:** Preserve source and review/publication timestamps.
- **FR-14:** Validate server-side; show loading, empty and error states.
- **FR-15:** Support mobile, tablet, desktop and keyboard accessibility.
- **FR-16:** Draft, rejected, archived and pending-review content must never leak through public APIs.

## 7. Trust workflow
Discover content → save as draft/pending review → admin checks source, date, relevance and rights → publish → public API serves it. Verification and publication are separate statuses. Use labels such as Official Source, Verified, Needs Review, Tentative, Confirmed and Not Announced only when accurate.

## 8. Non-functional requirements
- Hash passwords; secure session cookies; apply suitable CSRF protection, rate limits and admin authorization.
- Keep secrets in server `.env`; never expose Atlas credentials to the browser or commit `.env`.
- Paginate lists and index common filters.
- Use semantic HTML, keyboard navigation, visible focus and readable contrast.
- Separate routes, controllers, services, models and middleware.
- Check free-tier limits and terms before deployment.

## 9. Definition of Done
- Guests can open papers and official sources without signing in.
- Students can register, save preferences and access their dashboard.
- Admin publication workflow prevents unreviewed content from becoming public.
- Filters and validation are tested.
- Published content has traceable sources.
- Layout works at 320, 375, 768 and 1440 px without horizontal overflow.
- README covers setup, environment, seed data, tests and run commands.

## 10. Delivery sequence
1. Scaffold repo, configure environment, connect Atlas, add health endpoint.
2. Build models, seed subjects/exams and implement public APIs.
3. Connect homepage, updates, paper library and exam tracker.
4. Add auth, preferences, saved resources and dashboard.
5. Add admin review/publish and source checks.
6. Test security, responsiveness and accessibility; document setup.

## 11. Risks
- Outdated dates: show source/check date and require human review.
- Duplicates: canonical URLs and normalized titles.
- Copyright: link to official sources unless hosting is permitted.
- Secret leakage: ignore `.env` and rotate exposed credentials.
- Scope creep: limit MVP to five subjects, JEE Main/Advanced and core workflows.
