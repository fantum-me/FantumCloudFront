<script setup lang="ts">
import type {Ref} from "vue";
import View from "~/types/View";
import type StorageItem from "~/types/api/StorageItem";

useView().value = View.TRASH
const items: Ref<StorageItem[]> = ref([])

const fetchTrash = async () => {
	const res = await useApiFetch(`/workspaces/${useWorkspace().value.id}/trash`)
	if (res.ok) items.value = await res.json()
	else navigateTo(useRoute().fullPath + "?error=Error while trying to fetch Trash")
}

onMounted(async () => {
	await fetchTrash()
	useRefreshView().value = fetchTrash
})
</script>


<template>
	<NuxtLayout name="workspace">
		<StorageItems :items="items" @contextmenu.prevent>
			<h1 class="font-semibold">Trash</h1>
		</StorageItems>
	</NuxtLayout>
</template>
