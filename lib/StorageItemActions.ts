import type StorageItemSummary from "~/types/api/StorageItemSummary";

export const StorageItemActions = {
    download: downloadFile,
    // rename: renameItem,
    move: (items: Array<StorageItemSummary>, currentFolderId: string, targetFolderId: string, undoing = false) => {
        if (currentFolderId === targetFolderId) return;
        for (const item of items) {
            if (item.id === targetFolderId || item.id === currentFolderId) return
        }
        modifyItems(
            items,
            ["move", "moved"],
            "PATCH",
            {parent_id: targetFolderId},
            () => StorageItemActions.move(items, targetFolderId, currentFolderId, true),
            undoing
        )
    },
    trash: (items: StorageItemSummary[], undoing = false) => modifyItems(
        items,
        ["trash", "trashed"],
        "PATCH",
        {in_trash: true},
        () => StorageItemActions.restore(items, true),
        undoing
    ),
    restore: (items: StorageItemSummary[], undoing = false) => modifyItems(
        items,
        ["restore", "restored"],
        "PATCH",
        {in_trash: false},
        () => StorageItemActions.trash(items, true),
        undoing
    ),
    delete: (items: StorageItemSummary[], undoing = false) => modifyItems(
        items,
        ["delete", "deleted"],
        "DELETE",
        {},
        null,
        undoing
    ),
}

async function downloadFile(file: StorageItemSummary) {
    if (file.type !== "file") return;
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
    if (items.length === 0) return
    useHiddenItems().value = items.map(item => item.id)
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

        const res = await useApiFetch("/storage-items", {
            method: method,
            body: JSON.stringify(body)
        })

        if (res.ok) {
            await useRefreshView().value()
            useSuccessToast(`${name} ${past} successfully`, successActions)
            useItemsSelection().value = []
        } else useErrorToast(`Error while trying to ${action}: Network error`)
    } catch (e) {
        useErrorToast(`Error while trying to ${action}: Processing error (please reload the page)`)
    }
    useHiddenItems().value = []
}

function composeElementsName(files: any[], folders: any[]): string {
    let name = ""
    if (folders.length > 0) name += folders.length + " folder" + (folders.length > 1 ? "s" : "")
    if (folders.length > 0 && files.length > 0) name += " and "
    if (files.length > 0) name += files.length + " file" + (files.length > 1 ? "s" : "")
    return name
}


// async function renameItem(type, id, oldName, name, onRename, onClose) {
//     const rename = async () => {
//         const res = await fetchApi(`/${type}s/${id}`, {
//             method: "PATCH",
//             body: JSON.stringify({name: name})
//         })
//         if (res.ok) onRename()
//         else throw new Error("Error while renaming " + type)
//     }
//
//     if (name) {
//         toast.promise(
//             rename(),
//             {
//                 loading: <p>Renaming < span class = "font-semibold" > {oldName} < /span>...</p >,
//             success
//     :
//         <p><span class = "font-semibold" > {oldName} < /span> renamed successfully.</
//         p >,
//             error
//     :
//         <p>Error
//         while trying to
//         rename < span
//
//         class
//
//         = "font-semibold" > {oldName} < /span></
//         p >
//     }
//     )
//     }
//     onClose()
// }
