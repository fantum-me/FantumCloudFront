<script lang="ts" setup>
import type TableField from "~/types/database/TableField";
import {DATABASE_TABLE_MIN_WIDTH} from "~/types/database/DatabaseViewType";

const {field} = defineProps<{ field: TableField }>()

const workspace = useWorkspace()
const database = useDatabase()
const view = useDatabaseView()

const width = defineModel<number>()

const dragStartX = ref(0)
const draggingFieldWidth = ref(0)

async function onResize(e: MouseEvent) {
	if (!view.value.settings.widths) view.value.settings.widths = {}
	view.value.settings.widths[field.id] = Math.max(
		DATABASE_TABLE_MIN_WIDTH,
		draggingFieldWidth.value + e.pageX - dragStartX.value
	)
}

async function startResizing(e: MouseEvent) {
	dragStartX.value = e.pageX;
	draggingFieldWidth.value = width.value ?? DATABASE_TABLE_MIN_WIDTH

	if (!view.value.settings.widths) view.value.settings.widths = {}
	view.value.settings.widths[field.id] = DATABASE_TABLE_MIN_WIDTH

	document.addEventListener('mousemove', onResize);
	document.addEventListener('mouseup', () => {
		document.removeEventListener('mousemove', onResize)
		console.log(width.value, draggingFieldWidth.value)
		if (width.value !== draggingFieldWidth.value) endResizing()
	}, {once: true});
}

async function endResizing() {
	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/views/${view.value.id}`, {
			method: "PATCH",
			body: JSON.stringify({settings: view.value.settings})
		})

	if (!res.ok) useErrorToast("Failed to update column size.")
}
</script>

<template>
	<div :style="{left: width + 'px'}"
	     class="absolute z-50 h-full px-2 -ml-2.5 cursor-col-resize group" @mousedown="startResizing">
		<div class="rounded w-[3px] h-full group-hover:bg-primary-300"/>
	</div>
</template>
