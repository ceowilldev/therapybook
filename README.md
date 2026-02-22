# TherapyBook

**Appointment scheduling for therapists. Simple. Private. HIPAA-aware.**

## Features

- 📅 Online booking with custom therapist pages
- 📱 SMS reminders (24h before appointments)
- 💰 Insurance billing codes (CPT 90834/90837)
- 🔒 Privacy-first design (initials-only display)
- 📊 Revenue & no-show tracking
- 💳 Stripe copay processing

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth (Google OAuth)
- **Payments:** Stripe
- **SMS:** Twilio
- **UI:** Tailwind CSS + shadcn/ui
- **Hosting:** Vercel

## Setup

1. **Clone & install:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in:
   - `DATABASE_URL` (Vercel Postgres)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY`
   - `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_PHONE_NUMBER`

3. **Database setup:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

## Deployment

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

## Pricing

- **Free:** 5 clients, unlimited appointments
- **Pro ($29/mo):** Unlimited clients, insurance billing, Stripe copays
- **Enterprise:** Multi-location, team accounts, white-label

## HIPAA Compliance

- No PHI in URLs or query parameters
- Initials-only display in lists
- Encrypted session notes (production)
- Audit logging (Pro/Enterprise)

## Support

Email: support@therapybook.com

---