<script lang="ts" setup>
const workspace = useWorkspace()
const database = useDatabase()
const view = useDatabaseView()

const inputRef = ref()
const name = ref(view.value.name)

watch(() => view.value.name, newName => name.value = newName)
watch(() => name.value, resizeInput)

function resizeInput() {
	if (inputRef.value)
		inputRef.value.value = name.value
	inputRef.value.style.width = inputRef.value.value.length + 1 + 'ch'
}

async function onSubmit() {
	name.value = name.value.trim()
	if (view.value.name === name.value) return
	if (name.value.length === 0) name.value = capitalize(view.value.type)
	inputRef.value.blur()

	const res = await useApiFetch(`/workspaces/${workspace.value.id}/databases/${database.value.id}/views/${view.value.id}`, {
		method: "PATCH",
		body: JSON.stringify({name: name.value})
	})

	if (!res.ok) {
		name.value = view.value.name
		useErrorToast("Failed to rename view")
	}
}
</script>

<template>
	<div class="flex">
		<form @submit.prevent="onSubmit">
			<input ref="inputRef" v-model="name" class="text-xl font-semibold opacity-80 bg-transparent"
			       @focusout="onSubmit">
		</form>
		<!--		<UButton icon="i-heroicons-ellipsis-horizontal" color="gray" size="sm" variant="ghost"/>-->
	</div>
</template>

<style scoped>
input:focus-visible {
	outline: none;
}
</style>
