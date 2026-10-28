import "server-only";
import {UploadTarget} from "@/lib/storage/paths";
import {localFolderStorage} from "@/lib/storage/local";
import {vercelBlobStorage} from "@/lib/storage/blob";

export interface Storage {
    // Lets the browser upload one file straight to `path`, without going through a server action
    createUpload(path: string, contentType: string): Promise<UploadTarget>;
    // Public URL of a stored file, or null if nothing was uploaded there
    getUrl(path: string): Promise<string | null>;
    remove(paths: string[]): Promise<void>;
}

// Vercel sets BLOB_READ_WRITE_TOKEN when a Blob store is connected to the project.
// Without it (local dev), files are kept in ./uploads instead.
export const usingVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export const storage: Storage = usingVercelBlob ? vercelBlobStorage : localFolderStorage;
