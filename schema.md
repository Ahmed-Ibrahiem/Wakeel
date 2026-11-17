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
  └── clients                             [x]
        └── cases                         [x]
              ├── hearings                [x]
              ├── deadlines               [x]
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
- **Deletes:** deleting a user cascades to everything they own. Between app tables there is no cascade (`NO ACTION`), so a client that still has cases cannot be deleted, and the same applies to a case with hearings or deadlines. Use `archived_at` instead.
- **Enums** for fixed sets of values. Adding a value is easy, removing or renaming one is a painful migration, so values are chosen carefully. Created so far: `case_type`, `case_status`, `hearing_type`, `hearing_status`, `deadline_status`.
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

Created by a `user.create` hook. `getUserSettings()` creates the row with defaults if it is missing, because the HTTP driver has no transactions and the hook could fail after the user was created. In TypeScript the field is `timeZone`.

The time zone is stored because "today", "tomorrow" and "1 day before 9 AM" only make sense in the lawyer's own time.

**Allowed values (enforced in the application, not by a database constraint):** the time zone must be one of the names in `TIME_ZONES` (`features/settings/schemas.ts`, Arab countries plus London, Paris, New York and UTC), because an invalid name makes `Intl` throw a `RangeError` on every page that formats a date. `reminder_days_before` is one of 0, 1, 2, 3, 7 and `reminder_hours_before` one of 0, 1, 2, 3, 6, 12, 24 (0 means no reminder of that kind). `getUserSettings()` throws if the row can neither be read nor created.

---

## 3. action_rate_limits [x]

| Column     | Type        | Notes                                                            |
| ---------- | ----------- | ---------------------------------------------------------------- |
| key        | text PK     | `rule:identity:window`, for example `signin-ip:41.2.3.4:5871234` |
| count      | int         | incremented with one atomic upsert                               |
| expires_at | timestamptz | indexed; old rows are cleaned up randomly                        |

---

## 4. clients [x]

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

**Calculated, not stored:** number of cases (a subquery in the list query, counting archived cases too), latest case, and client status (**active** when they have at least one open case, **inactive** otherwise). All three are built as subqueries in the clients list query (the latest case is the most recently updated one; active means at least one case that is not `closed` and not archived), always joined on `client_id` and `user_id`.

**Deleting:** only possible when the client has no cases (the database enforces it with a foreign key error, code `23503`, translated to a friendly message). Otherwise the client is archived.

---

## 5. cases [x]

| Column                 | Type              | Notes                                                                   |
| ---------------------- | ----------------- | ----------------------------------------------------------------------- |
| id                     | uuid PK           |                                                                         |
| user_id                | text FK → user.id | owner, cascade on user delete                                           |
| client_id              | uuid              | composite FK `(client_id, user_id)` → clients (`cases_client_owner_fk`) |
| case_number            | text              | required, for example `125/2024`, **not unique** (see notes)            |
| case_type              | enum              | `civil` \| `criminal` \| `commercial` \| `family` \| `labor` \| `other` |
| court_name             | text              | required                                                                |
| opposing_party         | text              | optional                                                                |
| status                 | enum              | `ongoing` \| `postponed` \| `closed`, default `ongoing`                 |
| judgment_date          | date              | optional                                                                |
| notes                  | text              | optional, general notes about the case                                  |
| archived_at            | timestamptz       | null while active                                                       |
| created_at, updated_at | timestamptz       | `updated_at` drives "recently updated cases"                            |

Constraints and indexes: `unique(id, user_id)` (named `cases_id_user_unique`), `(user_id, client_id)`, `(user_id, status)`, `(user_id, case_number)`, `(user_id, updated_at)`.

**Calculated, not stored:** next and last hearing, **urgent** (a hearing or deadline within 48 hours), and the warning "ongoing case with no upcoming hearing". The case list computes them in the same query with subqueries (earliest `scheduled` hearing, latest decided hearing, earliest `pending` deadline), and `features/cases/signals.ts` turns them into the urgent badge, the card footer and the warning. They use the existing indexes `(case_id, hearing_at)` and `(case_id)`.

**Deleting:** a case can be deleted only when it has no hearings or deadlines. The composite foreign keys from those tables have no cascade, so the database refuses (code `23503`) and the app shows a friendly message. Otherwise the case is archived.

**Notes**

- `case_number` is not unique: the same number can exist in two different courts, and an appeal can carry the same number as the original case. The form asks for confirmation on a duplicate number (an application-level check, not a database constraint, so it only warns).
- The old `won` / `lost` statuses are gone. A judgment is recorded with `judgment_date`, and appeal dates live in `deadlines`.
- `updated_at` must be touched whenever a hearing, deadline or note changes. This is done in application code, in the same batch as the change.
- Fee columns (`agreed_fee`, `currency`) arrive with v1.1.

---

## 6. hearings [x]

| Column                 | Type              | Notes                                         |
| ---------------------- | ----------------- | --------------------------------------------- |
| id                     | uuid PK           |                                               |
| user_id                | text FK → user.id | owner                                         |
| case_id                | uuid              | composite FK `(case_id, user_id)` → cases     |
| hearing_at             | timestamptz       | the exact moment of the session               |
| type                   | enum              | `pleading` \| `ruling` \| `other`, default `pleading` |
| status                 | enum              | `scheduled` \| `completed` \| `postponed`, default `scheduled` |
| location               | text              | only when different from the case's court     |
| outcome                | text              | the decision taken at the session             |
| notes                  | text              | what happened, what the judge said            |
| reminder_day_sent_at   | timestamptz       | null until the day-before reminder was sent   |
| reminder_hours_sent_at | timestamptz       | null until the hours-before reminder was sent |
| created_at, updated_at | timestamptz       |                                               |

Indexes: `hearings_user_hearing_at_idx` on `(user_id, hearing_at)` for the dashboard, reminders and conflict checks, and `hearings_case_hearing_at_idx` on `(case_id, hearing_at)` for a case's timeline. The composite FK is named `hearings_case_owner_fk`.

**Notes**

- The composite FK to `cases` has **no cascade** (default `NO ACTION`), so a case with hearings cannot be deleted. Verified: `deleteCase` is refused with `23503` once a case has a hearing.
- **Postponing** a hearing means: mark the old one `postponed` and create a new `scheduled` one. Recording the outcome and the next date happens in a single step in the UI, and in a single `db.batch` on the server (it also touches `cases.updated_at`). With no next date, the old hearing becomes `completed`.
- **Only a `scheduled` hearing can be edited.** A hearing that already has a decision can only be deleted.
- **Order rule** (application code): a `scheduled` hearing must be later than the latest `postponed` or `completed` hearing of the same case. It is checked on create, on update and when recording the next hearing, so the timeline cannot go backwards. Consequence: old history must be entered oldest first.
- When `hearing_at` changes, both `reminder_*_sent_at` columns are reset to null, otherwise a reminder already sent for the old date would block the new one. The reminder job fills them (see `PROJECT_CONTEXT.md`, Reminders behaviour).
- **Conflict check** (application code, not a database constraint): other `scheduled` hearings of the same lawyer within 90 minutes before or after the new `hearing_at` (`CONFLICT_WINDOW_MINUTES`). It is a confirmation, not a block, because two hearings can legitimately be close. Location-based checks ("same day but far apart") come later.
- **Time zone:** the form sends a date and a time as strings; the server turns them into one UTC instant using the lawyer's zone name from `user_settings` (`lib/zoned-time.ts`, DST-safe). A time skipped by a clock change is rejected.

---

## 7. deadlines [x]

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

Indexes: `deadlines_user_due_date_idx` on `(user_id, due_date)` and `deadlines_case_idx` on `(case_id)`. The composite FK is named `deadlines_case_owner_fk`.

The composite FK to `cases` has **no cascade**, same as hearings. Verified: a case with deadlines cannot be deleted.

"Overdue" is calculated: `pending` and `due_date` earlier than today in the lawyer's time zone (`todayIn(timeZone)`), never stored.

**Notes**

- Only a `pending` deadline can be edited. Marking it done sets `completed_at`; reopening clears it. Both only change the opposite state, so a double click does nothing.
- When `due_date` changes, `reminder_sent_at` is reset to null so the new date gets its own reminder.
- Every change touches `cases.updated_at` in the same `db.batch`.
- `due_date` is a `date` read as a string, so no time zone can shift it.

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
- **The flag is also the lock.** The job claims a reminder with one `UPDATE ... WHERE <flag> IS NULL RETURNING id`, so only one run can send it, and sets the flag back to null if the email fails. No extra table or column was needed.
- **Reminder times are computed, not stored:** whether something is due is derived from `hearing_at` / `due_date`, `user_settings` and the current time in the lawyer's zone.
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
- Hard delete of a client with cases (or a case with hearings/deadlines) is blocked, archiving was added.
- Hearings built as designed, plus the order rule, "edit only while scheduled" and a 90-minute conflict window.
- Deadlines built as designed, plus "edit only while pending" and reopening.
- Reminders built on the existing columns: no schema change.
- Client details page, "latest case" and active/inactive built as calculated values: no schema change.

## Open questions

- **Cases of an archived client:** should they stay in the cases list (current behaviour) or be hidden?
- **Payments:** is a partial payment of one instalment needed? Are court expenses tracked differently from fees?
- **What does "postponed" mean to lawyers** as a case status, given that hearings are postponed routinely? Ask them.
- **Case types:** is the list complete (administrative cases, for example)?
- **Teams and firms:** not in v1. Adding organizations later means a membership table and an `organization_id`. Because every row already has `user_id`, the migration stays possible.
- **Activity feed** ("a note was added", "a document was uploaded"): a `case_activity` table, later.
- **In-app notifications:** a `notifications` table, later.
- **Search at scale:** a trigram index (`pg_trgm`) if `ILIKE` searches get slow.
- **Account deletion and data export** for lawyers who leave.