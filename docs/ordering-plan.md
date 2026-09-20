# TapDine Ordering — Implementation Plan (Separate Product)

> Status: approved plan, not yet built.
> Decision: separate Next.js app + brand, **same Supabase project** as TapDine
> (shared `restaurants`, shared owner logins). First slice: ordering MVP only.

## 1. Product shape

- **TapDine (existing):** NFC landing, review generation, offers, analytics.
- **New app (this plan):** table ordering — menu → cart → live status,
  kitchen/admin orders, waiter view, call-waiter, bill request.
- The existing review flow becomes the post-meal step: order `delivered`
  morphs into ⭐ → review → Google (deep-link to TapDine review page).

## 2. Architecture (no new backend to host)

```
Customer UI ─┐
Waiter UI  ──┼──► Next.js App Router ──► Supabase (Postgres + Auth + Realtime)
Admin UI   ──┘         ▲                          ▲
                       │                          │
               Route Handlers              Realtime channels
               (/api/orders)               (orders, table_requests)
```

- No FastAPI / Redis / separate WebSocket server. Supabase Realtime
  (already proven for `events`) fans out order updates.
- Customer pages are unauthenticated; identity = `?t=<table>` in the NFC/QR URL.
- Staff (`kitchen`, `waiter` roles) log in with Supabase Auth, same project.

## 3. Database schema (new migration)

```sql
-- Tables
tables (id, restaurant_id → restaurants, number INT, UNIQUE(restaurant_id, number))

-- Menu
menu_categories (id, restaurant_id, name, sort)
menu_items (id, restaurant_id, category_id, name, price_paise INT,
            veg BOOL DEFAULT true, available BOOL DEFAULT true,
            image_url TEXT DEFAULT '', sort INT DEFAULT 0)

-- Orders (status machine: placed → accepted → ready → delivered, + cancelled)
orders (id, restaurant_id, table_id → tables, status TEXT DEFAULT 'placed',
        instructions TEXT DEFAULT '', total_paise INT DEFAULT 0,
        created_at, updated_at)
order_items (id, order_id → orders CASCADE, item_id → menu_items,
             qty INT, price_paise INT)

-- Assistance
table_requests (id, restaurant_id, table_id, type TEXT -- waiter|water|bill,
                status TEXT DEFAULT 'open', -- open → acked → done
                created_at)
```

- Extend `restaurant_members.role` check to `('owner','manager','kitchen','waiter')`.
- RLS (mirror existing patterns in `supabase/schema.sql`):
  - Public (anon): read `tables`, `menu_categories`, available `menu_items`;
    insert `orders`, `order_items`, `table_requests`.
  - Members (`kitchen`/`waiter`/`manager`/`owner`): full manage on their
    restaurant's rows. Customers never update — all mutations via
    Route Handlers with validation.
- `updated_at` trigger on `orders` (reuse `update_updated_at()`).
- Enable Realtime on `orders`, `order_items`, `table_requests`.

## 4. URL contract (printed on the tag)

```
/r/[slug]?t=12&src=nfc        → landing, table-aware banner
/r/[slug]/menu?t=12           → menu + cart + place order
/r/[slug]/order/[id]          → live status + waiter/bill buttons
/waiter                       → waiter login + pickup/deliver + requests inbox
/dashboard/orders             → (admin side, if merged later) live order feed
```

## 5. Phases (each shippable, in order)

### Phase 1 — Customer ordering MVP ← build first
- [ ] Migration: tables + menu + orders schema + RLS + Realtime.
- [ ] Admin menu CRUD (dashboard tab): categories, items, availability toggle.
- [ ] Customer menu page: categories, native search input, veg filter,
      add-to-cart, cart drawer, instructions, Place Order → `POST /api/orders`
      (server-validated prices — never trust client totals).
- [ ] Order status page: Realtime subscription, state-aware landing
      (active order → status page on tap).
- [ ] Admin order list v1: realtime feed, Accept button. (Full KDS in Phase 2.)
- Exit criteria: one real table completes tap → delivered-status end to end.

### Phase 2 — Kitchen / admin live orders
- [ ] Kanban-ish columns (New / Preparing / Ready), Ready → notify waiter.
- [ ] Audible new-order ping (muted until first user gesture).
- [ ] Per-item bestsellers + peak-hour hints (extend `Insights` rules).

### Phase 3 — Waiter view + call-waiter
- [ ] `/waiter` auth (role=`waiter`), ready-for-pickup list → Accept → Delivered.
- [ ] Requests inbox (waiter/water/bill): Acknowledge → customer sees "on the way".
- [ ] No app install; mobile-first PWA page.

### Phase 4 — Close the loop
- [ ] `delivered` → review nudge → existing TapDine `/review` generator → Google.
- [ ] Bill request → admin notification; payment stays bill-at-counter.

### Phase 5 — AI layer (last)
- [ ] Upsell ("often added with"), menu assistant, LLM analytics summaries.
- [ ] Rule-based `Insights` first; LLM only when rules feel dumb.

## 6. Deliberately out of scope

Payments gateway, Redis, separate backend repo, native waiter app,
KDS hardware, multi-language menu, inventory deduction.

## 7. Risks

- **Price tampering:** totals recomputed server-side from `menu_items`. Never
  accept client totals.
- **Realtime scale:** one channel per restaurant (`restaurant_id=eq.X`);
  fine to hundreds of concurrent tables; revisit if a venue exceeds that.
- **Brand split cost:** two apps, two deployments, shared DB migrations must
  stay backward-compatible. Mitigation: migrations additive-only.
