<script lang="ts" setup>
import type TableField from "~/types/database/TableField";

const {value, field, small} = defineProps<{
	value: string,
	field: TableField,
	small: boolean
}>()
</script>

<template>
	<UBadge v-if="value" :class="small ? '' : 'm-2.5'" :color="field.options?.[value]" variant="subtle">
		{{ value }}
	</UBadge>
	<div v-else class="select-none">&nbsp;</div>
</template>
