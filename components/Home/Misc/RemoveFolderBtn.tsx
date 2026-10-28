"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import { MdRemove } from "react-icons/md";
import {folderRow} from "@/lib/types";
import {deleteFolder} from "@/app/actions";

export default function RemoveFolderBtn({folder}: {folder: folderRow}) {
    const removeFolder = async () => {
        await deleteFolder(folder.folderid);

        location.reload();
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <MdRemove className={"hover:text-indigo-700"}/>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-2 border-indigo-900 text-white">
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        Removing this folder will also remove all PDFs inside.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="submit" onClick={removeFolder} className={"bg-indigo-800 hover:bg-indigo-950"}>I&#39;m sure</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}