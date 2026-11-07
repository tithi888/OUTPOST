# GRANTLY — Unified Scholarship Discovery & Management Platform

> Built for **THE OUTPOST 2026** (Individual Frontend Development Hackathon by Frontend Arena)

GRANTLY transforms the confusing, scattered scholarship search process into an intelligent, personalized, and seamless student operating system. It brings together unified scholarship discovery, smart diagnostic eligibility evaluation, document readiness tracking, and a Kanban application management pipeline in one cohesive SaaS application.

---

## 🌟 Key Features

### 1. 🔍 Powerful Discovery Engine
- **Multi-dimensional Filtering**: Filter by education level (High School, Undergrad, Masters, PhD), category/discipline (STEM, Women in Tech, First-Generation, Need-Based, Merit-Based, Arts), award amount tiers, household income ceiling, provider type, and deadline urgency.
- **Smart Match Sorting**: Sort by AI diagnostic match score, deadline soonest, award amount (highest/lowest), and recently added.
- **Instant Search**: Real-time query matching across title, provider, field, and tags.
- **Bookmark & Quick Tracking**: 1-click bookmarking and pipeline tracking directly from discovery cards.

### 2. 🧠 Smart Diagnostic Eligibility Checker
- **Real-Time Profile Alignment**: Evaluates student profile (GPA normalized across 4.0, 10.0 CGPA, and 100% scales, annual household income, education level, category, and state) against specific scholarship prerequisites.
- **Transparent Status Badges**: Shows **Eligible**, **Potentially Eligible**, or **Not Eligible** with line-by-line explanations for each criterion.
- **Honest Compliance**: Explicitly distinguishes verified requirements from simulation data, never claiming guaranteed financial aid.

### 3. 📊 Personalized Student Dashboard
- **Welcome & Metric KPIs**: Total potential matched funding, high-match opportunities, active application pipeline, and document readiness score.
- **Recharts Data Visualizations**: Live pipeline stage distribution chart.
- **Deadline Sentinel Widget**: Highlights critical deadlines with countdown clocks (&lt;7 days, &lt;30 days).
- **Recent Activity Feed**: Chronological log of recent application status transitions.

### 4. 🗂️ Application Pipeline Tracker (Kanban & Table Views)
- **6 Standard Stages**: `Interested` → `Saved` → `Applying` → `Applied` → `Approved` → `Rejected`.
- **Dual View Support**: Switch between interactive Kanban columns and a clean data table.
- **Personal Notes & Audit History**: Keep timestamped notes, submission codes, and status transition logs.
- **Full LocalStorage Persistence**: All changes persist locally across page refreshes.

### 5. 📁 Document Readiness Vault
- **Readiness Meter**: Real-time percentage indicator of verified document preparedness.
- **Checklist of Common Requirements**: Income certificates, certified marksheets, identity proof, bonafide enrollment letters, bank passbooks, affidavits, and SOPs.
- **Simulated Demo Uploader**: Interactive drag-and-drop file upload simulator with validation and staged document status.
- **Custom Document Adder**: Add bespoke scholarship document requirements to your checklist.

### 6. ⏰ Deadline Sentinel & Calendar Radar
- **Chronological Urgency Ticker**: Categorized into Critical (&lt;7 days), Approaching (&lt;30 days), Future, and Passed.
- **Countdown Clocks**: Clear visual urgency badges so students never miss an application cutoff.

### 7. 👤 Evaluator Sandbox & Profile Manager
- **1-Click Persona Switcher**: Instantly load pre-configured test profiles to evaluate matching rules:
  - **Aarav Patel**: Undergrad CS • First-Gen • GPA 3.72
  - **Elena Rodriguez**: Undergrad AI • Women in Tech • GPA 3.88
  - **Marcus Vance**: Postgrad Public Policy • Need-Based • GPA 3.45
- **Export Backup**: Download your entire state as a local JSON file.
- **Reset to Defaults**: 1-click restore to sample state.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | React 19 + TypeScript + Vite |
| **Styling** | Tailwind CSS v4 + Plus Jakarta Sans Typography |
| **Routing** | React Router v7 |
| **Icons** | Lucide React |
| **Data Viz** | Recharts (Responsive Container, Bar Charts) |
| **State & Persistence** | React Context API + LocalStorage Sync Engine |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v24+)
- npm or pnpm

### Installation & Run

```bash
# Navigate to project directory
cd grantly

# Install dependencies (if not already installed)
npm install

# Start local development server
npm run dev

# Or create production build
npm run build
npm run preview
```

The application runs on Vite's default dev server (typically `http://localhost:5173`).

---

## 🧭 Application Structure & Routes

- `/` — **Landing Page**: Value proposition, interactive search hero, dashboard preview, problem vs solution, how-it-works, trust metrics.
- `/onboarding` — **Student Onboarding**: 4-step wizard with validation, progress indicators, and instant 1-click demo autofill.
- `/dashboard` — **Student Command Center**: Recharts pipeline breakdown, match rankings, readiness gauge, approaching deadlines alert.
- `/discover` — **Scholarship Discovery Engine**: Search, comprehensive filters, sorting, bookmarks, and match diagnostics.
- `/scholarship/:id` — **Scholarship Details**: In-depth criteria breakdown, live document checklist alignment, application simulator, and diagnostic box.
- `/tracker` — **Application Pipeline**: Dual Kanban and Table views with notes modal and status switcher.
- `/documents` — **Document Readiness Vault**: Checklist of verified certificates, readiness score, demo upload simulator.
- `/deadlines` — **Deadline Sentinel**: Chronological urgency radar with countdown badges.
- `/settings` — **Profile & Platform Settings**: Edit student attributes, switch evaluator personas, export JSON backup, reset demo records.

---

## ⚖️ Hackathon Compliance & Integrity Notice

GRANTLY is an individual submission engineered for **THE OUTPOST** 6-hour frontend hackathon. All mock scholarship deadlines, requirements, and aid values are realistic demonstration models for functional evaluation and should not be construed as official government or corporate financial advice. All student records remain private in client-side LocalStorage.
