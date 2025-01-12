<script lang="ts" setup>
import type DatabaseViewFilter from "~/types/database/DatabaseViewFilter";
import {getTableFieldAvailableFilter, isFilterTypeNeedValue} from "~/types/database/DatabaseViewFilterType";
import type TableField from "~/types/database/TableField";
import {getFieldTypeIcon} from "~/types/database/TableFieldType";

const filter = defineModel<DatabaseViewFilter>({required: true})

const workspace = useWorkspace()
const database = useDatabase()
const view = useDatabaseView()

const baseFilter = ref(JSON.parse(JSON.stringify(filter.value)))
const field = computed<TableField>(() => database.value.fields?.find(f => f.id === filter.value.field_id) as TableField)

const optionsOpen = ref(false)
const options = [[{
	label: "Delete filter",
	icon: 'i-heroicons-trash',
	click: remove
}]]

const hidden = ref(false)
const buttonRef = ref()
const isOpen = ref(false)
const popup = () => buttonRef.value.getBoundingClientRect()

onMounted(() => useState("edit-filter-" + filter.value.field_id).value = (forcePush: boolean = false) => {
	isOpen.value = true
	if (forcePush) baseFilter.value = ""
})
onUnmounted(() => useState("edit-filter-" + filter.value.field_id).value = undefined)


const operations = computed(() => {
	const result: { name: string, value: string }[] = []
	getTableFieldAvailableFilter(field.value).forEach(op => {
		result.push({
			name: capitalize(op.replaceAll("_", " ")),
			value: op
		})
	})
	return result
})

async function submit() {
	if (JSON.stringify(filter.value) === JSON.stringify(baseFilter.value)) return

	const res = await useApiFetch(`/workspaces/${workspace.value.id}/databases/${database.value.id}/views/${view.value.id}`, {
		method: "PATCH",
		body: JSON.stringify({settings: view.value.settings})
	})

	if (res.ok) baseFilter.value = JSON.parse(JSON.stringify(filter.value))
	else {
		useErrorToast("Failed to edit filter.")
		filter.value = baseFilter.value
	}
}

async function remove() {
	view.value.settings.filters = view.value.settings.filters?.filter(f => f !== filter.value)
	hidden.value = true
	const res = await useApiFetch(`/workspaces/${workspace.value.id}/databases/${database.value.id}/views/${view.value.id}`, {
		method: "PATCH",
		body: JSON.stringify({settings: view.value.settings})
	})

	if (!res.ok) {
		useErrorToast("Failed to remove filter.")
		hidden.value = false
		view.value.settings.filters?.push(filter.value)
	}
}
</script>

<template>
	<div v-if="!hidden && filter" ref="buttonRef" @click="isOpen = true">
		<slot/>
	</div>
	<Teleport v-if="!hidden && filter && field && isOpen" to="body">
		<div class="fixed z-[40] w-screen h-screen top-0 left-0" @click="isOpen = false; submit()">
			<UCard :style="{transform: `translate(${popup().left}px, ${popup().top}px)`}"
			       :ui="{rounded: 'rounded-xl', body: {padding: 'p-2 sm:p-2'}}"
			       class="m-1 absolute top-0 left-0 min-w-40" @click.stop>
				<div class="space-y-2">
					<div class="w-full flex-between gap-4">
						<div class="flex-start gap-1 text-sm text-gray-500">
							<component :is="getFieldTypeIcon(field.type)" class="opacity-50"/>
							{{ field.name }}
						</div>
						<UDropdown v-model="optionsOpen" :items="options" :popper="{ placement: 'right-start' }">
							<UButton color="gray" icon="i-heroicons-ellipsis-vertical" size="xs" variant="ghost"/>
						</UDropdown>
					</div>
					<USelect v-model="filter.operation" :options="operations" class="w-full" option-attribute="name"/>
					<DatabaseValueSimpleSelector v-if="isFilterTypeNeedValue(filter.operation)" v-model="filter.value"
					                             :field="field" :submit="submit"/>
				</div>
			</UCard>
		</div>
	</Teleport>
</template>
