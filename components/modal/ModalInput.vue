<script lang="ts" setup>
import type {FormError} from '#ui/types'

const modal = useModal()
const emit = defineEmits(['success'])
const {title, buttonLabel, defaultValue = "", trailing, minLength = 3, maxLength = 127} = defineProps<{
	title: string,
	buttonLabel: string,
	defaultValue?: string,
	trailing?: string,
	minLength?: number,
	maxLength?: number
}>()

const state = reactive({value: defaultValue})
const isLoading = ref(false)

function onSubmit() {
	isLoading.value = true
	emit('success', state.value)
}

const validate = (state: any): FormError[] => {
	const errors = []
	if (!state.value) errors.push({path: 'value', message: 'Required'})
	if (state.value.length < minLength) errors.push({path: 'value', message: 'Must have at least 3 characters'})
	if (state.value.length > maxLength) errors.push({path: 'value', message: 'Must not exceed 127 characters'})
	return errors
}
</script>

<template>
	<UModal>
		<UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
			<template #header>
				<div class="flex items-center justify-between font-semibold">
					<p>{{ title }}</p>
					<UButton color="gray" icon="i-heroicons-x-mark-20-solid" variant="ghost" @click="modal.close"/>
				</div>
			</template>

			<UForm :state="state" :validate="validate" class="space-y-4" @submit="onSubmit">
				<UFormGroup name="name">
					<UInput v-model="state.value" :loading="isLoading" autofocus color="gray"
					        name="name" placeholder="Name" size="xl" variant="outline">
						<template v-if="trailing" #trailing>
							<span class="text-gray-500 dark:text-gray-400 text-xs">{{ trailing }}</span>
						</template>
					</UInput>
				</UFormGroup>

				<div class="flex justify-end items-center gap-4 pt-2">
					<UButton v-if="!isLoading" color="gray" variant="ghost" @click="modal.close">Cancel</UButton>
					<UButton :loading="isLoading" type="submit">{{ buttonLabel }}</UButton>
				</div>
			</UForm>
		</UCard>
	</UModal>
</template>
