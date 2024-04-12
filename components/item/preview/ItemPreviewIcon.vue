<script setup lang="ts">
import type StorageItem from "~/types/api/StorageItem";

const {item, icon} = defineProps<{
	item: StorageItem,
	icon: any
}>()

const ext = isFile(item) ? item.ext : ""
</script>

<template>
	<div class="aspect-video flex-center">
		<div class="h-12 w-12 md:h-16 md:w-16 aspect-square rounded flex-center overflow-hidden">
			<icon :id="item.id" :ext="ext"/>
		</div>
	</div>
</template>
