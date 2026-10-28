"use client"

import Image from "next/image";
import React, {useState} from "react";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { PiSignOutLight } from "react-icons/pi";
import AccountSettingsTab from "@/components/Home/AccountSettingsTab";
import {signOut, useSession} from "@/lib/auth-client";

type User = NonNullable<ReturnType<typeof useSession>["data"]>["user"];

export default function AccountSettings({ user }: {user: User}) {
    const [hasClickedProfile, setHasClickedProfile] = useState(false);

    function updateClickedProfile(e: React.MouseEvent<Element, MouseEvent>) {
        e.preventDefault();

        setHasClickedProfile((prevState) => !prevState);
    }

    return (
        <div className={"flex gap-2"}>
        <div className={"relative z-10"}>
            {hasClickedProfile && (
                <div className={"w-56 lg:w-96 h-fit absolute right-0 top-0" +
                    "   opacity-100 bg-zinc-950 " +
                    "   border-2 border-blue-950 rounded-md"}>
                    <div className={"flex flex-col w-full"}>
                        <div className={"flex gap-2 justify-center items-center p-2"}>
                            <Image src={user.image ?? ""} alt={"PFP"} width={100} height={100} className={"w-11 h-11 rounded-full"}/>
                            <span className={"italic"}>@{user.username ?? user.name}</span>
                        </div>
                        <div className={"bg-neutral-950 p-2"}>
                            <div className={"flex justify-evenly"}>
                                <AccountSettingsTab icon={<PiSignOutLight/>} titleText={"Sign Out"} descriptionText={""} descriptionClass={"text-indigo-700"} onClickFunc={async () => {await signOut(); location.reload(); }}/>
                            </div>
                            <div className={"border-[1px] border-zinc-900 mx-10 my-2 rounded"}></div>
                            <div className={"flex justify-center"}>
                                <AccountSettingsTab icon={<MdOutlineTipsAndUpdates/>} titleText={"Joined StudyStash"} descriptionText={new Date(user.createdAt).toDateString()} descriptionClass={"text-indigo-700"}/>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
            <div onClick={updateClickedProfile} className={"flex relative gap-2 justify-center items-center w-fit scale-110 rounded-lg p-1" +
                " hover:cursor-pointer hover:scale-125 transition-all"}>
                <Image src={user.image ?? ""} alt={"PFP"} width={200} height={100}
                       className={"w-10 h-10 rounded-full"}/>
            </div>
        </div>
    )
}