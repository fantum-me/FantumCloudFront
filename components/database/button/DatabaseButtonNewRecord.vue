<script lang="ts" setup>
const workspace = useWorkspace()
const database = useDatabase()

async function createNewRecord() {
	if (!(database.value?.records)) return

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/records`,
		{method: "POST"}
	)

	if (!res.ok) useErrorToast(`Failed to create record`)
}
</script>

<template>
	<div @click="createNewRecord">
		<slot/>
	</div>
</template>
