# Database Schema — Wakeel (Lawyer Case & Deadline Tracker)

PostgreSQL on Neon, accessed with Drizzle ORM. Schema files live in `db/schema/`, migrations in `drizzle/`.

**Status legend**

- [x] Implemented and migrated
- [ ] Next: being built now
- [ ] Draft: designed, not created yet, may still change
- [ ] Planned: rough design only (v1.1 / v1.2)

---

## Entities Overview

```
user (Better Auth)                        [x]
  ├── session, account, verification      [x]  managed by Better Auth
  ├── user_settings                       [x]
  └── clients                             [ ]
        └── cases                         [ ]
              ├── hearings                [ ]
              ├── deadlines               [ ]
              ├── payments                [ ]  v1.1
              └── documents               [ ]  v1.2

Infrastructure
  rate_limit            [x]  Better Auth's rate limiter (HTTP endpoints)
  action_rate_limits    [x]  our own limiter (server actions, outgoing email)
```

Every app table (clients, cases, hearings, deadlines, payments, documents) carries a `user_id`, so each lawyer only ever sees their own data.

---

## Conventions

- **IDs:** app tables use `uuid` (`gen_random_uuid()`). Better Auth tables, and every `user_id` column, use `text` to match Better Auth's ids.
- **Timestamps:** `timestamptz`, stored in UTC. Every app table has `created_at` and `updated_at`.
- **Calendar dates** (no time of day) use `date` and are read as strings (`"2026-11-05"`), so they never shift a day because of a time zone.
- **Naming:** `snake_case` in the database, `camelCase` in TypeScript.
- **Ownership is enforced twice.** Every app table has `user_id`, and a child table references its parent with a composite foreign key `(parent_id, user_id)`. A case can therefore never point at another lawyer's client, even if the application code has a bug. Queries must still filter by the `user_id` of the current session.
- **Deletes:** deleting a user cascades to everything they own. Between app tables there is no cascade (`NO ACTION`), so a client that still has cases cannot be deleted. Use `archived_at` instead.
- **Enums** for fixed sets of values. Adding a value is easy, removing or renaming one is a painful migration, so values are chosen carefully.
- **Nothing that can be calculated is stored** (see the list at the end).

---

## 1. Better Auth tables [x]

Generated with `npx auth@latest generate`. Never edit `auth-schema.ts` by hand: it is rewritten every time the CLI runs. (The CLI cannot load files that import `server-only`, so comment that import out temporarily when running it.)

| Table          | Purpose                                                                       |
| -------------- | ----------------------------------------------------------------------------- |
| `user`         | who the person is                                                             |
| `session`      | one row per logged-in device, with an expiry                                  |
| `account`      | how the person signs in (password hash for `credential`, Google for `google`) |
| `verification` | tokens for password reset                                                     |
| `rate_limit`   | counters for Better Auth's built-in rate limiter                              |

Extra column on `user`:

| Column | Type | Notes                                                                                                                   |
| ------ | ---- | ----------------------------------------------------------------------------------------------------------------------- |
| phone  | text | additional field, E.164 (`+201001234567`), optional because Google sign-up does not provide it; collected in onboarding |

The password hash lives in `account.password`, never in `user`.

---

## 2. user_settings [x]

| Column                | Type                  | Notes                                     |
| --------------------- | --------------------- | ----------------------------------------- |
| user_id               | text PK, FK → user.id | one row per lawyer, deleted with the user |
| reminder_days_before  | int                   | default 1                                 |
| reminder_hours_before | int                   | default 3                                 |
| timezone              | text                  | IANA name, default `Africa/Cairo`         |
| updated_at            | timestamptz           |                                           |

Created by a `user.create` hook. `getUserSettings()` creates the row with defaults if it is missing, because the HTTP driver has no transactions and the hook could fail after the user was created.

The time zone is stored because "today", "tomorrow" and "1 day before 9 AM" only make sense in the lawyer's own time.

---

## 3. action_rate_limits [x]

| Column     | Type        | Notes                                                            |
| ---------- | ----------- | ---------------------------------------------------------------- |
| key        | text PK     | `rule:identity:window`, for example `signin-ip:41.2.3.4:5871234` |
| count      | int         | incremented with one atomic upsert                               |
| expires_at | timestamptz | indexed; old rows are cleaned up randomly                        |

---

## 4. clients

| Column                 | Type              | Notes                                                     |
| ---------------------- | ----------------- | --------------------------------------------------------- |
| id                     | uuid PK           |                                                           |
| user_id                | text FK → user.id | owner, cascade on user delete                             |
| full_name              | text              | required                                                  |
| phone                  | text              | E.164, optional                                           |
| email                  | text              | optional                                                  |
| address                | text              | optional                                                  |
| first_contact_date     | date              | defaults to today; the app sends the lawyer's own "today" |
| archived_at            | timestamptz       | null while active                                         |
| created_at, updated_at | timestamptz       |                                                           |

Constraints and indexes: `unique(id, user_id)` (needed by the composite foreign keys in child tables), index `(user_id, full_name)`, index `(user_id, archived_at)`.

**Calculated, not stored:** number of cases, latest case, and client status (**active** when they have at least one open case, **inactive** otherwise).

**Deleting:** only possible when the client has no cases (the database enforces it). Otherwise the client is archived.

---

## 5. cases

| Column                 | Type              | Notes                                                                   |
| ---------------------- | ----------------- | ----------------------------------------------------------------------- |
| id                     | uuid PK           |                                                                         |
| user_id                | text FK → user.id | owner                                                                   |
| client_id              | uuid              | composite FK `(client_id, user_id)` → clients                           |
| case_number            | text              | for example `125/2024`, **not unique** (see notes)                      |
| case_type              | enum              | `civil` \| `criminal` \| `commercial` \| `family` \| `labor` \| `other` |
| court_name             | text              |                                                                         |
| opposing_party         | text              | optional                                                                |
| status                 | enum              | `ongoing` \| `postponed` \| `closed`, default `ongoing`                 |
| judgment_date          | date              | optional                                                                |
| notes                  | text              | general notes about the case                                            |
| archived_at            | timestamptz       |                                                                         |
| created_at, updated_at | timestamptz       | `updated_at` drives "recently updated cases"                            |

Constraints and indexes: `unique(id, user_id)`, `(user_id, client_id)`, `(user_id, status)`, `(user_id, case_number)`, `(user_id, updated_at)`.

**Calculated, not stored:** next and last hearing, **urgent** (a hearing or deadline within 48 hours), and the warning "ongoing case with no upcoming hearing".

**Notes**

- `case_number` is not unique: the same number can exist in two different courts, and an appeal can carry the same number as the original case. The form warns about duplicates instead of blocking them.
- The old `won` / `lost` statuses are gone. A judgment is recorded with `judgment_date`, and appeal dates live in `deadlines`.
- `updated_at` must be touched whenever a hearing, deadline or note changes. This is done in application code, in the same batch as the change.
- Fee columns (`agreed_fee`, `currency`) arrive with v1.1.

---

## 6. hearings

| Column                 | Type              | Notes                                         |
| ---------------------- | ----------------- | --------------------------------------------- |
| id                     | uuid PK           |                                               |
| user_id                | text FK → user.id | owner                                         |
| case_id                | uuid              | composite FK `(case_id, user_id)` → cases     |
| hearing_at             | timestamptz       | the exact moment of the session               |
| type                   | enum              | `pleading` \| `ruling` \| `other`             |
| status                 | enum              | `scheduled` \| `completed` \| `postponed`     |
| location               | text              | only when different from the case's court     |
| outcome                | text              | the decision taken at the session             |
| notes                  | text              | what happened, what the judge said            |
| reminder_day_sent_at   | timestamptz       | null until the day-before reminder was sent   |
| reminder_hours_sent_at | timestamptz       | null until the hours-before reminder was sent |
| created_at, updated_at | timestamptz       |                                               |

Indexes: `(user_id, hearing_at)` for the dashboard, reminders and conflict checks, and `(case_id, hearing_at)` for a case's timeline.

**Notes**

- **Postponing** a hearing means: mark the old one `postponed` and create a new `scheduled` one. Recording the outcome and the next date happens in a single step in the UI.
- When `hearing_at` changes, both `reminder_*_sent_at` columns are reset to null, otherwise a reminder already sent for the old date would block the new one.
- **Conflict check** (application code, not a database constraint): other `scheduled` hearings of the same lawyer within a time window around the new `hearing_at`. Location-based checks ("same day but far apart") come later.

---

## 7. deadlines

Non-hearing dates, such as the last day to file an appeal or a defense memo.

| Column                 | Type              | Notes                                     |
| ---------------------- | ----------------- | ----------------------------------------- |
| id                     | uuid PK           |                                           |
| user_id                | text FK → user.id | owner                                     |
| case_id                | uuid              | composite FK `(case_id, user_id)` → cases |
| title                  | text              | for example "Last day to appeal"          |
| due_date               | date              | a calendar day, not a moment              |
| status                 | enum              | `pending` \| `done`                       |
| completed_at           | timestamptz       | set when marked done                      |
| notes                  | text              | optional                                  |
| reminder_sent_at       | timestamptz       | null until the reminder was sent          |
| created_at, updated_at | timestamptz       |                                           |

Indexes: `(user_id, due_date)` and `(case_id)`.

"Overdue" is calculated: `pending` and `due_date` earlier than today in the lawyer's time zone.

---

## 8. payments v1.1 (rough design)

To be confirmed with lawyers before building.

- `cases.agreed_fee numeric(12,2)` and `cases.currency` hold the agreed fee.
- `payments` holds one row per instalment or expense:

| Column   | Type              | Notes                                     |
| -------- | ----------------- | ----------------------------------------- |
| id       | uuid PK           |                                           |
| user_id  | text FK → user.id | owner                                     |
| case_id  | uuid              | composite FK `(case_id, user_id)` → cases |
| kind     | enum              | `fee` \| `expense`                        |
| amount   | numeric(12,2)     | never a float                             |
| due_date | date              | optional                                  |
| paid_at  | timestamptz       | null until paid                           |
| notes    | text              | optional                                  |

Calculated: **paid** when `paid_at` is set; **overdue** when unpaid and `due_date` is in the past; **outstanding** is the sum of unpaid rows.

---

## 9. documents v1.2 (rough design)

| Column        | Type              | Notes                                                       |
| ------------- | ----------------- | ----------------------------------------------------------- |
| id            | uuid PK           |                                                             |
| user_id       | text FK → user.id | owner                                                       |
| case_id       | uuid              | composite FK `(case_id, user_id)` → cases                   |
| storage_key   | text              | the object's key in **private** storage, never a public URL |
| file_name     | text              | original name                                               |
| mime_type     | text              | checked against an allow-list                               |
| size_bytes    | bigint            | limited                                                     |
| document_type | enum              | `contract` \| `court_paper` \| `photo` \| `other`           |
| uploaded_at   | timestamptz       |                                                             |

Files stay in private storage and are opened through short-lived signed links, generated by the server only after checking that the document belongs to the lawyer asking.

---

## Design notes

- **`user_id` on every app table, on purpose.** The first draft relied on reaching the owner through the parent tables. Repeating `user_id` makes every query simple and safe, and the composite foreign keys guarantee the copy can never disagree with the parent.
- **`hearing_at` is one `timestamptz` column** (not separate date and time columns), indexed together with `user_id`, because conflict checks, reminders and the calendar all query by time.
- **Reminder flags are timestamps, not booleans.** They exist only to stop the reminder job from sending twice, and a timestamp can be reset when the date changes.
- **`updated_at` on every table** is what lets the dashboard show recently updated cases.
- **Enums instead of free text** for case type, case status, hearing type, hearing status and deadline status, so typos can never reach the database.
- **No duplicated data:** a client's name is never copied into `cases`, it is always read through the relationship.
- **Calculated values are never stored:** case count, last case, next hearing, urgent, active/inactive, paid, overdue and outstanding.

## Changes from the first draft

- `password_hash` removed from the user table. Passwords live in `account`.
- Reminder settings moved from `user` to `user_settings`, together with `timezone`.
- `user_id` added to every app table, plus composite foreign keys.
- `deadlines` table added (user story 6).
- `won` / `lost` removed from case status, `judgment_date` added.
- `family` and `labor` case types added.
- All times are `timestamptz`, ids are `uuid`.
- Reminder booleans became timestamps.
- Documents use `storage_key` in private storage instead of a public `file_url`.
- Payments redefined with due dates, and the agreed fee moved onto the case.
- Hard delete of a client with cases is blocked, archiving was added.

## Open questions

- **Payments:** is a partial payment of one instalment needed? Are court expenses tracked differently from fees?
- **What does "postponed" mean to lawyers** as a case status, given that hearings are postponed routinely? Ask them.
- **Case types:** is the list complete (administrative cases, for example)?
- **Teams and firms:** not in v1. Adding organizations later means a membership table and an `organization_id`. Because every row already has `user_id`, the migration stays possible.
- **Activity feed** ("a note was added", "a document was uploaded"): a `case_activity` table, later.
- **In-app notifications:** a `notifications` table, later.
- **Search at scale:** a trigram index (`pg_trgm`) if `ILIKE` searches get slow.
- **Account deletion and data export** for lawyers who leave.
