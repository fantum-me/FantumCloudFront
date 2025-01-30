<script lang="ts" setup>
import {ModalConfirmation} from "#components";
import {getViewTargetFieldTypes} from "~/types/database/DatabaseViewType";
import {getFieldIcon} from "~/types/database/TableFieldType";

const modal = useModal()
const workspace = useWorkspace()
const database = useDatabase()
const view = useDatabaseView()

const targetField = computed(() => {
	if (view.value.settings.target_field)
		return database.value.fields?.find(f => f.id === view.value.settings.target_field)
})
const targetFieldTypes = computed(() => getViewTargetFieldTypes(view.value))
const targetFieldOptions = computed(() => database.value.fields?.filter(f => targetFieldTypes.value?.includes(f.type)))

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
			<div class="m-2 space-y-2">
				<UPopover v-if="targetFieldTypes" :popper="{ placement: 'right-start' }">
					<UButton block class="flex-between gap-2.5 -mt-px" color="gray" variant="ghost">
						<span>Field</span>
						<span class="flex-start gap-1 text-xs">
							<span v-if="targetField" class="opacity-50">{{ targetField.name }}</span>
							<UIcon class="opacity-75 mt-0.5" name="i-heroicons-chevron-right"/>
						</span>
					</UButton>

					<template #panel="{ close }">
						<div class="m-2 space-y-2">
							<UButton v-for="field in targetFieldOptions" block class="flex-between" color="gray"
							         variant="ghost" @click="setDatabaseViewTargetField(view, field.id); close()">
								<span class="flex-start gap-1">
									<component :is="getFieldIcon(field)"/>
									{{ field.name }}
								</span>
								<UIcon :class="{
									'opacity-0': field !== targetField,
									'transition-opacity': true
								}" name="i-heroicons-check"/>
							</UButton>
						</div>
					</template>
				</UPopover>

				<UButton color="red" icon="i-heroicons-trash" variant="ghost" @click="deleteView">
					Delete View
				</UButton>
			</div>
		</template>
	</UPopover>
</template>
