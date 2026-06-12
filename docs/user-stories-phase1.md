# DateManager — Phase 1 User Stories

Derived from
[`docs/superpowers/specs/2026-06-12-appointment-booking-phase1-design.md`](superpowers/specs/2026-06-12-appointment-booking-phase1-design.md).
Each story is intended to become its own GitHub issue. Stories are grouped
into epics; within an epic, earlier stories are generally prerequisites for
later ones.

---

## Epic: Project Foundation

### US-01 — Set up backend project
**As a** developer, **I want** an ASP.NET Core Web API project with EF Core and
a SQL Server connection configured, **so that** I have a base to build
features on.

**Acceptance criteria**
- [ ] ASP.NET Core Web API project created (C#)
- [ ] EF Core configured with a SQL Server connection string (via config/user
      secrets)
- [ ] Initial empty migration runs successfully against a local database
- [ ] Solution builds and runs locally

### US-02 — Set up frontend project
**As a** developer, **I want** an Angular SPA project scaffolded, **so that**
I have a base to build the UI on.

**Acceptance criteria**
- [ ] Angular project created
- [ ] Basic routing configured (placeholder pages)
- [ ] Project builds and runs locally, served separately from the API

### US-03 — Configure authentication (Identity + JWT)
**As a** developer, **I want** ASP.NET Core Identity wired up with JWT issuance,
**so that** business owners can securely register/log in and call protected
endpoints.

**Acceptance criteria**
- [ ] ASP.NET Core Identity configured for `BusinessOwner` users
- [ ] JWT bearer authentication configured for the API
- [ ] `POST /api/auth/register` and `POST /api/auth/login` return a JWT
- [ ] `POST /api/auth/refresh` issues a new token from a valid refresh token
- [ ] Protected endpoints reject requests without a valid JWT (401)

### US-04 — Email sending abstraction
**As a** developer, **I want** an `IEmailSender` abstraction with a dev/test
implementation, **so that** other features can send emails without depending
on a specific provider.

**Acceptance criteria**
- [ ] `IEmailSender` interface defined (e.g. `SendAsync(to, subject, body)`)
- [ ] A dev implementation (e.g. logs to console/file or uses a local SMTP
      catcher) is registered for local development
- [ ] Send failures are caught and logged without throwing to callers

### US-05 — Background reminder job skeleton
**As a** developer, **I want** a background hosted service that runs on a
timer, **so that** later stories can plug in reminder-sending logic.

**Acceptance criteria**
- [ ] `IHostedService`/`BackgroundService` registered and running on app
      startup
- [ ] Runs on a configurable interval (e.g. every 15-30 minutes)
- [ ] No-op logic for now (logs a heartbeat); ready for US-19 to extend

---

## Epic: Business Owner Account & Profile

### US-06 — Business owner registration & login
**As a** business owner, **I want** to register and log in, **so that** I can
access my account.

**Acceptance criteria**
- [ ] Registration form (Angular) collects email/password and calls
      `POST /api/auth/register`
- [ ] Login form calls `POST /api/auth/login` and stores the JWT
- [ ] Authenticated requests include the JWT; expired tokens trigger a
      refresh via `POST /api/auth/refresh`
- [ ] Validation errors (e.g. duplicate email, weak password) are shown
      inline

### US-07 — Create/edit business profile
**As a** business owner, **I want** to set my business name, public booking
slug, timezone, and approval setting, **so that** clients can find and book
with me the way I want.

**Acceptance criteria**
- [ ] `GET/PUT /api/business-profile` implemented, scoped to the
      authenticated owner
- [ ] `Slug` is unique (DB unique index); attempting to save a taken slug
      returns a clear 400 error
- [ ] `RequiresApproval` toggle (bool) is saved and editable
- [ ] Angular settings page for editing these fields, with inline validation
      errors

---

## Epic: Services Management

### US-08 — Manage services
**As a** business owner, **I want** to create, edit, deactivate, and delete the
services clients can book, **so that** my booking page reflects what I
actually offer.

**Acceptance criteria**
- [ ] `GET/POST/PUT/DELETE /api/services` implemented, scoped to the
      authenticated owner's business
- [ ] Each service has `Name`, `DurationMinutes`, `IsActive`
- [ ] Angular page lists services with add/edit/delete actions
- [ ] Inactive services are excluded from the public booking page (US-11)

---

## Epic: Availability Management

### US-09 — Manage weekly availability
**As a** business owner, **I want** to define recurring weekly availability
windows per day, **so that** clients can only book during my working hours.

**Acceptance criteria**
- [ ] `GET/PUT /api/availability` implemented, scoped to the authenticated
      owner's business
- [ ] Supports zero, one, or multiple windows per day of week (e.g. split
      morning/afternoon shifts)
- [ ] Angular page to view/edit the weekly schedule
- [ ] Basic validation: a window's `EndTime` must be after its `StartTime`,
      and windows on the same day must not overlap

---

## Epic: Public Booking Page

### US-10 — View public business page
**As a** client, **I want** to view a business's public page by its slug,
**so that** I can see who they are and what services they offer.

**Acceptance criteria**
- [ ] `GET /api/public/{slug}` returns business name and active services (or
      404 for an unknown slug)
- [ ] Angular route `/book/{slug}` renders the business name and a list of
      active services

### US-11 — View available slots for a service
**As a** client, **I want** to see available time slots for a chosen service,
**so that** I can pick a convenient time.

**Acceptance criteria**
- [ ] `GET /api/public/{slug}/availability?serviceId=&from=&to=` returns open
      slots computed from: the business's weekly `AvailabilityWindow`s, the
      selected service's `DurationMinutes`, and existing `Pending`/`Confirmed`
      appointments (which block their covered time)
- [ ] Slots in the past are excluded
- [ ] Angular UI lets the client pick a service, then shows a date/slot picker
- [ ] Unit tests cover the slot-generation algorithm, including split-shift
      days and partially-booked days

### US-12 — Submit a booking request
**As a** client, **I want** to submit a booking request with my name, email,
and phone, **so that** I can request an appointment.

**Acceptance criteria**
- [ ] `POST /api/public/{slug}/appointments` creates an `Appointment` with
      status `Pending` (if `RequiresApproval`) or `Confirmed` (otherwise)
- [ ] The endpoint re-checks slot availability inside the same DB transaction
      as the insert; if the slot is no longer free, returns 409 Conflict
- [ ] Angular form collects client name/email/phone, validates required
      fields, and shows a confirmation or error message
- [ ] On success, triggers the appropriate notification(s) from Epic:
      Notifications

---

## Epic: Appointment Management (Owner Dashboard)

### US-13 — View appointments calendar
**As a** business owner, **I want** to view my appointments in month, week,
day, and agenda views, **so that** I can see my schedule at a glance.

**Acceptance criteria**
- [ ] `GET /api/appointments?from=&to=` implemented, scoped to the
      authenticated owner's business
- [ ] Angular dashboard renders month/week/day/agenda views (e.g. via a
      FullCalendar wrapper) showing appointments with client name, service,
      and status
- [ ] Pending appointments are visually distinguished from Confirmed ones

### US-14 — Approve a pending appointment
**As a** business owner, **I want** to approve a pending appointment request,
**so that** it becomes confirmed and the client is notified.

**Acceptance criteria**
- [ ] `PUT /api/appointments/{id}/approve` transitions `Pending → Confirmed`
- [ ] Returns 400 if the appointment is not currently `Pending`
- [ ] Triggers a confirmation email to the client (Epic: Notifications)
- [ ] Angular dashboard has an "Approve" action on pending appointments

### US-15 — Decline a pending appointment
**As a** business owner, **I want** to decline a pending appointment request,
**so that** the slot frees up and the client is notified.

**Acceptance criteria**
- [ ] `PUT /api/appointments/{id}/decline` transitions `Pending → Declined`
- [ ] Returns 400 if the appointment is not currently `Pending`
- [ ] Triggers a decline email to the client (Epic: Notifications)
- [ ] Angular dashboard has a "Decline" action on pending appointments

### US-16 — Cancel a confirmed appointment
**As a** business owner, **I want** to cancel a confirmed appointment,
**so that** I can handle schedule changes and free up the slot.

**Acceptance criteria**
- [ ] `PUT /api/appointments/{id}/cancel` transitions `Confirmed → Cancelled`
- [ ] Returns 400 if the appointment is not currently `Confirmed`
- [ ] Triggers a cancellation email to the client (Epic: Notifications)
- [ ] Angular dashboard has a "Cancel" action on confirmed appointments

---

## Epic: Notifications

### US-17 — Notify owner of new pending requests
**As a** business owner, **I want** to receive an email when a new appointment
request needs my approval, **so that** I can respond promptly.

**Acceptance criteria**
- [ ] When a booking is created as `Pending` (US-12), an email is sent to the
      owner with client and appointment details
- [ ] No email is sent to the owner if the business auto-confirms
      (`RequiresApproval == false`)

### US-18 — Notify client of status changes
**As a** client, **I want** to receive an email when my appointment is
confirmed, declined, or cancelled, **so that** I know the outcome of my
request.

**Acceptance criteria**
- [ ] Confirmation email sent when status becomes `Confirmed` (whether
      immediately on auto-confirm, or via US-14)
- [ ] Decline email sent on US-15
- [ ] Cancellation email sent on US-16
- [ ] Each email includes the business name, service, and appointment time
      (in the business's timezone)

### US-19 — Send appointment reminders
**As a** client, **I want** to receive a reminder email before my upcoming
appointment, **so that** I don't forget it.

**Acceptance criteria**
- [ ] The background job from US-05 finds `Confirmed` appointments starting
      within the reminder window (e.g. 24h) where `ReminderSentAt IS NULL`
- [ ] Sends a reminder email to the client and stamps `ReminderSentAt`
- [ ] Appointments are never reminded twice
