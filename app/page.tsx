import Nav from "@/components/Home/Nav";
import Main from "@/components/Home/Main";

export default async function Home() {

    return (
        <div className={"flex flex-col"}>
            <Nav />
            <Main />
        </div>
    );
}
