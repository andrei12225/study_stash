"use client"

import Image from "next/image";
import {UserResource} from "@clerk/types";
import React, {useState} from "react";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { PiSignOutLight } from "react-icons/pi";
import { TiUserDelete } from "react-icons/ti";
import AccountSettingsTab from "@/components/Home/AccountSettingsTab";
import {useClerk} from "@clerk/nextjs";

export default function AccountSettings({ user }: {user: UserResource}) {
    const [hasClickedProfile, setHasClickedProfile] = useState(false);
    const {signOut} = useClerk();

    function updateClickedProfile(e: React.MouseEvent<Element, MouseEvent>) {
        e.preventDefault();

        setHasClickedProfile((prevState) => !prevState);
    }

    return (
        <div className={"flex gap-2"}>
        <div className={"relative z-10"}>
            {hasClickedProfile && (
                <div className={"w-96 h-fit absolute right-0 top-0" +
                    "   opacity-100 bg-zinc-950 " +
                    "   border-2 border-blue-950 rounded-md"}>
                    <div className={"flex flex-col w-full"}>
                        <div className={"flex gap-2 justify-center items-center p-2"}>
                            <Image src={user.imageUrl} alt={"PFP"} width={100} height={100} className={"w-11 h-11 rounded-full"}/>
                            <span className={"italic"}>@{user.username}</span>
                        </div>
                        <div className={"bg-neutral-950 p-2"}>
                            <div className={"flex justify-evenly"}>
                                <AccountSettingsTab icon={<PiSignOutLight/>} titleText={"Sign Out"} descriptionText={""} descriptionClass={"text-indigo-700"} onClickFunc={async () => {await signOut({redirectUrl: "/"}); location.reload(); }}/>
                                <AccountSettingsTab icon={<TiUserDelete/>} titleText={"Delete Account"} descriptionText={""} descriptionClass={"text-red-900"}/>
                            </div>
                            <div className={"border-[1px] border-zinc-900 mx-10 my-2 rounded"}></div>
                            <div className={"flex justify-center"}>
                                <AccountSettingsTab icon={<MdOutlineTipsAndUpdates/>} titleText={"Joined StudyStash"} descriptionText={user.createdAt?.toDateString() as string} descriptionClass={"text-indigo-700"}/>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
            <div onClick={updateClickedProfile} className={"flex relative gap-2 justify-center items-center w-fit scale-110 rounded-lg p-1" +
                " hover:cursor-pointer hover:scale-125 transition-all"}>
                <Image src={user.imageUrl} alt={"PFP"} width={200} height={100}
                       className={"w-10 h-10 rounded-full"}/>
            </div>
        </div>
    )
}