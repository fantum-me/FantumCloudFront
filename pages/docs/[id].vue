<script setup lang="ts">
import {DocumentEditor} from "@onlyoffice/document-editor-vue";

const id: string = useRoute().params.id as string
const res = await useFetch(`/api/docs/${id}/config`)
</script>

<template>
	<div id="container" v-if="res.status.value === 'success'">
		<DocumentEditor id="editor" documentServerUrl="http://localhost:7000/" :config="res.data.value.config"/>
	</div>
</template>

<style>
*, ::before, ::after {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

#container {
	width: 100vw;
	height: 100vh;
}
</style>
