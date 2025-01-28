<script lang="ts" setup>
import type TableRecord from "~/types/database/TableRecord";
import {DatabaseModalEditRecord} from "#components";
import type TableField from "~/types/database/TableField";

const modal = useModal()
const {record} = defineProps<{ record: TableRecord }>()

const database = useDatabase()
const titleField = computed(() => database.value.fields?.find(f => f.is_title) as TableField)
</script>

<template>
	<div class="bg-white border border-gray-100 px-4 py-2 mb-3 rounded-lg transition-opacity select-none cursor-pointer"
	     @click="modal.open(DatabaseModalEditRecord, {record})">
		{{ record.values[titleField.id].length ? record.values[titleField.id] : "New Item" }}
	</div>
</template>
