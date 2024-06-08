<script setup lang="ts">
import type ParentFolder from "~/types/api/ParentFolder";
import type Folder from "~/types/api/Folder";
import type {Ref} from "vue";

const {id} = defineProps({id: String})

const status: Ref<"loaded" | "loading" | "failed"> = ref("loading");
const folder = useFolder();
const workspace = useWorkspace()
const path = "/workspace/" + workspace.value.id

onMounted(() => {
	fetchFolder()
	useRefreshView().value = fetchFolder
})

async function fetchFolder() {
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/items/${id}`);
	status.value = "loading"
	const current_folder = folder.value
	if (res.ok) {
		folder.value = await res.json() as Folder;
		useItem(folder.value.id).value = folder.value
		if (current_folder) folder.value.import_file = current_folder.import_file
		status.value = "loaded"
	} else {
		console.log(res.status, await res.text());
		status.value = "failed"
	}
}

function getParentFolderPath(parent: ParentFolder) {
	return parent.is_root ? path + '/files'
		: parent.id === 'trash' ? path + '/trash'
			: path + '/folder/' + parent.id
}

function onContextMenu(e: MouseEvent) {
	if (e.target && asHtmlElement(e.target)) {
		if (!e.target.closest(".item-card")) useFolderContextMenu().value.open(folder.value)
	}
}
</script>


<template>
	<div v-if="status == 'loading'" class="w-full h-full flex-center appear-after-1s">
		<Loader/>
	</div>
	<div v-else-if="status == 'failed'" class="w-full h-full flex-center">
		<p>Failed to access folder. Please ty again later...</p>
	</div>
	<div v-else-if="status == 'loaded'" class="w-full h-full appear-0.1">
		<ItemWrapper :id="folder.id" type="main" class="w-full h-full"
		             @contextmenu.prevent="onContextMenu" @click="unselectAll">
			<ContextMenuFolder/>
			<FileDropzone>
				<StorageItems :items="folder.items ?? []">
					<div class="-mt-2 -ml-4 flex-start">
						<div v-for="(parent, index) in folder.parents">
							<div :key="index" class="flex-center" data-type="folder" :data-item-id="parent.id">
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
		</ItemWrapper>
	</div>
</template>
