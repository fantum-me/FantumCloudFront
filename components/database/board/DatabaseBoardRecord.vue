<script lang="ts" setup>
import type TableRecord from "~/types/database/TableRecord";

const {record, titleFieldId} = defineProps<{ record: TableRecord, titleFieldId: string }>()
</script>

<template>
	<div
		class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700/50 px-4 py-2 mb-3 rounded-lg transition-opacity select-none cursor-pointer">
		{{ record.values[titleFieldId].length ? record.values[titleFieldId] : "New Item" }}
	</div>
</template>
