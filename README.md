# Showup Waitlist

A single-page landing site that collects waitlist signups and sends a confirmation email.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

3. Start the dev server:

```bash
npm run dev
```

## Waitlist Email Configuration

The API requires SMTP credentials to send confirmation emails. Set these in `.env.local`:

```bash
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_SECURE=false
WAITLIST_FROM="Showup <no-reply@showup.com>"
WAITLIST_REPLY_TO=
```

## Waitlist Storage

Signups are appended to `data/waitlist.csv` on the server.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
