<template>
	<div class="table-container">
		<table>
			<thead>
			<tr>
				<th
					v-for="(column, index) in columns"
					:key="column.id"
					class="draggable-header"
					:style="getColumnStyle(index)"
					draggable="true"
					@dragstart="onDragStart(index)"
					@dragover.prevent="onDragOver(index)"
					@dragend="onDragEnd"
					@drop="onDrop(index)"
				>
					{{ column.label }}
				</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="row in rows" :key="row.id">
				<td v-for="column in columns" :key="column.id">
					{{ row[column.key] }}
				</td>
			</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

// Columns configuration
const columns = reactive([
	{ id: 'name', label: 'Name', key: 'name' },
	{ id: 'age', label: 'Age', key: 'age' },
	{ id: 'email', label: 'Email', key: 'email' },
]);

// Example data
const rows = reactive([
	{ id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
	{ id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
	{ id: 3, name: 'Sam Brown', age: 35, email: 'sam@example.com' },
]);

// Dragging state
const draggingColumnIndex = ref<number | null>(null);

// Store column positions to calculate transitions
const columnPositions = ref<number[]>(columns.map((_, index) => index));

// Handle drag start

</script>

<style scoped>
.table-container {
	overflow-x: auto;
}

table {
	width: 100%;
	border-collapse: collapse;
	table-layout: fixed;
}

th,
td {
	border: 1px solid #ccc;
	padding: 8px;
	text-align: left;
	width: 100px; /* Adjust based on your table width */
}

.draggable-header {
	cursor: grab;
	background-color: #f9f9f9;
	user-select: none;
}

.draggable-header:active {
	cursor: grabbing;
	background-color: #e0e0e0;
}

tr:nth-child(even) {
	background-color: #f2f2f2;
}
</style>
