<script setup lang="ts">
import type TableRecord from "~/types/database/TableRecord";
import type TableField from "~/types/database/TableField";
import {getFieldIcon} from "~/types/database/TableFieldType";

const {record} = defineProps<{ record: TableRecord }>()

const modal = useModal()

const workspace = useWorkspace()
const database = useDatabase()
const titleField = computed(() => database.value.fields?.find(f => f.is_title) as TableField)

const currentName = computed(() => record.values[titleField.value.id])
const newName = ref(record.values[titleField.value.id])
watch(() => currentName.value, (newValue) => newName.value = newValue)

watch(() => database.value.records, (newValue) => {
	if (!newValue?.find(r => r.id === record.id)) modal.close()
})

onMounted(() => console.log("aaaaaaaa"))

async function updateName() {
	const oldValue = record.values[titleField.value.id]
	if (newName.value === oldValue) return
	record.values[titleField.value.id] = newName.value
	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/fields/${titleField.value.id}/records/${record.id}`,
		{
			method: "PATCH",
			body: JSON.stringify({value: newName.value}),
		}
	)
	if (!res.ok) {
		record.values[titleField.value.id] = oldValue;
		useErrorToast("Rename failed")
	}
}
</script>

<template>
	<UModal v-if="database.fields" :ui="{width: 'sm:max-w-3xl', wrapper: 'z-40'}">
		<UCard :ui="{ base: 'px-8 py-7 sm:px-16 sm:py-14', ring: '', background: 'dark:bg-gray-700',
		divide: 'divide-y divide-gray-100 dark:divide-gray-700/50' }">
			<div class="absolute top-0 right-0 m-2">
				<DatabaseButtonMenuRecord :record="record" context="edit-modal">
					<UButton icon="i-heroicons-ellipsis-horizontal" color="gray" variant="ghost"/>
				</DatabaseButtonMenuRecord>
			</div>

			<form @submit.prevent="updateName">
				<UInput v-model="newName" size="4xl" class="font-semibold opacity-80" placeholder="New Item" autofocus
				        color="gray" variant="transparent" @focusout="updateName"/>
			</form>
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
					<DatabaseRecordValue :field="field" :record="record"/>
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
