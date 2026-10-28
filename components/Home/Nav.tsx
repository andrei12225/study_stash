"use client"

import { CiMaximize2 } from "react-icons/ci";
import { AiOutlineLoading } from "react-icons/ai";
import {signInWithDiscord, useSession} from "@/lib/auth-client";
import AccountSettings from "@/components/Home/AccountSettings";
import { PiSignIn } from "react-icons/pi";
import CreateFolderBtn from "@/components/Home/Misc/CreateFolderBtn";
import {usePathname} from "next/navigation";

export default function Nav() {
    const {data: session, isPending} = useSession();
    const onDashboard = usePathname() == "/dashboard";

    return (
        <div className={"text-white" +
            " w-full h-[10vh]" +
            " flex items-center justify-between" +
            " border-b-2 border-b-indigo-500 rounded-b-lg"}>
            <div></div>
            <a href={"/"} className={"flex gap-2 items-center text-2xl hover:cursor-pointer"}>
                <CiMaximize2 className={"text-indigo-400 text-2xl"}/> StudyStash</a>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            {session && onDashboard && <CreateFolderBtn />}
            <div>
                {isPending &&
                    <AiOutlineLoading className={"animate-spin"}></AiOutlineLoading>}
                {session &&
                    <AccountSettings user={session.user}/>}
                {!session && !isPending &&
                    <span className={"flex gap-2 items-center hover:cursor-pointer hover:text-indigo-500"} onClick={signInWithDiscord}>
                        <PiSignIn />Sign In</span>
                }
            </div>
            <div></div>
        </div>
    )
}