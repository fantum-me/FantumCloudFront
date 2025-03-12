<script setup lang="ts">
import type {FormError, FormSubmitEvent} from '#ui/types'
import type File from "~/types/filesystem/File"
import type Folder from "~/types/filesystem/Folder";
import type DocumentType from "~/types/filesystem/DocumentType";

const {folder, type, openAfterCreation = false} = defineProps<{
	folder: Folder,
	type: string,
	openAfterCreation: boolean
}>()

const modal = useModal()
const workspace = useWorkspace()

const selectedType = ref<DocumentType>(documentTypes.find(d => d.type === type) as DocumentType)
const isLoading = ref(false)

const state = reactive({name: ""})

const validate = (state: any): FormError[] => {
	const errors = []
	if (!state.name) errors.push({path: 'name', message: 'Required'})
	if (state.name.length < 3) errors.push({path: 'name', message: 'Must have at least 3 characters'})
	if (state.name.length > 127) errors.push({path: 'name', message: 'Must not exceed 127 characters'})
	return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
	if (!folder || !selectedType.value || isLoading.value) return
	isLoading.value = true

	const res = await useApiFetch(`/workspaces/${workspace.value.id}/items`, {
		method: "POST",
		body: JSON.stringify({
			type: 'file',
			name: event.data.name + "." + selectedType.value.ext,
			mime: selectedType.value.mime,
			parent_id: folder.id
		})
	})

	if (res.ok) {
		const item: File = await res.json()
		useItem(item.id).value = item
		if (folder.items) folder.items.push(item)
		useSuccessToast(`Document ${event.data.name}.${selectedType.value.ext} created successfully !`)
		if (openAfterCreation) openItem(item)
	} else useErrorToast(`Failed to create document ${event.data.name}.${selectedType.value.ext}`)

	await modal.close()
	isLoading.value = false
}
</script>

<template>
	<UModal v-if="folder && selectedType">
		<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
			<template #header>
				<div class="flex items-center justify-between font-semibold">
					Create new document
					<UButton :v-if="!isLoading" color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
					         class="-my-1" @click="modal.close"/>
				</div>
			</template>

			<USelectMenu v-model="selectedType" :options="documentTypes" class="mb-5">
				<template #leading>
					<span class="h-5 w-5">
						<component :is="selectedType.icon"/>
					</span>
				</template>
				<template #option="{ option }">
					<span class="h-5 w-5">
						<component :is="option.icon"/>
					</span>
					<span class="truncate">{{ option.label }} (.{{ option.ext }})</span>
				</template>
			</USelectMenu>

			<UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
				<UFormGroup label="Name" name="name">
					<UInput v-model="state.name" :loading="isLoading" :placeholder="selectedType.label + ' name'"
					        size="xl" color="gray" variant="outline" autofocus>
						<template #trailing>
							<span class="text-gray-500 dark:text-gray-400 text-xs">
								.{{ selectedType.ext.toUpperCase() }}
							</span>
						</template>
					</UInput>
				</UFormGroup>

				<div class="flex justify-end items-center gap-4 pt-2">
					<UButton v-if="!isLoading" color="gray" variant="ghost" @click="modal.close">
						Cancel
					</UButton>
					<UButton type="submit" :loading="isLoading">
						Create
					</UButton>
				</div>
			</UForm>
		</UCard>
	</UModal>
</template>
