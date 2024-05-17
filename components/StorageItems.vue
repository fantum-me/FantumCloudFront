<script setup lang="ts">
import type Folder from "~/types/api/Folder";
import type File from "~/types/api/File";
import {DragSelect} from "@coleqiu/vue-drag-select";

const props = defineProps<{
	folders: Folder[],
	files: File[]
}>()

const itemsSelection = useItemsSelection()

function unfocusInputs() {
	document.querySelectorAll('input:focus').forEach((element) => {
		if (element instanceof HTMLInputElement) element.blur();
	});
}
</script>

<template>
	<drag-select v-model="itemsSelection" class="w-full h-full" :draggable-on-option="false" @click="unfocusInputs">
		<slot/>
		<div class="pb-28 items-grid">
			<ItemCard v-for="folder in props.folders" :item="folder" :key="folder.id"/>
			<ItemCard v-for="file in props.files" :item="file" :key="file.id"/>
		</div>
	</drag-select>
</template>

<style>
.drag-select {
	@apply w-full h-full p-6 md:p-12;
	container-type: inline-size;
}

.drag-select__area {
	@apply bg-primary opacity-25 rounded !important;
}
</style>
