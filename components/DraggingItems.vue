<script setup lang="ts">
import {useMouse, useWindowScroll} from "@vueuse/core";

const {x, y} = useMouse()
const {y: windowY} = useWindowScroll()

const itemsDragging = useItemsDragging()
const itemsSelection = useItemsSelection()
</script>

<template>
	<UCard class="fixed shadow-xl z-[60] dark:ring-gray-600 pointer-events-none"
	       :ui="{body: {base: 'px-4 py-3 sm:px-4 sm:py-3'}}"
	       v-if="itemsDragging" v-bind:style="{ left: x + 'px', top: (y - windowY) + 'px' }">
		<div class="flex-between gap-5">
			<div class="flex-start space-x-1.5">
				<span class="h-5 w-5">
					<UIcon v-if="isFile(useItem(itemsSelection[0]).value)"
					       name="i-heroicons-document-solid" class="h-full w-full"/>
					<UIcon v-else name="i-heroicons-folder-solid" class="h-full w-full"/>
				</span>
				<span class="font-medium">{{ useItem(itemsSelection[0]).value.name }}</span>
			</div>
			<span :hidden="itemsSelection.length < 2" class="opacity-75 text-sm">+{{ itemsSelection.length - 1 }}</span>
		</div>
	</UCard>
</template>
