<script setup lang="ts">
import {useMouse, useWindowScroll} from "@vueuse/core";
import type StorageItemSummary from "~/types/api/StorageItemSummary";
import {ArrowDownTrayIcon, CloudArrowUpIcon, FolderOpenIcon, PencilIcon, TrashIcon} from "@heroicons/vue/24/solid";
import type {Ref} from "vue";
import type PermissionObject from "~/types/api/PermissionObject";
import Permission from "~/types/Permission";
import View from "~/types/View";

const {x, y} = useMouse()
const {y: windowY} = useWindowScroll()

const view = useView()
const itemsSelection = useItemsSelection()
const workspace = useWorkspace()

const isOpen = ref(false)
const virtualElement = ref({getBoundingClientRect: () => ({})})

const menu: Ref<Array<{
	name: string
	icon: any
	color?: string
	action: () => any
}>> = ref([])

function onContextMenu() {
	const top = unref(y) - unref(windowY)
	const left = unref(x)

	virtualElement.value.getBoundingClientRect = () => ({width: 0, height: 0, top, left})

	let items: StorageItemSummary[] = itemsSelection.value.map(item => decodeSummary(item) as StorageItemSummary)

	let permissions: PermissionObject = {
		[Permission.READ]: true,
		[Permission.WRITE]: true,
		[Permission.TRASH]: true,
		[Permission.DELETE]: true,
		[Permission.EDIT_PERMISSIONS]: true
	}

	items.forEach(item => {
		Object.keys(permissions).forEach(key => {
			if (!item.access[key as Permission]) permissions[key as Permission] = false
		})
	})

	menu.value = []

	console.log(permissions[Permission.READ], items[0].type, items[0].type === "file")

	if (permissions[Permission.READ] && items.length === 1)
		if (items[0].type === "folder" || isOfficeDocument(items[0])) menu.value.push({
			icon: FolderOpenIcon,
			name: "Open",
			action: () => {
				if (isFolder(items[0])) navigateTo(`/workspace/${workspace.value.id}/folder/${items[0].id}`)
				else if (isFile(items[0])) navigateTo(`/docs/${items[0].id}`, {open: {target: '_blank',}})
			}
		})
	if (permissions[Permission.READ] && items.length === 1 && items[0].type === "file") menu.value.push({
		icon: ArrowDownTrayIcon,
		name: "Download",
		action: () => downloadFile(items[0])
	})
	if (permissions[Permission.WRITE] && items.length === 1) menu.value.push({
		icon: PencilIcon,
		name: "Rename",
		action: () => {
		} // rename(selectedElements[0])
	})
	if (permissions[Permission.TRASH] && view.value !== View.TRASH) menu.value.push({
		icon: TrashIcon,
		name: "Move To Trash",
		color: "error",
		action: () => trashItems(items)
	})
	if (permissions[Permission.WRITE] && view.value === View.TRASH) menu.value.push({
		icon: CloudArrowUpIcon,
		name: "Restore",
		color: "primary",
		action: () => restoreItems(items)
	})
	if (permissions[Permission.DELETE] && view.value === View.TRASH) menu.value.push({
		icon: TrashIcon,
		name: "Delete",
		color: "error",
		action: () => deleteItems(items)
	})

	isOpen.value = true
}

const contextMenu = useItemsContextMenu()
contextMenu.value = {
	open: () => {
		onContextMenu()
		useFolderContextMenu().value.close()
	},
	close: () => isOpen.value = false
}
</script>

<template>
	<UContextMenu v-model="isOpen" :virtual-element="virtualElement">
		<button v-for="item in menu" @click="item.action() && contextMenu.close()">
			<component :is="item.icon" class="h-5 w-5"/>
			{{ item.name }}
		</button>
	</UContextMenu>
</template>
