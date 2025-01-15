<script lang="ts" setup>
import type TableField from "~/types/database/TableField";

const {value, field} = defineProps<{
	value: string,
	field: TableField
}>()
</script>

<template>
	<UBadge v-if="value" :color="field.options?.[value]" class="m-2.5" variant="subtle">
		{{ value }}
	</UBadge>
	<div v-else class="select-none">&nbsp;</div>
</template>
