import {createSupabaseClient} from "@/supabase/client";
import {v4 as uuidv4} from "uuid";

function getStorage() {
    const {storage} = createSupabaseClient();
    return storage;
}

type UploadProps = {
    userId: string;
    file: File;
    bucket: string;
    userName: string;
    folderId: string;
    fileName: string;
}

export async function uploadFile({userId, file, bucket, fileName, userName, folderId}: UploadProps) {
    const fileExtension = fileName.slice(fileName.lastIndexOf(".")+1);
    const fileId = uuidv4();
    const path = `${fileId}.${fileExtension}`;

    const storage = getStorage();

    const {data} = await storage.from(bucket).upload(path, file);

    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data?.path}`;

    const supabase = createSupabaseClient();
    await supabase.from("userfile").insert({userid: userId, fileid: fileId, folderid: folderId, filename: fileName, username: userName, fileaddedat: new Date().toDateString(), fileurl: fileUrl})

    return fileUrl;
}