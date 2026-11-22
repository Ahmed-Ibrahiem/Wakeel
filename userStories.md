# User Stories - Wakeel (Lawyer Case & Deadline Tracker)

Check each story off once it's fully built and working.

**Release tags:** `v1` = first version lawyers will try · `v1.1` = billing · `v1.2` = documents and full calendar · `later` = after feedback.

---

## 1. Authentication

- [x] **As a** lawyer, **I want to** create an account with my email or my Google account, **so that** I can start using the system without friction. `v1`
- [x] **As a** lawyer, **I want to** confirm my email address, **so that** nobody can open an account in my name. `v1`
- [x] **As a** lawyer, **I want to** log in to access my data, **so that** my account stays protected and private. `v1`
- [x] **As a** lawyer, **I want to** reset my password if I forget it, **so that** I'm not permanently locked out of my own data. `v1`
- [x] **As a** lawyer, **I want to** log out safely, **so that** my data stays protected if I'm using a shared or public device. `v1`
- [x] **As a** lawyer who signed up with Google, **I want to** finish my profile (phone number, terms), **so that** my account has the same details as everyone else's. `v1`

## 2. Landing Page

- [x] **As a** visitor, **I want to** see a simple landing page that explains what the system is and what it does, **so that** I understand it before I sign up. `v1`

## 3. Dashboard Home

- [x] **As a** lawyer, **I want to** see today's and tomorrow's hearings right when I log in, **so that** I know what needs my attention without searching for it. `v1` (with a warning for hearings close to each other, and a separate box for past hearings that still have no recorded decision)
- [x] **As a** lawyer, **I want to** see upcoming deadlines (like appeal filing dates) highlighted clearly in their own section, **so that** nothing urgent slips past me. `v1` (overdue ones first, in red)
- [x] **As a** lawyer, **I want to** see a quick overview of my caseload (ongoing cases, hearings this week), **so that** I know how busy I am without opening the cases page. `v1` ("this week" means the next 7 days)
- [x] **As a** lawyer, **I want to** see my most recently updated cases, **so that** I can quickly get back to what I was working on last. `v1`
- [x] **As a** lawyer, **I want to** see a clear message when there's nothing pending, and sensible loading and error states, **so that** I know the dashboard isn't just empty or broken. `v1`
- [ ] **As a** lawyer, **I want to** see which clients have overdue payments and how much is outstanding, **so that** I remember to follow up with them. `v1.1`

## 4. Client Management

- [x] **As a** lawyer, **I want to** view a list of all my clients, **so that** I can quickly find and manage their information. `v1`
- [x] **As a** lawyer, **I want to** search clients by name or phone number, **so that** I can find them fast during a busy day. `v1`
- [x] **As a** lawyer, **I want to** store basic contact info for each client (phone, email, address), **so that** I can reach them when needed. `v1`
- [x] **As a** lawyer, **I want to** see the date I first started working with a client, **so that** I have a history of our relationship. `v1`
- [x] **As a** lawyer, **I want to** see how many cases each client has in the list, **so that** I get the picture without opening each client. `v1`
- [x] **As a** lawyer, **I want to** see each client's latest case in the list, **so that** I know what I last handled for them. `v1` (the most recently updated case; the list also shows active / inactive)
- [x] **As a** lawyer, **I want to** open a client and see all their cases in one place, **so that** I see everything I'm handling for them. `v1` (the client page shows the contact info, four numbers (total, ongoing, active or not, latest case) and a table of their cases that can be filtered by status and searched by case number; archived ones last)
- [x] **As a** lawyer, **I want to** edit a client's details, **so that** the information stays correct. `v1`
- [x] **As a** lawyer, **I want to** archive a client (and delete one only if they have no cases), **so that** I never lose case history by accident. `v1`

> A client is shown as **active** when they have at least one open case (not closed and not archived), and **inactive** otherwise. This is calculated, never typed in. It appears in the clients list and on the client page.

## 5. Case Management

- [x] **As a** lawyer, **I want to** create a case with a case number, type (civil, criminal, commercial, family, labor, other), court, and opposing party, **so that** I have all the key identifying details in one place. `v1`
- [x] **As a** lawyer, **I want to** set and update a case's status (ongoing, postponed, closed) and record the judgment date when there is one, **so that** I know where each case stands at a glance. `v1`
- [x] **As a** lawyer, **I want to** browse all my cases, filter them by status, and search by case number or client name, **so that** I can find a case quickly. `v1`
- [x] **As a** lawyer, **I want to** add free-text notes to a case after each session, **so that** I remember what happened and what the judge said. `v1` (a general notes field on the case, plus the decision and notes on each hearing)
- [x] **As a** lawyer, **I want to** open a case and see its hearings, deadlines and notes together, **so that** I have the full picture on one screen. `v1` (a summary strip on top and four tabs: overview, hearings, deadlines, notes; the overview shows the basics, the last decided hearings, the next upcoming items and the client)
- [x] **As a** lawyer, **I want to** see a case marked **urgent** when it has a hearing or deadline within 48 hours, **so that** I notice it without checking dates. `v1`
- [x] **As a** lawyer, **I want to** be warned when an ongoing case has no upcoming hearing, **so that** I don't forget to schedule the next session. `v1`
- [x] **As a** lawyer who opens "new case" before adding any client, **I want to** be told to add a client first, and to add one from the case form and come back with that client already chosen, **so that** I am never stuck on an empty picker. `v1` (with no clients the page shows a message and an "add client" button instead of the form; the case form also has an "add a new client" link; after saving the client the lawyer returns to the case form with the client selected)
- [x] **As a** lawyer, **I want to** edit, archive or delete a case (delete only when it has no hearings or deadlines), **so that** my list stays accurate. `v1`

> "Urgent" is calculated from upcoming dates. It is not a status and not a field the lawyer fills in. A case is urgent when its earliest scheduled hearing is within 48 hours **or already past without a decision**, or when a pending deadline is due within 2 days **or already overdue**. Closed and archived cases are never urgent.
>
> The case card shows the next hearing (amber "hearing without a decision" if its time has passed), the nearest pending deadline (red if overdue), and an amber "no upcoming hearing" for an ongoing case with no scheduled hearing.

## 6. Hearings & Deadlines (Core Feature)

- [x] **As a** lawyer, **I want to** set a hearing date for a case, **so that** it appears on my dashboard. `v1` (the hearing is saved and shown in the case; the dashboard itself comes later)
- [x] **As a** lawyer, **I want to** record a session's decision and set the next hearing date in one step, **so that** the daily routine after court takes seconds. `v1`
- [ ] **As a** lawyer, **I want to** get an email reminder before a hearing (for example 1 day before and a few hours before), **so that** I never miss a court session. `later` (the code is built and tested but switched off: it needs a verified sending domain, and there is no budget for a domain yet)
- [x] **As a** lawyer, **I want to** get warned if two hearings are scheduled too close together, **so that** I don't accidentally double-book myself. `v1`
- [x] **As a** lawyer, **I want to** track non-hearing deadlines too (last date to file an appeal or a defense memo), **so that** I don't lose a case permanently over a missed paperwork deadline. `v1` (deadlines are built: add, edit, delete, overdue / upcoming / done groups; the reminder email for deadlines is built but switched off together with the hearing reminders)
- [x] **As a** lawyer, **I want to** mark a deadline as done, **so that** it stops appearing as pending. `v1` (and reopen it if it was a mistake)
- [ ] **As a** lawyer, **I want to** see all my upcoming dates in a calendar view (monthly/weekly), **so that** I get a full picture of my schedule. `v1.2`

> v1 conflict check: another scheduled hearing within 90 minutes of the new one. It asks for confirmation, it never blocks. Location-based checks ("same day but far apart") come later.
>
> A deadline is **overdue** when it is pending and its date is earlier than today in the lawyer's time zone (calculated, never stored). It can be edited only while pending; a done deadline must be reopened first.
>
> A hearing can be edited only while it is `scheduled`. A new hearing must be later than the last one that already has a decision, so the timeline never goes backwards.

## 7. Documents

- [ ] **As a** lawyer, **I want to** upload documents to a case (contracts, official papers, photos), **so that** everything related to the case is stored in one place. `v1.2`
- [ ] **As a** lawyer, **I want to** organize documents by type or date, **so that** I can find a specific document quickly later. `v1.2`
- [ ] **As a** lawyer, **I want to** know my documents are private and only reachable through short-lived links, **so that** client files can't leak. `v1.2`

## 8. Billing & Fees

- [ ] **As a** lawyer, **I want to** record the agreed fee for each case, **so that** I know how much I'm owed. `v1.1`
- [ ] **As a** lawyer, **I want to** record payments and their due dates (including instalments), **so that** I can tell what is overdue. `v1.1`
- [ ] **As a** lawyer, **I want to** see what has actually been paid vs what's still outstanding, per client and per case, **so that** I know who still owes me money. `v1.1`
- [ ] **As a** lawyer, **I want to** generate a simple invoice I can print or send to the client, **so that** I can request payment professionally. `later`

## 9. Search & Reports

- [x] **As a** lawyer, **I want to** search within each list (clients, cases), **so that** I can find information fast. `v1`
- [ ] **As a** lawyer, **I want to** search everything from one place (name, case number, date), **so that** I find information fast before a session. `later`
- [ ] **As a** lawyer, **I want to** see a monthly report (new cases, closed cases, still-open cases), **so that** I can track my workload and progress over time. `later`

## 10. Settings

- [ ] **As a** lawyer, **I want to** set how many days/hours before a hearing I get reminded, **so that** the reminders match how far ahead I like to prepare. `later` (built, but the card is hidden in the settings page until reminders can be sent)
- [x] **As a** lawyer, **I want to** set my time zone, **so that** "today" and reminder times are correct for me. `v1` (changing it only changes how dates are shown, saved hearings keep their exact moment)
- [x] **As a** lawyer, **I want to** reset my settings to the defaults in one click and see when I last saved them, **so that** I can undo experiments without remembering the original values. `v1` (the reset only fills the fields, nothing is saved until I press save)
- [ ] **As a** lawyer, **I want to** change my password and my email, **so that** I can keep my account secure. `later`
- [ ] **As a** lawyer, **I want to** delete my account and my data, **so that** I stay in control of client information. `later`

## 11. Smaller but Practical Items

- [x] **As a** lawyer, **I want to** choose how many items I see per page in the clients and cases lists, **so that** I can scan a long list in one screen or keep it short. `v1` (8, 12, 24 or 48; the choice is kept in the link together with the search and filters)
- [ ] **As a** lawyer, **I want to** get warned if a new client conflicts with an existing case (I'd be representing both sides), **so that** I avoid a conflict of interest. `later`
- [ ] **As a** lawyer, **I want to** log calls or contacts with a client (date + short summary), **so that** I have a record of our communication history. `later`
- [ ] **As a** lawyer, **I want to** see in-app notifications (bell) in addition to email, **so that** I don't depend on my inbox. `later`
- [ ] **As a** lawyer, **I want to** see what changed on a case ("a note was added", "a document was uploaded"), **so that** I recall what I did last. `later`

## 12. Quality (applies to everything)

All three are done for v1. They apply to everything, so they must be checked again whenever a screen is added.

- [x] **As a** lawyer, **I want** my data to be invisible to every other lawyer, **so that** my clients' information stays confidential. `v1` (cross-account tests passed for authentication, clients, cases, hearings, deadlines and settings; the dashboard, the client page and the case tabs reuse the same tested queries)
- [x] **As a** lawyer, **I want** every page to work on my phone, **so that** I can use it at court. `v1` (checked page by page by the owner)
- [x] **As a** lawyer, **I want** empty, loading and error states on every screen, **so that** I always know what is happening. `v1` (loading skeletons for the list, details and form pages; an error page for the dashboard and one for the rest of the site; an Arabic 404 for unknown links; the settings page has no loading state because it loads instantly)

---

## Release plan

**v1 (feedback version)**
- [x] Authentication, landing page
- [x] Clients (list, search, details page with all their cases, latest case, active / inactive)
- [x] Cases (list, form, details, delete, duplicate warning)
- [x] Case card signals (next hearing, nearest deadline, urgent badge, "no upcoming hearing" warning)
- [x] Hearings (create, edit, delete, decision + next hearing in one step, conflict warning)
- [x] Deadlines (create, edit, delete, mark done / reopen, overdue grouping)
- [ ] Email reminders for hearings and deadlines: built and tested, **on hold** until a verified sending domain exists (moved out of v1 for now)
- [x] Dashboard (hearings, deadlines, caseload, recent cases)
- [x] Settings (time zone; the reminder card is hidden while reminders are on hold)
- [x] UI redesign of the form, details and settings pages (tabs on the case page, client page with stats, loading skeletons, user-chosen page size)
- [x] Quality pass: isolation, phone layout, and empty / loading / error states on every screen (section 12)
- [x] Deployed on Vercel (a push to `main` deploys automatically)

**v1.1** Billing: agreed fee, payments with due dates, overdue and outstanding widgets.

**v1.2** Documents (private storage) and the full calendar.

**On hold** Email reminders for hearings and deadlines. The code, the columns and the endpoint are ready; they wait for a verified sending domain (Resend only delivers to the account owner without one).

**Later** Invoices, global search, monthly reports, in-app notifications, case activity feed, conflict-of-interest check, call log, account settings.

---

## Design decisions

1. **"Urgent" is calculated**, not a status: a case can be ongoing and urgent at once. The badge sits next to the status badge, it does not replace it (see the note in section 5 for the exact rule).
2. **Case status** is `ongoing / postponed / closed`, plus an optional judgment date. Appeal dates live in deadlines.
3. **Client status is calculated** (active when they have an open case).
4. **The update description is postponed.** v1 shows "last updated" only.
5. **Notifications and the bell are postponed.** v1 reminders go by email.
6. **No comparison cards** ("+8% vs last month") in v1.
7. **Initials instead of photos** for clients.
8. **Deleting a client** is allowed only when they have no cases. Otherwise archive.
9. **Case types** include family and labor.
10. **Search is per page** in v1.
11. **Release plan** is v1, v1.1, v1.2 as above.
12. **Deleting a case** is allowed only when it has no hearings or deadlines. Otherwise archive.
13. **Duplicate case numbers** trigger a confirmation, not a block (the same number can legitimately exist in another court).
14. **Hearings:** a decision plus the next date is one step (old hearing becomes `postponed`, a new `scheduled` one is created; with no next date the old one becomes `completed`). Only `scheduled` hearings are editable, and a scheduled hearing must come after the last decided one.
15. **Close hearings** (within 90 minutes) trigger a confirmation, not a block.
16. **Deadlines** are a calendar date with a title. Marking one done or reopening it needs no confirmation; only pending deadlines are editable; "overdue" is calculated from the lawyer's today.
17. **Overdue things count as urgent:** a hearing in the past with no decision, and a pending deadline whose date has passed, keep the case marked urgent until they are handled.
18. **Dashboard:** the four cards are ongoing cases, today's hearings, hearings in the next 7 days (not a calendar week, to avoid the question of which day a week starts) and pending deadlines (with the overdue ones counted apart). The billing card and widget wait for v1.1. Archived cases never count. Past hearings that are still "scheduled" get their own box, otherwise nobody would see them.
19. **Settings:** the time zone is chosen from a fixed list (an invalid name would break every date on screen), and the reminder timing from fixed options, with "none" available for both. Changing the zone never moves a saved hearing.
20. **Reminders:** an email goes out once per reminder, never for something already past; day-based reminders arrive from 08:00 in the lawyer's own time zone, hour-based ones inside the chosen window; deadlines have a day reminder only (a date has no time); changing a date makes the new date get its own reminder; if sending fails it is retried on the next run. **On hold:** see decision 26.
21. **Clients:** a client is active when they have at least one case that is not closed and not archived; the latest case is the most recently updated one; an archived client's page still opens and lists their cases; opening a client (or case) that does not exist or belongs to someone else shows the same "not found" page.
22. **Case details are tabs** driven by the link (`?tab=`): overview, hearings, deadlines, notes. Only the open tab loads its data. A wrong tab name falls back to the overview.
23. **Page size** comes from one fixed list (8, 12, 24, 48) that the lawyer picks from; the server accepts only those values and uses 8 for anything else. The control is separate from the page numbers so it stays visible when only one page is left.
24. **Settings reset** restores the defaults (Cairo, 1 day, 3 hours) without saving. The labels say that the day reminder covers hearings and deadlines while the hour reminder covers hearings only, and that day reminders arrive from 08:00 in the lawyer's zone. While reminders are on hold the reminder card is hidden.
25. **Redesigned screens** follow the owner's designs without adding fields outside v1 (no short description, no start date, opposing party optional, court as free text, no bell). Every details or form page has a loading skeleton with the same layout, so nothing jumps when the data arrives.
26. **Reminders are on hold.** A reminder email can only reach a lawyer from a verified sending domain, and there is no budget for a domain yet (Resend's test sender delivers only to the account owner). The code, the database columns and the secret-protected endpoint stay as they are, nothing calls the endpoint, and the reminder card is hidden in the settings page so the screen does not promise something that does not happen. Bringing it back needs a domain, one setting, the scheduler and showing the card again, with no migration.
27. **Interface scale:** the pages were designed with the browser at 90%, so the root font size is set to 90% (`html { font-size: 90% }`) and every rem-based size follows it.
28. **Adding a client from the case form:** a case always belongs to a client, so with no clients the new-case page shows a message and a button instead of an unusable form, and the form offers an "add a new client" link even when clients exist. The link carries a flag (`?from=case`, one fixed value, never a URL); after saving, the lawyer comes back to the case form with the new client selected. The client id in the link is used only if it is in the lawyer's own client list.

Anything that can be calculated from other data is never stored (case count, last case, next hearing, overdue amount, active/inactive, urgent).