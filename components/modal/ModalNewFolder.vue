<script setup lang="ts">
import type {FormError, FormSubmitEvent} from '#ui/types'
import type Folder from "~/types/api/Folder";
import type {Ref} from "vue";

const folder: Ref<Folder | undefined> = ref()
const isOpen = ref(false)
const isLoading = ref(false)

useNewFolderModal().value = (target: Folder) => {
	folder.value = target
	isOpen.value = true
}

const state = reactive({
	name: "",
})

const validate = (state: any): FormError[] => {
	const errors = []
	if (!state.name) errors.push({path: 'name', message: 'Required'})
	if (state.name.length < 3) errors.push({path: 'name', message: 'Must have at least 3 characters'})
	if (state.name.length > 127) errors.push({path: 'name', message: 'Must not exceed 127 characters'})
	return errors
}

async function onSubmit(event: FormSubmitEvent<any>) {
	if (!folder.value || isLoading.value) return
	isLoading.value = true

	const res = await useApiFetch("/folders", {
		method: "POST",
		body: JSON.stringify({
			name: event.data.name,
			parent_id: folder.value.id
		})
	})

	if (res.ok) {
		const item: Folder = await res.json()
		useItem(item.id).value = item
		if (folder.value.items) folder.value.items.push(item)
		useSuccessToast(`Folder ${event.data.name} created successfully !`)
	} else useErrorToast(`Failed to create folder ${event.data.name}`)

	isOpen.value = false
	isLoading.value = false
}

async function close() {
	isOpen.value = false
	await useWait(200) // wait for modal transition
	state.name = ""
}
</script>

<template>
	<UModal v-model="isOpen" :prevent-close="isLoading" @close="close">
		<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
			<template #header>
				<div class="flex items-center justify-between font-semibold">
					Create Folder
					<UButton v-if="!isLoading" color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
					         class="-my-1" @click="close"/>
				</div>
			</template>

			<UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
				<UFormGroup label="Name" name="name">
					<UInput v-model="state.name" :loading="isLoading" placeholder="Folder name"
					        size="xl" color="gray" variant="outline" autofocus/>
				</UFormGroup>

				<div class="flex justify-end items-center gap-4 pt-2">
					<UButton v-if="!isLoading" color="gray" variant="ghost" @click="close">
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
