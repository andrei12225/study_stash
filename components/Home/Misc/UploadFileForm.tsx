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
import {PDFDocument} from "pdf-lib";
import {useClerk} from "@clerk/nextjs";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {folderRow} from "@/lib/types";
import {convertBlobUrlToFile} from "@/lib/convertBlobURLToFile";
import {uploadPdf} from "@/supabase/storage/client";
import imageCompression from "browser-image-compression";
import {createPdfFromBytes} from "@/lib/createPdfFromBytes";

export default function UploadFileForm({folder}: {folder: folderRow}) {
    const user = useClerk();
    const [files, setFiles] = useState<File[]>([]);
    const [fileName, setFileName] = useState("untitled");
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = [...(e.target.files as unknown as FileList)];

        setFiles(files);
        setDialogOpen(true);
    }

    const saveImages = async () => {
        const filesB: Uint8Array[] = [];

        async function asyncToBytes(file: File): Promise<Uint8Array> {
            return new Promise((resolve) => {
                fileToBytes(file, bytes => resolve(bytes));
            });
        }

        for (const file of files) {
            const compressedFile = await imageCompression(file, {maxSizeMB: 1});
            const bytes = await asyncToBytes(compressedFile);
            filesB.push(bytes);
        }

        const pdfBytes = await createPdfFromBytes(filesB);
        const pdfBlob = new Blob([pdfBytes]);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const pdfFile = await convertBlobUrlToFile(pdfUrl);

        await uploadPdf({userId: user.user?.id as string, userName: user.user?.username as string, folderId: folder.folderid, fileName: fileName + ".pdf", file: pdfFile, bucket: "userFiles"});
        location.reload();
    }
    return (
        <div>
            <form>
                <label htmlFor={"file-upload"} className={"flex gap-1 px-10 items-center border-2 border-indigo-900 bg-indigo-950 p-1 rounded " +
                    "   hover:cursor-pointer hover:bg-indigo-700"}><FiUploadCloud /> Upload</label>
                <input onChange={handleChange} id={"file-upload"} multiple={true} type={"file"} accept={"image/*"} className={"hidden"} />
            </form>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-2 border-indigo-900 text-white">
                    <DialogHeader>
                        <DialogTitle>Uploading files</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to upload these files? <b>They will be automatically added to a
                            PDF.</b>
                            <div className={"flex flex-col mt-1"}>
                                {files.slice(0, 10).map(((file, key) => {
                                    return <span key={key}>{file.name}</span>
                                }))}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name the PDF
                            </Label>
                            <Input required={true} id="name" onChange={(e) => setFileName(e.target.value)}
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