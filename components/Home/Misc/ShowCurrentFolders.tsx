import {Skeleton} from "@/components/ui/skeleton";
import {CiFolderOn} from "react-icons/ci";
import FolderCard from "@/components/Home/Misc/FolderCard";
import {folderRow} from "@/lib/types";

export default function ShowCurrentFolders({userIsLoaded, folders, foldersLoading, updateFolderAndFiles}: {userIsLoaded: boolean, folders: folderRow[], foldersLoading: boolean, updateFolderAndFiles: (folder: folderRow) => void}) {
    return (
        <div className={"w-full h-32 flex justify-center gap-5 flex-wrap"}>
            {!userIsLoaded &&
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 bg-indigo-950 rounded-full"/>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px] bg-indigo-950"/>
                        <Skeleton className="h-4 w-[200px] bg-indigo-950"/>
                    </div>
                </div>}

            {userIsLoaded && folders.length == 0 && !foldersLoading &&
                <div className={"flex flex-col items-center opacity-60"}>
                    <CiFolderOn className={"text-indigo-500 text-8xl opacity-40"}/>
                    <span>No folders yet. Create one first!</span>
                </div>}

            {userIsLoaded && folders.length > 0 && !foldersLoading &&
                <>
                    {folders.map((folder, key) => {
                        return <FolderCard onClick={() => updateFolderAndFiles(folder)} key={key} folder={folder}/>
                    })}
                </>
            }
        </div>
    )
}