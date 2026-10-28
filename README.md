## Welcome to StudyStash 📝

StudyStash is a project made on a whim, as I wanted an easy way to convert pictures I took to PDF. Additionally, I added text file support for even more convenience!

## How to run

- Create the `.env.local` file in your project root and add the following variables
```
# Auth - generate the secret with `openssl rand -base64 32`
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# Optional locally - defaults to a SQLite file at ./local.db
DATABASE_URL=file:local.db
DATABASE_AUTH_TOKEN=
```
you will need a Discord application for sign-in (see [Authentication](#authentication)). Nothing else is needed for local development.

- Install dependencies by running `npm install`

- Create the local database by running `npm run db:push`

- To start the server in development mode,

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [`http://localhost:3000`](http://localhost:3000) with your browser to see the result.

## Database

The database is SQLite, accessed through [Drizzle ORM](https://orm.drizzle.team/). The schema lives in `db/schema.ts`.

- Locally, it's a plain file (`local.db`). Browse it with `npm run db:studio`.
- In production (Vercel), it's [Turso](https://turso.tech/). Create a database, then set `DATABASE_URL` (`libsql://...`) and `DATABASE_AUTH_TOKEN` in your Vercel project. Push the schema to it with `npm run db:push` while those variables point at Turso.

## Authentication

Sign-in uses [Better Auth](https://www.better-auth.com/) with Discord as the only provider. Users and sessions are stored in the same database as everything else.

1. Create an application in the [Discord Developer Portal](https://discord.com/developers/applications).
2. Under *OAuth2*, copy the client ID and secret into `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`.
3. Add these redirect URLs:
   - `http://localhost:3000/api/auth/callback/discord`
   - `https://<your-domain>/api/auth/callback/discord`

On Vercel, set `BETTER_AUTH_SECRET` (a different one from local), `BETTER_AUTH_URL` (`https://<your-domain>`), and the two Discord variables.

## File storage

Uploaded files go through a small storage interface (`lib/storage`), which picks where to keep them based on environment variables:

- **Locally** (no `BLOB_READ_WRITE_TOKEN` set), files are saved to the `uploads/` folder and served from `/uploads/...`.
- **In production**, files go to [Vercel Blob](https://vercel.com/docs/vercel-blob). Create a Blob store in your Vercel project's *Storage* tab and connect it. Vercel then sets `BLOB_READ_WRITE_TOKEN` for you.

To test against Vercel Blob locally, run `vercel env pull .env.local` (or copy `BLOB_READ_WRITE_TOKEN` into `.env.local` yourself).

## Screenshots

![Screenshot](./screenshots/screenshot1.png)