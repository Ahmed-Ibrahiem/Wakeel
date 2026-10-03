# Wakeel (وكيل) — Lawyer Case & Deadline Tracker

A SaaS-style case, client, and deadline management system built for lawyers running a small-to-medium practice. Built as a portfolio project to demonstrate a production-grade Next.js + relational database application.

> **Note:** "Wakeel" is a placeholder name — update this if a different name is chosen.

## The Problem

Lawyers often manage clients, case files, and — most critically — court hearing dates across scattered tools: WhatsApp, paper notes, memory. A single missed hearing or filing deadline can permanently harm a case. Wakeel centralizes this into one system with proactive reminders and scheduling-conflict detection.

## Core Features (MVP)

- **Client management** — store and search client contact info, linked to their cases
- **Case management** — track case number, type, court, opposing party, and status
- **Hearings & deadlines** — schedule hearings with automatic reminders (day-before + hours-before), and get warned about scheduling conflicts across cases
- **Documents** — upload and organize case-related files
- **Billing** — track agreed fees and payment status per case

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | PostgreSQL (via Neon) |
| ORM | Drizzle |
| Auth | Auth.js (NextAuth) |
| Styling | Tailwind CSS v4 |
| Forms & Validation | React Hook Form + Zod |
| File uploads | Cloudinary |
| Email reminders | Resend |
| Scheduled jobs | Vercel Cron |
| Hosting | Vercel |

## Project Status

🚧 In planning/setup phase. User stories, database schema, and design system are finalized; implementation has not started yet.

## Documentation

- [`userStories.md`](./userStories.md) — full feature breakdown by actor
- [`schema.md`](./schema.md) — database schema and design rationale

## Future Features (Post-MVP)

- Conflict-of-interest check when adding a new client
- Client call/interaction log
- Monthly reporting dashboard

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, AUTH_SECRET, etc.
npm run db:migrate
npm run dev
```