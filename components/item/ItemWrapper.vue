<script setup lang="ts">
import type StorageItem from "~/types/api/StorageItem";

const {item} = defineProps<{item: StorageItem}>()
</script>

<template>
	<div :data-type="isFolder(item) ? 'folder' : 'file'" :data-item-id="item.id"
	     @contextmenu.prevent="onItemContextMenu(item)" @dblclick="openItem(item)"
	     draggable="true" @dragstart.prevent="onItemDragStart(item)">
		<slot/>
	</div>
</template>
