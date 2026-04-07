# Attendance System

A mobile-first employee attendance management system built with **Laravel 13**, **Inertia.js v3**, and **React 19**. The system handles daily check-in and check-out with GPS-based location enforcement, role-based access control, and a full admin panel for managing records.

> Built alongside [Claude](https://claude.ai/claude-code) — Anthropic's AI coding assistant — from initial scaffold to feature-complete system.

---

## Features

### Employee (User)
- Check in and check out from a mobile-friendly dashboard
- GPS location is captured on every check-in/check-out — must be within the configured office radius to succeed
- Attendance status automatically resolved as **Present** or **Late** based on configured work hours
- View today's attendance status with check-in/check-out times
- Browse full attendance history with month/year filtering

### Admin
- Dashboard with live daily stats (present, late, absent, half day)
- View, create, edit, and delete any attendance record
- User management — change roles between `user` and `admin`
- Work schedule settings — configure work start/end times
- Office location picker powered by **Google Maps** — click-to-pin, draggable marker, live radius circle overlay
- Adjustable allowed check-in radius (10–500m) via a slider

### System
- All timestamps stored in **UTC**; displayed in **Malaysia time (MYT, UTC+8)** throughout the UI
- Toast notifications (via [Sonner](https://sonner.emilkowal.ski/)) for every action — success and error
- Bottom navigation bar on mobile with user avatar, settings, and logout popup
- Dark mode support

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13 (PHP 8.3+) |
| Frontend | React 19 + TypeScript |
| SSR Bridge | Inertia.js v3 |
| Styling | Tailwind CSS v4 |
| Maps | `@vis.gl/react-google-maps` (Google Maps JS API) |
| Toasts | Sonner |
| UI Components | shadcn/ui |
| Database | MySQL (via Laravel Herd) |
| Type-safe Routes | Laravel Wayfinder |

---

## Requirements

- PHP 8.3+
- Node.js 20+
- [Laravel Herd](https://herd.laravel.com/) (or any local PHP/MySQL environment)
- A [Google Maps API key](https://developers.google.com/maps) with the **Maps JavaScript API** enabled

---

## Setup

```bash
# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Copy environment file and configure
cp .env.example .env
php artisan key:generate
```

Update `.env` with your database credentials and Google Maps API key:

```env
DB_DATABASE=attendance_system
DB_USERNAME=root
DB_PASSWORD=

VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

```bash
# Run migrations and seed initial data
php artisan migrate --seed

# Start the development server
npm run dev
```

---

## Default Credentials

After seeding, the following accounts are available:

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | password |
| User | user@example.com | password |

---

## Project Structure

```
app/
  Http/Controllers/
    Admin/          # Dashboard, Attendance, UserManagement, WorkSchedule
    User/           # Dashboard, Attendance (check-in/check-out)
  Models/
    Attendance.php  # MYT constant, resolveStatus(), Haversine bypass
    WorkSchedule.php # isWithinRadius(), haversineDistance()
    User.php

resources/js/
  pages/
    admin/          # dashboard, attendance (index/show/create), users, settings
    user/           # dashboard, attendance (today, index)
  components/
    bottom-nav.tsx  # Mobile navigation with user avatar popup
  hooks/
    use-flash-toast.ts  # Inertia flash → Sonner toast bridge
  lib/
    utils.ts        # utcTimeToMyt(), formatDate(), cn()

database/migrations/
  # work_schedules — office location + radius columns
  # attendances    — check_in/check_out GPS audit columns
```

---

## Built with Claude

This project was built in collaboration with [Claude Code](https://claude.ai/claude-code), Anthropic's AI coding assistant. Claude was used throughout the entire development process — from architecture decisions and database schema design, to writing controllers, React components, and resolving timezone edge cases (UTC storage vs. MYT display).
