<script lang="ts" setup>
import {ModalConfirmation} from "#components";

const modal = useModal()
const workspace = useWorkspace()
const database = useDatabase()
const view = useDatabaseView()

async function deleteView() {
	if (!view.value) return
	modal.open(ModalConfirmation, {
		title: `Delete view "${view.value.name}" ?`,
		description: `Are you sure you want to delete the view "${view.value.name}" ?`,
		warning: "This action is not reversible. This will not delete the database.",
		buttonLabel: "Delete view",
		color: "red",
		onSuccess: async () => {
			const res = await useApiFetch(
				`/workspaces/${workspace.value.id}/databases/${database.value.id}/views/${view.value.id}`,
				{method: "DELETE"}
			)
			if (!res.ok) useErrorToast("Failed to delete current view.")
		}
	})
}
</script>

<template>
	<UPopover v-if="view && database.views.length > 1" :popper="{ placement: 'bottom-end', arrow: true }">
		<UButton color="gray" icon="i-heroicons-cog-6-tooth" variant="ghost"/>

		<template #panel>
			<div class="m-2">
				<UButton color="red" icon="i-heroicons-trash" variant="ghost" @click="deleteView">
					Delete View
				</UButton>
			</div>
		</template>
	</UPopover>
</template>
