# Payments Flow Diagram

```mermaid
flowchart TD
  A[User clicks unlock] --> B[POST /api/checkout]
  B --> C[Create CheckoutSession status=pending]
  C --> D[Redirect to provider page]
  D --> E[Provider webhook to /api/webhook/stripe]
  E --> F{Signature valid?}
  F -- no --> G[Reject 401]
  F -- yes --> H[Create WebhookEvent status=received]
  H --> I{Session found?}
  I -- no --> J[WebhookEvent status=failed]
  I -- yes --> K{Payment completed?}
  K -- no --> L[CheckoutSession -> failed]
  L --> M[WebhookEvent -> processed]
  K -- yes --> N[CheckoutSession -> completed]
  N --> O{purchaseType}
  O -- deep-insight / tarot-deep --> P[Insert Purchase]
  O -- premium-monthly --> Q[Upsert Subscription + Purchase]
  P --> R[WebhookEvent -> processed]
  Q --> R
  R --> S[User redirected to /checkout/success]
  S --> T[Feature unlocked]
```

## Reconcile Job

- Endpoint: `POST /api/cron/reconcile-checkout`
- Purpose: convert stale `pending` sessions to `failed` if older than 30 minutes.
- Trigger: cron every 15 minutes.

