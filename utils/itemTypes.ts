import type StorageItem from "~/types/filesystem/StorageItem";
import type File from "~/types/filesystem/File";
import type Folder from "~/types/filesystem/Folder";

export const isFile = (item: StorageItem): item is File => item.type === 'file';

export const isFolder = (item: StorageItem): item is Folder => item.type === 'folder';

export const fileTypes = {
    "image": ["image/*"],
    "word": [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.oasis.opendocument.text"
    ],
    "cell": [
        "application/vnd.ms-excel",
        "*spreadsheet*",
        "text/csv"
    ],
    "audio": ["audio/*"],
    "video": ["video/*"],
    "pdf": ["application/pdf"],
    "slide": ["application/vnd.ms-powerpoint", "*presentation"],
    "archive": [
        "application/x-freearc",
        "*zip*",
        "application/vnd.rar",
        "application/x-tar",
        "application/x-7z-compressed"
    ],
    "exe": [
        "application/x-sh",
        "application/x-shellscript",
        "application/x-msdownload",
        "application/bat",
        "application/x-msdos-program",
        "application/x-executable",
        "application/x-ms-dos-executable",
        "application/x-msi",
        "application/x-ms-shortcut",
    ],
    "code": [
        "text/x-c",
        "text/x-c\\+\\+src",
        "text/x-csharp",

        "*python",
        "*java",
        "*javascript",
        "*typescript",
        "*yaml",
        "*json",
        "*xml",
        "*php*",
        "*sql",
        "*css",
        "*html",
    ]
}

export const getStorageItemType = (item: StorageItem): string => {
    if (isFolder(item)) return "folder"
    else if (isFile(item)) {
        for (const [type, formats] of Object.entries(fileTypes)) {
            for (const format of formats) {
                const pattern = format.replace(/\*/g, '.*')
                const regex = new RegExp(`^${pattern}$`);
                if (regex.test(item.mime)) return type
            }
        }
        return "file"
    }
    return "other"
}

export const isOfficeDocument = (item: StorageItem): boolean => {
    const type = getStorageItemType(item)
    return ["word", "cell", "slide", "pdf"].includes(type)
}

