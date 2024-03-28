<script setup lang="ts">
const {ext} = defineProps<{ext: string}>()
</script>

<template>
	<ItemIconTextBased class="bg-gray-500" :text="ext.toUpperCase()"/>
</template>
