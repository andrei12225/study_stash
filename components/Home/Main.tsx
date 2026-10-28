"use client"

import {useSession} from "@/lib/auth-client";
import {fileRow,folderRow} from "@/lib/types";
import {useEffect, useState} from "react";
import BreadcrumbNav from "@/components/Home/BreadcrumbNav";
import {getFiles, getFolders} from "@/app/actions";
import ShowFilesInFolder from "@/components/Home/Misc/ShowFilesInFolder";
import ShowCurrentFolders from "@/components/Home/Misc/ShowCurrentFolders";

export default function Main() {
    const {data: session, isPending} = useSession();
    const userId = session?.user.id;

    const [foldersLoading, setLoading] = useState<boolean>(true);
    const [filesInFolder, setFilesInFolder] = useState<fileRow[]>([]);
    const [folders, setFolders] = useState<folderRow[]>([]);
    const [folderSelected, setFolderSelected] = useState<folderRow>();

    useEffect(() => {
        const requestFolders: () => void = async () => {
            try {
                setFolders(await getFolders()); setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }

        if (userId) {
            requestFolders();
        }
    }, [userId]);

    async function updateFolderAndFiles(folder: folderRow | undefined) {
        if (!folder) {
            setFolderSelected(undefined); setFilesInFolder([]);
            return;
        }

        const folderFiles = await getFiles(folder.folderid);

        setFolderSelected(folder); setFilesInFolder(folderFiles);
    }

    return (
        <div className={"w-full h-[90vh]" +
        " flex flex-col justify-start gap-52 items-center text-white"}>
            <BreadcrumbNav setFolder={updateFolderAndFiles as () => Promise<void>} folder={folderSelected} />
            {folderSelected &&
                <ShowFilesInFolder folder={folderSelected} filesInFolder={filesInFolder} />}

            {!folderSelected &&
                <ShowCurrentFolders userIsLoaded={!isPending} folders={folders} foldersLoading={foldersLoading} updateFolderAndFiles={updateFolderAndFiles} />}

        </div>
    )
}