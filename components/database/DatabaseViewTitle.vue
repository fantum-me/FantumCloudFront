<script lang="ts" setup>
import type DatabaseView from "~/types/database/DatabaseView";

const {view} = defineProps<{ view: DatabaseView }>()

const workspace = useWorkspace()
const database = useDatabase()

const inputRef = ref()
const name = ref("")

watch(() => view.name, newName => {
	name.value = newName
	resizeInput()
}, {immediate: true})
watch(inputRef, resizeInput)

function resizeInput() {
	console.log("a")
	if (inputRef.value)
		inputRef.value.style.width = inputRef.value.value.length + 1 + 'ch'
}

async function onSubmit() {
	inputRef.value.blur()
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/databases/${database.value.id}/views/${view.id}`, {
		method: "PATCH",
		body: JSON.stringify({name: name.value})
	})

	if (!res.ok) {
		name.value = view.name
		useErrorToast("Failed to rename view")
	}
}
</script>

<template>
	<div class="flex">
		<form @submit.prevent="onSubmit">
			<input ref="inputRef" v-model="name" class="text-xl font-semibold opacity-80" @focusout="onSubmit"
			       @input="resizeInput">
		</form>
		<!--		<UButton icon="i-heroicons-ellipsis-horizontal" color="gray" size="sm" variant="ghost"/>-->
	</div>
</template>

<style scoped>
input:focus-visible {
	outline: none;
}
</style>
