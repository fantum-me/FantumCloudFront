<script setup lang="ts">
import View from "~/types/View";
import type {Ref} from "vue";

const isOpen = useSidebarOpen();
const workspace = useWorkspace();
const session = useSession()

const query: Ref<string> = ref(useView().value === View.SEARCH ? useRoute().query.q as string : "")


async function handleSearch() {
	await navigateTo(`/workspace/${workspace.value.id}/search?q=${query.value}`)
	const event = new Event("search")
	window.dispatchEvent(event)
}

</script>

<template>
	<div class="sticky z-20 top-0 h-16 shrink-0 w-full flex-between gap-3">
		<div class="flex-start gap-3">
			<UButton class="flex-center w-15 h-15 md:hidden" color="gray" variant="ghost" @click="isOpen = true">
				<UIcon name="i-heroicons-bars-3-solid" class="w-10 h-10"/>
			</UButton>
			<form @submit.prevent="handleSearch">
				<UInput color="white" :ui="{base: 'w-96 ring-opacity-0', rounded: 'rounded-full'}"
				        v-model="query" name="q" icon="i-heroicons-magnifying-glass" placeholder="Search file, folder..." size="lg"/>
			</form>
		</div>
		<UPopover>
			<img :src="session.avatar" :alt="session.name + '\'s avatar'" class="rounded-full h-8 w-8">

			<template #panel>
				<UCard>
					<div class="w-full space-y-5">
						<div class="flex-center gap-3">
							<img :src="session.avatar" :alt="session.name + '\'s avatar'" class="rounded-full h-8 w-8">
							<div class="text-xs">
								<p class="font-medium">{{ session.name }}</p>
								<p class="opacity-70">{{ session.email }}</p>
							</div>
						</div>
						<UButton block to="/auth/logout" :external="true">Sign out</UButton>
					</div>
				</UCard>
			</template>
		</UPopover>
	</div>
</template>
