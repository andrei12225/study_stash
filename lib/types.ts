export type fileRow = {
    fileid: string;
    userid: string;
    username: string;
    filename: string;
    fileaddedat: string;
    folderid: string;
    fileurl: string;
}

export type modifiedRow = {
    userId: string;
    userName: string;
    file: string;
    fileName: string;
    fileAddedAt: string;
    fileId: string;
}

export type folderRow = {
    userid: string;
    folderid: string;
    foldername: string;
}