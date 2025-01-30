<script lang="ts" setup>
import TableFieldType, {getFieldTypeIcon} from "~/types/database/TableFieldType";

const workspace = useWorkspace()
const database = useDatabase()

const isOpen = ref(false)
const buttonRef = ref()

const selectedType = ref<TableFieldType>()
const name = ref<string>()

async function onSubmit() {
	if (!selectedType.value || !name.value || name.value.length < 1) return
	const body = JSON.stringify({name: name.value, type: selectedType.value})
	close()

	const res = await useApiFetch(`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields`, {
		method: "POST",
		body: body
	})

	if (!res.ok) useErrorToast("Failed to create field")
}

function close() {
	isOpen.value = false
	selectedType.value = undefined
}

function getPopupX() {
	return buttonRef.value.getBoundingClientRect().left
}

function getPopupY() {
	return buttonRef.value.getBoundingClientRect().top
}
</script>

<template>
	<div ref="buttonRef" class="w-full h-full flex-start" @click="isOpen = true" @contextmenu.prevent="isOpen = true">
		<slot/>
	</div>

	<Teleport v-if="isOpen" to="body">
		<div class="fixed z-[40] w-screen h-screen top-0 left-0" @click="close">
			<UCard :style="{transform: `translate(${getPopupX()}px, ${getPopupY()}px)`}" :ui="{rounded: 'rounded-xl', body: {padding: 'p-2 sm:p-2'}}"
			       class="m-1 absolute top-0 left-0" @click.stop>
				<div class="flex-between gap-4 mb-2">
					<p class="pt-0.5 pl-2.5">New Property</p>
					<UButton color="gray" icon="i-heroicons-x-mark" variant="ghost" @click="close"/>
				</div>

				<div v-if="selectedType" class="space-y-1.5">
					<form class="flex-center" @submit.prevent="onSubmit">
						<UInput v-model="name" :ui="{wrapper: 'w-full mx-px'}" autofocus color="gray"
						        placeholder="name" variant="outline"/>
						<UButton v-if="name" class="ml-1" color="gray" icon="i-heroicons-chevron-right" type="submit"
						         variant="solid"/>
					</form>
					<UButton class="w-full flex-between" color="gray" variant="ghost" @click="selectedType = undefined">
						<span>Type</span>
						<span class="opacity-50 flex-center">
							<span class="-mt-px text-xs">{{ capitalize(selectedType) }}</span>
							<UIcon class="h-4 w-4" name="i-heroicons-chevron-right-20-solid"/>
						</span>
					</UButton>
				</div>
				<div v-else class="flex flex-col gap-1">
					<UButton v-for="type in Object.values(TableFieldType)" color="gray" variant="ghost"
					         @click="selectedType = type">
						<component :is="getFieldTypeIcon(type)" class="opacity-75"/>
						{{ capitalize(type) }}
					</UButton>
				</div>
			</UCard>
		</div>
	</Teleport>
</template>
