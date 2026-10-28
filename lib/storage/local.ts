import "server-only";
import {mkdir, readFile, rm, stat, writeFile} from "node:fs/promises";
import {join} from "node:path";
import type {Storage} from "@/lib/storage";

// Uploads are written by the PUT handler in app/uploads/[...path]/route.ts and served by its GET handler.
const uploadsDir = join(process.cwd(), "uploads");

export const localFolderStorage: Storage = {
    async createUpload(path) {
        if (process.env.VERCEL) throw new Error("Local file storage doesn't work on Vercel. Connect a Blob store to the project.");
        return {kind: "local", url: `/uploads/${path}`};
    },

    async getUrl(path) {
        try {
            await stat(join(uploadsDir, path));
            return `/uploads/${path}`;
        } catch {
            return null;
        }
    },

    async remove(paths) {
        await Promise.all(paths.map(path => rm(join(uploadsDir, path), {force: true})));
    },
};

export async function readLocalFile(path: string) {
    return readFile(join(uploadsDir, path));
}

export async function writeLocalFile(path: string, data: Buffer) {
    await mkdir(uploadsDir, {recursive: true});
    await writeFile(join(uploadsDir, path), data);
}
