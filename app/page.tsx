import Nav from "@/components/Home/Nav";
import Landing from "@/components/Home/Landing";

export default function Home() {
    return (
        <div className={"flex flex-col"}>
            <Nav />
            <Landing />
        </div>
    );
}
