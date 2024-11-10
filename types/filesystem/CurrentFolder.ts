import type Folder from "~/types/filesystem/Folder";
import type {DocumentTypeType} from "~/types/filesystem/DocumentType";

export default interface CurrentFolder extends Folder {
    import_file?: () => void,
    create_folder?: () => void,
    create_document?: (type: DocumentTypeType) => void,
}
