<script setup>
const {status, cards} = defineProps({
	status: String,
	cards: Array,
});
</script>

<template>
	<div class="w-full px-4 pt-2 pb-32">
		<h2 class="font-bold mb-2">{{ status }}</h2>
		<DatabaseBoardCard v-for="card in cards" :key="card.id" :card="card"/>
	</div>
</template>
