import {
    ItemIconTypeArchive,
    ItemIconTypeAudio,
    ItemIconTypeCode,
    ItemIconTypeDoc,
    ItemIconTypeExe, ItemIconTypeFolder,
    ItemIconTypeImage,
    ItemIconTypePdf,
    ItemIconTypePresentation,
    ItemIconTypeSpreadsheet,
    ItemIconTypeText,
    ItemIconTypeVideo
} from "#components";
import type StorageItem from "~/types/api/StorageItem";

export const types = [
    {
        icon: ItemIconTypeImage,
        formats: ["image/*"]
    }, {
        icon: ItemIconTypeDoc,
        formats: [
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.oasis.opendocument.text"
        ]
    }, {
        icon: ItemIconTypeSpreadsheet,
        formats: [
            "application/vnd.ms-excel",
            "*spreadsheet*",
            "text/csv"
        ]
    }, {
        icon: ItemIconTypeAudio,
        formats: ["audio/*"]
    }, {
        icon: ItemIconTypeVideo,
        formats: ["video/*"]
    }, {
        icon: ItemIconTypePdf,
        formats: ["application/pdf"]
    }, {
        icon: ItemIconTypePresentation,
        formats: ["application/vnd.ms-powerpoint", "*presentation"]
    }, {
        icon: ItemIconTypeArchive,
        formats: [
            "application/x-freearc",
            "*zip*",
            "application/vnd.rar",
            "application/x-tar",
            "application/x-7z-compressed"
        ]
    }, {
        icon: ItemIconTypeExe,
        formats: [
            "application/x-sh",
            "application/x-shellscript",
            "application/x-msdownload",
            "application/bat",
            "application/x-msdos-program",
            "application/x-executable",
            "application/x-ms-dos-executable",
            "application/x-msi",
            "application/x-ms-shortcut",
        ]
    }, {
        icon: ItemIconTypeCode,
        formats: [
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
    },
]

export const getStorageItemIcon = (item: StorageItem): any => {
    if (isFolder(item)) return ItemIconTypeFolder
    else if (isFile(item)) {
        for (const type of types) {
            for (const format of type.formats) {
                const pattern = format.replace(/\*/g, '.*')
                const regex = new RegExp(`^${pattern}$`);
                if (regex.test(item.type)) return type.icon
            }
        }
    }
    return ItemIconTypeText
}
