<script setup lang="ts">
import type Folder from "~/types/api/Folder";
import type File from "~/types/api/File";
import {DragSelect} from "@coleqiu/vue-drag-select";
import {useMouse, useWindowScroll} from "@vueuse/core";

const {x, y} = useMouse()
const {y: windowY} = useWindowScroll()

const props = defineProps<{
	isLoading: boolean,
	folders: Folder[],
	files: File[],
}>()

const itemsSelection = useItemsSelection()
const itemsDragging = useItemsDragging()
</script>

<template>
	<drag-select v-model="itemsSelection" class="w-full h-full" :draggable-on-option="false">
		<slot/>
		<div v-if="!isLoading" class="pb-28 items-grid">
			<ItemCard v-for="folder in props.folders" :item="folder"/>
			<ItemCard v-for="file in props.files" :item="file"/>
		</div>
	</drag-select>

	<UCard class="fixed shadow-xl z-[60] dark:ring-gray-600 pointer-events-none"
	       :ui="{body: {base: 'px-4 py-3 sm:px-4 sm:py-3'}}"
	       v-if="itemsDragging" v-bind:style="{ left: x + 'px', top: (y - windowY) + 'px' }">
		<div class="flex-between gap-5">
			<div class="flex-start space-x-1.5">
				<span class="h-5 w-5">
					<UIcon v-if="decodeSummary(itemsSelection[0]).type === 'file'" name="i-heroicons-document-solid" class="h-full w-full"/>
					<UIcon v-else name="i-heroicons-folder-solid" class="h-full w-full"/>
				</span>
				<span class="font-medium">{{ decodeSummary(itemsSelection[0]).name }}</span>
			</div>
			<span :hidden="itemsSelection.length < 2" class="opacity-75 text-sm">+{{ itemsSelection.length - 1 }}</span>
		</div>
	</UCard>
	<ContextMenuItems/>
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
