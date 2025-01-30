<script lang="ts" setup>
import {ModalConfirmation} from "#components";
import type TableField from "~/types/database/TableField";

const {field} = defineProps<{ field: TableField }>()

const headerRef = ref()

const workspace = useWorkspace()
const database = useDatabase()
const modal = useModal()

const isEditing = ref(false)
const newName = ref(field.name ?? "")

async function endEditing() {
	if (newName.value === field.name) return

	isEditing.value = false
	const oldName = field.name
	field.name = newName.value

	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${field.id}`, {
			method: "PATCH",
			body: JSON.stringify({name: field.name})
		})

	if (!res.ok) {
		newName.value = field.name = oldName
		useErrorToast("Failed to update field name.")
	}
}

async function deleteProperty() {
	if (modal.isOpen) {
		modal.close()
		await useWait(200) // Wait for the current modal close duration
	}

	modal.open(ModalConfirmation, {
		title: `Delete property ${field.name} ?`,
		description: `Are you sure you want to delete the property ${field.name} ?`,
		warning: "This action is not reversible.",
		buttonLabel: "Delete property",
		color: "red",
		onSuccess: async () => {
			if (!field) return
			await useApiFetch(
				`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${field.id}`,
				{method: "DELETE"}
			)
		}
	})
}

function getPopupX() {
	return headerRef.value.getBoundingClientRect().left
}

function getPopupY() {
	return headerRef.value.getBoundingClientRect().top
}
</script>

<template>
	<div v-if="field" ref="headerRef" class="w-full h-full" @click="isEditing = true"
	     @contextmenu.prevent="isEditing = true">
		<slot/>
	</div>

	<Teleport v-if="isEditing" to="body">
		<div class="fixed z-[40] w-screen h-screen top-0 left-0" @click="isEditing = false">
			<UCard :style="{transform: `translate(${getPopupX()}px, ${getPopupY()}px)`}" :ui="{rounded: 'rounded-xl', body: {padding: 'p-2 sm:p-2'}}"
			       class="m-1 absolute top-0 left-0" @click.stop>
				<form @submit.prevent="endEditing">
					<UInput v-model="newName" autofocus/>
				</form>
				<UButton :disabled="field.is_title" block class="justify-start text-sm mt-2" color="red"
				         leading-icon="i-heroicons-trash" size="xs" variant="ghost" @click="deleteProperty">
					Delete property
				</UButton>
			</UCard>
		</div>
	</Teleport>
</template>
