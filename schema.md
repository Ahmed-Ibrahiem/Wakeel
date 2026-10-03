# Database Schema — Lawyer Contract & Case Deadline Tracker

## Entities Overview

```
users (lawyers)
  └── clients
        └── cases
              ├── hearings
              ├── documents
              └── payments
```

Every table below belongs to one lawyer (`user_id`), so each lawyer only ever sees their own data (multi-tenancy).

---

## 1. users (lawyers — the app's account holders)

| Column                | Type      | Notes                             |
| --------------------- | --------- | --------------------------------- |
| id                    | PK        |                                   |
| name                  | text      |                                   |
| email                 | text      | unique, used for login            |
| password_hash         | text      | only if using email/password auth |
| reminder_days_before  | int       | default reminder setting, e.g. 1  |
| reminder_hours_before | int       | default reminder setting, e.g. 3  |
| created_at            | timestamp |                                   |
| updated_at            | timestamp |                                   |

---

## 2. clients

| Column             | Type          | Notes                         |
| ------------------ | ------------- | ----------------------------- |
| id                 | PK            |                               |
| user_id            | FK → users.id | which lawyer owns this client |
| full_name          | text          |                               |
| phone              | text          |                               |
| email              | text          | optional                      |
| address            | text          | optional                      |
| first_contact_date | date          |                               |
| created_at         | timestamp     |                               |
| updated_at         | timestamp     |                               |

**Relationship:** one lawyer → many clients.

---

## 3. cases

| Column         | Type            | Notes                                                          |
| -------------- | --------------- | -------------------------------------------------------------- |
| id             | PK              |                                                                |
| client_id      | FK → clients.id | which client this case belongs to                              |
| case_number    | text            |                                                                |
| case_type      | enum            | `civil` \| `criminal` \| `commercial` \| `other`               |
| court_name     | text            |                                                                |
| opposing_party | text            |                                                                |
| status         | enum            | `ongoing` \| `postponed` \| `closed` \| `won` \| `lost`        |
| notes          | text            | free-text notes, updated after sessions                        |
| created_at     | timestamp       |                                                                |
| updated_at     | timestamp       | drives the "recently updated cases" list on the dashboard home |

**Relationship:** one client → many cases.

---

## 4. hearings

| Column                     | Type          | Notes                                          |
| -------------------------- | ------------- | ---------------------------------------------- |
| id                         | PK            |                                                |
| case_id                    | FK → cases.id | which case this hearing belongs to             |
| hearing_datetime           | timestamp     | combined date + time, indexed                  |
| hearing_type               | enum          | `pleading` \| `ruling` \| `hearing` \| `other` |
| status                     | enum          | `scheduled` \| `postponed` \| `completed`      |
| notes                      | text          | what happened in this session                  |
| reminder_sent_day_before   | boolean       | prevents duplicate reminder sends              |
| reminder_sent_hours_before | boolean       | prevents duplicate reminder sends              |
| created_at                 | timestamp     |                                                |
| updated_at                 | timestamp     |                                                |

**Relationship:** one case → many hearings (a case can have several sessions over time).

**Special logic:** when a new hearing is saved, the app checks for other hearings close in time (for this lawyer, across all their cases) and warns about a possible scheduling conflict. This check happens in application code, not as a database constraint.

---

## 5. documents

| Column        | Type          | Notes                                       |
| ------------- | ------------- | ------------------------------------------- |
| id            | PK            |                                             |
| case_id       | FK → cases.id | which case this document belongs to         |
| file_url      | text          | link to the uploaded file (e.g. Cloudinary) |
| file_name     | text          | original file name                          |
| document_type | text          | contract / court paper / photo / other      |
| uploaded_at   | timestamp     |                                             |

**Relationship:** one case → many documents.

---

## 6. payments

| Column       | Type          | Notes                                     |
| ------------ | ------------- | ----------------------------------------- |
| id           | PK            |                                           |
| case_id      | FK → cases.id | which case this payment relates to        |
| amount       | decimal       |                                           |
| payment_type | text          | agreed fee / partial payment / expense    |
| status       | text          | paid / pending                            |
| paid_at      | timestamp     | nullable — empty until it's actually paid |
| created_at   | timestamp     |                                           |
| updated_at   | timestamp     |                                           |

**Relationship:** one case → many payments (deposit, milestone payments, etc.).

---

## Design notes

- Every child table (clients, cases, hearings, documents, payments) links back through its parent, and ultimately up to `users`, so data stays scoped per lawyer.
- No data is duplicated across tables (e.g. client name is never copied into `cases` or `payments` — it's always fetched through the relationship) — this keeps the schema normalized.
- `hearing_datetime` is a single combined field (not separate date/time columns) and is indexed, since it's queried often (conflict checks, reminders, calendar view).
- The two `reminder_sent_*` boolean flags exist purely to stop the daily cron job from sending the same reminder more than once — they're not about _when_ to remind, only _whether it already happened_.
- `updated_at` was added to every table (Drizzle can auto-update it on write). It's what powers the dashboard home's "recently updated cases" list specifically — without it there was no way to tell a recently-edited case from an old untouched one.
- `case_type`, `cases.status`, `hearing_type`, and `hearings.status` are now enums instead of free text — this matches the fixed set of real-world values each one has, and prevents typo'd/inconsistent values from ever reaching the database.

## Not yet decided / open questions

- Whether `payments` needs a separate `expenses` table instead of reusing `payment_type`, if court fees and lawyer fees need to be tracked very differently.
