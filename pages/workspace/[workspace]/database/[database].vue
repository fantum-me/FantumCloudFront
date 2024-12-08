<script setup lang="ts">
import View from "~/types/View";

useView().value = View.DATABASE
</script>


<template>
	<NuxtLayout name="workspace">
		<Database :id="useRoute().params.database as string"/>
	</NuxtLayout>
</template>
