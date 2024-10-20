import {ReactElement} from "react";

export default function AccountSettingsTab({icon, titleText, descriptionText, descriptionClass, onClickFunc}: {icon: ReactElement, titleText: string, descriptionText: string, descriptionClass: string, onClickFunc?: () => void}) {
    return (
        <div onClick={onClickFunc} className={"flex flex-col " +
            " hover:bg-indigo-950 hover:cursor-pointer rounded p-0.5"}>
            <div className={"flex gap-2 items-center"}>
                {icon} {titleText}
            </div>
            <span className={descriptionClass}>{descriptionText}</span>
        </div>
    )
}