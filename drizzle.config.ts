import {defineConfig} from "drizzle-kit";
import {loadEnvConfig} from "@next/env";

loadEnvConfig(process.cwd());

export default defineConfig({
    schema: "./db/schema.ts",
    out: "./db/migrations",
    dialect: "turso",
    dbCredentials: {
        url: process.env.DATABASE_URL ?? "file:local.db",
        authToken: process.env.DATABASE_AUTH_TOKEN,
    },
});
