"use server"

import {and, eq} from "drizzle-orm";
import {v4 as uuidv4} from "uuid";
import {db} from "@/db";
import {userFiles, userFolders} from "@/db/schema";
import {fileRow, folderRow} from "@/lib/types";
import {getSession} from "@/lib/auth";
import {storage} from "@/lib/storage";
import {contentTypeFor, pathFromUrl, storagePath} from "@/lib/storage/paths";

async function requireUser() {
    const session = await getSession();
    if (!session) throw new Error("Not signed in");
    return session.user;
}

async function requireUserId() {
    return (await requireUser()).id;
}

async function assertOwnsFolder(userId: string, folderId: string) {
    const folder = await db.query.userFolders.findFirst({
        where: and(eq(userFolders.folderid, folderId), eq(userFolders.userid, userId)),
    });
    if (!folder) throw new Error("Folder not found");
}

async function getOwnedFile(userId: string, fileId: string) {
    const file = await db.query.userFiles.findFirst({
        where: and(eq(userFiles.fileid, fileId), eq(userFiles.userid, userId)),
    });
    if (!file) throw new Error("File not found");
    return file;
}

export async function getFolders(): Promise<folderRow[]> {
    const userId = await requireUserId();
    return db.select().from(userFolders).where(eq(userFolders.userid, userId));
}

export async function getFiles(folderId: string): Promise<fileRow[]> {
    const userId = await requireUserId();
    return db.select().from(userFiles).where(and(eq(userFiles.folderid, folderId), eq(userFiles.userid, userId)));
}

export async function createFolder(folderName: string) {
    const userId = await requireUserId();
    if (folderName.trim().length == 0) throw new Error("Folder name is empty");
    await db.insert(userFolders).values({folderid: uuidv4(), userid: userId, foldername: folderName.trim()});
}

export async function deleteFolder(folderId: string) {
    const userId = await requireUserId();
    await assertOwnsFolder(userId, folderId);

    const files = await db.select().from(userFiles).where(eq(userFiles.folderid, folderId));
    await storage.remove(files.map(file => pathFromUrl(file.fileurl)));

    // Delete explicitly rather than relying on ON DELETE CASCADE, since SQLite only enforces it with PRAGMA foreign_keys=ON
    await db.delete(userFiles).where(eq(userFiles.folderid, folderId));
    await db.delete(userFolders).where(and(eq(userFolders.folderid, folderId), eq(userFolders.userid, userId)));
}

// Uploading is two steps: prepare (check ownership, hand the browser an upload target),
// then finish (confirm the file landed and save the row). The file itself never passes through a server action.

export async function prepareUpload({folderId, fileName}: {folderId: string, fileName: string}) {
    const userId = await requireUserId();
    await assertOwnsFolder(userId, folderId);

    const fileId = uuidv4();
    const path = storagePath(fileId, fileName);
    const contentType = contentTypeFor(fileName);
    return {fileId, path, contentType, target: await storage.createUpload(path, contentType)};
}

export async function finishUpload({fileId, folderId, fileName}: {fileId: string, folderId: string, fileName: string}) {
    const user = await requireUser();
    const userId = user.id;
    await assertOwnsFolder(userId, folderId);

    const fileUrl = await storage.getUrl(storagePath(fileId, fileName));
    if (!fileUrl) throw new Error("Upload not found");

    await db.insert(userFiles).values({
        fileid: fileId, userid: userId, folderid: folderId, filename: fileName,
        username: user.username ?? "", fileaddedat: new Date().toDateString(), fileurl: fileUrl,
    });
}

export async function prepareUpdate({fileId, fileName}: {fileId: string, fileName: string}) {
    const userId = await requireUserId();
    await getOwnedFile(userId, fileId);

    const path = storagePath(fileId, fileName);
    const contentType = contentTypeFor(fileName);
    return {path, contentType, target: await storage.createUpload(path, contentType)};
}

export async function finishUpdate({fileId, fileName}: {fileId: string, fileName: string}) {
    const userId = await requireUserId();
    const file = await getOwnedFile(userId, fileId);

    const path = storagePath(fileId, fileName);
    const fileUrl = await storage.getUrl(path);
    if (!fileUrl) throw new Error("Upload not found");

    // Renaming can change the extension, which leaves the old copy behind under its old path
    const oldPath = pathFromUrl(file.fileurl);
    if (oldPath != path) await storage.remove([oldPath]);

    await db.update(userFiles)
        .set({filename: fileName, fileurl: fileUrl, fileaddedat: new Date().toDateString()})
        .where(and(eq(userFiles.fileid, fileId), eq(userFiles.userid, userId)));
}

export async function deleteFile(fileId: string) {
    const userId = await requireUserId();
    const file = await getOwnedFile(userId, fileId);

    await storage.remove([pathFromUrl(file.fileurl)]);
    await db.delete(userFiles).where(eq(userFiles.fileid, fileId));
}
