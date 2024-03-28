import type Folder from "~/types/api/Folder";

export default interface CurrentFolder extends Folder {
    import_file?: () => void,
    create_folder?: () => void,
}
