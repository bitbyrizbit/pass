<div align="center">
  <h1 align="center">Ace or Ace</h1>
</div>

# Pass

*An order management system built around the one thing every kitchen already trusts - the ticket rail.*

---

## The idea, in one paragraph

Every restaurant tech demo solves this the same way: a customer app bolted to an admin dashboard, talking to each other through an API and nothing else. That's not how a kitchen actually runs. A kitchen runs on a rail - tickets get written, clipped, bumped, fired, and pulled, and that one physical object is the most battle-tested coordination system in the industry. Pass doesn't decorate that idea with paper textures. It builds the actual mechanic: an order is a ticket, a ticket lives on a rail, and every screen in this product - customer, kitchen, manager - is a different vantage point on the same rail, not three unrelated interfaces sharing a database.

## Why the name

A pass is the counter in a real kitchen where a finished ticket gets called out and handed from the kitchen to the floor. It's not a made-up product name chosen because it sounded clean on a landing page - it's the literal object this system is modeled on. If you ask why it's called that, the answer is "because that's what it is," not "because it tested well."

## What it looks like

No glass panels, no dark-mode gradient hero, no bento grid. The palette is warm paper and ink - cream, charcoal, one working accent (rust, the color of a fired ticket) - because a kitchen at night is lit warm, not lit like a SaaS pitch deck. Type pairs an editorial italic serif against a receipt-printer monospace, because those are the two voices an actual kitchen speaks in: the handwriting on the wall and the print on the chit. Every ticket-shaped surface has a genuine torn top edge, built with a real clip-path polygon, not a fake border image. Buttons are named `fire`, `hold`, and `bump` - the actual vocabulary of a kitchen line - because naming them "primary" and "secondary" would have let the product forget what it's supposed to be.

## Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind v4
- **Backend:** Next.js server actions and route handlers - no separate service, kept monolithic on purpose for a solo 72-hour build
- **Database, auth, realtime:** Supabase (Postgres, row-level security, live channels)
- **Motion:** Framer Motion for spring physics and drag interactions, GSAP where scroll-driven sequencing was needed
- **Deployment:** Vercel

## User stories completed

- **Bronze** - a full interface for both customer ordering and kitchen operations, built around one coherent visual and interaction language instead of two disconnected products
- **Silver** - email/password auth, OTP via email, and real role-based access separating customer, staff, and admin views at the database level, not just hidden in the UI
- **Gold** - a manager view covering live orders, menu availability, and a running sales summary, built as the same rail concept viewed from the pass rather than a bolted-on generic admin panel
- **Platinum** - a live demand signal that flags which dishes are trending toward selling out, computed from real order velocity and surfaced on both the customer menu and the manager view

## On the AI feature, specifically

The demand signal is an order-velocity heuristic, not a trained model. It counts recent orders per dish in a rolling window and classifies momentum into three states. That's a deliberate, stated scope decision, not a shortcut hidden behind a fancy name - a real forecasting model needs historical data this system doesn't have in 72 hours, and claiming otherwise would be a worse look than being precise about what this actually is. What's real is that it's live, server-computed from actual order data, and genuinely changes what a customer or manager sees on screen in real time.

## Known scope decisions

Being direct about tradeoffs here, because pretending a 72-hour solo build has no edges would be a worse signal than naming them plainly:

- Email delivery runs through Resend's shared sending address for this build, which restricts OTP delivery to the account's own verified email. A production deployment would use a verified sending domain to lift that restriction.
- Staff role assignment is done manually at the database level for this build. A real invite-and-promote flow is the obvious next step, not an oversight.
- The hero section uses a high-fidelity static fallback with Framer Motion and GSAP scroll-driven sequencing instead of WebGL 3D physics. Given the strict 72-hour window, optimizing performance and perfecting the core rail logic took precedence over 3D physics rendering in the browser. 
- Google OAuth was wired up in the code, but intentionally excluded from the final deployed UI to avoid Cloud Console verification friction for hackathon judges testing the live URL.

## Future Exploration (What's Next)

- **Audio-Reactive Interactions:** Wiring the Web Audio API to the ticket writer so the physical "zzzt-zzzt" of a receipt printer drives the CSS `transform` of the ticket sliding into view in real time.
- **Thermal Heatmap Gestures:** Implementing a WebGL or canvas overlay on the kitchen rail where dragging a ticket leaves a temporary infrared "heat trail" based on the velocity of the line cook's drag.

## Running it locally

```
git clone https://github.com/bitbyrizbit/pass.git
cd pass
npm install
```

Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

```
npm run dev
```

## Live

[https://pass-iota-seven.vercel.app/](https://pass-iota-seven.vercel.app/)

---

*Built solo, ground up, in 72 hours for VibeAthon 6.0.*
