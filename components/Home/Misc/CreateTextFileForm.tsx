import { IoCreateOutline } from "react-icons/io5";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {convertBlobUrlToFile} from "@/lib/convertBlobURLToFile";
import {uploadFile} from "@/supabase/storage/client";
import {useUser} from "@clerk/nextjs";
import {folderRow} from "@/lib/types";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export default function CreateTextFileForm({folder}: {folder: folderRow}) {
    const user = useUser();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentText, setCurrentText] = useState("");
    const [fileName, setFileName] = useState("untitled");
    const [fileExtension, setFileExtension] = useState("txt");

    async function createTextFile() {
        const extension = fileExtension.startsWith(".") ? fileExtension.slice(1) : fileExtension;
        const file = new Blob([currentText], {type: `text/${extension}`});
        const fileUrl = URL.createObjectURL(file);
        const textFile = await convertBlobUrlToFile(fileUrl);

        await uploadFile({userId: user.user?.id as string, userName: user.user?.username as string, folderId: folder.folderid, fileName: fileName + "." + extension, file: textFile, bucket: "userFiles"});
        location.reload();
    }

    return (
        <div>
            <form>
                <label
                       onClick={() => setDialogOpen(true) } className={"flex gap-1 px-10 items-center border-2 border-indigo-950 bg-blue-950 p-1 rounded " +
                           "   hover:cursor-pointer hover:bg-indigo-800"}><IoCreateOutline/> New Text File</label>
            </form>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-2 border-indigo-900 text-white">
                    <DialogHeader>
                        <DialogTitle>Create text file</DialogTitle>
                        <DialogDescription>Enter your input here.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className={"flex gap-2"}>
                            <Label htmlFor="name" className="flex items-center">
                               File name
                            </Label>
                            <Input required={false} id="name" onChange={(e) => setFileName(e.target.value)}
                                   placeholder="Untitled" className="col-span-3"/>
                            <Label htmlFor="extension" className="flex items-center">
                                Extension
                            </Label>
                            <Input required={false} id="extension" onChange={(e) => setFileExtension(e.target.value)}
                                   placeholder="txt" className="col-span-3"/>
                        </div>
                        <div className="w-full">
                            File content
                            <Textarea onChange={(e) => setCurrentText(e.target.value)} value={currentText} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={async () => await createTextFile()} type="submit"
                                className={"bg-indigo-800 hover:bg-indigo-950"}>Create file</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}