"use client"

import Link from "next/link";
import {ReactElement} from "react";
import {signInWithDiscord, useSession} from "@/lib/auth-client";
import { RiNextjsFill } from "react-icons/ri";
import { IoLogoDiscord, IoText } from "react-icons/io5";
import { BsFillFileEarmarkPdfFill, BsFillFolderFill, BsStars } from "react-icons/bs";

const features: {icon: ReactElement, title: string, text: string}[] = [
    {icon: <BsFillFileEarmarkPdfFill/>, title: "Photos to PDF", text: "Upload pictures of your notes and get back one tidy PDF."},
    {icon: <IoText/>, title: "Text notes", text: "Write and edit text files right in your browser."},
    {icon: <BsFillFolderFill/>, title: "Organised in folders", text: "Keep every course in its own folder."},
    {icon: <IoLogoDiscord/>, title: "Sign in with Discord", text: "One click, no new password to remember."},
];

const ctaClass = "text-xl mt-10 cursor-pointer bg-indigo-900 py-2 w-56 text-center rounded-full relative hover:scale-105 transition-all" +
    " after:content-[''] after:absolute after:w-full after:h-full after:inset-0 btn-background after:-z-10 after:rounded-full after:m-3 after:hover:scale-105 after:transition-all after:hover:m-0";

export default function Landing() {
    const {data: session, isPending} = useSession();

    return (
        <main className={"relative text-white overflow-hidden"}>
            {/* Soft glow behind the headline */}
            <div aria-hidden className={"pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 w-[42rem] max-w-[140vw] h-80 rounded-full bg-indigo-700/20 blur-3xl"}/>

            <section className={"relative flex flex-col items-center text-center px-4 pt-24 sm:pt-36" +
                " motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700"}>
                <span className={"mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-800/70 bg-indigo-950/60 px-3 py-1 text-sm text-indigo-200"}>
                    <BsStars className={"text-indigo-400"}/> Snap your notes, get a PDF
                </span>
                <h1 className={"text-4xl sm:text-6xl font-light tracking-tight"}>
                    Welcome to <span className={"font-bold bg-gradient-to-r from-indigo-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent"}>StudyStash</span>
                </h1>
                <p className={"mt-4 max-w-xl text-lg sm:text-xl text-zinc-400"}>The easiest, most convenient way of storing your notes.</p>

                {session ?
                    <Link href={"/dashboard"} className={ctaClass}>Open your stash</Link> :
                    <button onClick={signInWithDiscord} disabled={isPending} className={ctaClass + " disabled:opacity-60"}>Get Started</button>}
            </section>

            <div className={"mt-32 w-full min-h-32 relative bg-zinc-950 rounded-t-[70%100%] landing-line-background" +
                " after:content-[''] after:absolute after:w-full after:h-full after:-z-20 after:inset-0 after:bg-indigo-950 after:rounded-t-[70%100%] after:-mt-1 " +
                " before:content-[''] before:absolute before:w-full before:mt-1 before:rounded-t-[50%100%] before:h-16 before:-z-10 before:inset-0 before:bg-indigo-900 before:blur-lg"}>
            </div>

            <section className={"relative -mt-12 mx-auto max-w-5xl px-4 pb-24"}>
                <h2 className={"text-center text-2xl sm:text-3xl mb-8"}>Why choose StudyStash</h2>
                <div className={"grid gap-4 sm:grid-cols-2 lg:grid-cols-4"}>
                    {features.map((feature, i) =>
                        <div key={feature.title} style={{animationDelay: `${150 + i * 100}ms`}}
                             className={"rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 transition-all hover:-translate-y-1 hover:border-indigo-700/70 hover:bg-zinc-900" +
                                 " motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 motion-safe:fill-mode-both"}>
                            <div className={"mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-950 text-lg text-indigo-300"}>{feature.icon}</div>
                            <h3 className={"font-semibold"}>{feature.title}</h3>
                            <p className={"mt-1 text-sm text-zinc-400"}>{feature.text}</p>
                        </div>
                    )}
                </div>
            </section>

            <footer className={"flex items-center justify-center gap-1 bg-zinc-900 rounded-t-full p-1 text-sm text-zinc-300"}>
                Made by @Andrei with <RiNextjsFill className={"text-indigo-500 w-5 h-5"}/>
            </footer>
        </main>
    )
}
