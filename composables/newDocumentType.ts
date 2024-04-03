import type DocumentType from "~/types/DocumentType";
import type {DocumentTypeType} from "~/types/DocumentType";

export const useNewDocumentType = () => useState<DocumentType>('new-document-type')

export const setNewDocumentType = (type: DocumentTypeType) => {
    const documentType = documentTypes.find(d => d.type === type)
    if (documentType) useNewDocumentType().value = documentType
}
