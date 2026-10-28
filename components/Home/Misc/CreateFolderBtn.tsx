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
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import { MdFolderSpecial } from "react-icons/md";
import {createFolder as createFolderAction} from "@/app/actions";

export default function CreateFolderBtn() {
    const [folderName, setFolderName] = useState("");

    const createFolder = async () => {
        if (folderName.length == 0) return;
        await createFolderAction(folderName);

        location.reload();
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className={"bg-neutral-900 hover:bg-zinc-800 p-2"}><MdFolderSpecial /> Add folder</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-2 border-indigo-900 text-white">
                <DialogHeader>
                    <DialogTitle>Create folder</DialogTitle>
                    <DialogDescription>
                        Give it a distinctive name!
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input required={true} id="name" onChange={(e) => setFolderName(e.target.value)}  placeholder="Course 1" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={createFolder} className={"bg-indigo-800 hover:bg-indigo-950"}>Create folder</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}