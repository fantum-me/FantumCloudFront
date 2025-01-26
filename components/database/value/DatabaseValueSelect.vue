<script lang="ts" setup>
import type TableField from "~/types/database/TableField";
import type {BadgeColor} from "#ui/types";

const {value, field} = defineProps<{
	value: string,
	field: TableField
}>()

const values = computed(() => value ? value.split(",") : [])
</script>

<template>
	<div v-if="values.length" class="h-full flex items-start flex-wrap gap-x-2 gap-y-1.5 p-2.5">
		<UBadge v-for="v in values" :color="field.options?.[v] as BadgeColor" variant="subtle">
			{{ v }}
		</UBadge>
	</div>
	<div v-else class="select-none">&nbsp;</div>
</template>
