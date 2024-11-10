<script setup lang="ts">
import type {Ref} from "vue";
import type Folder from "~/types/filesystem/Folder";
import View from "~/types/View";

const workspace = useWorkspace()

const rootFolder = useItem(workspace.value.root) as Ref<Folder>

onMounted(async () => {
	if (!rootFolder.value && useView().value !== View.FILES) {
		const res = await useApiFetch(`/workspaces/${workspace.value.id}/items/${workspace.value.root}`)
		if (res.ok) {
			rootFolder.value = await res.json();
		}
	}
})
</script>

<template>
	<SidebarExplorerItem v-if="rootFolder" :item="rootFolder"/>
</template>
