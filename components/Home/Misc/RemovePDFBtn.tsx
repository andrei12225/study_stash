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
import {fileRow} from "@/lib/types";
import {createSupabaseClient} from "@/supabase/client";

export default function RemovePDFBtn({file}: {file: fileRow}) {
    const removePDF = async () => {
        const supabase = createSupabaseClient();
        const {error} = await supabase.from("userfile").delete().eq("fileid", file.fileid);
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
                    <DialogTitle>Are you sure you want to delete this?</DialogTitle>
                    <DialogDescription>
                        This action is undoable!
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="submit" onClick={removePDF} className={"bg-indigo-800 hover:bg-indigo-950"}>I&#39;m sure</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}