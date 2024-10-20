"use client"

import {fileRow} from "@/lib/types";
import { FaFilePdf } from "react-icons/fa6";
import { MdBookmarkAdded } from "react-icons/md";
import RemovePDFBtn from "@/components/Home/Misc/RemovePDFBtn";
import {useRouter} from "next/navigation";

export default function PDFCard({file}: {file: fileRow}) {
    const router = useRouter();
    return (
        <a onClick={(e) => (e.target as unknown as {
            closest: (x: string) => { id: string }
        }).closest("div").id == "main" ? router.push(file.fileurl) : ""} className={"w-40 h-fit" +
            " bg-zinc-900 border-2 rounded-t-md border-zinc-800 " +
            " hover:scale-110 hover:cursor-pointer transition-all"}>
            <div id={"main"} className={"flex flex-col items-center justify-center w-full p-2"}>
                <div className={"flex w-full justify-end"}><RemovePDFBtn file={file}/></div>
                <FaFilePdf className={"w-10 h-10 my-10 text-white"}/>
            </div>
            <div className={"flex flex-col w-full p-2" +
                " text-xs text-nowrap overflow-hidden" +
                " border-t-2 border-t-indigo-800"}>
                <span className={"font-semibold"}>{file.filename}</span>
                <span className={"flex items-center gap-1"}><MdBookmarkAdded/>Added {file.fileaddedat}</span>
            </div>
        </a>
    )
}