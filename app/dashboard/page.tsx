import {redirect} from "next/navigation";
import Nav from "@/components/Home/Nav";
import Main from "@/components/Home/Main";
import {getSession} from "@/lib/auth";

export default async function Dashboard() {
    if (!await getSession()) redirect("/");

    return (
        <div className={"flex flex-col"}>
            <Nav />
            <Main />
        </div>
    );
}
