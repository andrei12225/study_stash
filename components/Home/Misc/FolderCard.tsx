import { BsFillFolderFill } from "react-icons/bs";
import {folderRow} from "@/lib/types";
import RemoveFolderBtn from "@/components/Home/Misc/RemoveFolderBtn";

export default function FolderCard({ folder, onClick }: {folder: folderRow, onClick: () => void}) {
    return (
        <div onClick={(e) => { if ((e.target as unknown as {closest: (x: string) => {id: string}}).closest("div")?.id == "main") onClick(); }} className={"w-40 h-fit" +
            " text-white bg-zinc-900 border-2 rounded-t-md border-neutral-800 border-b-indigo-800 " +
            " hover:scale-110 hover:cursor-pointer transition-all"}>
            <div id={"main"} className={"flex flex-col items-center justify-center w-full p-2"}>
                <div className={"flex w-full justify-end"}><RemoveFolderBtn folder={folder} /></div>
                <BsFillFolderFill className={"w-12 h-12"}/>
                <span className={"text-center"}>{folder.foldername}</span>
            </div>
        </div>
    )
}