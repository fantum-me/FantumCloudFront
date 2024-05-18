<script setup lang="ts">
import type StorageItem from "~/types/api/StorageItem";

const {id, type} = defineProps<{
	id: string,
	type: "main" | "sidebar" | "card"
}>()


const itemsDragging = useItemsDragging()
const itemsSelection = useItemsSelection()

const item = useItem(id)
const editable = type !== 'main' && !(isFolder(item.value) && item.value.is_root)

function getDroppableClass(): string {
	if (isFolder(item.value) && !itemsSelection.value.includes(item.value.id)) {
		const childrenIds = (item.value.files as StorageItem[] ?? []).concat(item.value.folders ?? []).map(i => i.id);
		const p = itemsSelection.value.map(i => childrenIds.includes(i))
		if (p.includes(false)) return "droppable-item"
	}
	return ""
}
</script>

<template>
	<div v-if="item" :data-type="isFolder(item) ? 'folder' : 'file'" :data-item-id="item.id"
	     @contextmenu.prevent="editable && onItemContextMenu(item)"
	     @dblclick="editable && openItem(item)"
	     :draggable="editable" @dragstart.prevent="editable && onItemDragStart(item)"
	     :class="(itemsDragging ? getDroppableClass() : '') + ' ' + type + ' item-wrapper'">
		<slot/>
	</div>
</template>

<style>
.item-wrapper {
	transition: transform 0.1s ease-out;
	@apply outline-gray-200 dark:outline-gray-800 -outline-offset-4;

	&.droppable-item {
		@apply outline-dashed outline-2 outline-primary outline-offset-1 scale-95;

		&.main {
			@apply -outline-offset-4 scale-100;
		}

		&.sidebar {
			@apply rounded -outline-offset-1;
		}

		&.card {
			@apply rounded-lg outline-offset-2;
		}
	}
}
</style>
