# NexusFlow CRM — Modern SaaS Dashboard

A production-ready, responsive CRM dashboard built with React + Vite + TypeScript featuring a unique **Aurora Dark** design system.

---

## Quick Start

```bash
npm install
npm run dev
```

Visit **http://localhost:5173** and login with:
- Email: `admin@nexusflow.io`
- Password: `password123`

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v3 + Custom CSS Variables |
| State | Zustand + React Query |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Data | DummyJSON API + Static Mock JSON |

---

## Pages

1. **Login** — Email/password validation, password toggle, remember me
2. **Dashboard** — 5 KPI cards + sparklines, revenue chart, donut chart, sales funnel, activity feed
3. **Customers** — Real DummyJSON API, search, sort, filter, pagination
4. **Orders** — Search, filter, edit status modal, delete confirmation, optimistic updates
5. **Settings** — Profile form, avatar upload, theme switcher, notification toggles, password change

---

## Project Structure

```
src/
├── api/              # fetchCustomers, fetchOrders
├── components/
│   ├── charts/       # RevenueAreaChart, CustomerDonutChart, SalesFunnelChart, Sparkline
│   ├── dashboard/    # KPICard, ActivityFeed
│   ├── layout/       # Sidebar, Topbar, PageShell
│   └── ui/           # Avatar, Badge, Modal, Skeleton, Toast
├── data/             # mockData.ts
├── pages/            # Login, Dashboard, Customers, Orders, Settings
├── store/            # Zustand stores
├── types/            # TypeScript interfaces
├── utils/            # Utilities
└── index.css         # Aurora Design System
```

---

## Design — Aurora Dark Theme

- Background: `#070B14` (deep space)
- Primary: `#00D4AA` (teal aurora)
- Secondary: `#7C3AED` (violet)
- Accent: `#F59E0B` (gold)
- Glassmorphism cards, neon glow effects, CSS micro-animations

*NexusFlow CRM — Built with React, TypeScript, and the Aurora Dark design system.*
