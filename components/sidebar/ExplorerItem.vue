<script setup lang="ts">
import type StorageItem from "~/types/api/StorageItem";
import type {Ref} from "vue";

type FolderStatus = "open" | "hasBeenOpen" | "isOpening" | "closed"

const currentFolder = useFolder()
const props = defineProps<{ item: StorageItem }>()

const item = useItem(props.item.id, props.item)
const folderStatus: Ref<FolderStatus> = isFolder(item.value) ? useState(
	`sidebar-explorer-folder-status-${item.value.id}`,
	() => isFolder(item.value) && item.value.files && item.value.folders ? "open" : "closed"
) : ref("closed")

const itemsSelection = useItemsSelection()
const isSelected = () => itemsSelection.value.includes(item.value.id)

async function openFolder() {
	if (folderStatus.value === "hasBeenOpen") folderStatus.value = "open"
	else if (folderStatus.value === "closed") {
		folderStatus.value = "isOpening"
		const res = await useApiFetch(`/folders/${item.value.id}`)
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
	const isRoot = isFolder(item.value) && item.value.is_root
	if (e.ctrlKey || e.shiftKey) {
		if (isRoot) return
		if (isSelected()) itemsSelection.value = itemsSelection.value.filter(id => id !== item.value.id)
		else itemsSelection.value.push(item.value.id)
	} else {
		if (isRoot) itemsSelection.value = []
		else itemsSelection.value = [item.value.id]
		if (isFolder(item.value)) openItem(item.value)
	}
}

const FileIcon = isFile(item.value) ? getStorageItemIcon(item.value) : null

function getFolderIcon() {
	if (isFolder(item.value)) {
		if (item.value.is_root) return "i-heroicons-server"
		else if (folderStatus.value === 'open') return "i-heroicons-folder-open"
	}
	return "i-heroicons-folder"
}
</script>

<template>
	<div v-show="!item.in_trash">
		<ItemWrapper :id="item.id" @click="onClick" type="sidebar">
			<UButton color="gray" variant="ghost" block
			         :class="(isSelected() ? 'explorer-item-selected ' : '') + 'transition-colors justify-start group'">
				<template #leading>
					<div class="h-5 w-5 rounded group-hover:p-[2px] hover:bg-gray-200 dark:hover:bg-gray-700"
					     v-if="isFolder(item)" @click.stop="toggleFolder">
						<UIcon :name="getFolderIcon()" class="w-full h-full group-hover:hidden"/>
						<UIcon
							:class="(folderStatus === 'open' ? 'rotate-90 ' : '') + 'w-full h-full hidden group-hover:block transition-transform'"
							name="i-heroicons-chevron-right"/>
					</div>
					<div v-else-if="isFile(item)" class="h-5 w-5">
						<FileIcon :id="item.id" :ext="item.ext" class="w-full h-full"/>
					</div>
				</template>
				<p :class="(currentFolder?.id === item.id ? 'font-semibold ' : '') + 'flex-grow text-start'">
					{{ isFolder(item) && item.is_root ? "Files" : item.name }}
				</p>
				<template #trailing v-if="isFolder(item)">
					<div class="h-5 w-5 rounded group-hover:p-[2px] hover:bg-gray-200 dark:hover:bg-gray-700"
					     @click.stop="useFolderContextMenu().value.open(item)">
						<UIcon class="(w-full h-full hidden group-hover:block transition-transform"
						       name="i-heroicons-plus"/>
					</div>
				</template>
			</UButton>
		</ItemWrapper>
		<div v-if="isFolder(item) && folderStatus === 'open'" class="w-full pl-3 mt-2 space-y-2">
			<SidebarExplorerItem v-for="folder in item.folders" :item="folder" :key="folder.id"/>
			<SidebarExplorerItem v-for="file in item.files" :item="file" :key="file.id"/>
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
