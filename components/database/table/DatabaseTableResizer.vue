<script lang="ts" setup>
import type TableField from "~/types/database/TableField";
import type DatabaseView from "~/types/database/DatabaseView";
import {DATABASE_TABLE_MIN_WIDTH} from "~/types/database/DatabaseViewType";

const workspace = useWorkspace()
const database = useDatabase()

const width = defineModel<number>()

const {view, field} = defineProps<{
	view: DatabaseView,
	field: TableField
}>()

const dragStartX = ref(0)
const draggingFieldWidth = ref(0)

async function onResize(e: MouseEvent) {
	view.field_settings[field.id].width = Math.max(
		DATABASE_TABLE_MIN_WIDTH,
		draggingFieldWidth.value + e.pageX - dragStartX.value
	)
}

async function startResizing(e: MouseEvent) {
	dragStartX.value = e.pageX;
	draggingFieldWidth.value = width.value ?? DATABASE_TABLE_MIN_WIDTH

	if (!view.field_settings) view.field_settings = {}
	if (!(field.id in view.field_settings)) view.field_settings[field.id] = {}
	if (!("width" in view.field_settings[field.id])) {
		view.field_settings[field.id].width = draggingFieldWidth.value
	}

	document.addEventListener('mousemove', onResize);
	document.addEventListener('mouseup', () => {
		document.removeEventListener('mousemove', onResize)
		console.log(width.value, draggingFieldWidth.value)
		if (width.value !== draggingFieldWidth.value) endResizing()
	}, {once: true});
}

async function endResizing() {
	console.log(view.field_settings)
	const res = await useApiFetch(
		`/workspaces/${workspace.value.id}/databases/${database.value.id}/views/${view.id}`, {
			method: "PATCH",
			body: JSON.stringify({field_settings: view.field_settings})
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
