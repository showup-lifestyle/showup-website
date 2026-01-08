# Development Plan for Showup Challenge App

## Overview

Showup is an application where users create personal challenges with monetary stakes and social accountability through a **dual-incentive framework**:

1. **Financial incentive** - Skin in the game via deposits
2. **Social incentive** - Accountability via guarantor + shared stakes

Users deposit funds (via Apple Pay or crypto) and invite friends as guarantors who verify completion and participate in their own linked challenges.

---

## Tech Stack

### Backend: Nakama (Heroic Labs)

**Why Nakama over Node.js/Supabase:**

- Written in Go - handles 100k+ concurrent users on a single node (~2GB RAM)
- Built-in social primitives: Friends, Groups, Wallets, Realtime Chat
- TypeScript runtime for custom business logic
- Apache 2.0 license (free for commercial use)
- Full PostgreSQL access - no vendor lock-in

### Full Stack

| Layer                 | Technology             | Purpose                         |
| --------------------- | ---------------------- | ------------------------------- |
| **Frontend (Web)**    | Next.js                | Web prototype & PWA             |
| **Frontend (Mobile)** | React Native (Phase 3) | iOS/Android apps                |
| **Backend**           | Nakama                 | Social, Wallets, Realtime, Auth |
| **Database**          | PostgreSQL             | All persistent data             |
| **Payments (Fiat)**   | Stripe                 | Apple Pay, card payments        |
| **Payments (Crypto)** | Bitcart                | USDC/stablecoin processing      |
| **AI**                | OpenAI API             | Challenge ideation              |
| **Infrastructure**    | Docker + Self-hosted   | Full control                    |

---

## Guarantor Model (MUST CLARIFY FIRST)

### Critical Questions to Answer

Before building, document exactly how money flows:

**Scenario**: Alice deposits $100 for a fitness challenge. Bob is her guarantor and creates his own meditation challenge ($50 deposit).

For each $1 = 1 share

This means that Bob links 50 shares to those of Alice.

If Alice fails all members that have taken shares will have a say in the outcome.

| Event             | Alice's $100     | Bob's $100     |
| ----------------- | ---------------- | -------------- |
| Alice succeeds    | Returns to Alice | Returns to Bob |
| Alice fails       | ???              | ???            |
| Bob fails his own | ???              | ???            |

**Questions to answer:**

1. If Alice fails, does Bob get a % of her deposit? No
2. If Bob fails to verify (is unresponsive), what happens? Wait until verification
3. Does the app take a fee? When? When you deposit
4. Who holds funds during challenges? ?Smart Contract? Ask?? (Stripe/Nakama Wallet/Smart Contract)

Smart Contracts could be very useful

**Document this before Phase 1.**

---

## Development Phases

### Phase 0: Validation & De-Risking (Weeks 1-2)

**Goal**: Validate the dual-incentive model before engineering effort.

#### Week 1: Clarify & Design

- [ ] Define guarantor model fund flow (see above)
- [ ] Sketch user flow diagram (Figma/paper)
- [ ] Consult legal if fund distribution needs compliance review
- [ ] Document decisions in this file

#### Week 2: Web Prototype

- [ ] Set up Docker infrastructure (PostgreSQL + Nakama)
- [ ] Build interactive web prototype (Next.js):
  - Sign up / login
  - Challenge creation form
  - Invite guarantor (mock)
  - Guarantor accepts + creates linked challenge
  - Dashboard showing both challenges
  - Completion checklist (guarantor marks complete)
  - Success/failure notification

**What to skip:**

- Real payments (mock the UI)
- Complex AI (simple text suggestions)
- Mobile apps

#### User Testing

- [ ] Get 5-10 friends to go through the flow
- [ ] Key questions:
  - Does the dual-incentive feel motivating?
  - Would they actually invite a friend?
  - What deposit amount feels "real"?
  - Where do they get confused?

---

### Phase 1: MVP Development (Weeks 3-8)

**Goal**: Build functional MVP with Nakama backend.

#### Infrastructure Setup

- [ ] Create `docker-compose.yml`:
  ```yaml
  services:
    postgres:
      image: postgres:15-alpine
    nakama:
      image: heroiclabs/nakama:3.22.0
  ```
- [ ] Configure Nakama for TypeScript runtime
- [ ] Set up development environment

#### Nakama Features to Use

| Nakama Feature  | Showup Use Case                 |
| --------------- | ------------------------------- |
| **Users/Auth**  | User accounts                   |
| **Friends API** | Guarantor relationships         |
| **Groups**      | User + Guarantor challenge pods |
| **Wallets**     | Track deposits (virtual ledger) |
| **Realtime**    | Challenge status updates        |
| **Storage**     | Challenge metadata              |
| **RPC**         | Custom verification logic       |

#### Core Features (TypeScript Modules)

- [ ] Challenge CRUD operations
- [ ] Guarantor invitation system
- [ ] Challenge linking logic
- [ ] Completion verification flow
- [ ] Wallet ledger updates

#### Frontend (Next.js)

- [ ] Auth flow (Nakama session)
- [ ] Challenge creation with AI ideation
- [ ] Guarantor invitation + acceptance
- [ ] Dashboard with active challenges
- [ ] Challenge detail view with progress
- [ ] Notification system

---

### Phase 2: Payment Integration (Weeks 9-16)

**Goal**: Real money handling with proper escrow.

#### Stripe Integration (Fiat)

- [ ] Connect Stripe account
- [ ] Apple Pay / card payment flow
- [ ] Escrow funds in Stripe
- [ ] Release logic: Challenge complete -> Guarantor confirms -> Money released

#### Bitcart Integration (Crypto)

- [ ] Deploy Bitcart container
- [ ] USDC stablecoin support only (avoid volatility)
- [ ] Deposit address generation
- [ ] Webhook for payment confirmation
- [ ] Wallet update on deposit

#### Escrow Logic (Nakama TypeScript)

- [ ] `createDeposit(userId, amount, method)`
- [ ] `releaseDeposit(challengeId, outcome)`
- [ ] `redistributeFunds(challengeId)` - on failure
- [ ] Audit logging for all transactions

---

### Phase 3: Launch & Scale (Weeks 17-24)

**Goal**: Production-ready launch.

#### Mobile Apps

- [ ] React Native app (iOS + Android)
- [ ] Push notifications via Nakama
- [ ] Deep linking for invitations

#### Compliance & Legal

- [ ] KYC verification (if required by regulators)
- [ ] Legal review of guarantor model
- [ ] Terms of Service / Privacy Policy

#### Launch

- [ ] App Store submission
- [ ] Google Play submission
- [ ] Marketing site updates
- [ ] Launch to beta users

---

## Docker Infrastructure

### `docker-compose.yml`

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: showup-db
    environment:
      POSTGRES_DB: nakama
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  nakama:
    image: heroiclabs/nakama:3.22.0
    container_name: showup-backend
    entrypoint:
      - "/bin/sh"
      - "-ecx"
      - >
        /nakama/nakama migrate up --database.address postgres:${POSTGRES_PASSWORD}@postgres:5432/nakama &&
        exec /nakama/nakama --name showup
        --database.address postgres:${POSTGRES_PASSWORD}@postgres:5432/nakama
        --logger.level DEBUG
        --session.token_expiry_sec 7200
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    ports:
      - "7349:7349" # gRPC API
      - "7350:7350" # HTTP API
      - "7351:7351" # Console (Admin)
    volumes:
      - ./nakama/data:/nakama/data
      - ./nakama/modules:/nakama/data/modules
    healthcheck:
      test: ["CMD", "/nakama/nakama", "healthcheck"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Phase 2: Uncomment when ready for crypto payments
  # bitcart:
  #   image: bitcart/bitcart:latest
  #   container_name: showup-crypto
  #   ports:
  #     - "8000:8000"
  #   environment:
  #     - BITCART_HOST=0.0.0.0

volumes:
  postgres_data:
```

---

## Nakama TypeScript Module Structure

```
nakama/
  modules/
    src/
      main.ts              # Entry point
      challenges/
        create.ts          # Challenge creation RPC
        verify.ts          # Completion verification
        list.ts            # Get user challenges
      guarantor/
        invite.ts          # Send invitation
        accept.ts          # Accept & link challenge
        confirm.ts         # Confirm completion
      wallet/
        deposit.ts         # Process deposit
        release.ts         # Release funds
        ledger.ts          # Transaction history
      hooks/
        beforeAuth.ts      # Pre-auth validation
        afterAuth.ts       # Post-auth setup
```

---

## Risk Mitigation

| Risk                         | Mitigation                                                       |
| ---------------------------- | ---------------------------------------------------------------- |
| **Regulatory compliance**    | Consult fintech lawyer before Phase 2                            |
| **Nakama single-node limit** | Sufficient for 100k+ users; Enterprise license if needed         |
| **Payment fraud**            | Start with small deposit limits; manual review for large amounts |
| **User adoption**            | Validate with friends first; iterate on UX                       |
| **Guarantor no-shows**       | Timeout mechanism with default resolution                        |

---

## Success Metrics

### Phase 0 (Validation)

- [ ] 5+ users complete full prototype flow
- [ ] > 70% say they would use this with real money
- [ ] Guarantor model documented and validated

### Phase 1 (MVP)

- [ ] 50+ challenges created
- [ ] 30+ guarantor relationships formed
- [ ] <3s average API response time

### Phase 2 (Payments)

- [ ] 10+ real deposits processed
- [ ] Zero payment disputes
- [ ] Successful fund release on completion

### Phase 3 (Launch)

- [ ] App Store approval
- [ ] 100+ active users
- [ ] > 50% challenge completion rate

---

## Immediate Next Steps (This Week)

1. [ ] **Define guarantor fund flow** - Write exact scenarios
2. [ ] **Set up Docker environment** - PostgreSQL + Nakama running locally
3. [ ] **Create Nakama TypeScript project** - Basic hello world RPC
4. [ ] **Sketch 5-6 core screens** - Paper or Figma wireframes
5. [ ] **Update this document** with guarantor model decisions

---

## Long-Term Strategy

**Why Nakama is future-proof:**

- Apache 2.0 license - no vendor lock-in
- Full PostgreSQL access - migrate data anytime
- TypeScript business logic - portable to other frameworks
- Single node handles 100k+ CCU - years of runway
- Enterprise clustering available if you outgrow

**Exit paths if needed:**

- Extract TypeScript logic to standalone Node.js service
- Keep PostgreSQL database with all data
- Nakama becomes optional realtime layer

---

_Last updated: December 2025_
