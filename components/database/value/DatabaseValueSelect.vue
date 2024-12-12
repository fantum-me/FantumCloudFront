<script lang="ts" setup>
import type TableRecord from "~/types/database/TableRecord";
import type TableField from "~/types/database/TableField";

const {record, field} = defineProps<{
	record: TableRecord,
	field: TableField
}>()
</script>

<template>
	<UBadge v-if="record.values[field.id]" :color="field.options?.[record.values[field.id]]" class="m-2.5"
	        variant="subtle">
		{{ record.values[field.id] }}
	</UBadge>
	<div v-else class="select-none">&nbsp;</div>
</template>
