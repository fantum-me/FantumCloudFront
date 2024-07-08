import type StorageItem from "~/types/api/StorageItem";

const useLastSelection = () => useState<string[]>("last-selection", () => [])

export function onItemContextMenu(item: StorageItem) {
    const itemsSelection = useItemsSelection()
    if (!itemsSelection.value.includes(item.id)) itemsSelection.value = [item.id]
    useItemsContextMenu().value.open()
}

export function onItemDragStart(item: StorageItem) {
    const itemsSelection = useItemsSelection()
    if (!itemsSelection.value.includes(item.id)) itemsSelection.value = [item.id]
    useLastSelection().value = itemsSelection.value
    useItemsDragging().value = true
    window.addEventListener("mouseup", onDragEnd)
}

function onDragEnd(e: MouseEvent) {
    const lastSelection = useLastSelection()
    useItemsDragging().value = false
    useWait(1) // executing after the onClick event to reselect elements
        .then(() => {
            useItemsSelection().value = lastSelection.value
            window.removeEventListener("mouseup", onDragEnd)

            if (e.target && asHtmlElement(e.target)) {
                const target = e.target.closest('[data-type="folder"]')
                if (target) {
                    const targetId = target.getAttribute("data-item-id")
                    if (targetId) {
                        const items: StorageItem[] = lastSelection.value.map(id => useItem(id).value)
                        moveItems(items, targetId)
                    }
                } else if (e.target.closest('[data-target="trash"]')) {
                    const items: StorageItem[] = lastSelection.value.map(id => useItem(id).value)
                    trashItems(items)
                }
            }
        })
}
