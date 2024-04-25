import type StorageItemSummary from "~/types/api/StorageItemSummary";

export const moveItems = (items: Array<StorageItemSummary>, currentFolderId: string, targetFolderId: string, undoing = false) => {
    if (currentFolderId === targetFolderId) return;
    for (const item of items) {
        if (item.id === targetFolderId || item.id === currentFolderId) return
    }
    modifyItems(
        items,
        ["move", "moved"],
        "PATCH",
        {parent_id: targetFolderId},
        () => moveItems(items, targetFolderId, currentFolderId, true),
        undoing
    )
}

export const trashItems = (items: StorageItemSummary[], undoing = false) => modifyItems(
    items,
    ["trash", "trashed"],
    "PATCH",
    {in_trash: true},
    () => restoreItems(items, true),
    undoing
)
export const restoreItems = (items: StorageItemSummary[], undoing = false) => modifyItems(
    items,
    ["restore", "restored"],
    "PATCH",
    {in_trash: false},
    () => trashItems(items, true),
    undoing
)
export const deleteItems = (items: StorageItemSummary[], undoing = false) => modifyItems(
    items,
    ["delete", "deleted"],
    "DELETE",
    {},
    null,
    undoing
)

export const downloadFile = (file: StorageItemSummary) => {
    if (!isFile(file)) return;
    const link = document.createElement("a");
    link.setAttribute("href", `/api/files/${file.id}/download`);
    link.setAttribute("download", file.name + "." + file.ext);
    link.click();
    link.remove()
}

async function modifyItems(
    items: StorageItemSummary[],
    [action, past]: Array<string>,
    method: string,
    body: any,
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
            item.type === "file" ? fileIds.push(item.id) : folderIds.push(item.id)
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
            await useRefreshView().value()
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
