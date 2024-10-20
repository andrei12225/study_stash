"use client"

import {useUser} from "@clerk/nextjs";
import {fileRow,folderRow} from "@/lib/types";
import {useEffect, useState} from "react";
import BreadcrumbNav from "@/components/Home/BreadcrumbNav";
import {createSupabaseClient} from "@/supabase/client";
import { RiNextjsFill } from "react-icons/ri";
import ShowFilesInFolder from "@/components/Home/Misc/ShowFilesInFolder";
import ShowCurrentFolders from "@/components/Home/Misc/ShowCurrentFolders";
import { IoLogoDiscord } from "react-icons/io5";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { IoDownload } from "react-icons/io5";

export default function Main() {
    const user = useUser();

    const [foldersLoading, setLoading] = useState<boolean>(true);
    const [filesInFolder, setFilesInFolder] = useState<fileRow[]>([]);
    const [folders, setFolders] = useState<folderRow[]>([]);
    const [folderSelected, setFolderSelected] = useState<folderRow>();

    useEffect(() => {
        const requestFolders: () => void = async () => {
            const supabase = createSupabaseClient();
            const {data, error} = await supabase.from("userfolders").select().eq("userid", user?.user?.id as string);
            if (error) return console.error(error);
            setFolders(data); setLoading(false);
        }

        if (user.user?.id) {
            requestFolders();
        }
    }, [user.isLoaded, user.user?.id]);

    async function updateFolderAndFiles(folder: folderRow | undefined) {
        if (!folder) {
            setFolderSelected(undefined); setFilesInFolder([]);
            return;
        }

        const supabase = createSupabaseClient();
        const {data: folderFiles} = await supabase.from("userfile").select().eq("folderid", folder.folderid);

        setFolderSelected(folder); setFilesInFolder(folderFiles as unknown as fileRow[]);
    }

    if (user.isSignedIn || !user.isLoaded)
        return (
            <div className={"w-full h-[90vh]" +
            " flex flex-col justify-start gap-52 items-center text-white"}>
                <BreadcrumbNav setFolder={updateFolderAndFiles as () => Promise<void>} folder={folderSelected} />
                {folderSelected &&
                    <ShowFilesInFolder folder={folderSelected} filesInFolder={filesInFolder} />}

                {!folderSelected &&
                    <ShowCurrentFolders userIsLoaded={user.isLoaded} folders={folders} foldersLoading={foldersLoading} updateFolderAndFiles={updateFolderAndFiles} />}

            </div>
        )
    else return (
        <div className={"w-full h-[90vh] " +
            " text-white"}>
            <div className={"flex justify-center gap-1 flex-col items-center h-full mt-52"}>
                <span className={"text-5xl"}>Welcome to <span className={"font-bold"}>StudyStash!</span></span>
                <span className={"text-2xl"}>The easiest, most convenient way of storing your notes.</span>
                <div className={"text-xl mt-5 cursor-pointer bg-indigo-900 py-2 w-52 text-center rounded-full relative hover:scale-105 transition-all" +
                    " after:content-[''] after:absolute after:w-full after:h-full after:inset-0 btn-background after:-z-10 after:rounded-full after:m-3 after:hover:scale-105 after:transition-all after:hover:m-0"}>
                    Get Started
                </div>
                <div className={"mt-44 w-full min-h-32 relative bg-zinc-950 rounded-t-[70%100%] landing-line-background" +
                    " after:content-[''] after:absolute after:w-full after:h-full after:-z-20 after:inset-0 after:bg-indigo-950 after:rounded-t-[70%100%] after:-mt-1 " +
                    " before:content-[''] before:absolute before:w-full before:mt-1 before:rounded-t-[50%100%] before:h-16 before:-z-10 before:inset-0 before:bg-indigo-900 before:blur-lg"}>
                </div>
                <div className={"w-1/2 h-1/2 mt-10 bg-zinc-950 relative btn-background rounded-b-[80%100%] pb-5 after:content-[''] after:w-full after:h-full after:absolute after:inset-0 after:-z-20 after:bg-indigo-950 after:mt-1 after:rounded-b-[60%100%]"}>
                    <div className={"text-center text-3xl pt-2"}>Why choose StudyStash</div>
                    <div className={"border-t-2 border-t-indigo-900 m-2 rounded-t-[50%100%]"}> </div>
                    <div className={"flex flex-col justify-center items-center mb-2"}>
                        <div className={"flex items-center gap-1"}><IoLogoDiscord />Easily create your account with Discord</div>
                        <div className={"flex items-center gap-1"}><BsFillLightningChargeFill />Lightning-fast uploads</div>
                        <div className={"flex items-center gap-1"}><BsFillFileEarmarkPdfFill />We automatically convert your pictures to PDF</div>
                        <div className={"flex items-center gap-1"}><IoDownload />Download your freshly created notes any time!</div>
                    </div>
                </div>
            </div>
            <div className={"flex items-end mt-32 text-center justify-center bg-zinc-900 rounded-t-full p-1"}>
                <div className={"flex items-center justify-center gap-1"}>Made by @Andrei with <RiNextjsFill className={"text-indigo-700 w-5 h-5"}/>
                </div>
            </div>
        </div>
    )
}