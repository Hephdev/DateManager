# DateManager

A multi-tenant appointment-booking SaaS (a "mini Calendly"). Each business
owner manages their own availability and services; clients book appointments
via a public booking page without needing an account.

## Status

Phase 1 (MVP) is in design/planning. See:
- [Phase 1 design doc](docs/superpowers/specs/2026-06-12-appointment-booking-phase1-design.md)
- [Phase 1 user stories](docs/user-stories-phase1.md) — tracked as [GitHub issues](https://github.com/Hephdev/DateManager/issues)

## Architecture & Tech Stack

- **Backend**: ASP.NET Core Web API (C#) + Entity Framework Core + SQL Server
- **Frontend**: Angular SPA
- **Auth**: ASP.NET Core Identity for business owner accounts, issuing JWT
  bearer tokens consumed by the Angular app
- **Email**: `IEmailSender` abstraction so the concrete provider
  (SMTP/SendGrid/etc.) can be swapped without touching business logic
- **Reminders**: a background hosted service polls periodically for upcoming
  confirmed appointments and sends reminder emails
- **Time handling**: all timestamps stored in UTC; each business has a
  `TimeZone` used to interpret availability and compute slots

## Project Structure

```
src/
  backend/   # ASP.NET Core Web API
  frontend/  # Angular SPA
docs/        # design docs and user stories
```

## Core Concepts

- A **Business Owner** registers, configures a business profile (name, public
  booking slug, timezone, approval mode), services (name + duration), and
  weekly availability windows.
- **Clients** visit `/book/{slug}`, pick a service and an available time slot,
  and submit a booking request — no account required.
- Bookings are created as **Pending** (if the business requires approval) or
  **Confirmed** (auto-confirm). Owners review their schedule on a
  month/week/day/agenda calendar and can approve/decline pending requests or
  cancel confirmed ones.
- Email notifications are sent on status changes (request received,
  confirmed, declined/cancelled) and as a reminder before an upcoming
  confirmed appointment.

## Data Model

- **BusinessOwner** — ASP.NET Identity user
- **BusinessProfile** (1:1 with owner) — `BusinessName`, unique `Slug`,
  `TimeZone`, `RequiresApproval`
- **Service** (many per business) — `Name`, `DurationMinutes`, `IsActive`
- **AvailabilityWindow** (many per business) — `DayOfWeek`, `StartTime`,
  `EndTime`; a day may have zero, one, or multiple windows
- **Appointment** — `ServiceId`, client name/email/phone, `StartUtc`/`EndUtc`,
  `Status` (`Pending` / `Confirmed` / `Declined` / `Cancelled`),
  `ReminderSentAt`

## API Overview

**Auth** (public)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

**Owner-facing** (JWT required, scoped to the caller's business)
- `GET/PUT /api/business-profile`
- `GET/POST/PUT/DELETE /api/services`
- `GET/PUT /api/availability`
- `GET /api/appointments?from=&to=`
- `PUT /api/appointments/{id}/approve`
- `PUT /api/appointments/{id}/decline`
- `PUT /api/appointments/{id}/cancel`

**Public** (no auth, used by the booking page)
- `GET /api/public/{slug}`
- `GET /api/public/{slug}/availability?serviceId=&from=&to=`
- `POST /api/public/{slug}/appointments`

## Getting Started

The backend and frontend projects haven't been scaffolded yet — see
[US-01](https://github.com/Hephdev/DateManager/issues/1) (backend) and
[US-02](https://github.com/Hephdev/DateManager/issues/2) (frontend).
