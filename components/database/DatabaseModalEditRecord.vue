<script setup lang="ts">
import type TableRecord from "~/types/database/TableRecord";
import type TableField from "~/types/database/TableField";
import {getFieldIcon} from "~/types/database/TableFieldType";

const {record} = defineProps<{ record: TableRecord }>()

const modal = useModal()

const workspace = useWorkspace()
const database = useDatabase()
const titleField = computed(() => database.value.fields?.find(f => f.is_title) as TableField)

const newName = ref(record.values[titleField.value.id])
watch(() => record, (newValue) => newName.value = newValue.values[titleField.value.id])

watch(() => database.value.records, (newValue) => {
	if (!newValue?.find(r => r.id === record.id)) modal.close()
})


</script>

<template>
	<UModal v-if="database.fields" :ui="{width: 'sm:max-w-3xl', wrapper: 'z-40'}">
		<UCard :ui="{ base: 'px-8 py-7 sm:px-16 sm:py-14', ring: '', background: 'dark:bg-gray-900',
		divide: 'divide-y divide-gray-100 dark:divide-gray-700/50' }">
			<div class="absolute top-0 right-0 m-2">
				<DatabaseButtonMenuRecord :record="record" context="edit-modal">
					<UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="ghost"/>
				</DatabaseButtonMenuRecord>
			</div>

			<DatabaseRecordTitleInput :record="record"/>
			<div v-for="field in database.fields.filter(f => !f.is_title)" class="w-full flex-start gap-3">
				<UTooltip :text="field.name" class="w-36" :popper="{placement: 'left'}" :prevent="field.name.length < 15">
					<DatabaseButtonFieldHeader :field="field">
						<UButton class="flex-start gap-2 w-36" color="gray" variant="ghost">
							<component :is="getFieldIcon(field)" class="shrink-0"/>
							<p class="truncate">{{ field.name }}</p>
						</UButton>
					</DatabaseButtonFieldHeader>
				</UTooltip>
				<div class="flex-1">
					<DatabaseRecordValue :field="field" :record="record" placeholder/>
				</div>
			</div>
			<div class="w-36 mt-2 opacity-60">
				<DatabaseButtonNewField>
					<UButton icon="i-heroicons-plus" color="gray" variant="ghost" class="w-full">
						New Field
					</UButton>
				</DatabaseButtonNewField>
			</div>
		</UCard>
	</UModal>
</template>
