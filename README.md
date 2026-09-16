# Job Orchestrator - Fullstack System

A fullstack job management platform featuring an asynchronous backend API built with NestJS and TypeORM, paired with a minimalist desktop dashboard built with React (TypeScript), Vite, and Tailwind CSS v3.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture & Design System](#architecture--design-system)
4. [Backend Specification](#backend-specification)
   - [Database & Entities](#database--entities)
   - [Allowed State Transitions](#allowed-state-transitions)
   - [API Endpoints](#api-endpoints)
5. [Frontend Specification](#frontend-specification)
   - [Features](#features)
   - [Component Structure](#component-structure)
   - [Theme & Aesthetics](#theme--aesthetics)
6. [Setup and Installation Guide](#setup-and-installation-guide)
   - [Prerequisites](#prerequisites)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
7. [Environment & Port Configuration](#environment--port-configuration)
8. [Ignored and Unnecessary Files](#ignored-and-unnecessary-files)

---

## Project Overview

Job Orchestrator is designed to manage and track lifecycle transitions of background tasks and operational jobs. It provides:
- Reliable persistence via SQLite and TypeORM.
- Strict atomic status validation to guard against race conditions and invalid state progressions.
- A desktop-focused, low-distraction UI with status counters, keyword search, contextual transition menus, and error boundary handling.

---

## Tech Stack

### Backend
- **Framework**: NestJS (v12) with Express platform
- **Language**: TypeScript (Node.js ES modules)
- **Database**: SQLite via `better-sqlite3` and `TypeORM`
- **Validation**: `class-validator` and `class-transformer`

### Frontend
- **Framework**: React 19 with TypeScript
- **Bundler / Dev Server**: Vite (running on port 5000)
- **Styling**: Tailwind CSS v3 with custom PostCSS configuration
- **Icons**: Lucide React
- **HTTP Client**: Axios

---

## Architecture & Design System

The repository is structured as a monorepo containing both backend and frontend applications:

```text
NestJs/
├── .git/                      # Root Git repository
├── .gitignore                 # Root Git exclusion rules
├── README.md                  # Complete system documentation
├── backend/                   # NestJS API application
│   ├── src/
│   │   ├── jobs/              # Jobs module, entity, controller, service, DTOs
│   │   ├── app.module.ts      # Root application module and TypeORM connection
│   │   └── main.ts            # NestJS entrypoint, CORS configuration
│   ├── package.json
│   └── tsconfig.json
└── frontend/                  # React + TypeScript client
    ├── src/
    │   ├── components/        # Header, StatusCards, JobFilters, JobTable, etc.
    │   ├── services/          # Axios HTTP client with error formatting
    │   ├── types/             # Domain TypeScript definitions and transition maps
    │   ├── App.tsx            # Main application layout and state manager
    │   ├── main.tsx           # React DOM root render
    │   └── index.css          # Tailwind base layer
    ├── index.html             # Desktop viewport with Inter typography
    ├── tailwind.config.js     # Matcha and Coffee color tokens
    ├── postcss.config.js      # PostCSS configuration
    ├── vite.config.ts         # Vite configuration (port 5000 + proxy)
    └── package.json
```

---

## Backend Specification

### Database & Entities

The application utilizes a local SQLite database (`jobs.sqlite`) through TypeORM. The core entity is `Job`:

| Field | Type | Description |
|---|---|---|
| `id` | number (Primary Key) | Auto-incrementing identifier |
| `title` | string | Description or title of the job |
| `type` | string | Identifier tag (e.g. `data_export`, `email_sync`) |
| `status` | JobStatus enum | Current job status (`pending`, `running`, `completed`, `failed`) |
| `createdAt` | Date | Timestamp generated automatically on creation |

### Allowed State Transitions

Job transitions follow strict lifecycle constraints:

```text
pending  ───> running ───> completed (terminal)
    │             │
    │             └───> failed (terminal)
    │
    ├───> completed (terminal)
    └───> failed (terminal)
```

- **Pending**: Can transition to `running`, `completed`, or `failed`.
- **Running**: Can transition to `completed` or `failed`.
- **Completed**: Terminal state (no further transitions permitted).
- **Failed**: Terminal state (no further transitions permitted).

The backend executes optimistic concurrency checking on status transitions to guarantee atomic updates without race conditions.

### API Endpoints

All endpoints are rooted under `/jobs`:

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `GET` | `/jobs` | None | Retrieves all jobs ordered by `createdAt DESC` |
| `POST` | `/jobs` | `{ title: string, type: string }` | Creates a new job with initial status `pending` |
| `PATCH` | `/jobs/:id/status` | `{ status: JobStatus }` | Updates job status following valid transition rules |
| `DELETE`| `/jobs/:id` | None | Deletes job record |

---

## Frontend Specification

### Features

1. **All Jobs Display**: Desktop table rendering ID, title, type tag, status badge, timestamp, contextual status dropdown, and deletion button.
2. **Status Metrics**: Interactive counter cards showing counts for:
   - Total Jobs
   - Pending
   - Running
   - Completed
   - Failed
3. **Dynamic Filtering**:
   - Status tabs filter records instantly. Clicking any metric card also selects that status filter.
   - Real-time text search filters by job title or type with an instant clear button.
4. **Job Creation**: Clean modal dialogue with field validation and pre-populated job type suggestions (`data_export`, `email_digest`, `report_generation`, `image_processing`).
5. **Contextual Status Transitions**: The action dropdown only lists valid next statuses according to the transition matrix. Jobs in terminal states (`completed` or `failed`) display a `"Terminal state"` indicator.
6. **Deletion with Confirmation**: Inline safety toggle (`Confirm` / `Cancel`) prevents accidental deletion.
7. **Error & Loading States**:
   - Loading skeletons during initial data fetch.
   - Background refresh indicator on the header refresh button.
   - Non-intrusive alert banner with server error messages and retry trigger.

### Theme & Aesthetics

- **Matcha Tea Palette**: Soft sage and forest greens used for running/completed states, primary action buttons, and active indicators:
  - `matcha-50`: `#f4f7f4`
  - `matcha-100`: `#e5ece2`
  - `matcha-500`: `#5d8d55`
  - `matcha-700`: `#3c5b37`
- **Brown Coffee Palette**: Warm roasted tones used for background canvases, borders, and typography:
  - `coffee-50`: `#faf7f2`
  - `coffee-100`: `#f2eae0`
  - `coffee-200`: `#e3d3c1`
  - `coffee-600`: `#6f523d`
  - `coffee-900`: `#271c15`
- **Minimalist Principles**: Clean borders, generous whitespace, Inter typography, and strictly zero emojis across code and interface.

---

## Setup and Installation Guide

### Prerequisites
- **Node.js**: v18.0.0 or later (v22.x recommended)
- **npm**: v9.x or later (v11.x recommended)
- **Git**: Installed and available on system PATH

---

### Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the backend:
   ```bash
   npm run build
   ```

4. Start the backend server:
   - In development watch mode:
     ```bash
     npm run start:dev
     ```
   - In standard mode:
     ```bash
     npm run start
     ```

   The backend will start on **`http://localhost:3000`**.

---

### Frontend Setup

1. Open a second terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Access the dashboard:
   Open your browser at **`http://localhost:5000`**.

---

## Environment & Port Configuration

- **Backend Port**: `3000` (configurable via `PORT` environment variable in `backend/`).
- **Frontend Port**: `5000` (configured in `frontend/vite.config.ts`).
- **CORS**: Enabled on the NestJS backend to permit cross-origin requests from `http://localhost:5000`.
- **API Proxy**: The Vite development server is configured to proxy requests from `/jobs` to `http://localhost:3000`.

---

## Ignored and Unnecessary Files

The project `.gitignore` files have been configured to exclude:
- Unused NestJS scaffold boilerplate (`src/app.controller.ts`, `src/app.service.ts`, `src/app.controller.spec.ts`).
- Unconfigured spec tests lacking dependency mocks (`src/jobs/jobs.controller.spec.ts`, `src/jobs/jobs.service.spec.ts`, `test/app.e2e-spec.ts`).
- Incremental build caches (`tsconfig.build.tsbuildinfo`).
- Local SQLite database files (`jobs.sqlite`).
- Node dependencies (`node_modules/`) and compiled artifacts (`dist/`).
