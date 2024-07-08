<script setup lang="ts">
const {name} = defineProps<{name: string}>()
</script>

<template>
	<ItemIconTextBased class="bg-gray-500" :text="name.split('.').pop()?.toUpperCase() ?? ''"/>
</template>
