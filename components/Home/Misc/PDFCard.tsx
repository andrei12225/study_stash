"use client"

import {fileRow} from "@/lib/types";
import { FaFilePdf } from "react-icons/fa6";
import { IoText } from "react-icons/io5";
import { MdBookmarkAdded } from "react-icons/md";
import RemovePDFBtn from "@/components/Home/Misc/RemovePDFBtn";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {convertBlobUrlToFile} from "@/lib/convertBlobURLToFile";
import {updateFile} from "@/supabase/storage/client";
import {useUser} from "@clerk/nextjs";

export default function PDFCard({file}: {file: fileRow}) {
    const user = useUser();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [curFileContent, setCurFileContent] = useState("Loading content...");
    const [loadedFileContent, setLoadedFileContent] = useState(false);
    const [updatedName, setUpdatedName] = useState(file.filename);

    const openInNewTab = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer')
    }
    const getFileContent = async () => {
        setDialogOpen(true);
        const body = await fetch(file.fileurl + "?t=" + Date.now());
        const text = await body.text();
        setCurFileContent(text);
        setLoadedFileContent(true);
    }
    const updateCurFile = async () => {
        const tFile = new Blob([curFileContent], {type: "text/plain"});
        const fileUrl = URL.createObjectURL(tFile);
        const textFile = await convertBlobUrlToFile(fileUrl);

        await updateFile({userId: user.user?.id as string, userName: user.user?.username as string,
            folderId: file.folderid,
            fileName: updatedName.endsWith(".txt") ? updatedName : updatedName + ".txt",
            file: textFile, bucket: "userFiles", fileId: file.fileid});
        location.reload();
    }
    const createDownloadLink = () => {
        const extension = file.filename.split(".")[1];
        const tFile = new Blob([curFileContent], {type: `text/${extension}`});
        return URL.createObjectURL(tFile);
    }

    return (
        <a onClick={async (e) => (e.target as unknown as {
            closest: (x: string) => { id: string }
        }).closest("div").id == "main" ? (file.filename.endsWith(".pdf") ? openInNewTab(file.fileurl) : await getFileContent()) : ""} className={"w-40 h-fit" +
            " bg-zinc-900 border-2 rounded-t-md border-zinc-800 " +
            " hover:scale-110 hover:cursor-pointer transition-all"}>
            <div id={"main"} className={"flex flex-col items-center justify-center w-full p-2"}>
                <div className={"flex w-full justify-end"}><RemovePDFBtn file={file}/></div>
                {file.filename.endsWith(".pdf") ?
                    <FaFilePdf className={"w-10 h-10 my-10 text-white"}/>
                    : <IoText className={"w-10 h-10 my-10 text-white"}/>}
            </div>
            <div className={"flex flex-col w-full p-1" +
                " text-xs overflow-hidden" +
                " border-t-2 border-t-indigo-800"}>
                <span className={"font-semibold"}>{file.filename}</span>
                <span className={"flex items-center gap-1 w-full"}><MdBookmarkAdded />Added {file.fileaddedat}</span>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-2 border-indigo-900 text-white">
                    <DialogHeader>
                        <DialogTitle>Viewing {file.filename}</DialogTitle>
                        <DialogDescription>Update your file here.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className={"flex gap-1"}>
                            <Label htmlFor="name" className="text-center">
                                File name
                            </Label>
                            <Input onChange={(e) => setUpdatedName(e.target.value)} required={false} id="name"
                                   placeholder={updatedName} className="col-span-3"/>
                        </div>
                        <div className="w-full">
                            File content
                            <Textarea disabled={!loadedFileContent} onChange={(e) => setCurFileContent(e.target.value)} value={curFileContent}/>
                        </div>
                    </div>
                    <DialogFooter>
                        <a download={file.filename} href={createDownloadLink()} type="submit" className={"flex justify-center items-center px-3 text-sm cursor-pointer " +
                            "rounded-md bg-zinc-800 hover:bg-zinc-950"}>Download</a>
                        <Button onClick={updateCurFile} type="submit"
                                className={"bg-indigo-800 hover:bg-indigo-950"}>Update file</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </a>
    )
}