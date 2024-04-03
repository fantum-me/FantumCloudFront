import {ItemIconTypeDoc, ItemIconTypePresentation, ItemIconTypeSpreadsheet} from "#components";
import type DocumentType from "~/types/DocumentType";

export const documentTypes: DocumentType[] = [
    {
        type: "text",
        label: "Text document",
        ext: "odt",
        mime: "application/vnd.oasis.opendocument.text",
        icon: ItemIconTypeDoc
    },
    {
        type: "spreadsheet",
        ext: "ods",
        label: "Spreadsheet",
        mime: "application/vnd.oasis.opendocument.spreadsheet",
        icon: ItemIconTypeSpreadsheet
    },
    {
        type: "presentation",
        ext: "odp",
        label: "Slides presentation",
        mime: "application/vnd.oasis.opendocument.presentation",
        icon: ItemIconTypePresentation
    },
]
