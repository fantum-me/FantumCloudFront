import {ItemIconTypeDoc, ItemIconTypePresentation, ItemIconTypeSpreadsheet} from "#components";
import type DocumentType from "~/types/filesystem/DocumentType";

export const documentTypes: DocumentType[] = [
    {
        type: "text",
        label: "Text document",
        ext: "docx",
        mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        icon: ItemIconTypeDoc
    },
    {
        type: "spreadsheet",
        ext: "xlsx",
        label: "Spreadsheet",
        mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        icon: ItemIconTypeSpreadsheet
    },
    {
        type: "presentation",
        ext: "pptx",
        label: "Slides presentation",
        mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        icon: ItemIconTypePresentation
    },
]
