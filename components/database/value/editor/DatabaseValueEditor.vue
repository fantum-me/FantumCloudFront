<script setup lang="ts">
import TableFieldType from "~/types/database/TableFieldType";

const newValue = ref("")

const target = useValueEditingTarget()
watch(() => target.value, (v) => newValue.value = v?.currentValue ?? newValue.value)

function endEditing() {
	if (!target.value) return;
	if (newValue.value !== target.value.currentValue) target.value.update(newValue.value)
	target.value = undefined
	newValue.value = ""
}
</script>

<template>
	<Teleport to="body" v-if="target">
		<div class="z-[100] fixed top-0 left-0 w-screen h-screen" @click="endEditing">
			<div class="absolute" @click.stop :style="{
			transform: `translate(${target.position.x - 1}px, ${target.position.y - 1}px)`,
			width: target.width + 'px'
		}">
				<DatabaseValueEditorSelect v-if="target.field.type === TableFieldType.SelectType" v-model="newValue"
				                           :end-editing="endEditing" :field="target.field"/>
				<DatabaseValueEditorDatetime v-else-if="target.field.type === TableFieldType.DatetimeType"
				                             v-model="newValue" :end-editing="endEditing"/>
				<DatabaseValueEditorText v-else v-model="newValue" :end-editing="endEditing" :field="target.field"/>
			</div>
		</div>
	</Teleport>
</template>
