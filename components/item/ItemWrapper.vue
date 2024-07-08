<script setup lang="ts">
import type {ItemDisplay} from "~/components/item/Item.vue";

const {id, type} = defineProps<{
	id: string,
	type: "main" | "sidebar" | ItemDisplay
}>()


const itemsDragging = useItemsDragging()
const itemsSelection = useItemsSelection()

const item = useItem(id)
const editable = type !== 'main' && !(isFolder(item.value) && item.value.is_root)

function getDroppableClass(): string {
	if (isFolder(item.value) && !itemsSelection.value.includes(item.value.id)) {
		const childrenIds = item.value.items?.map(i => i.id) ?? [];
		const p = itemsSelection.value.map(i => childrenIds.includes(i))
		if (p.includes(false)) return "droppable-item"
	}
	return ""
}
</script>

<template>
	<div v-if="item" :data-type="isFolder(item) ? 'folder' : 'file'" :data-item-id="item.id"
	     @contextmenu.prevent.stop="editable && onItemContextMenu(item)"
	     @dblclick="editable && openItem(item)"
	     :draggable="editable" @dragstart.prevent="editable && onItemDragStart(item)"
	     :class="(itemsDragging ? getDroppableClass() : '') + ' ' + type + ' item-wrapper'">
		<slot/>
	</div>
</template>

<style>
.item-wrapper {
	transition: transform 0.1s ease-out;

	&.droppable-item {
		@apply outline-dashed outline-2 outline-primary outline-offset-1 scale-95;

		&.main {
			@apply -outline-offset-4 scale-[99%] rounded-2xl;
		}

		&.sidebar {
			@apply rounded -outline-offset-1;
		}

		&.card {
			@apply rounded-lg outline-offset-2;
		}

		&.line {
			@apply rounded z-40 scale-[99%] outline-offset-1;
		}
	}
}
</style>
