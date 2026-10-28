import {put} from "@vercel/blob/client";
import {prepareUpdate, prepareUpload, finishUpdate, finishUpload} from "@/app/actions";
import {UploadTarget} from "@/lib/storage/paths";

// Runs in the browser: sends the file wherever the server said to (local dev folder or Vercel Blob)
async function sendFile(target: UploadTarget, path: string, file: Blob, contentType: string) {
    if (target.kind == "local") {
        const res = await fetch(target.url, {method: "PUT", body: file, headers: {"Content-Type": contentType}});
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    } else {
        await put(path, file, {access: "public", token: target.token, contentType});
    }
}

export async function uploadFile({file, folderId, fileName}: {file: Blob, folderId: string, fileName: string}) {
    const {fileId, path, contentType, target} = await prepareUpload({folderId, fileName});
    await sendFile(target, path, file, contentType);
    await finishUpload({fileId, folderId, fileName});
}

export async function updateFile({file, fileId, fileName}: {file: Blob, fileId: string, fileName: string}) {
    const {path, contentType, target} = await prepareUpdate({fileId, fileName});
    await sendFile(target, path, file, contentType);
    await finishUpdate({fileId, fileName});
}
