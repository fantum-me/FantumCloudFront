import type StorageItem from "~/types/filesystem/StorageItem";
import type File from "~/types/filesystem/File";
import type Folder from "~/types/filesystem/Folder";
import type {Ref} from "vue";

export const openItem = (item: StorageItem, imageViewerArrows = true) => {
    const workspaceId = useWorkspace().value.id
    if (isFolder(item)) {
        const path = item.is_root ? "files" : "folder/" + item.id
        navigateTo(`/workspace/${workspaceId}/${path}`)
    } else if (isDatabase(item)) navigateTo(`/workspace/${workspaceId}/database/${item.id}`)
    else if (isOfficeDocument(item)) navigateTo(`/workspace/${workspaceId}/docs/${item.id}`, {open: {target: "_blank"}})
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
        parentIds.length === 1 ? () => moveItems(items, parentIds[0], true) : null,
        undoing
    )
}

export const renameItem = (item: StorageItem, newName: string, undoing = false) => {
    const oldName = item.name
    modifyItems(
        [item],
        ["rename", "renamed"],
        "PATCH",
        {name: newName},
        (item: StorageItem) => item.name = newName,
        () => renameItem(item, oldName, true),
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
    () => {
    },
    null,
    false
)

export const downloadFile = (file: StorageItem) => {
    if (!isFile(file)) return;
    const link = document.createElement("a");
    link.setAttribute("href", `/api/workspaces/${file.workspace_id}/files/${file.id}/download`);
    link.setAttribute("download", file.name);
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
        body.items = items.map(item => item.id)

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
            useSuccessToast(`${items.length} items ${past} successfully`, successActions)
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
