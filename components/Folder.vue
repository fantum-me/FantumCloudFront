<script setup lang="ts">
import type ParentFolder from "~/types/api/ParentFolder";
import type Folder from "~/types/api/Folder";

const {id} = defineProps({id: String})

const isLoading = ref(false);
const folder = useFolder();
const workspace = useWorkspace()
const path = "/workspace/" + workspace.value.id

await fetchFolder()
useRefreshView().value = fetchFolder

async function fetchFolder() {
	const res = await useApiFetch('/folders/' + id);
	isLoading.value = true
	const current_folder = folder.value
	if (res.ok) {
		folder.value = await res.json() as Folder;
		if (current_folder) {
			folder.value.import_file = current_folder.import_file
			folder.value.create_folder = current_folder.create_folder
			folder.value.create_document = current_folder.create_document
		}
	} else console.log(res.status, await res.text());
	isLoading.value = false
}

function getParentFolderPath(parent: ParentFolder) {
	return parent.is_root ? path + '/files'
		: parent.id === 'trash' ? path + '/trash'
			: path + '/folder/' + parent.id
}

function onContextMenu(e: MouseEvent) {
	if (e.target && asHtmlElement(e.target)) {
		if (!e.target.closest(".item-card")) useFolderContextMenu().value.open()
	}
}
</script>


<template>
	<ModalNewFolder/>
	<ModalNewDocument/>
	<div class="w-full h-full" @contextmenu.prevent="onContextMenu" @click="unselectAll">
		<ContextMenuFolder/>
		<FileDropzone>
			<StorageItems :folders="folder.folders ?? []" :files="folder.files ?? []" :is-loading="isLoading">
				<div class="-mt-2 -ml-4 mb-4 flex-start">
					<div v-for="(parent, index) in folder.parents">
						<div :key="index" class="flex-center" data-type="folder" :id="parent.id">
							<NuxtLink
								class="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-2xl font-bold"
								:to="getParentFolderPath(parent)">
								{{ parent.is_root ? workspace.name : parent.name }}
							</NuxtLink>
							<UIcon name="i-heroicons-chevron-right-20-solid" class="mr-1 h-8 w-8"/>
						</div>
					</div>
					<button @click="fetchFolder"
					        class="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-2xl font-bold">
						{{ folder.is_root ? workspace.name : folder.name }}
					</button>
				</div>
			</StorageItems>
		</FileDropzone>
	</div>
</template>
