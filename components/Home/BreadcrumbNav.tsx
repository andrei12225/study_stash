import { SlashIcon } from "@radix-ui/react-icons"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {folderRow} from "@/lib/types";

export default function BreadcrumbNav({ folder, setFolder }: {folder: folderRow | undefined, setFolder: (folder: folderRow | undefined) => void}) {
    return (
        <Breadcrumb className={"mt-10 bg-indigo-950 rounded p-1"}>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink className={"hover:text-zinc-400 hover:cursor-pointer"} onClick={() => setFolder(undefined)}>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                {folder &&
                    <BreadcrumbItem>
                        <BreadcrumbLink className={"hover:text-zinc-400 hover:cursor-pointer"}>{folder?.foldername}</BreadcrumbLink>
                    </BreadcrumbItem>
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}