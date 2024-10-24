"use client"

import { CiMaximize2 } from "react-icons/ci";
import { AiOutlineLoading } from "react-icons/ai";
import {useClerk, useUser} from "@clerk/nextjs";
import AccountSettings from "@/components/Home/AccountSettings";
import { PiSignIn } from "react-icons/pi";
import CreateFolderBtn from "@/components/Home/Misc/CreateFolderBtn";

export default function Nav() {
    const user = useUser();
    const clerk = useClerk();

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
            {user.isSignedIn && <CreateFolderBtn />}
            <div>
                {!user.isLoaded &&
                    <AiOutlineLoading className={"animate-spin"}></AiOutlineLoading>}
                {user.isSignedIn &&
                    <AccountSettings user={user.user}/>}
                {!user.isSignedIn && user.isLoaded &&
                    <span className={"flex gap-2 items-center hover:cursor-pointer hover:text-indigo-500"} onClick={() => clerk.openSignIn()}>
                        <PiSignIn />Sign In</span>
                }
            </div>
            <div></div>
        </div>
    )
}