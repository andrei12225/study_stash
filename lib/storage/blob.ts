import "server-only";
import {BlobNotFoundError, del, head} from "@vercel/blob";
import {generateClientTokenFromReadWriteToken} from "@vercel/blob/client";
import type {Storage} from "@/lib/storage";

export const vercelBlobStorage: Storage = {
    async createUpload(path, contentType) {
        // The token only allows uploading this one path, so the browser can't write anywhere else
        const token = await generateClientTokenFromReadWriteToken({
            pathname: path,
            addRandomSuffix: false,
            allowOverwrite: true,
            allowedContentTypes: [contentType],
            maximumSizeInBytes: 50 * 1024 * 1024,
            cacheControlMaxAge: 60,
        });
        return {kind: "blob", token};
    },

    async getUrl(path) {
        try {
            return (await head(path)).url;
        } catch (error) {
            if (error instanceof BlobNotFoundError) return null;
            throw error;
        }
    },

    async remove(paths) {
        if (paths.length > 0) await del(paths);
    },
};
