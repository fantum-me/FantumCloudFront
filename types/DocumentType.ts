export default interface DocumentType {
    type: DocumentTypeType,
    label: string,
    ext: string,
    mime: string,
    icon: any
}

export type DocumentTypeType = "text" | "spreadsheet" | "presentation"
