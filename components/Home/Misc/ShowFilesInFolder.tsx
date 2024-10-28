import PDFCard from "@/components/Home/Misc/PDFCard";
import {PiFileDashedThin} from "react-icons/pi";
import {GoArrowDown} from "react-icons/go";
import UploadFileForm from "@/components/Home/Misc/UploadFileForm";
import {fileRow, folderRow} from "@/lib/types";
import CreateTextFileForm from "@/components/Home/Misc/CreateTextFileForm";

export default function ShowFilesInFolder({folder, filesInFolder}: {folder: folderRow, filesInFolder: fileRow[]}) {
    return (
        <div className={"flex flex-col items-center justify-center gap-5"}>
            {filesInFolder.length == 0 &&
            <div className={"flex flex-col items-center"}>
                <div className={"flex flex-col items-center justify-center opacity-60"}>
                    <PiFileDashedThin  className={"text-indigo-500 text-8xl opacity-40"}/>
                    <span className={"flex items-center justify-center gap-1 text-xs sm:text-sm md:text-base xl:text-lg"}>No files here yet. Press the button down there <GoArrowDown /> to upload one!</span>
                </div>
            </div>
            }

            {filesInFolder.length > 0 &&
                <div  className={"flex items-center justify-center gap-5 flex-wrap"}>
                    {filesInFolder.map((file, key) => {
                        return <PDFCard key={key} file={file}/>
                    })}
                </div>
            }
            <UploadFileForm folder={folder} />
            <CreateTextFileForm folder={folder} />
        </div>
    )
}