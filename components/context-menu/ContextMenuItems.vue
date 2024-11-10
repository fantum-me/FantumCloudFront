<script setup lang="ts">
import {useMouse, useWindowScroll} from "@vueuse/core";
import type {Ref} from "vue";
import type PermissionObject from "~/types/permission/PermissionObject";
import Permission from "~/types/permission/Permission";
import type StorageItem from "~/types/filesystem/StorageItem";

type MenuItem = {
	name: string
	icon: any
	color?: string
	action: () => any
}

const {x, y} = useMouse()
const {y: windowY} = useWindowScroll()

const itemsSelection = useItemsSelection()

const isOpen = ref(false)
const virtualElement = ref({getBoundingClientRect: () => ({})})

const menu: Ref<MenuItem[]> = ref([])

function onContextMenu() {
	const top = unref(y) - unref(windowY)
	const left = unref(x)

	virtualElement.value.getBoundingClientRect = () => ({width: 0, height: 0, top, left})

	let items: StorageItem[] = itemsSelection.value.map(id => useItem(id).value)

	let permissions: PermissionObject = {
		[Permission.READ]: true,
		[Permission.WRITE]: true,
		[Permission.TRASH]: true,
		[Permission.DELETE]: true,
		[Permission.EDIT_PERMISSIONS]: true
	}

	let in_trash: boolean | null | undefined = undefined;

	items.forEach(item => {
		if (in_trash === undefined) in_trash = item.in_trash
		else if (in_trash !== null && in_trash !== item.in_trash) in_trash = null
		Object.keys(permissions).forEach(key => {
			if (!item.access[key as Permission]) permissions[key as Permission] = false
		})
	})

	menu.value = []

	if (permissions[Permission.READ] && items.length === 1)
		if (isFolder(items[0]) || isOfficeDocument(items[0])) menu.value.push({
			icon: isFile(items[0]) ? "i-heroicons-document" : "i-heroicons-folder-open",
			name: "Open",
			action: () => openItem(items[0])
		})
	if (permissions[Permission.READ] && items.length === 1 && isFile(items[0])) menu.value.push({
		icon: "i-heroicons-arrow-down-tray",
		name: "Download",
		action: () => downloadFile(items[0])
	})
	if (permissions[Permission.WRITE] && items.length === 1) menu.value.push({
		icon: "i-heroicons-pencil",
		name: "Rename",
		action: () => useRenameItemsModal().value(items[0])
	})
	if (permissions[Permission.TRASH] && in_trash === false) menu.value.push({
		icon: "i-heroicons-trash",
		name: "Move To Trash",
		color: "error",
		action: () => trashItems(items)
	})
	if (permissions[Permission.WRITE] && in_trash === true) menu.value.push({
		icon: "i-heroicons-cloud-arrow-up",
		name: "Restore",
		color: "primary",
		action: () => restoreItems(items)
	})
	if (permissions[Permission.DELETE] && in_trash === true) menu.value.push({
		icon: "i-heroicons-x-mark",
		name: "Delete",
		color: "error",
		action: () => deleteItems(items)
	})
	if (permissions[Permission.EDIT_PERMISSIONS] && items.length === 1) menu.value.push({
		icon: "i-heroicons-users",
		name: "Manage Access",
		action: () => useAccessControlsModal().value(items[0])
	})

	isOpen.value = true
}

const contextMenu = useItemsContextMenu()
contextMenu.value = {
	open: () => {
		onContextMenu()
		useFolderContextMenu().value?.close()
	},
	close: () => isOpen.value = false
}
</script>

<template>
	<UContextMenu v-model="isOpen" :virtual-element="virtualElement" class="z-[35]">
		<button v-for="item in menu" @click="item.action() && contextMenu.close()">
			<UIcon :name="item.icon"  class="h-5 w-5"/>
			{{ item.name }}
		</button>
	</UContextMenu>
</template>
