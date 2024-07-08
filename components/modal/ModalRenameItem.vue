<script setup lang="ts">
import type {FormError, FormSubmitEvent} from '#ui/types'
import type {Ref} from "vue";
import type StorageItem from "~/types/api/StorageItem";

const item: Ref<StorageItem | undefined> = ref()
const isOpen = ref(false)
const isLoading = ref(false)

useRenameItemsModal().value = (targetItem: StorageItem) => {
	item.value = targetItem
	state.name = targetItem.name
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
	if (!item.value || isLoading.value) return
	isLoading.value = true

	await renameItem(item.value, event.data.name)

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
	<UModal v-if="item" v-model="isOpen" :prevent-close="isLoading" @close="close">
		<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
			<template #header>
				<div class="flex items-center justify-between font-semibold">
					<span>
						Rename
						<span class="font-bold px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded">
							{{ item.name }}
						</span>
					</span>
					<UButton v-if="!isLoading" color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
					         class="-my-1" @click="close"/>
				</div>
			</template>

			<UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
				<UFormGroup name="name">
					<UInput v-model="state.name" :loading="isLoading" placeholder="Name" name="name"
					        size="xl" color="gray" variant="outline" autofocus>
						<template #trailing v-if="isFile(item)">
								<span class="text-gray-500 dark:text-gray-400 text-xs">
									.{{ item.ext.toUpperCase() }}
								</span>
						</template>
					</UInput>
				</UFormGroup>

				<div class="flex justify-end items-center gap-4 pt-2">
					<UButton v-if="!isLoading" color="gray" variant="ghost" @click="close">
						Cancel
					</UButton>
					<UButton type="submit" :loading="isLoading">
						Rename
					</UButton>
				</div>
			</UForm>
		</UCard>
	</UModal>
</template>
