"use client"

import { FiUploadCloud } from "react-icons/fi";
import {ChangeEvent, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {fileToBytes} from "@/lib/fileToBytes";
import {useClerk} from "@clerk/nextjs";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {folderRow} from "@/lib/types";
import {convertBlobUrlToFile} from "@/lib/convertBlobURLToFile";
import {uploadFile} from "@/supabase/storage/client";
import imageCompression from "browser-image-compression";
import {createPdfFromBytes} from "@/lib/createPdfFromBytes";

export default function UploadFileForm({folder}: {folder: folderRow}) {
    const user = useClerk();
    const [files, setFiles] = useState<File[]>([]);
    const [fileName, setFileName] = useState("untitled");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [exceededUploadLimit, setExceededUploadLimit] = useState(false);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let files = [...(e.target.files as unknown as FileList)];
        if (files.length > 15) { files = files.slice(0, 15); setExceededUploadLimit(true); }

        setFiles(files);
        setDialogOpen(true);
    }

    const saveImages = async () => {
        const imagesBytes: Uint8Array[] = [];
        const otherFBytes: {fName: string, fBytes: Uint8Array}[] = [];

        async function asyncToBytes(file: File): Promise<Uint8Array> {
            return new Promise((resolve) => {
                fileToBytes(file, bytes => resolve(bytes));
            });
        }

        for (let file of files) {
            if (file.name.endsWith(".png") || file.name.endsWith(".jpg") || file.name.endsWith(".jpeg")) {
                if (file.size == 0) continue;
                file = await imageCompression(file, {maxSizeMB: 1});
                const bytes = await asyncToBytes(file);
                imagesBytes.push(bytes);
            } else {
                const bytes = await asyncToBytes(file);
                if (file.name.endsWith(".pdf") || file.name.endsWith(".docx")) otherFBytes.push({fBytes: bytes, fName: file.name});
            }
        }

        if (imagesBytes.length > 0) {
            const pdfFromImgsBytes = await createPdfFromBytes(imagesBytes);
            const pdfFromImgsBlob = new Blob([pdfFromImgsBytes]);
            const pdfFromImgsUrl = URL.createObjectURL(pdfFromImgsBlob);
            const pdfFromImgsFile = await convertBlobUrlToFile(pdfFromImgsUrl);
            await uploadFile({userId: user.user?.id as string, userName: user.user?.username as string, folderId: folder.folderid, fileName: fileName + ".pdf", file: pdfFromImgsFile, bucket: "userFiles"});
        }

        for (const otherFByte of otherFBytes) {
            const otherBlob = new Blob([otherFByte.fBytes]);
            const otherUrl = URL.createObjectURL(otherBlob);
            const otherFile = await convertBlobUrlToFile(otherUrl);

            await uploadFile({userId: user.user?.id as string, userName: user.user?.username as string, folderId: folder.folderid, fileName: otherFByte.fName, file: otherFile, bucket: "userFiles"});
        }

        setExceededUploadLimit(false);
        location.reload();
    }

    return (
        <div>
            <form>
                <label htmlFor={"file-upload"} className={"flex gap-1 px-10 items-center border-2 border-indigo-900 bg-indigo-950 p-1 rounded " +
                    "   hover:cursor-pointer hover:bg-indigo-700"}><FiUploadCloud /> Upload</label>
                <input onChange={handleChange} id={"file-upload"} multiple={true} type={"file"} accept={"image/*,.pdf,.docx"} className={"hidden"} />
            </form>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-2 border-indigo-900 text-white">
                    <DialogHeader>
                        <DialogTitle>Uploading files</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to upload these files?
                            <br />
                            <b>Any images you add will be added to a PDF (.png, .jpg, .jpeg).
                            <br />
                            Only other supported extensions are .docx and .pdf</b>
                            <br />
                            {exceededUploadLimit && <b>You cannot upload more than 15 files at a time, so we will only add the first 15 you uploaded!</b>}
                            <div className={"flex flex-col mt-1"}>
                                {files.map(((file, key) => {
                                    return <span key={key}>{file.name}</span>
                                }))}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-center">
                                Name the Image PDF
                            </Label>
                            <Input required={false} id="name" onChange={(e) => setFileName(e.target.value)}
                                   placeholder="Untitled" className="col-span-3"/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={saveImages} type="submit"
                                className={"bg-indigo-800 hover:bg-indigo-950"}>I&#39;m sure</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}