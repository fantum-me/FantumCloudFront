<script setup lang="ts">
const session = useSession()
useColorMode().preference = session.value.scheme
</script>

<template>
	<div :class="'bg-gray-100 dark:bg-gray-800 w-screen min-h-screen'">
		<slot/>
	</div>
</template>
