<script setup lang="ts">
import View from "~/types/View";
import type File from "~/types/api/File";
import type {Ref} from "vue";

useView().value = View.HOME
const workspace = useWorkspace()

const recentFiles: Ref<File[]> = ref([])

onMounted(async () => {
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/files/recent`)
	if (res.ok) {
		recentFiles.value = await res.json() as File[]
	}
})
</script>

<template>
	<NuxtLayout name="workspace">
		<div class="px-32 py-16 space-y-12">
			<h1 class="text-center text-3xl font-bold">{{ getWelcomeMessage() }}</h1>
			<div class="w-full space-y-3">
				<p class="flex-start gap-1 text-xs opacity-75">
					<UIcon name="i-heroicons-clock" class="h-4 w-4"/>
					Recent updates
				</p>
				<div class="items-list">
					<Item v-for="file in recentFiles" :item="file" display="line"/>
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>
