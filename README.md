<div align="center">
  <img src="https://via.placeholder.com/150x150/201C18/C24C1B?text=PASS" alt="Pass Logo" width="100" height="100" style="border-radius: 12px; margin-bottom: 20px;" />
  <h1 align="center">Pass</h1>
  <p align="center">
    <strong>The pass is where everything comes together.</strong>
    <br />
    A real-time, demand-aware kitchen order management system built around the ticket rail.
  </p>
  
  <p align="center">
    <a href="https://github.com/bitbyrizbit/pass"><strong>Explore the code »</strong></a>
    <br />
    <br />
    <a href="#the-concept">Concept</a>
    ·
    <a href="#features">Features</a>
    ·
    <a href="#architecture">Architecture</a>
    ·
    <a href="#getting-started">Quick Start</a>
  </p>
</div>

<hr />

## The Concept

In every kitchen, **the pass** is the final checkpoint before a plate reaches a table. We borrowed that same idea for software. Your orders, your team, your line — all visible, all real-time, all under control. 

Built for high-volume environments, **Pass** translates the physical reality of a restaurant's ticket rail into a high-performance digital workspace. It's order management for people who cook.

> *Award-level design, brutalist aesthetics, and lightning-fast real-time reactivity.*

---

## Features

### 🎫 The Kitchen Rail (`/rail`)
A real-time, drag-and-drop digital ticket rail for kitchen staff.
- **Real-time Sync**: Orders appear instantly via Supabase Realtime subscriptions.
- **Swipe to Bump**: Drag tickets right to bump them off the line, mirroring the physical action of pulling a ticket.
- **Arrival Pulse**: New tickets flash with a decaying rust glow, ensuring a busy kitchen never misses an order.
- **Elapsed Time Tracking**: Tickets automatically track how long they've been on the line.

### 📜 Customer Menu (`/menu`)
A fluid, live-updating menu for customers.
- **Demand Signals (AI Heuristic)**: Real-time velocity tracking detects when items are "moving fast" and surfaces this to customers, driving urgency and social proof.
- **Inventory Sync**: If the kitchen 86's an item, it is immediately disabled on the menu.
- **Ticket Writer Animation**: Firing an order triggers a custom "ticket printing" overlay animation.

### 🧠 Command Center (`/admin`)
A manager's dashboard for the whole operation.
- **Live Pipeline**: See the exact state of the restaurant (Fired, In Progress, Bumped, Served) at a glance.
- **Menu Control**: Optimistically toggle item availability (86 items) with a single click.
- **Demand Intelligence**: View velocity metrics and trend data for the evening's service.

### 🔐 Multi-Role Authentication
- Seamless role-based access control (RBAC) via Supabase row-level security (RLS).
- OTP (one-time password) or standard email/password login.
- Magic link fallback and strict route guards for `(kitchen)` and `(admin)` layouts.

---

## Architecture & Tech Stack

**Pass** is built to be fast, reliable, and visually stunning.

- **Framework**: Next.js 15/16 App Router (React 19)
- **Database & Auth**: Supabase (PostgreSQL, GoTrue Auth, Realtime)
- **Styling**: Tailwind CSS v4, custom CSS variables, raw brutalist aesthetics
- **Motion & 3D**: Framer Motion, GSAP, React Three Fiber (Landing Hero)
- **Language**: TypeScript (strict mode)

### Design System
The UI utilizes a highly customized token system inspired by physical kitchen elements:
- `Paper` & `Paper Dim`: Warm off-whites mimicking thermal receipt paper.
- `Ink` & `Ink Soft`: Deep, legible darks.
- `Rust` & `Brick`: Urgent, high-contrast action colors.
- `Chalkboard`: Neutral, authoritative dark greens.
- **Typography**: Instrument Serif (Display), Instrument Sans (Body), IBM Plex Mono (Data & Interface).

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/bitbyrizbit/pass.git
cd pass
npm install
```

### 2. Supabase Setup

You need a Supabase project.

1. Run the setup SQL script located in `supabase/setup.sql` in your Supabase SQL editor. This provisions tables, policies, and auth triggers.
2. Set up your environment variables:

Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the landing page.

---

## Deployment

This project is optimized for deployment on **Vercel**.

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add the Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`).
4. Ensure `NEXT_PUBLIC_SITE_URL` matches your production domain.
5. Deploy.

---

<div align="center">
  <p className="font-mono text-[10px]">bitbyrizbit / 2026</p>
</div>
