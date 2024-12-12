<script lang="ts" setup>
import TableFieldType, {getFieldTypeIcon} from "~/types/database/TableFieldType";

const workspace = useWorkspace()
const database = useDatabase()

const selectedType = ref<TableFieldType>()
const name = ref<string>()

async function onSubmit() {
	if (!selectedType.value || !name.value || name.value.length < 1) return

	const res = await useApiFetch(`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields`, {
		method: "POST",
		body: JSON.stringify({name: name.value, type: selectedType.value})
	})

	if (!res.ok) useErrorToast("Failed to create field")
}
</script>

<template>
	<UPopover :popper="{ placement: 'right-start', arrow: true }" :ui="{trigger: 'w-auto'}" class="flex-start">
		<slot/>

		<template #panel="{ close }">
			<div class="w-56 p-1 space-y-1">
				<div class="flex-between gap-4">
					<p class="pt-0.5 pl-2.5">New Property</p>
					<UButton color="gray" icon="i-heroicons-x-mark" variant="ghost"
					         @click="close(); selectedType = undefined;"/>
				</div>

				<div v-if="selectedType" class="space-y-1.5">
					<form class="flex-center" @submit.prevent="onSubmit(); close()">
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
			</div>
		</template>
	</UPopover>
</template>
