// Shared between server and browser, so no server-only imports here.

export type UploadTarget =
    | {kind: "local", url: string}
    | {kind: "blob", token: string};

const contentTypes: Record<string, string> = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function extensionOf(fileName: string) {
    const dot = fileName.lastIndexOf(".");
    const ext = dot == -1 ? "" : fileName.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "");
    return ext || "txt";
}

// Files are stored as "<fileId>.<ext>", e.g. "3f2c...-9a1b.pdf"
export function storagePath(fileId: string, fileName: string) {
    return `${fileId}.${extensionOf(fileName)}`;
}

export function isStoragePath(path: string) {
    return /^[0-9a-f-]{36}\.[a-z0-9]+$/.test(path);
}

// Anything that isn't a PDF or Word document is a text file created in the app
export function contentTypeFor(fileName: string) {
    return contentTypes[extensionOf(fileName)] ?? "text/plain";
}

export function pathFromUrl(url: string) {
    return url.split("/").pop() as string;
}
