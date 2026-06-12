# DateManager — Phase 1 Design: Appointment Booking MVP

## Context

DateManager is a multi-tenant appointment-booking SaaS (a "mini Calendly"). Each
business owner manages their own availability and services; clients book
appointments via a public booking page without needing an account.

This document covers **Phase 1**, the MVP foundation. Later phases (not designed
yet) are expected to add: recurring events, categories/color-coding, search &
filtering, team/shared calendars within a business, date-specific availability
exceptions (holidays/vacation), custom booking page branding, client accounts
with booking history, and integrations (e.g. Google Calendar sync).

## Goals (Phase 1)

- Business owners can register, log in, and configure their business profile,
  services, and weekly availability.
- Clients can visit a business's public booking page, pick a service and time
  slot, and submit an appointment request — no account required.
- Each business can require manual approval of requests or auto-confirm them.
- Owners get a calendar view (month/week/day/agenda) of their appointments and
  can approve/decline pending requests or cancel confirmed ones.
- Email notifications are sent on status changes (request received, confirmed,
  declined/cancelled) and as a reminder before an upcoming confirmed
  appointment.

## Architecture & Tech Stack

- **Backend**: ASP.NET Core Web API (C#) + Entity Framework Core + SQL Server.
- **Frontend**: Angular SPA.
- **Auth**: ASP.NET Core Identity for business owner accounts, issuing JWT
  bearer tokens consumed by the Angular app for protected endpoints.
- **Public booking pages**: unauthenticated. Anyone with a business's booking
  URL (`/book/{slug}`) can view services/availability and submit a booking
  request.
- **Reminders**: a background hosted service (.NET `IHostedService` / timer)
  runs periodically (e.g. every 15-30 minutes), finds `Confirmed` appointments
  starting within the reminder window that haven't been notified yet, and
  sends reminder emails.
- **Email**: sent via an `IEmailSender` abstraction so the concrete provider
  (SMTP/SendGrid/etc.) can be swapped without touching business logic.
- **Time handling**: all timestamps stored in UTC. Each `BusinessProfile` has a
  `TimeZone` used to interpret weekly availability and to render/compute slots
  for that business.

## Data Model

- **BusinessOwner** — ASP.NET Identity user (email, password hash, etc.)
- **BusinessProfile** (1:1 with owner)
  - `OwnerId`, `BusinessName`, `Slug` (unique, used in the public booking URL),
    `TimeZone`, `RequiresApproval` (bool)
- **Service** (many per business)
  - `BusinessProfileId`, `Name`, `DurationMinutes`, `IsActive`
- **AvailabilityWindow** (many per business)
  - `BusinessProfileId`, `DayOfWeek`, `StartTime`, `EndTime`
  - A day can have zero windows (closed), one (normal hours), or multiple
    (e.g. split morning/afternoon shifts with a lunch break)
- **Appointment**
  - `BusinessProfileId`, `ServiceId`, `ClientName`, `ClientEmail`,
    `ClientPhone`, `StartUtc`, `EndUtc`, `Status`
    (`Pending` / `Confirmed` / `Declined` / `Cancelled`), `CreatedAt`,
    `ReminderSentAt` (nullable, used by the background reminder job)

**Relationships**: one owner → one business profile → many services & many
availability windows → many appointments (each appointment tied to one
service).

## Core User Flows

### Owner onboarding
Register/login → create/edit business profile (name, slug, timezone, approval
setting) → define services (name + duration) → set weekly availability
windows.

### Client booking (`/book/{slug}`, no login)
Client sees business name + service list → picks a service → app computes
available slots for upcoming days by combining the business's weekly
availability with the chosen service's duration, minus times already covered
by `Pending`/`Confirmed` appointments → client picks a slot, enters
name/email/phone, submits.

### Booking creation
Server re-validates the slot is still free (prevents double-booking from
concurrent requests) → creates the `Appointment` as `Pending` (if
`RequiresApproval`) or `Confirmed` (if auto-confirm) → sends email(s): owner is
notified of new pending requests; client receives a confirmation email when
status is/becomes `Confirmed`.

### Owner manages appointments
Dashboard with month/week/day/agenda calendar views of the owner's
appointments. Pending requests are highlighted with Approve/Decline actions
(each emails the client). Confirmed appointments can be Cancelled (emails the
client).

### Reminders
Background job periodically finds `Confirmed` appointments starting within the
reminder window with `ReminderSentAt == null`, sends a reminder email to the
client, and stamps `ReminderSentAt`.

## API Design (high-level)

**Auth** (public)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

**Owner-facing** (JWT required, scoped to the caller's business)
- `GET/PUT /api/business-profile` — name, slug, timezone, approval setting
- `GET/POST/PUT/DELETE /api/services`
- `GET/PUT /api/availability` — weekly windows
- `GET /api/appointments?from=&to=` — for calendar views
  (month/week/day/agenda)
- `PUT /api/appointments/{id}/approve`
- `PUT /api/appointments/{id}/decline`
- `PUT /api/appointments/{id}/cancel`

**Public** (no auth, used by the booking page)
- `GET /api/public/{slug}` — business info + active services
- `GET /api/public/{slug}/availability?serviceId=&from=&to=` — computed open
  slots
- `POST /api/public/{slug}/appointments` — submit a booking request

## Error Handling & Validation

- **Slot availability** is the core invariant: a requested
  `StartUtc`/`EndUtc` must (a) fall fully within one of the business's
  `AvailabilityWindow`s for that day of week, (b) not be in the past, and (c)
  not overlap any existing `Pending` or `Confirmed` appointment for that
  business.
- The public booking endpoint **re-checks overlap inside the same DB
  transaction** that inserts the new appointment, so two clients racing for
  the same slot can't both succeed — the second gets a 409 Conflict with a
  "slot no longer available" message.
- **Status transitions** are enforced server-side: only
  `Pending → Confirmed/Declined`, and only `Confirmed → Cancelled` are valid;
  invalid transitions (e.g. approving an already-declined appointment) return
  400.
- **Slug** uniqueness is enforced at the DB level (unique index) and validated
  on profile create/update with a friendly error if taken.
- Validation errors return structured 400 responses (field + message) so the
  Angular forms can show inline errors.
- Email send failures are logged but **never block** the booking/approval
  flow — the appointment state change is the source of truth, email is
  best-effort.

## Testing Strategy

- **Unit tests (backend)**: the slot-generation algorithm (availability
  windows + service duration + existing appointments → available slots) and
  overlap/conflict detection — the trickiest business logic and most valuable
  to cover. Also status-transition rules.
- **Integration tests (backend)**: API endpoints via `WebApplicationFactory`,
  covering the full booking flow (create profile → set availability/services
  → public slot query → submit booking → approve/decline), using a real SQL
  Server instance (e.g. Testcontainers) or LocalDB.
- **Frontend (Angular)**: unit tests for the booking form (validation, slot
  selection) and calendar view components; the calendar views can use an
  existing library (e.g. a FullCalendar Angular wrapper) to avoid building
  date-grid logic from scratch.
- **Manual/E2E**: a basic end-to-end pass (Playwright/Cypress) for the
  happy-path booking flow is a nice-to-have, not blocking for Phase 1.
