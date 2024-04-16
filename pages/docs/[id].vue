<script setup lang="ts">
import {DocumentEditor} from "@onlyoffice/document-editor-vue";
import type File from "~/types/api/File";

const loadAllowed = ref(false)
const error = ref()
const config = ref()

const id: string = useRoute().params.id as string

const fileRes = await useApiFetch(`/files/${id}`)

if (fileRes.ok) {
	const file: File = await fileRes.json()
	if (isOfficeDocument(file)) {
		if (!["doc", "ppt"].includes(file.ext)) {
			const res = await fetch(`/api/docs/${id}/config`)
			if (res.ok) {
				config.value = (await res.json()).config
				loadAllowed.value = true
			}
			else error.value = "Failed to load document editor"
		} else error.value = "The extension of this document is too old, please convert it to " + file.ext + "x"
	} else error.value = "This document cannot be edited"
} else error.value = "Failed to load document"

</script>

<template>
	<div class="w-screen h-screen flex-center">
		<DocumentEditor v-if="loadAllowed" id="editor" documentServerUrl="http://localhost:7000/" :config="config"/>
		<p v-else-if="error">Error: {{ error }}</p>
	</div>
</template>
