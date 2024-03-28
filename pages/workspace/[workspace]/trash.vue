<script setup lang="ts">
import View from "~/lib/View";
import type File from "~/types/api/File";
import type Folder from "~/types/api/Folder";
import type {Ref} from "vue";

useView().value = View.TRASH
const trash: Ref<{files: File[], folders: Folder[]} | undefined> = ref()

const fetchTrash = async () => {
	const res = await useApiFetch(`/workspaces/${useWorkspace().value.id}/trash`)
	if (res.ok) trash.value = await res.json()
	else navigateTo(useRoute().fullPath + "?error=Error while trying to fetch Trash")
}

await fetchTrash()
useRefreshView().value = fetchTrash
</script>


<template>
	<StorageItems :files="trash?.files" :folders="trash?.folders">
		<h1 class="text-2xl font-bold mb-6">Trash</h1>
	</StorageItems>
</template>
