## Welcome to StudyStash 📝

StudyStash is a project made on a whim, as I wanted an easy way to convert pictures I took to PDF. Additionally, I added text file support for even more convenience!

## How to run

- Create the `.env.local` file in your project root and add the following variables
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Optional locally - defaults to a SQLite file at ./local.db
DATABASE_URL=file:local.db
DATABASE_AUTH_TOKEN=
```
you will need a [`Clerk`](https://clerk.com/) account. Nothing else is needed for local development.

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

## File storage

Uploaded files go through a small storage interface (`lib/storage`), which picks where to keep them based on environment variables:

- **Locally** (no `BLOB_READ_WRITE_TOKEN` set), files are saved to the `uploads/` folder and served from `/uploads/...`.
- **In production**, files go to [Vercel Blob](https://vercel.com/docs/vercel-blob). Create a Blob store in your Vercel project's *Storage* tab and connect it. Vercel then sets `BLOB_READ_WRITE_TOKEN` for you.

To test against Vercel Blob locally, run `vercel env pull .env.local` (or copy `BLOB_READ_WRITE_TOKEN` into `.env.local` yourself).

## Screenshots

![Screenshot](./screenshots/screenshot1.png)