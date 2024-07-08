<script setup lang="ts">
const session = useSession()
useColorMode().preference = session.value.scheme
</script>

<template>
	<div :class="'bg-primary-50 dark:bg-gray-950 w-screen h-screen'">
		<slot/>
	</div>
</template>
