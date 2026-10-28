import {getSession} from "@/lib/auth";
import {usingVercelBlob} from "@/lib/storage";
import {readLocalFile, writeLocalFile} from "@/lib/storage/local";
import {contentTypeFor, isStoragePath} from "@/lib/storage/paths";

// Serves and receives files for local dev storage. When Vercel Blob is in use, files never come through here.

type Params = {params: {path: string[]}};

function resolvePath(params: Params["params"]) {
    const path = params.path.join("/");
    return !usingVercelBlob && isStoragePath(path) ? path : null;
}

export async function GET(_req: Request, {params}: Params) {
    const path = resolvePath(params);
    if (!path) return new Response("Not found", {status: 404});

    try {
        const data = await readLocalFile(path);
        return new Response(data, {headers: {"Content-Type": contentTypeFor(path), "Cache-Control": "no-store"}});
    } catch {
        return new Response("Not found", {status: 404});
    }
}

export async function PUT(req: Request, {params}: Params) {
    const path = resolvePath(params);
    if (!path) return new Response("Not found", {status: 404});
    if (!await getSession()) return new Response("Unauthorized", {status: 401});

    await writeLocalFile(path, Buffer.from(await req.arrayBuffer()));
    return new Response(null, {status: 204});
}
