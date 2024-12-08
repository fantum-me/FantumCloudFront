import {
    ItemIconTypeArchive,
    ItemIconTypeAudio,
    ItemIconTypeCode,
    ItemIconTypeDatabase,
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
import type StorageItem from "~/types/filesystem/StorageItem";

export const getStorageItemIcon = (item: StorageItem): any => {

    if (isFolder(item)) return ItemIconTypeFolder
    else if (isDatabase(item)) return ItemIconTypeDatabase
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
