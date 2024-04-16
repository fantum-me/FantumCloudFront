<script setup lang="ts">
import View from "~/types/View";

useView().value = View.FOLDER
</script>


<template>
	<NuxtLayout name="workspace">
		<Folder :id="useRoute().params.folder as string"/>
	</NuxtLayout>
</template>
