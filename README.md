# Wakeel (وكيل) — Lawyer Case & Deadline Tracker

A SaaS-style case, client, and deadline management system built for lawyers running a small-to-medium practice. Built as a portfolio project to demonstrate a production-grade Next.js + relational database application, with a right-to-left Arabic interface.

> **Note:** "Wakeel" is a placeholder name — update this if a different name is chosen.

## The Problem

Lawyers often manage clients, case files, and — most critically — court hearing dates across scattered tools: WhatsApp, paper notes, memory. A single missed hearing or filing deadline can permanently harm a case. Wakeel centralizes this into one system with proactive email reminders and scheduling-conflict detection.

## Features

**Built (v1)**

- **Authentication** — email and password with verification and password reset, Google sign-in, sessions stored in the database
- **Client management** — contact info, search by name or phone, archive and restore, a client page with summary numbers and a filterable table of the client's cases, plus the latest case and an active / inactive status in the list, and a choice of how many rows to show per page
- **Case management** — case number, type, court, opposing party, status, search and filters, archive and restore, duplicate-number warning, and a details page with tabs (overview, hearings, deadlines, notes)
- **Hearings** — scheduled, postponed or completed; recording a decision and the next hearing in one step; a warning when two hearings are close to each other
- **Deadlines** — non-hearing dates (such as the last day to appeal) with overdue, upcoming and done groups
- **Case card signals** — urgent badge, next hearing and nearest deadline directly on the card
- **Dashboard** — today's and tomorrow's hearings, hearings that still have no decision, upcoming deadlines, caseload numbers and recently updated cases
- **Settings** — time zone, saved per lawyer, with a one-click return to the defaults

**Planned**

- **Email reminders** — built and tested (days and/or hours before a hearing, days before a deadline, in Modern Standard Arabic and in the lawyer's own time zone) but switched off until a verified sending domain exists
- **Billing (v1.1)** — agreed fee per case, payments with due dates, overdue and outstanding widgets
- **Documents and calendar (v1.2)** — file uploads in private storage opened through short-lived signed links, and a full calendar

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) and React 19 |
| Language | TypeScript |
| Database | PostgreSQL on Neon (`neon-http` driver) |
| ORM | Drizzle ORM v1 and `drizzle-kit` migrations |
| Auth | Better Auth |
| Styling and UI | Tailwind CSS v4, shadcn/ui (Radix), `lucide-react`, `sonner` |
| Forms and validation | React Hook Form and Zod 4 (one schema shared by the form and the server action) |
| Email | Resend |
| Scheduled reminders | An external cron calling a secret-protected endpoint (see Reminders) |
| Hosting | Vercel (a push to `main` deploys automatically) |

## Security

Every lawyer's data is private to them, and the code is written to keep it that way:

- **Tenant isolation:** `user_id` is on every table, child rows use composite foreign keys such as `(case_id, user_id)`, and the user id always comes from the session, never from the request.
- **Ownership in the query:** every read and write filters by the session's user id. A record that does not exist and a record that belongs to someone else give exactly the same "not found" answer.
- **Server-side validation:** every server action validates its input with Zod, rejects malformed ids before they reach the database, and returns friendly errors instead of raw database errors.
- **Rate limiting:** authentication and every write action are rate limited, with separate caps for emails.
- **Reminder endpoint:** protected by a secret compared in constant time, and it refuses everything when the secret is not configured.
- **Emails:** text written by the lawyer is HTML-escaped before it goes into an email.
- **Fixed lists:** the time zone and reminder options come from fixed lists, so a bad stored value can never break the pages that format dates.
- **Tested by attacking it:** each feature was tested with two accounts, other accounts' ids, hostile input, invalid states and request floods.

## Design Decisions

- **Time handling:** moments are stored as UTC `timestamptz`, calendar dates as plain dates, and each lawyer has an IANA time zone. Day boundaries and reminder times are computed in that zone, including the days when daylight saving time changes (a day can have 23 or 25 hours).
- **Nothing calculated is stored:** case count, latest case, next hearing, urgent, overdue, active / inactive are always derived from the data.
- **No silent cascades:** a client with cases, or a case with hearings or deadlines, cannot be deleted. Archiving is the safe path.
- **Reminders cannot repeat:** each reminder is claimed with one atomic database update before the email is sent, and released again if sending fails.
- **Serverless database constraints:** the Neon HTTP driver has no interactive transactions, so multi-step writes use one `db.batch` and queries prefer subqueries over several round trips.
- **Interface language:** the UI text is Modern Standard Arabic and the layout is right-to-left.

## Reminders (on hold)

The feature is built and tested, but it is switched off: without a verified sending domain, Resend only delivers to the account owner. The settings page hides the reminder card, and nothing calls the endpoint. The design below is what runs once a domain exists.

An external scheduler (for example cron-job.org every 5 minutes) calls `GET /api/cron/reminders` with the header `Authorization: Bearer <CRON_SECRET>`. The endpoint finds the reminders that are due, claims each one, and sends the email through Resend. Vercel's free-plan cron runs only once a day, which is too coarse for "a few hours before", so it is not used for this.

Sending to people other than the Resend account owner requires a verified sending domain.

## Project Status

v1 is built, tested and deployed on Vercel. Email reminders are on hold until a sending domain is available. Before real lawyers use it: a clean production database, the pre-launch checklist (security headers, secrets handling, privacy and terms pages), and then billing (v1.1).

## Documentation

- [`userStories.md`](./userStories.md) — full feature breakdown by actor
- [`schema.md`](./schema.md) — database schema and design rationale
- [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) — architecture, behaviour of each feature, conventions and gotchas

## Future Features (Post-MVP)

- Conflict-of-interest check when adding a new client
- Client call/interaction log
- Monthly reporting dashboard

## Getting Started

```bash
npm install
```

Create a `.env` file with these variables:

```
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
CRON_SECRET=
```

Without `RESEND_API_KEY`, emails are printed in the terminal during development.

```bash
npm run db:migrate
npm run dev
```

To try the reminders locally, call the endpoint yourself:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/reminders
```