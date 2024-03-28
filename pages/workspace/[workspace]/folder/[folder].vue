<script setup lang="ts">
import View from "~/lib/View";

useView().value = View.FOLDER
</script>


<template>
	<Folder :id="useRoute().params.folder"/>
</template>
