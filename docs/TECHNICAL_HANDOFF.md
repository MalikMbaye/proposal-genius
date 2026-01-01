# PitchGenius Technical Handoff Document

**Last Updated:** January 2026  
**Purpose:** Complete context for any engineer inheriting this codebase

---

## 1. What This Product Is

**PitchGenius** is a B2B proposal generation SaaS for consultants, agencies, and freelancers. Users input their business background + client context, and the platform generates:

- **Proposal Document** — AI-generated via Claude Sonnet 4, streamed in real-time
- **Presentation Deck** — Generated via Manus AI (external service), delivered as PDF
- **Contract Template** — Auto-generated based on project scope
- **Email Drafts** — Proposal email and contract email
- **Invoice Description** — Copy for billing

**Target User:** Solo consultants and small agencies who win work through proposals but hate writing them.

---

## 2. Product & UX Decisions

### 2.1 Core User Flow

```
Landing Page → Quick Signup (email only) → Profile Setup → Create Proposal → Generate → Preview/Edit → Download/Share
```

**Key UX Decisions:**

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| **Quick signup (email only, no password)** | Minimize friction to first value. Auto-generate password, send reset email. | Slightly awkward if user wants to log in immediately |
| **Profile-first before generation** | Capture business context once, reuse across all proposals | Extra step before first proposal |
| **Streaming proposal generation** | Show progress during 30-60s generation. Feels responsive. | More complex implementation |
| **Async deck generation with email notification** | Decks take 5-7 min. Can't make user wait. | User leaves and forgets to check email |
| **All deliverables on one preview page** | Show value immediately. Copy-paste friendly. | Long page, lots of scrolling |

### 2.2 Pricing & Monetization Strategy

| Tier | Price | What They Get | Strategic Intent |
|------|-------|---------------|------------------|
| **Free** | $0 | 2 proposals (IP-tracked) | Acquisition funnel |
| **Pro Monthly** | $X/mo | Unlimited proposals | Core subscription |
| **Lifetime** | One-time | Unlimited forever | Cash flow + viral potential |
| **Pro Library** | Add-on | Case study templates | Upsell for power users |
| **Extra Proposals** | One-time pack | +N proposals | Monetize free tier overflow |

**Key Decision:** Free tier tracked by IP address, not account. Allows trying without signup.

### 2.3 Feature Inventory

| Feature | Status | Notes |
|---------|--------|-------|
| Proposal generation (streaming) | ✅ Live | Claude Sonnet 4 |
| Deck generation (async) | ✅ Live | Manus AI, 5-7 min |
| Contract generation | ✅ Live | Included in proposal output |
| Email drafts | ✅ Live | Proposal email + contract email |
| Invoice description | ✅ Live | Short copy for billing |
| Case study library | ✅ Live | Pre-built templates |
| Document parsing (RFP upload) | ✅ Live | Extract context from client docs |
| Proposal editing | ✅ Live | Modal editor post-generation |
| PPTX export | ✅ Live | Client-side via pptxgenjs |
| Deck PDF download | ✅ Live | From Manus output |
| Stripe subscriptions | ✅ Live | Monthly + lifetime + add-ons |
| Email notifications | ✅ Live | Deck completion via Resend |

---

## 3. Architecture Decisions

### 3.1 Tech Stack Choices

| Layer | Choice | Why This |
|-------|--------|----------|
| **Frontend** | React 18 + Vite + TypeScript | Fast dev experience, type safety |
| **Styling** | Tailwind + shadcn/ui | Rapid UI development, consistent design system |
| **State** | Zustand (form), React Query (server) | Simple, minimal boilerplate |
| **Auth** | Supabase Auth | Built-in, RLS integration |
| **Database** | Supabase Postgres | Managed, RLS, realtime subscriptions |
| **Backend** | Supabase Edge Functions (Deno) | Serverless, auto-scaling, close to DB |
| **Payments** | Stripe | Industry standard, webhooks |
| **AI - Proposals** | Anthropic Claude Sonnet 4 | Best writing quality at acceptable cost |
| **AI - Decks** | Manus AI | Only service that generates designed PDFs |
| **Email** | Resend | Simple API, good deliverability |

### 3.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vite + React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │
│  │  Pages   │  │  Hooks   │  │ Zustand  │  │   React Query        │ │
│  │          │  │ useAuth  │  │  Store   │  │   (server state)     │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────────┬───────────┘ │
└───────┼─────────────┼─────────────┼────────────────────┼────────────┘
        │             │             │                    │
        ▼             ▼             ▼                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      SUPABASE EDGE FUNCTIONS                         │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐ │
│  │generate-proposal│  │ generate-deck  │  │   poll-deck-jobs      │ │
│  │  (streaming)   │  │ (starts Manus) │  │   (pg_cron, 1 min)    │ │
│  └───────┬────────┘  └───────┬────────┘  └───────────┬────────────┘ │
│          │                   │                       │              │
│  ┌───────┴───────────────────┴───────────────────────┴────────────┐ │
│  │                    Other Functions                              │ │
│  │  check-subscription, create-checkout, customer-portal,         │ │
│  │  record-usage, check-ip-usage, send-deck-notification,         │ │
│  │  parse-document, generate-asset                                │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└───────┬─────────────────────┬─────────────────────┬─────────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Claude API  │      │  Manus AI    │      │   Stripe     │
│  (proposals) │      │   (decks)    │      │  (payments)  │
└──────────────┘      └──────────────┘      └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SUPABASE POSTGRES (with RLS)                      │
│  ┌────────────┐ ┌──────────────────┐ ┌───────────────────────────┐  │
│  │  profiles  │ │    proposals     │ │   deck_generation_jobs    │  │
│  │            │ │                  │ │                           │  │
│  ├────────────┤ ├──────────────────┤ ├───────────────────────────┤  │
│  │user_       │ │ proposal_drafts  │ │   user_subscriptions      │  │
│  │subscriptions│ │                  │ │                           │  │
│  └────────────┘ └──────────────────┘ └───────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Why These Patterns

#### Streaming SSE for Proposals

**Problem:** Claude takes 30-60s to generate a full proposal. Users need feedback.

**Solution:** Server-Sent Events (SSE) stream from Claude → Edge Function → Client

```typescript
// Edge function streams directly to client
return new Response(response.body, {
  headers: { 'Content-Type': 'text/event-stream' }
});
```

**Client parses line-by-line:**
```typescript
while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
  const line = buffer.slice(0, newlineIndex);
  // Parse SSE data, update UI immediately
}
```

#### Async Job Queue for Decks

**Problem:** Manus AI takes 5-7 minutes. Can't hold HTTP connection.

**Solution:** Database-backed job queue + server-side polling via pg_cron

```
1. User clicks "Generate Deck"
2. Insert job to deck_generation_jobs (status: pending)
3. Call generate-deck → Manus API → get task_id
4. Store manus_task_id in job
5. pg_cron runs poll-deck-jobs every minute
6. On completion: update job, email user via send-deck-notification
7. Frontend shows result from DB
```

**Why pg_cron instead of client polling?**
- User can close browser
- More reliable
- Reduces client complexity
- Email notification works even if user leaves

#### Zustand for Form State

**Why not React Query for form state?**
- Form state is local, ephemeral
- No server sync needed until generation
- Zustand is simpler for wizard-style multi-step forms

**What Zustand manages:**
- Client name, context, background
- Pricing tiers
- Selected case studies
- Proposal length preference
- All deliverables after generation

---

## 4. Database Design

### 4.1 Table Structure

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User profile (company, background, proof points) | id (matches auth.users), company_name, business_context, background, proof_points |
| `proposals` | Saved proposals with all deliverables | client_name, proposal, contract, deck_prompt, deck_url, budget_min/max |
| `proposal_drafts` | Auto-saved form state before generation | Same fields as form, last_saved_at |
| `deck_generation_jobs` | Async deck generation queue | status, manus_task_id, progress, result_url, error_message |
| `user_subscriptions` | Stripe subscription mirror | subscription_type, status, stripe_customer_id, current_period_end |
| `proposal_usage` | Usage tracking for free tier | user_id, ip_address, created_at |
| `api_usage_tracking` | Token/cost tracking | function_name, input_tokens, output_tokens, estimated_cost_cents |

### 4.2 RLS Policies

**Every table has RLS enabled.** Core pattern:

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own" ON table_name
FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own data
CREATE POLICY "Users can insert own" ON table_name
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**Special cases:**
- `user_subscriptions`: SELECT only (Stripe webhooks do INSERT/UPDATE via service role)
- `proposal_usage`: INSERT + SELECT only (no UPDATE/DELETE)
- `api_usage_tracking`: SELECT only for users, INSERT via service role

### 4.3 Key Relationships

```
profiles.id ←→ auth.users.id (1:1, created via trigger on signup)
proposals.user_id → profiles.id
deck_generation_jobs.proposal_id → proposals.id (optional)
deck_generation_jobs.user_id → profiles.id
```

**Note:** No CASCADE deletes. If user is deleted, orphaned records remain. (Tech debt)

---

## 5. Edge Function Details

| Function | Auth | Purpose | External API |
|----------|------|---------|--------------|
| `generate-proposal` | Public (rate limited) | Stream Claude response | Anthropic |
| `generate-deck` | JWT required | Start Manus task, create job | Manus AI |
| `poll-deck-jobs` | Service role (internal) | Check Manus status, update jobs | Manus AI |
| `send-deck-notification` | Service role (internal) | Email when deck ready | Resend |
| `check-subscription` | JWT required | Return user's subscription status | — |
| `create-checkout` | JWT required | Create Stripe checkout session | Stripe |
| `customer-portal` | JWT required | Create Stripe portal session | Stripe |
| `check-ip-usage` | Public | Free tier IP-based limiting | — |
| `record-usage` | Optional JWT | Record proposal generation | — |
| `parse-document` | JWT required | Parse uploaded RFPs | — |
| `generate-asset` | JWT required | Generate additional assets | Anthropic |

### 5.1 Retry Logic

**Manus API calls (generate-deck, poll-deck-jobs):**
```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T>
```
- 3 retries with exponential backoff
- Handles transient failures

**Client-side (useDeckGenerationJob):**
- 3 retries for starting generation
- Exponential backoff (1s, 2s, 3s)

---

## 6. Design System

### 6.1 Philosophy

- **Dark-mode-first** premium SaaS aesthetic
- Reference brands: Linear, Vercel, Stripe
- Light/dark section switching via `.section-light` / `.section-dark`

### 6.2 Typography

| Use | Font |
|-----|------|
| Display/Headers | Space Grotesk |
| Code/Monospace | JetBrains Mono |
| Body | System default (Inter-like) |

### 6.3 Color System

All colors use HSL and semantic tokens in `index.css`:

```css
:root {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 152 76% 42%;  /* Green accent */
  --primary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --accent: 240 3.7% 15.9%;
  /* ... */
}
```

**Rule:** Never use raw colors in components. Always use semantic tokens.

### 6.4 Custom Effects

- **Glow animations** — Subtle glow on hover for premium feel
- **Glass-morphism cards** — Backdrop blur + transparency
- **Grid patterns** — Background texture on landing sections

---

## 7. Security Decisions

| Area | Decision | Notes |
|------|----------|-------|
| **RLS** | Enabled on all tables | `auth.uid() = user_id` pattern |
| **API Keys** | Stored in Supabase secrets | Never in client code |
| **CORS** | Wildcard `*` on edge functions | ⚠️ Should restrict in production |
| **Service Role** | Only for internal functions | poll-deck-jobs, send-deck-notification |
| **Free Tier Abuse** | IP-based tracking | check-ip-usage edge function |
| **Password Security** | Supabase leaked password check | ⚠️ Verify enabled in Auth settings |

---

## 8. Known Tech Debt & Issues

### 8.1 Console Warnings

| Warning | Cause | Fix Status |
|---------|-------|------------|
| DropdownMenu forwardRef | Radix/React issue | ✅ Fixed with MenuLink wrapper |
| React Router splat paths | v6 deprecation | Pending migration |

### 8.2 Architectural Debt

| Issue | Impact | Recommendation |
|-------|--------|----------------|
| No Stripe webhooks | Payment could succeed but subscription not sync | Implement webhook endpoint |
| No error tracking | Silent failures in production | Add Sentry |
| No CASCADE deletes | Orphaned records on user deletion | Add migration |
| CORS wildcard | Security risk | Restrict to prod domains |
| No usage cost caps | Potential API abuse | Add per-user limits |

### 8.3 UX Debt

| Issue | Impact | Recommendation |
|-------|--------|----------------|
| No deck cancellation | User stuck waiting 5-7 min | Add cancel button |
| No draft auto-save | Form data lost on crash | Save to localStorage |
| No queue position | User doesn't know wait time | Show position in queue |

---

## 9. Key Files Reference

### Frontend Structure

```
src/
├── components/
│   ├── landing/          # Landing page sections
│   ├── ui/               # shadcn components
│   ├── Navbar.tsx        # Main navigation
│   ├── ProtectedRoute.tsx # Auth wrapper
│   └── ...
├── hooks/
│   ├── useAuth.tsx       # Authentication context
│   ├── useSubscription.tsx # Subscription status
│   ├── useDeckGenerationJob.ts # Deck generation logic
│   ├── useStreamingProposal.ts # Proposal streaming
│   └── useDraftAutosave.ts # Form persistence
├── lib/
│   ├── proposalStore.ts  # Zustand store
│   ├── utils.ts          # Shared utilities
│   └── loadingContent.ts # Loading screen content
├── pages/
│   ├── Index.tsx         # Landing page
│   ├── Auth.tsx          # Login/signup
│   ├── Generate.tsx      # Proposal wizard
│   ├── Preview.tsx       # Results page
│   ├── Proposals.tsx     # Library/history
│   └── Profile.tsx       # User settings
└── integrations/
    └── supabase/
        ├── client.ts     # ⚠️ Auto-generated, don't edit
        └── types.ts      # ⚠️ Auto-generated, don't edit
```

### Backend Structure

```
supabase/
├── functions/
│   ├── generate-proposal/index.ts  # Claude streaming
│   ├── generate-deck/index.ts      # Manus task creation
│   ├── poll-deck-jobs/index.ts     # pg_cron job processor
│   ├── send-deck-notification/     # Email on completion
│   ├── check-subscription/         # Subscription lookup
│   ├── create-checkout/            # Stripe checkout
│   ├── customer-portal/            # Stripe portal
│   ├── check-ip-usage/             # Free tier limiting
│   ├── record-usage/               # Usage tracking
│   ├── parse-document/             # RFP parsing
│   └── generate-asset/             # Additional generation
└── config.toml                     # Function configuration
```

---

## 10. Environment & Secrets

### Client-side (in .env, auto-generated)

```
VITE_SUPABASE_URL=https://npvqjlclfqzjgrlibyrf.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_SUPABASE_PROJECT_ID=npvqjlclfqzjgrlibyrf
```

### Server-side (Supabase secrets)

| Secret | Used By |
|--------|---------|
| `ANTHROPIC_API_KEY` | generate-proposal, generate-asset |
| `MANUS_API_KEY` | generate-deck, poll-deck-jobs |
| `STRIPE_SECRET_KEY` | create-checkout, customer-portal |
| `RESEND_API_KEY` | send-deck-notification |
| `SUPABASE_SERVICE_ROLE_KEY` | poll-deck-jobs (admin ops) |

---

## 11. Deployment

- **Frontend:** Auto-deploys via Lovable on code push
- **Edge Functions:** Auto-deployed with frontend
- **Database:** Managed by Supabase, migrations via Lovable
- **Secrets:** Configured in Supabase dashboard

**To deploy:**
1. Make changes in Lovable
2. Changes auto-deploy to staging
3. Click "Publish" for production

---

## 12. Critical Paths to Understand

### Path 1: Proposal Generation

```
1. User fills form → Zustand store
2. Clicks "Generate" → useStreamingProposal.startStreaming()
3. POST to generate-proposal edge function
4. Edge function calls Claude API with streaming
5. SSE events flow back to client
6. Client parses, updates UI in real-time
7. On complete: parse sections, save to DB
```

### Path 2: Deck Generation

```
1. User clicks "Generate Deck"
2. useDeckGenerationJob.startGeneration()
3. Insert job to deck_generation_jobs (pending)
4. Call generate-deck → Manus API → get task_id
5. Update job with manus_task_id (running)
6. pg_cron runs poll-deck-jobs every 60s
7. poll-deck-jobs checks Manus status
8. On complete: update job, call send-deck-notification
9. User gets email with PDF link
10. Frontend shows result from DB
```

### Path 3: Subscription Check

```
1. App loads → useSubscription hook
2. Calls check-subscription edge function
3. Function queries user_subscriptions table
4. Returns: { hasActiveSubscription, subscriptionType, ... }
5. UI conditionally shows upgrade prompts
```

---

## 13. Testing Considerations

**Currently no automated tests.** Manual testing paths:

1. **Free tier flow:** Create 2 proposals without login, verify IP blocking
2. **Signup flow:** Quick signup, verify password reset email
3. **Generation flow:** Full proposal + deck generation
4. **Subscription flow:** Checkout → subscription active → portal access
5. **Error handling:** Network failures, API errors, timeout behavior

---

## 14. Future Considerations

Things that were discussed but not implemented:

- [ ] Stripe webhooks for reliable subscription sync
- [ ] Sentry for error tracking
- [ ] Analytics/funnel tracking
- [ ] Draft auto-save to localStorage
- [ ] Deck generation cancellation
- [ ] Queue position display
- [ ] Per-user API cost caps
- [ ] Team/workspace features
- [ ] White-label/custom branding

---

*This document should be updated whenever major architectural decisions are made.*
