<script setup lang="ts">
import type {FormError, FormSubmitEvent} from '#ui/types'
import type {Ref} from "vue";

const folder = useFolder()
const selectedType = useNewDocumentType()
const isOpen: Ref<boolean> = ref(false)
const isLoading: Ref<boolean> = ref(false)

folder.value.create_document = (type) => {
	const documentType = documentTypes.find(d => d.type === type)
	if (documentType) {
		selectedType.value = documentType
		isOpen.value = true
	}
}

const state = reactive({
	name: undefined,
})

const validate = (state: any): FormError[] => {
	const errors = []
	if (!state.name) errors.push({path: 'name', message: 'Required'})
	if (state.name.length < 3) errors.push({path: 'name', message: 'Must have at least 3 characters'})
	if (state.name.length > 127) errors.push({path: 'name', message: 'Must not exceed 127 characters'})
	return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
	isLoading.value = true
	const res = await useApiFetch("/files", {
		method: "POST",
		body: JSON.stringify({
			name: event.data.name,
			ext: selectedType.value.ext,
			mime: selectedType.value.mime,
			parent_id: folder.value.id
		})
	})
	console.log(res.status, res.statusText)
	if (res.ok) {
		await useRefreshView().value()
		useSuccessToast(`Document ${event.data.name}.${selectedType.value.ext} created successfully !`)
	} else useErrorToast(`Failed to create document ${event.data.name}.${selectedType.value.ext}`)
	isOpen.value = false
	isLoading.value = false
}
</script>

<template>
	<UModal v-model="isOpen" :prevent-close="isLoading">
		<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
			<template #header>
				<div class="flex items-center justify-between font-semibold">
					Create new document
					<UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
					         class="-my-1" @click="!isLoading ? isOpen = false : null"/>
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
					<UButton color="gray" variant="ghost" @click="!isLoading ? isOpen = false : null">
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