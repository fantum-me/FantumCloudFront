import type StorageItem from "~/types/api/StorageItem";
import type File from "~/types/api/File";
import type Folder from "~/types/api/Folder";
import type {Ref} from "vue";

export const openItem = (item: StorageItem, imageViewerArrows = true) => {
    if (isFolder(item)) {
        const link = item.is_root ? "/files" : "/folder/" + item.id
        navigateTo("/workspace/" + useWorkspace().value.id + link)
    } else if (isOfficeDocument(item)) navigateTo(`/docs/${item.id}`, {open: {target: "_blank"}})
    else if (getStorageItemType(item) === "image") useImageViewer().value(item as File, imageViewerArrows)
}

export const moveItems = (items: StorageItem[], targetId: string, undoing = false) => {
    const target = useItem(targetId) as Ref<Folder>;
    if (!target.value) return;

    items = items.filter(item => item.parent_id && targetId !== item.parent_id)
    for (const item of items) if (item.id === targetId) return

    const parentIds: string[] = []
    items.forEach(item => parentIds.includes(item.parent_id) ? null : parentIds.push(item.parent_id))

    modifyItems(
        items,
        ["move", "moved"],
        "PATCH",
        {parent_id: targetId},
        (item: StorageItem) => {
            const parent = useItem(item.parent_id) as Ref<Folder>
            if (parent.value.items) parent.value.items = parent.value.items.filter(f => f.id !== item.id)
            if (target.value.items) target.value.items.push(item)
            item.parent_id = target.value.id
        },
        parentIds.length === 1 ? () => moveItems(items, parentIds[0], true): null,
        undoing
    )
}

export const trashItems = (items: StorageItem[], undoing = false) => modifyItems(
    items,
    ["trash", "trashed"],
    "PATCH",
    {in_trash: true},
    (item: StorageItem) => item.in_trash = true,
    () => restoreItems(items, true),
    undoing
)
export const restoreItems = (items: StorageItem[], undoing = false) => modifyItems(
    items,
    ["restore", "restored"],
    "PATCH",
    {in_trash: false},
    (item: StorageItem) => item.in_trash = false,
    () => trashItems(items, true),
    undoing
)
export const deleteItems = (items: StorageItem[]) => modifyItems(
    items,
    ["delete", "deleted"],
    "DELETE",
    {},
    () => {},
    null,
    false
)

export const downloadFile = (file: StorageItem) => {
    if (!isFile(file)) return;
    const link = document.createElement("a");
    link.setAttribute("href", `/api/files/${file.id}/download`);
    link.setAttribute("download", file.name + "." + file.ext);
    link.click();
    link.remove()
}

async function modifyItems(
    items: StorageItem[],
    [action, past]: Array<string>,
    method: string,
    body: any,
    itemFunction: (item: StorageItem) => any,
    undo: Function | null,
    undoing: boolean
) {
    const workspace = useWorkspace()

    if (items.length === 0) return
    useLoadingItems().value = items.map(item => item.id)
    useItemsSelection().value = []

    try {
        const fileIds: string[] = []
        const folderIds: string[] = []
        items.forEach(item => {
            isFile(item) ? fileIds.push(item.id) : folderIds.push(item.id)
        })

        body.files = fileIds
        body.folders = folderIds
        const name = composeElementsName(fileIds, folderIds)

        let successActions = []
        if (undo && !undoing) {
            successActions.push({
                label: "undo",
                click: undo as Function
            })
        }

        const res = await useApiFetch(`/workspaces/${workspace.value.id}/items`, {
            method: method,
            body: JSON.stringify(body)
        })

        if (res.ok) {
            items.forEach(itemFunction)
            useRefreshView().value()
            useSuccessToast(`${name} ${past} successfully`, successActions)
            useItemsSelection().value = []
        } else {
            if (res.status === 403) useErrorToast(`You are not allowed to perform this action`)
            else useErrorToast(`Error while trying to ${action}: Network error`)
        }
    } catch (e) {
        useErrorToast(`Error while trying to ${action}: Processing error (please reload the page)`)
    }
    useLoadingItems().value = []
}

function composeElementsName(files: any[], folders: any[]): string {
    let name = ""
    if (folders.length > 0) name += folders.length + " folder" + (folders.length > 1 ? "s" : "")
    if (folders.length > 0 && files.length > 0) name += " and "
    if (files.length > 0) name += files.length + " file" + (files.length > 1 ? "s" : "")
    return name
}
