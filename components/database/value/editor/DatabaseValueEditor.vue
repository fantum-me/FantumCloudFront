<script setup lang="ts">
import TableFieldType from "~/types/database/TableFieldType";
import type TableField from "~/types/database/TableField";

const target = useState<undefined|{
	field: TableField,
	currentValue: string,
	update: (v: string) => void,
	width: number,
	small: boolean,
	position: {
		x: number,
		y: number
	}
}>("database-value-editing-target", () => undefined)

const newValue = ref("")

function endEditing() {
	if (!target.value) return;
	if (newValue.value !== target.value.currentValue) target.value.update(newValue.value)
	target.value = undefined
	newValue.value = ""
}
</script>

<template>
	<div v-if="target" class="z-50 fixed top-0 left-0 w-screen h-screen" @click="endEditing">
		<div class="absolute" @click.stop :style="{
			transform: `translate(${target.position.x - 1}px, ${target.position.y - 1}px)`,
			width: target.width + 'px'
		}">
			<DatabaseValueEditorSelect v-if="target.field.type === TableFieldType.SelectType" v-model="newValue"
			                           :end-editing="endEditing" :field="target.field"/>
			<DatabaseValueEditorText v-else v-model="newValue" :current-value="target.currentValue" :end-editing="endEditing"
			                         :field="target.field" :small="target.small"/>
		</div>
	</div>
</template>
