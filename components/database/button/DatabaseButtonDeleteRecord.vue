<script lang="ts" setup>
const {id} = defineProps<{ id: string }>()

const workspace = useWorkspace()
const database = useDatabase()

async function deleteRecord() {
	if (!(database.value?.records)) return

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/records/${id}`,
		{method: "DELETE"}
	)

	if (!res.ok) useErrorToast(`Failed to delete record`)
}
</script>

<template>
	<div @click="deleteRecord">
		<slot/>
	</div>
</template>
