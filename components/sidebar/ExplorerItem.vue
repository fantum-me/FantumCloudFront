<script setup lang="ts">
import type StorageItem from "~/types/filesystem/StorageItem";
import type {Ref} from "vue";
import View from "~/types/View";

type FolderStatus = "open" | "hasBeenOpen" | "isOpening" | "closed"

const view = useView()
const workspace = useWorkspace()
const currentFolder = useFolder()
const props = defineProps<{ item: StorageItem }>()

const item = useItem(props.item.id, props.item)
const folderStatus: Ref<FolderStatus> = isFolder(item.value) ?
	useState(`sidebar-explorer-folder-status-${item.value.id}`, () => "closed")
	: ref("closed")

const isRootFolder = isFolder(item.value) && item.value.is_root

const itemsSelection = useItemsSelection()
const isSelected = () => {
	return itemsSelection.value.includes(item.value.id) || (view.value === View.FILES && isCurrentFolder())
}

async function openFolder() {
	if (folderStatus.value === "hasBeenOpen") folderStatus.value = "open"
	else if (folderStatus.value === "closed") {
		folderStatus.value = "isOpening"
		const res = await useApiFetch(`/workspaces/${workspace.value.id}/items/${item.value.id}`)
		if (res.ok) {
			item.value = await res.json()
			folderStatus.value = "open"
		} else {
			folderStatus.value = "closed"
			useErrorToast("Failed to open folder.")
		}
	}
}

async function toggleFolder() {
	switch (folderStatus.value) {
		case "open":
			folderStatus.value = "hasBeenOpen"
			break;
		case "hasBeenOpen":
			folderStatus.value = "open"
			break;
		case "closed":
			await openFolder()
			break;
	}
}

function onClick(e: MouseEvent) {
	if (e.ctrlKey || e.shiftKey) {
		if (isRootFolder) return
		if (isSelected()) itemsSelection.value = itemsSelection.value.filter(id => id !== item.value.id)
		else itemsSelection.value.push(item.value.id)
	} else {
		if (isRootFolder) itemsSelection.value = []
		else itemsSelection.value = [item.value.id]
		if (isFolder(item.value)) openItem(item.value)
	}
}

const FileIcon = isFile(item.value) ? getStorageItemIcon(item.value) : null

function isCurrentFolder() {
	return (view.value === View.FILES && isRootFolder)
		|| (view.value === View.FOLDER && item.value.id === currentFolder.value?.id)
}

function getFolderIcon() {
	if (isFolder(item.value)) {
		if (item.value.is_root) {
			if (isCurrentFolder()) return "i-heroicons-server-solid"
			else return "i-heroicons-server"
		} else if (folderStatus.value === 'open') {
			if (isCurrentFolder()) return "i-heroicons-folder-open-solid"
			else return "i-heroicons-folder-open"
		} else {
			if (isCurrentFolder()) return "i-heroicons-folder-solid"
			else return "i-heroicons-folder"
		}
	} else return "i-heroicons-document"
}
</script>

<template>
	<div v-show="!item.in_trash">
		<ItemWrapper :id="item.id" @click="onClick" type="sidebar"
		             :title="isFolder(item) && item.is_root ? 'Files' : item.name">
			<UButton color="primary" :variant="isSelected() ? 'selected' : 'sidebar'" block class="group">
				<template #leading>
					<div
						class="h-5 w-5 rounded group-hover:p-[2px] hover:bg-primary-100 dark:hover:bg-gray-500 transition-colors"
						v-if="isFolder(item)" @click.stop="toggleFolder">
						<UIcon :name="getFolderIcon()" class="w-full h-full group-hover:hidden"/>
						<UIcon
							:class="(folderStatus === 'open' ? 'rotate-90 ' : '') + 'w-full h-full hidden group-hover:block transition-transform'"
							name="i-heroicons-chevron-right"/>
					</div>
					<div v-else-if="isFile(item)" class="h-5 w-5 shrink-0">
						<FileIcon :id="item.id" :name="item.name" class="w-full h-full"/>
					</div>
				</template>
				<p :class="(isCurrentFolder() && !isRootFolder ? 'font-semibold ' : '') + 'flex-grow text-start truncate'">
					{{ isFolder(item) && item.is_root ? "Files" : item.name }}
				</p>
				<template #trailing v-if="isFolder(item)">
					<div
						class="h-5 w-5 rounded group-hover:p-[2px] hover:bg-primary-100 dark:hover:bg-gray-500 transition-colors"
						@click.stop="useFolderContextMenu().value.open(item)">
						<UIcon class="(w-full h-full hidden group-hover:block transition-transform"
						       name="i-heroicons-plus"/>
					</div>
				</template>
			</UButton>
		</ItemWrapper>
		<div v-if="isFolder(item) && item.items && folderStatus === 'open'" class="w-full pl-3 mt-2 space-y-2">
			<SidebarExplorerItem v-for="f in item.items.filter(i => isFolder(i))" :item="f" :key="f.id"/>
			<SidebarExplorerItem v-for="f in item.items.filter(i => isFile(i))" :item="f" :key="f.id"/>
		</div>
	</div>
</template>

<style>
.explorer-item-selected {
	@apply bg-primary-100 dark:bg-primary-500 dark:bg-opacity-20;

	&:hover {
		@apply bg-primary-100 bg-opacity-80 dark:bg-primary-500 dark:bg-opacity-25;
	}
}
</style>
