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

- [ ] **As a** lawyer, **I want to** see today's and tomorrow's hearings right when I log in, **so that** I know what needs my attention without searching for it. `v1`
- [ ] **As a** lawyer, **I want to** see upcoming deadlines (like appeal filing dates) highlighted clearly in their own section, **so that** nothing urgent slips past me. `v1`
- [ ] **As a** lawyer, **I want to** see a quick overview of my caseload (ongoing cases, hearings this week), **so that** I know how busy I am without opening the cases page. `v1`
- [ ] **As a** lawyer, **I want to** see my most recently updated cases, **so that** I can quickly get back to what I was working on last. `v1`
- [ ] **As a** lawyer, **I want to** see a clear message when there's nothing pending, and sensible loading and error states, **so that** I know the dashboard isn't just empty or broken. `v1`
- [ ] **As a** lawyer, **I want to** see which clients have overdue payments and how much is outstanding, **so that** I remember to follow up with them. `v1.1`

## 4. Client Management

- [ ] **As a** lawyer, **I want to** view a list of all my clients, **so that** I can quickly find and manage their information. `v1`
- [ ] **As a** lawyer, **I want to** search clients by name or phone number, **so that** I can find them fast during a busy day. `v1`
- [ ] **As a** lawyer, **I want to** store basic contact info for each client (phone, email, address), **so that** I can reach them when needed. `v1`
- [ ] **As a** lawyer, **I want to** see the date I first started working with a client, **so that** I have a history of our relationship. `v1`
- [ ] **As a** lawyer, **I want to** see how many cases each client has and their latest case in the list, **so that** I get the picture without opening each client. `v1`
- [ ] **As a** lawyer, **I want to** open a client and see all their cases in one place, **so that** I see everything I'm handling for them. `v1`
- [ ] **As a** lawyer, **I want to** edit a client's details, **so that** the information stays correct. `v1`
- [ ] **As a** lawyer, **I want to** archive a client (and delete one only if they have no cases), **so that** I never lose case history by accident. `v1`

> A client is shown as **active** when they have at least one open case, and **inactive** otherwise. This is calculated, never typed in.

## 5. Case Management

- [ ] **As a** lawyer, **I want to** create a case with a case number, type (civil, criminal, commercial, family, labor, other), court, and opposing party, **so that** I have all the key identifying details in one place. `v1`
- [ ] **As a** lawyer, **I want to** set and update a case's status (ongoing, postponed, closed) and record the judgment date when there is one, **so that** I know where each case stands at a glance. `v1`
- [ ] **As a** lawyer, **I want to** browse all my cases, filter them by status, and search by case number or client name, **so that** I can find a case quickly. `v1`
- [ ] **As a** lawyer, **I want to** add free-text notes to a case after each session, **so that** I remember what happened and what the judge said. `v1`
- [ ] **As a** lawyer, **I want to** open a case and see its hearings, deadlines and notes together, **so that** I have the full picture on one screen. `v1`
- [ ] **As a** lawyer, **I want to** see a case marked **urgent** when it has a hearing or deadline within 48 hours, **so that** I notice it without checking dates. `v1`
- [ ] **As a** lawyer, **I want to** be warned when an ongoing case has no upcoming hearing, **so that** I don't forget to schedule the next session. `v1`
- [ ] **As a** lawyer, **I want to** edit or archive a case, **so that** my list stays accurate. `v1`

> "Urgent" is calculated from upcoming dates. It is not a status and not a field the lawyer fills in.

## 6. Hearings & Deadlines (Core Feature)

- [ ] **As a** lawyer, **I want to** set a hearing date for a case, **so that** it appears on my dashboard. `v1`
- [ ] **As a** lawyer, **I want to** record a session's decision and set the next hearing date in one step, **so that** the daily routine after court takes seconds. `v1`
- [ ] **As a** lawyer, **I want to** get an email reminder before a hearing (for example 1 day before and a few hours before), **so that** I never miss a court session. `v1`
- [ ] **As a** lawyer, **I want to** get warned if two hearings are scheduled too close together, **so that** I don't accidentally double-book myself. `v1`
- [ ] **As a** lawyer, **I want to** track non-hearing deadlines too (last date to file an appeal or a defense memo), with reminders, **so that** I don't lose a case permanently over a missed paperwork deadline. `v1`
- [ ] **As a** lawyer, **I want to** mark a deadline as done, **so that** it stops appearing as pending. `v1`
- [ ] **As a** lawyer, **I want to** see all my upcoming dates in a calendar view (monthly/weekly), **so that** I get a full picture of my schedule. `v1.2`

> v1 conflict check: another hearing within a time window around the new one. Location-based checks ("same day but far apart") come later.

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

- [ ] **As a** lawyer, **I want to** search within each list (clients, cases), **so that** I can find information fast. `v1`
- [ ] **As a** lawyer, **I want to** search everything from one place (name, case number, date), **so that** I find information fast before a session. `later`
- [ ] **As a** lawyer, **I want to** see a monthly report (new cases, closed cases, still-open cases), **so that** I can track my workload and progress over time. `later`

## 10. Settings

- [ ] **As a** lawyer, **I want to** set how many days/hours before a hearing I get reminded, **so that** the reminders match how far ahead I like to prepare. `v1`
- [ ] **As a** lawyer, **I want to** set my time zone, **so that** "today" and reminder times are correct for me. `v1`
- [ ] **As a** lawyer, **I want to** change my password and my email, **so that** I can keep my account secure. `later`
- [ ] **As a** lawyer, **I want to** delete my account and my data, **so that** I stay in control of client information. `later`

## 11. Smaller but Practical Items

- [ ] **As a** lawyer, **I want to** get warned if a new client conflicts with an existing case (I'd be representing both sides), **so that** I avoid a conflict of interest. `later`
- [ ] **As a** lawyer, **I want to** log calls or contacts with a client (date + short summary), **so that** I have a record of our communication history. `later`
- [ ] **As a** lawyer, **I want to** see in-app notifications (bell) in addition to email, **so that** I don't depend on my inbox. `later`
- [ ] **As a** lawyer, **I want to** see what changed on a case ("a note was added", "a document was uploaded"), **so that** I recall what I did last. `later`

## 12. Quality (applies to everything)

- [ ] **As a** lawyer, **I want** my data to be invisible to every other lawyer, **so that** my clients' information stays confidential. `v1`
- [ ] **As a** lawyer, **I want** every page to work on my phone, **so that** I can use it at court. `v1`
- [ ] **As a** lawyer, **I want** empty, loading and error states on every screen, **so that** I always know what is happening. `v1`

---

## Release plan

**v1 (feedback version)**
- [x] Authentication, landing page
- [ ] Clients
- [ ] Cases
- [ ] Hearings and deadlines with email reminders and conflict warning
- [ ] Dashboard (hearings, deadlines, caseload, recent cases)
- [ ] Settings (reminders, time zone)

**v1.1** Billing: agreed fee, payments with due dates, overdue and outstanding widgets.

**v1.2** Documents (private storage) and the full calendar.

**Later** Invoices, global search, monthly reports, in-app notifications, case activity feed, conflict-of-interest check, call log, account settings.

---

## Design decisions

1. **"Urgent" is calculated**, not a status: a case can be ongoing and urgent at once.
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

Anything that can be calculated from other data is never stored (case count, last case, next hearing, overdue amount, active/inactive, urgent).