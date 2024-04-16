<template>
	<NuxtLoadingIndicator :height="2" color="repeating-linear-gradient(to right,#3b5dd2,#1E3BA3)"/>
	<NuxtLayout name="auth-required">
		<NuxtLayout name="scheme">
			<NuxtPage/>
		</NuxtLayout>
	</NuxtLayout>
	<UNotifications/>
</template>
