# Mini Job Queue Dashboard & Job Orchestrator

A modern, production-grade fullstack job management platform featuring an asynchronous backend API built with NestJS, TypeORM, and SQLite, paired with a minimalist desktop dashboard built with React (TypeScript), Vite, and Tailwind CSS.

[![Repository](https://img.shields.io/badge/GitHub-prince083%2FMini--Job--Queue--Dashboard-181717?style=flat&logo=github)](https://github.com/prince083/Mini-Job-Queue-Dashboard)
[![Backend](https://img.shields.io/badge/Backend-NestJS%20v12-E0234E?style=flat&logo=nestjs)](https://nestjs.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Database](https://img.shields.io/badge/Database-SQLite%20via%20TypeORM-003B57?style=flat&logo=sqlite)](https://www.sqlite.org/)

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture & Directory Structure](#architecture--directory-structure)
4. [Backend Specification](#backend-specification)
   - [Database & Entities](#database--entities)
   - [Allowed State Transitions](#allowed-state-transitions)
   - [API Endpoints](#api-endpoints)
5. [Frontend Specification](#frontend-specification)
   - [Features](#features)
   - [Component Structure](#component-structure)
   - [Design System & Aesthetics](#design-system--aesthetics)
6. [Testing & Quality Assurance](#testing--quality-assurance)
7. [Setup and Installation Guide](#setup-and-installation-guide)
   - [Prerequisites](#prerequisites)
   - [Clone Repository](#clone-repository)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
8. [Environment & Port Configuration](#environment--port-configuration)
9. [Git & Ignore Configuration](#git--ignore-configuration)

---

## Project Overview

**Job Orchestrator** is designed to manage, monitor, and track lifecycle transitions of background tasks and operational jobs. Key capabilities include:
- **Persistent Storage**: Reliable local persistence using SQLite and TypeORM with automatic schema synchronization.
- **Strict State Progression**: Atomic status transitions preventing race conditions and disallowing illegal lifecycle hops.
- **Minimalist Aesthetic**: Low-distraction UI featuring curated Matcha Green and Roasted Coffee hues, responsive metrics counters, real-time search, contextual dropdown menus, and resilient error recovery.
- **Full Test Coverage**: Unit tests with dependency injection mocks and E2E API tests via Vitest and Supertest.

---

## Tech Stack

### Backend
- **Framework**: NestJS (v12) with Express HTTP engine
- **Language**: TypeScript (Node.js ES modules)
- **Database**: SQLite via `better-sqlite3` and `TypeORM`
- **Validation**: `class-validator` and `class-transformer`
- **Testing**: Vitest, `@nestjs/testing`, Supertest

### Frontend
- **Framework**: React 19 with TypeScript
- **Tooling & Bundler**: Vite (running on port 5000)
- **Styling**: Tailwind CSS v3 with custom PostCSS configuration
- **Icons**: Lucide React
- **HTTP Client**: Axios with centralized error formatting and interceptors

---

## Architecture & Directory Structure

The repository is organized as a clean monorepo containing both the API and client applications:

```text
Mini-Job-Queue-Dashboard/
├── .gitattributes             # Git LF line-ending normalization
├── .gitignore                 # Root exclusion rules (node_modules, logs, databases)
├── README.md                  # Comprehensive project documentation
├── backend/                   # NestJS API application
│   ├── src/
│   │   ├── jobs/              # Jobs entity, DTOs, controller, service, and unit tests
│   │   │   ├── create-job.dto.ts
│   │   │   ├── update-status.dto.ts
│   │   │   ├── job.entity.ts
│   │   │   ├── jobs.service.ts
│   │   │   ├── jobs.service.spec.ts
│   │   │   ├── jobs.controller.ts
│   │   │   ├── jobs.controller.spec.ts
│   │   │   └── jobs.module.ts
│   │   ├── app.controller.ts  # Health check root controller
│   │   ├── app.module.ts      # TypeORM configuration and module bundling
│   │   └── main.ts            # NestJS bootstrap, CORS, ValidationPipe
│   ├── test/                  # E2E test suites (app.e2e-spec.ts)
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
└── frontend/                  # React + TypeScript Vite client
    ├── src/
    │   ├── components/        # Header, StatusCards, JobFilters, JobTable, Modal, etc.
    │   │   ├── Header.tsx
    │   │   ├── StatusCards.tsx
    │   │   ├── JobFilters.tsx
    │   │   ├── JobTable.tsx
    │   │   ├── CreateJobModal.tsx
    │   │   ├── FeedbackBanner.tsx
    │   │   └── LoadingSkeleton.tsx
    │   ├── services/          # Axios HTTP service with base configuration
    │   ├── types/             # Domain TypeScript interfaces and transition mappings
    │   ├── App.tsx            # Main dashboard container and state orchestrator
    │   ├── main.tsx           # React DOM root entry
    │   └── index.css          # Tailwind base layer & CSS tokens
    ├── index.html             # HTML entry with Inter font
    ├── tailwind.config.js     # Matcha & Coffee custom theme definitions
    ├── postcss.config.js      # PostCSS configuration
    ├── vite.config.ts         # Vite server (port 5000 + /jobs proxy)
    └── package.json
```

---

## Backend Specification

### Database & Entities

The persistence layer uses a local SQLite database (`jobs.sqlite`). The core entity is `Job`:

| Field | Type | Description |
|---|---|---|
| `id` | `number` (Primary Key) | Auto-incrementing identifier |
| `title` | `string` | Job summary or descriptive task name |
| `type` | `string` | Classification category (e.g. `data_export`, `email_digest`) |
| `status` | `JobStatus` enum | Current state (`pending`, `running`, `completed`, `failed`) |
| `createdAt` | `Date` | Timestamp generated automatically upon record creation |

### Allowed State Transitions

Job status updates adhere strictly to the following state diagram:

```text
pending  ───> running ───> completed (terminal)
    │             │
    │             └───> failed (terminal)
    │
    ├───> completed (terminal)
    └───> failed (terminal)
```

- **`pending`**: Can transition to `running`, `completed`, or `failed`.
- **`running`**: Can transition to `completed` or `failed`.
- **`completed`**: Terminal state (no further transitions permitted).
- **`failed`**: Terminal state (no further transitions permitted).

Attempting an invalid state transition results in an immediate `409 Conflict` HTTP response with a descriptive error message.

### API Endpoints

All job management endpoints are exposed under `/jobs`:

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `GET` | `/` | None | Service welcome / health verification |
| `GET` | `/jobs` | None | Returns all jobs ordered chronologically (`createdAt DESC`) |
| `POST` | `/jobs` | `{ "title": string, "type": string }` | Enqueues a new job with default status `pending` |
| `PATCH` | `/jobs/:id/status` | `{ "status": JobStatus }` | Transitions job status according to validation matrix |
| `DELETE`| `/jobs/:id` | None | Removes a job record by ID |

---

## Frontend Specification

### Features

1. **Live Jobs Table**: Clean tabular layout presenting ID, title, job type tag, status pill, formatted creation timestamp, contextual action menu, and delete action.
2. **Interactive Status Counters**: Five summary cards tracking total volume and count per status (`Total`, `Pending`, `Running`, `Completed`, `Failed`). Clicking any card instantly filters the table to that status.
3. **Dual Filtering & Search**:
   - Status tab pills with active highlight.
   - Real-time text search filtering across job title and type with an instant clear button.
4. **Create Job Dialog**: Accessible modal with form validation, submission loading states, and quick-pick type suggestion pills (`data_export`, `email_digest`, `report_generation`, `image_processing`).
5. **Contextual Action Dropdowns**: The transition dropdown only offers legitimate forward statuses based on the job's current status. Terminal jobs display a clear `"Terminal state"` badge.
6. **Safe Two-Step Deletion**: Inline confirmation toggle (`Confirm` / `Cancel`) prevents accidental job deletion.
7. **Feedback & Resilience**:
   - Skeleton shimmer loaders during initial data fetch.
   - Non-blocking error notification banner with retry functionality.
   - Live refresh indicator on the header action bar.

### Design System & Aesthetics

- **Matcha Green Palette**: Calming sage and forest tones used for active indicators, running/completed badges, and primary actions:
  - `matcha-50`: `#f4f7f4`
  - `matcha-100`: `#e5ece2`
  - `matcha-500`: `#5d8d55`
  - `matcha-700`: `#3c5b37`
- **Roasted Coffee Palette**: Warm earthen tones providing soft contrast for cards, borders, and typography:
  - `coffee-50`: `#faf7f2`
  - `coffee-100`: `#f2eae0`
  - `coffee-200`: `#e3d3c1`
  - `coffee-600`: `#6f523d`
  - `coffee-900`: `#271c15`
- **Typography & Layout**: Modern Inter font, clean borders, generous whitespace, and strictly zero emojis.

---

## Testing & Quality Assurance

Both unit testing and end-to-end testing are configured out of the box using Vitest:

### Running Backend Unit Tests
```bash
cd backend
npm test
```
Runs unit test suites for `AppController`, `JobsService`, and `JobsController` with isolated dependency mocks.

### Running Backend E2E Tests
```bash
cd backend
npm run test:e2e
```
Executes full HTTP request lifecycle tests on a live NestJS test instance via Supertest.

### Frontend Compilation & Build Check
```bash
cd frontend
npm run build
```
Executes TypeScript type checking (`tsc`) and generates an optimized Vite production bundle.

---

## Setup and Installation Guide

### Prerequisites
- **Node.js**: v18.0.0 or later (v22.x recommended)
- **npm**: v9.x or later (v11.x recommended)
- **Git**: Installed and configured on your path

---

### Clone Repository

```bash
git clone https://github.com/prince083/Mini-Job-Queue-Dashboard.git
cd Mini-Job-Queue-Dashboard
```

---

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

4. Start the server:
   - **Development mode** (with auto-reload):
     ```bash
     npm run start:dev
     ```
   - **Production mode**:
     ```bash
     npm run start
     ```

   The backend will be live at **`http://localhost:3000`**.

---

### Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at **`http://localhost:5000`** to access the dashboard.

---

## Environment & Port Configuration

- **Backend Port**: `3000` (configurable via the `PORT` environment variable).
- **Frontend Port**: `5000` (configured in `frontend/vite.config.ts`).
- **CORS**: Configured in NestJS `main.ts` to allow cross-origin requests from `http://localhost:5000`.
- **Vite Proxy**: Pre-configured in `vite.config.ts` to forward `/jobs` requests to `http://localhost:3000`.

---

## Git & Ignore Configuration

- **`.gitattributes`**: Normalizes all repository text files to standard `LF` line endings across Windows, macOS, and Linux to prevent cross-platform CRLF false modifications.
- **`.gitignore`**: Configured to cleanly ignore:
  - Local database files (`jobs.sqlite`, `*.sqlite`).
  - Dependencies (`node_modules/`) and build outputs (`dist/`, `build/`).
  - TypeScript cache artifacts (`*.tsbuildinfo`).
  - Environment variable files (`.env*`) and runtime logs.
