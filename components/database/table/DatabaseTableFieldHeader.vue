<script setup lang="ts">
import {getFieldIcon} from "~/types/database/TableFieldType";
import {ModalConfirmation} from "#components";

const {id} = defineProps<{ id: string }>()

const workspace = useWorkspace()
const database = useDatabase()
const modal = useModal()

const field = computed(() => database.value.fields?.find((f) => f.id === id))
const isEditing = ref(false)
const newName = ref(field.value?.name ?? "")

async function endEditing() {
	if (!field.value || newName.value === field.value.name) return

	isEditing.value = false
	const oldName = field.value.name
	field.value.name = newName.value

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${field.value.id}`, {
			method: "PATCH",
			body: JSON.stringify({name: field.value.name})
		})

	if (!res.ok) {
		newName.value = field.value.name = oldName
		useErrorToast("Failed to update field name.")
	}
}

async function deleteProperty() {
	if (!field.value) return
	modal.open(ModalConfirmation, {
		title: `Delete property ${field.value.name} ?`,
		description: `Are you sure you want to delete the property ${field.value.name} ?`,
		warning: "This action is not reversible.",
		buttonLabel: "Delete property",
		color: "red",
		onSuccess: async () => {
			if (!field.value) return
			const res = await useApiFetch(
				`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${field.value.id}`,
				{method: "DELETE"}
			)
			if (res.ok) {
				database.value.records?.forEach(record => {
					if (!field.value) return
					delete record.values[field.value.id]
				})
				database.value.fields = database.value.fields?.filter(f => f !== field.value)
			}
		}
	})
}
</script>

<template>
	<UPopover v-if="field" v-model:open="isEditing" @contextmenu.prevent="isEditing = !isEditing" class="font-medium"
	          :popper="{ placement: 'bottom-start', offsetDistance: -40 }" @update:open="endEditing">
		<div class="flex-start gap-0.5 px-4 py-3.5 truncate">
			<component :is="getFieldIcon(field)" class="opacity-40 -mb-0.5 shrink-0"/>
			<span class="truncate text-gray-800 dark:text-gray-200">{{ field.name }}</span>
		</div>

		<template #panel>
			<div class="p-1 space-y-1">
				<form @submit.prevent="endEditing">
					<UInput v-model="newName" autofocus/>
				</form>
				<UButton v-if="!field.is_title" block color="red" variant="ghost" class="justify-start text-sm"
				         leading-icon="i-heroicons-trash" size="xs" @click="deleteProperty">
					Delete property
				</UButton>
			</div>
		</template>
	</UPopover>
</template>
