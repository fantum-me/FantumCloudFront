<script lang="ts" setup>
import {getFieldTypeIcon} from "~/types/database/TableFieldType";
import type TableField from "~/types/database/TableField";
import DatabaseViewFilterType from "~/types/database/DatabaseViewFilterType";

const database = useDatabase()
const view = useDatabaseView()

const newButtonRef = ref()
const isOpen = ref(false)
const popup = () => newButtonRef.value.getBoundingClientRect()

const availableFields = computed(
	() => database.value.fields?.filter(field => !view.value.settings.filters?.find(f => f.field_id === field.id))
)

async function addFilter(field: TableField) {
	view.value.settings.filters?.push({
		field_id: field.id,
		operation: DatabaseViewFilterType.Is,
		value: field.default_value
	})
	isOpen.value = false
	await useWait(100)
	useState<(b: boolean) => void>("edit-filter-" + field.id).value(true)
}
</script>

<template>
	<div ref="newButtonRef" @click="isOpen = true">
		<slot/>
	</div>

	<Teleport v-if="isOpen" to="body">
		<div class="fixed z-[40] w-screen h-screen top-0 left-0" @click="isOpen = false">
			<UCard :style="{transform: `translate(${popup().left}px, ${popup().top}px)`}"
			       :ui="{rounded: 'rounded-xl', body: {padding: 'p-2 sm:p-2'}}"
			       class="min-w-32 m-1 absolute top-0 left-0" @click.stop>
				<div class="space-y-1">
					<p class="pl-1.5">New Filter</p>
					<div v-for="field in availableFields" :key="field.id">
						<UButton class="w-full" color="gray" variant="ghost" @click="addFilter(field)">
							<component :is="getFieldTypeIcon(field.type)" class="opacity-75"/>
							{{ capitalize(field.name) }}
						</UButton>
					</div>
				</div>
			</UCard>
		</div>
	</Teleport>


	<!--	<USelect v-model="filter.field_id" :options="fields" option-attribute="name"/>-->
	<!--	<USelect v-model="filter.operation" :options="operations" option-attribute="name"/>-->
	<!--	<div class="m-1 relative">-->
	<!--		<DatabaseValue :key="filter.field_id" v-if="filter.operation && isFilterTypeNeedValue(filter.operation)"-->
	<!--		               v-model="filter.value" :field="field" :placeholder="true"/>-->
	<!--	</div>-->
	<!--	{{filter.field_id}}-->
</template>
