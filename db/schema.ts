import {index, sqliteTable, text} from "drizzle-orm/sqlite-core";

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
