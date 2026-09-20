# Burhan Cash Admin

Daily cash in / cash out admin panel — Next.js + PostgreSQL.

## Features

- Admin login
- Add, enable, and disable employees
- Separate Cash In and Cash Out pages
- Note counts: 500, 200, 100, 50, 20, 10, 1
- For each note, record how many are present and how many are missing
- Dashboard shows today's in, out, expenses, net, and denomination-wise totals

## Setup

1. Start PostgreSQL with Docker:

```bash
docker compose up -d
```

This Postgres instance runs on **port 55432** so it does not clash with local Postgres on 5432/5433.

2. Create database tables and the admin user:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

3. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Default login: **admin** / **admin123**

You can change `DATABASE_URL` and `AUTH_SECRET` in `.env`.
