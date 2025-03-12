import type StorageItem from "~/types/filesystem/StorageItem";
import {ModalConfirmation, ModalInput, ModalNewDocument, ModalWorkspaceOwnershipTransfer} from "#components";
import type Member from "~/types/user/Member";
import type Folder from "~/types/filesystem/Folder";

export const openRenameModal = (item: StorageItem) => {
    const nameParts = item.name.split(".")
    let ext = hasExtension(item) ? nameParts.pop() : ""
    let defaultValue = nameParts.join(".")

    const modal = useModal()
    modal.open(ModalInput, {
        title: "Rename " + item.name,
        buttonLabel: "Rename",
        defaultValue: defaultValue,
        trailing: ext,
        onSuccess: (newName: string) => {
            renameItem(item, newName + "." + ext)
            modal.close()
        }
    })
}

export const openKickMemberModal = (member: Member) => {
    const modal = useModal()
    const workspace = useWorkspace()
    modal.open(ModalConfirmation, {
        title: `Are you sure you want to kick ${member.user.name} ?`,
        description: "They will be able to join the workspace again if they have a valid invitation link.",
        buttonLabel: "Kick",
        color: "red",
        onSuccess: async () => {
            const res = await useApiFetch(`/workspaces/${workspace.value.id}/members/${member.id}/kick`, {
                method: "POST"
            })

            if (res.ok) {
                useRefreshView().value()
                useSuccessToast(`Successfully kicked ${member.user.name} !`)
            } else useErrorToast(`Failed to kick ${member.user.name}`)
        }
    })
}

export const openNewItemModal = (type: "folder" | "database", folder: Folder, openAfterCreation = false) => {
    const modal = useModal()
    const workspace = useWorkspace()
    modal.open(ModalInput, {
        title: "Create new " + capitalize(type),
        buttonLabel: "Create",
        onSuccess: async (name: string) => {
            const res = await useApiFetch(`/workspaces/${workspace.value.id}/items`, {
                method: "POST",
                body: JSON.stringify({
                    type: type,
                    view: "table", // will not be read by backend if the type is folder
                    name: name,
                    parent_id: folder.id
                })
            })


            if (res.ok) {
                const item = await res.json()
                useItem(item.id).value = item
                if (folder.items) folder.items.push(item)
                useSuccessToast(`Database ${name} created successfully !`)
                if (openAfterCreation) navigateTo(`/workspace/${workspace.value.id}/database/${item.id}`)
            } else useErrorToast(`Failed to create database ${name}`)
            await modal.close()
        }
    })
}

export const openNewDocumentModal = (folder: Folder, type: string, openAfterCreation: boolean) => {
    useModal().open(ModalNewDocument, {folder, type, openAfterCreation})
}

export const openTransferOwnershipModal = (member: Member) => {
    useModal().open(ModalWorkspaceOwnershipTransfer, {member})
}
