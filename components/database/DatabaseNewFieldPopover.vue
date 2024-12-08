<script setup lang="ts">
import TableFieldType, {getFieldTypeIcon} from "~/types/database/TableFieldType";
import type TableField from "~/types/database/TableField";

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

	if (res.ok) {
		const field: TableField = await res.json()
		database.value.fields?.push(field)
		useSuccessToast("Field created successfully !")
	} else useErrorToast("Failed to create field")
}
</script>

<template>
	<UPopover :ui="{trigger: 'w-auto'}" class="flex-start" :popper="{ placement: 'right-start', arrow: true }">
		<UButton color="gray" variant="soft" icon="i-heroicons-plus" class="aspect-square h-8 w-8 flex-center"/>

		<template #panel="{ close }">
			<div class="w-56 p-1 space-y-1">
				<div class="flex-between gap-4">
					<p class="pt-0.5 pl-2.5">New Property</p>
					<UButton color="gray" variant="ghost" @click="close(); selectedType = undefined;"
					         icon="i-heroicons-x-mark"/>
				</div>

				<div v-if="selectedType" class="space-y-1.5">
					<form @submit.prevent="onSubmit(); close()" class="flex-center">
						<UInput v-model="name" placeholder="name" color="gray" variant="outline"
						        :ui="{wrapper: 'w-full mx-px'}" autofocus/>
						<UButton v-if="name" class="ml-1" color="gray" variant="solid" icon="i-heroicons-chevron-right"/>
					</form>
					<UButton color="gray" variant="ghost" class="w-full flex-between" @click="selectedType = undefined">
						<span>Type</span>
						<span class="opacity-50 flex-center">
							<span class="-mt-px text-xs">{{ capitalize(selectedType) }}</span>
							<UIcon name="i-heroicons-chevron-right-20-solid" class="h-4 w-4"/>
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
