<script setup lang="ts">
import type TableRecord from "~/types/database/TableRecord";
import type TableField from "~/types/database/TableField";

const {record, field, update} = defineProps<{ record: TableRecord, field: TableField, update: Function }>()

const value = computed(() => record.values[field.id] === "true")
</script>

<template>
	<div v-if="record && field" class="p-3 mt-px">
		<UToggle :model-value="value" @click="update(!Boolean(value))"/>
	</div>
</template>
