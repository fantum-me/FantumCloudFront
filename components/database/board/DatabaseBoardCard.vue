<script setup>
const {card} = defineProps({
	card: Object,
});

const emit = defineEmits(['moveCard']);

const dragStart = (event, card) => {
	event.dataTransfer.setData('text/plain', card.id);
};

const drop = event => {
	const cardId = event.dataTransfer.getData('text/plain');
	emit('moveCard', parseInt(cardId, 10), status);
};
</script>

<template>
	<div class="kanban-card bg-gray-100 rounded shadow p-3 mb-2 cursor-pointer"
		draggable="true" @dragstart="dragStart($event, card)" @dragover.prevent @drop="drop($event)">
		{{ card.title }}
	</div>
</template>
