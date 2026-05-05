# Sprint 3 Dev Handoff

This document is the implementation contract for entitlement, checkout, webhook, and dashboard access.

## 1) Entitlement Matrix

| Product | Price (THB) | Tier | Access Scope | Duration |
|---|---:|---|---|---|
| Starter Daily | 19 | PAY_PER_VIEW | Deep analysis for one target report | 7 days |
| Tarot Insight | 39 | PAY_PER_VIEW | Deep tarot for one reading + follow-up context | 7 days |
| Premium Monthly | 159 | SUBSCRIBER | Soul Dashboard + unlimited deep content | 30 days rolling |

Source of truth:
- `lib/billing-config.ts`
- `lib/entitlement-matrix.ts`

## 2) API Contract (Current)

### `POST /api/checkout`
- body:
  - `purchaseType`: `"deep-insight" | "tarot-deep" | "premium-monthly"`
  - `analysisId`: optional target id
- returns:
  - `redirectUrl`
  - `sessionId`

### `POST /api/webhook/stripe`
- validates signature in production
- writes `WebhookEvent` status lifecycle:
  - `received` -> `processed`
  - `failed` (session missing / transaction failed)
- updates `CheckoutSession`
- grants entitlement (`Purchase` / `Subscription`)

### `POST /api/cron/reconcile-checkout`
- auth:
  - dev: open
  - prod: requires `Authorization: Bearer ${CRON_SECRET}`
- marks stale `pending` checkout sessions (>30m) as `failed`

## 3) Access Rules

`lib/auth-utils.ts`:
- `premium`: active subscription + non-expired
- `deep-insight`: completed purchase with same targetId and `createdAt >= now - 7d`
- `tarot-deep`: completed purchase with same targetId and `createdAt >= now - 7d`

## 4) Dashboard Rules

Soul Dashboard is computed from Lagna + transit proxy, not tarot history:
- free: 7-day preview + shield
- premium: full 30-day panel

Files:
- `lib/soul-dashboard.ts`
- `components/SoulDashboard.tsx`
- `app/vault/page.tsx`

## 5) Ops and Monitoring

Admin page:
- `app/admin/payments/page.tsx`
- KPIs:
  - pending/completed/failed checkout sessions
  - avg unlock seconds
  - webhook processed/failed (24h)
  - recent webhook events
  - product mix 7 days

## 6) Recommended Next Steps

1. Add payment provider adapter abstraction (`stripe`, `xendit`, `2c2p`) behind one interface.
2. Add webhook retry endpoint to replay failed events by event id.
3. Add events table for analytics funnel (`paywall_view`, `checkout_start`, `checkout_paid`, `unlock_success`).
4. Add line OA push scheduler from Soul Dashboard daily highlights.

