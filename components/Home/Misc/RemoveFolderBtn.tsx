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
import {createSupabaseClient} from "@/supabase/client";

export default function RemoveFolderBtn({folder}: {folder: folderRow}) {
    const removeFolder = async () => {
        const supabase = createSupabaseClient();
        const {error} = await supabase.from("userfolders").delete().eq("folderid", folder.folderid);
        if (error) return console.error(error);

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