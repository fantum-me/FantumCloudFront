<script setup>
const cards = ref([
	{ id: 1, title: 'Task 1', status: 'New' },
	{ id: 2, title: 'Task 2', status: 'New' },
	{ id: 3, title: 'Task 3', status: 'New' },
]);

const columnStatuses = ['New', 'To Do', 'In Progress', 'Done'];

const moveCard = (cardId, newStatus) => {
	const card = cards.value.find(card => card.id === cardId);
	if (card) {
		card.status = newStatus;
	}
};
</script>

<template>
	<div class="flex px-4">
		<DatabaseBoardColumn v-for="status in columnStatuses" :key="status" :status="status"
			:cards="cards.filter(card => card.status === status)" @moveCard="moveCard"/>
	</div>
</template>
