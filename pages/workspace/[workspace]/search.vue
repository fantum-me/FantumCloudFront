<script lang="ts" setup>
import type StorageItem from "~/types/filesystem/StorageItem";
import type {Ref} from "vue";
import View from "~/types/View";

useView().value = View.SEARCH

const workspace = useWorkspace()
let query = useRoute().query.q as string
const items: Ref<StorageItem[]> = ref([])

async function search() {
	if (!query) navigateTo(`/workspace/${workspace.value.id}`)
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/items/search?sort=updated_at&name=${query}`)
	if (res.ok) {
		items.value = await res.json()
	} else {
		useErrorToast("Failed to search")
		navigateTo(`/workspace/${workspace.value.id}`)
	}
}

onMounted(() => {
	search()
	window.addEventListener("search", () => {
		query = useRoute().query.q as string
		search()
	})
})
</script>

<template>
	<NuxtLayout name="workspace">
		<StorageItems :items="items">
			<h1 class="text-2xl font-bold">Search result for {{ query }}</h1>
			<p class="flex-start gap-1 text-xs opacity-75">{{ items.length }} results found</p>
		</StorageItems>
	</NuxtLayout>
</template>
