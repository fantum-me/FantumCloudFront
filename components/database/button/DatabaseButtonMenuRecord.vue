<script setup lang="ts">
import type TableRecord from "~/types/database/TableRecord";
import {DatabaseModalEditRecord} from "#components";

const {record, context} = defineProps<{
	record: TableRecord,
	context: "view" | "edit-modal"
}>()

const modal = useModal()
const openInPanel = () => modal.open(DatabaseModalEditRecord, {record})
</script>

<template>
	<UPopover :popper="{ placement: context === 'view' ? 'bottom-start' : 'right-start' }">
		<slot/>

		<template #panel>
			<div class="m-1 space-y-1">
				<UButton v-if="context !== 'edit-modal'" class="w-full" icon="i-heroicons-arrows-pointing-out"
				         color="gray" variant="ghost" @click="openInPanel">
					Open in panel
				</UButton>

				<DatabaseButtonDeleteRecord :id="record.id">
					<UButton icon="i-heroicons-trash" class="w-full" color="gray" variant="ghost">
						Delete record
					</UButton>
				</DatabaseButtonDeleteRecord>
			</div>
		</template>
	</UPopover>
</template>
