<script setup lang="ts">
import type {FormError, FormSubmitEvent} from '#ui/types'

const folder = useFolder()
const isOpen = ref(false)
const isLoading = ref(false)

folder.value.create_folder = () => isOpen.value = true

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
	const res = await useApiFetch("/folders", {
		method: "POST",
		body: JSON.stringify({
			name: event.data.name,
			parent_id: folder.value.id
		})
	})
	console.log(res.status, res.statusText)
	if (res.ok) {
		await useRefreshView().value()
		useSuccessToast(`Folder ${event.data.name} created successfully !`)
	} else useErrorToast(`Failed to create folder ${event.data.name}`)
	isOpen.value = false
	isLoading.value = false
}
</script>

<template>
	<UModal v-model="isOpen" :prevent-close="isLoading">
		<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
			<template #header>
				<div class="flex items-center justify-between font-semibold">
					Create Folder
					<UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
					         class="-my-1" @click="!isLoading ? isOpen = false : null"/>
				</div>
			</template>

			<UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
				<UFormGroup label="Name" name="name">
					<UInput v-model="state.name" :loading="isLoading" placeholder="Folder name"
					        size="xl" color="gray" variant="outline" autofocus/>
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
