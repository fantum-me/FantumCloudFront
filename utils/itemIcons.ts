import {
    ItemIconTypeArchive,
    ItemIconTypeAudio,
    ItemIconTypeCode,
    ItemIconTypeDoc,
    ItemIconTypeExe,
    ItemIconTypeFolder,
    ItemIconTypeImage,
    ItemIconTypePdf,
    ItemIconTypePresentation,
    ItemIconTypeSpreadsheet,
    ItemIconTypeText,
    ItemIconTypeVideo
} from "#components";
import type StorageItem from "~/types/api/StorageItem";
import type File from "~/types/api/File";
import type Folder from "~/types/api/Folder";

export const isFile = (item: StorageItem): item is File => "ext" in item;

export const isFolder = (item: StorageItem): item is Folder => "is_root" in item;

export const getStorageItemIcon = (item: StorageItem): any => {

    if (isFolder(item)) return ItemIconTypeFolder
    else if (isFile(item)) {
        switch (getStorageItemType(item)) {
            case "image":
                return ItemIconTypeImage;
            case "word":
                return ItemIconTypeDoc;
            case "cell":
                return ItemIconTypeSpreadsheet;
            case "audio":
                return ItemIconTypeAudio;
            case "video":
                return ItemIconTypeVideo;
            case "pdf":
                return ItemIconTypePdf;
            case "slide":
                return ItemIconTypePresentation;
            case "archive":
                return ItemIconTypeArchive;
            case "exe":
                return ItemIconTypeExe;
            case "code":
                return ItemIconTypeCode;
        }
    }
    return ItemIconTypeText
}
