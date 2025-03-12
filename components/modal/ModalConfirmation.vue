<script lang="ts" setup>
defineProps({
	title: String,
	description: String,
	warning: String,
	buttonLabel: String,
	color: {
		type: String,
		default: "primary"
	}
})

const modal = useModal()

const emit = defineEmits(['success'])

function onSuccess() {
	emit('success')
	modal.close()
}
</script>

<template>
	<UModal>
		<UCard>
			<template #header>
				<div class="flex items-center justify-between font-semibold">{{ title }}</div>
			</template>

			<div class="space-y-3">
				<p class="ml-2 text-sm">{{ description }}</p>
				<UAlert v-if="warning" :description="warning" color="red" icon="i-heroicons-exclamation-triangle"
				        variant="soft"/>
			</div>

			<template #footer>
				<div class="flex-end">
					<UButton color="gray" variant="ghost" @click="modal.close">
						Cancel
					</UButton>
					<UButton :color="color" @click="onSuccess">
						{{ buttonLabel }}
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
