<script setup lang="ts">
import {DocumentEditor} from "@onlyoffice/document-editor-vue";
import type File from "~/types/api/File";

const loadAllowed = ref(false)
const error = ref()
const config = ref()

const workspaceId = useRoute().params.workspace as string
const id: string = useRoute().params.id as string

const res = await useFetch(`/api/workspaces/${workspaceId}/docs/${id}/config`)
if (res.status.value === "success" && res.data.value) {
	const file: File = res.data.value.file as File;
	if (isOfficeDocument(file)) {
		if (!["doc", "ppt"].includes(file.ext)) {
			config.value = res.data.value?.config
			loadAllowed.value = true
		} else error.value = "The extension of this document is too old, please convert it to " + file.ext + "x"
	} else error.value = "This document cannot be edited"
} else error.value = "Failed to load document editor"

</script>

<template>
	<div class="w-screen h-screen flex-center">
		<DocumentEditor v-if="loadAllowed" id="editor" documentServerUrl="http://localhost:7000/" :config="config"/>
		<p v-else-if="error">Error: {{ error }}</p>
	</div>
</template>
