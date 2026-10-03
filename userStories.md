# User Stories - Lawyer Contract & Case Deadline Tracker

Check each story off once it's fully built and working.

## 1. Authentication

- [ ] **As a** lawyer, **I want to** create an account quickly, **so that** I can start using the system without friction.
- [ ] **As a** lawyer, **I want to** log in to access my data, **so that** my account stays protected and private.
- [ ] **As a** lawyer, **I want to** reset my password if I forget it, **so that** I'm not permanently locked out of my own data.
- [ ] **As a** lawyer, **I want to** log out safely, **so that** my data stays protected if I'm using a shared or public device.

## 2. Landing Page

- [X] **As a** visitor, **I want to** see a simple landing page that explains what the system is and what it does, **so that** I understand it before I sign up.

## 3. Dashboard Home

- [ ] **As a** lawyer, **I want to** see today's and tomorrow's hearings right when I log in, **so that** I know what needs my attention without searching for it.
- [ ] **As a** lawyer, **I want to** see upcoming critical deadlines (like appeal filing dates) highlighted clearly, **so that** nothing urgent slips past me.
- [ ] **As a** lawyer, **I want to** see a quick overview of my caseload (ongoing cases, etc.), **so that** I know how busy I am without opening the cases page.
- [ ] **As a** lawyer, **I want to** see which clients have overdue payments, **so that** I remember to follow up with them.
- [ ] **As a** lawyer, **I want to** see my most recently updated cases, **so that** I can quickly get back to what I was working on last.
- [ ] **As a** lawyer, **I want to** see a clear message when there's nothing pending, **so that** I know the dashboard isn't just empty or broken.

## 4. Client Management

- [ ] **As a** lawyer, **I want to** view a list of all my clients, **so that** I can quickly find and manage their information.
- [ ] **As a** lawyer, **I want to** search clients by name or phone number, **so that** I can find them fast during a busy day.
- [ ] **As a** lawyer, **I want to** store basic contact info for each client (phone, email, address), **so that** I can reach them when needed.
- [ ] **As a** lawyer, **I want to** link a client to multiple cases, **so that** I can see everything I'm handling for them in one place.
- [ ] **As a** lawyer, **I want to** see the date I first started working with a client, **so that** I have a history of our relationship.

## 5. Case Management

- [ ] **As a** lawyer, **I want to** create a case with a case number, type (civil, criminal, commercial...), court, and opposing party, **so that** I have all the key identifying details in one place.
- [ ] **As a** lawyer, **I want to** set and update a case's status (ongoing, postponed, judged, closed), **so that** I know where each case stands at a glance.
- [ ] **As a** lawyer, **I want to** view all cases belonging to a specific client, **so that** I don't have to search separately for each one.
- [ ] **As a** lawyer, **I want to** add free-text notes to a case after each session, **so that** I remember what happened and what the judge said.

## 6. Hearings & Deadlines (Core Feature)

- [ ] **As a** lawyer, **I want to** set a hearing date for a case and get reminded before it (e.g. 1 day before, and a few hours before), **so that** I never miss a court session.
- [ ] **As a** lawyer, **I want to** get warned if two hearings are scheduled too close together (same time, or same day but far apart locations), **so that** I don't accidentally double-book myself.
- [ ] **As a** lawyer, **I want to** track non-hearing deadlines too (e.g. last date to file an appeal or a defense memo), **so that** I don't lose a case permanently over a missed paperwork deadline.
- [ ] **As a** lawyer, **I want to** see all my upcoming dates in a calendar view (monthly/weekly), **so that** I get a full picture of my schedule.

## 7. Documents

- [ ] **As a** lawyer, **I want to** upload documents to a case (contracts, official papers, photos), **so that** everything related to the case is stored in one place.
- [ ] **As a** lawyer, **I want to** organize documents by type or date, **so that** I can find a specific document quickly later.

## 8. Billing & Fees

- [ ] **As a** lawyer, **I want to** record the agreed fee for each client/case, **so that** I know how much I'm owed.
- [ ] **As a** lawyer, **I want to** track what has actually been paid vs what's still outstanding, **so that** I know who still owes me money.
- [ ] **As a** lawyer, **I want to** generate a simple invoice I can print or send to the client, **so that** I can request payment professionally.

## 9. Search & Reports

- [ ] **As a** lawyer, **I want to** quickly search by name, case number, or date, **so that** I can find information fast, especially when time is tight before a session.
- [ ] **As a** lawyer, **I want to** see a monthly report (new cases, closed cases, still-open cases), **so that** I can track my workload and progress over time.

## 10. Settings

- [ ] **As a** lawyer, **I want to** set how many days/hours before a hearing I get reminded, **so that** the reminders match how far ahead I like to prepare.

## 11. Smaller but Practical Items

- [ ] **As a** lawyer, **I want to** get warned if a new client conflicts with an existing case (i.e. I'd be representing both sides), **so that** I avoid a conflict of interest.
- [ ] **As a** lawyer, **I want to** log calls or contacts with a client (date + short summary), **so that** I have a record of our communication history.

---

## MVP Scope (build this first, ~1-1.5 weeks)

- [ ] Authentication (register, login, logout, password reset)
- [ ] Landing page (explains the system before sign-up)
- [ ] Dashboard home (today/tomorrow's hearings, deadlines, caseload overview, overdue payments, recent cases)
- [ ] Client management (list, search, contact info)
- [ ] Case management (basic fields, status, notes)
- [ ] Hearings & deadlines with reminders + scheduling conflict warning
- [ ] Basic document upload
- [ ] Basic billing (fee + paid/outstanding tracking)
- [ ] Settings (reminder timing preferences)

## Future Features (Post-MVP)

- [ ] Conflict-of-interest check
- [ ] Call/interaction log
- [ ] Full monthly reports dashboard