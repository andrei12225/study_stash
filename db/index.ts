import "server-only";
import {createClient} from "@libsql/client";
import {drizzle} from "drizzle-orm/libsql";
import * as schema from "@/db/schema";

// Locally this is a SQLite file (file:local.db); on Vercel it points at Turso (libsql://...).
const client = createClient({
    url: process.env.DATABASE_URL ?? "file:local.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, {schema});
