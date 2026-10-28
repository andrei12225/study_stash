import {index, integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

export const userFolders = sqliteTable("userfolders", {
    folderid: text("folderid").primaryKey(),
    userid: text("userid").notNull(),
    foldername: text("foldername").notNull(),
}, (t) => [index("userfolders_userid_idx").on(t.userid)]);

export const userFiles = sqliteTable("userfile", {
    fileid: text("fileid").primaryKey(),
    userid: text("userid").notNull(),
    username: text("username").notNull().default(""),
    filename: text("filename").notNull(),
    fileaddedat: text("fileaddedat").notNull(),
    folderid: text("folderid").notNull().references(() => userFolders.folderid, {onDelete: "cascade"}),
    fileurl: text("fileurl").notNull(),
}, (t) => [index("userfile_folderid_idx").on(t.folderid)]);

// Tables used by Better Auth (lib/auth.ts). Column names follow its defaults.

const createdAt = () => integer("createdAt", {mode: "timestamp_ms"}).notNull().default(sql`(unixepoch() * 1000)`);
const updatedAt = () => integer("updatedAt", {mode: "timestamp_ms"}).notNull().default(sql`(unixepoch() * 1000)`).$onUpdate(() => new Date());

export const user = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("emailVerified", {mode: "boolean"}).notNull().default(false),
    image: text("image"),
    username: text("username"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
});

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),
    expiresAt: integer("expiresAt", {mode: "timestamp_ms"}).notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull().references(() => user.id, {onDelete: "cascade"}),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
}, (t) => [index("session_userId_idx").on(t.userId)]);

export const account = sqliteTable("account", {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull().references(() => user.id, {onDelete: "cascade"}),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: integer("accessTokenExpiresAt", {mode: "timestamp_ms"}),
    refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {mode: "timestamp_ms"}),
    scope: text("scope"),
    password: text("password"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
}, (t) => [index("account_userId_idx").on(t.userId)]);

export const verification = sqliteTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expiresAt", {mode: "timestamp_ms"}).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
}, (t) => [index("verification_identifier_idx").on(t.identifier)]);
