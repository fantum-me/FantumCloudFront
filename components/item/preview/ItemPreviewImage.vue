<script setup lang="ts">
import type File from "~/types/api/File";

const {item} = defineProps<{
	item: File,
}>()
const src = "/api/files/" + item.id + "/preview"
const alt = "Preview of: " + item.name
</script>

<template>
	<img v-if="item.mime.startsWith('image')" :src="src" :alt="alt"
	     class="w-full aspect-video object-center object-cover rounded pointer-events-none"/>
	<img v-else :src="src" :alt="alt"
	     class="w-full aspect-video object-top object-cover rounded-t bg-white pointer-events-none"/>
</template>
