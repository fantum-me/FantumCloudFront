<script setup lang="ts">
import type StorageItem from "~/types/api/StorageItem";
import type {Ref} from "vue";

type FolderStatus = "open" | "hasBeenOpen" | "isOpening" | "closed"

const workspace = useWorkspace()
const currentFolder = useFolder()
const props = defineProps<{ item: StorageItem }>()

const item = useItem(props.item.id, props.item)
const folderStatus: Ref<FolderStatus> = isFolder(item.value) ? useState(
	`sidebar-explorer-folder-status-${item.value.id}`,
	() => isFolder(item.value) && item.value.files && item.value.folders ? "open" : "closed"
) : ref("closed")

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

async function click() {
	if (isFolder(item.value)) {
		const link = item.value.is_root ? "/files" : "/folder/" + item.value.id
		navigateTo("/workspace/" + workspace.value.id + link)
	} else if (isOfficeDocument(item.value)) navigateTo(`/docs/${item.value.id}`, {open: {target: "_blank"}})
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
	<UButton color="gray" variant="ghost" block class="justify-start group" @click="click" @contextmenu="click">
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
		<p :class="currentFolder?.id === item.id ? 'font-semibold' : ''">
			{{ isFolder(item) && item.is_root ? "Files" : item.name }}
		</p>
	</UButton>
	<div v-if="isFolder(item) && folderStatus === 'open'" class="w-full pl-3 space-y-2">
		<SidebarExplorerItem v-for="folder in item.folders" :item="folder"/>
		<SidebarExplorerItem v-for="file in item.files" :item="file"/>
	</div>
</template>
