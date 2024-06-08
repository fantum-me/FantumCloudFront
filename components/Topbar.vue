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
	<UCard class="sticky z-20 top-0 h-16 w-full rounded-none shadow-none"
	       :ui="{body: {padding: 'px-3 sm:px-4', base: 'flex-between gap-3 h-full'}}">
		<div class="flex-start gap-3">
			<UButton class="flex-center w-15 h-15 md:hidden" color="gray" variant="ghost" @click="isOpen = true">
				<UIcon name="i-heroicons-bars-3-solid" class="w-10 h-10"/>
			</UButton>
			<form @submit.prevent="handleSearch">
				<UInput color="gray" variant="outline" :ui="{base: 'w-96 ring-opacity-0'}" v-model="query"
				        name="q" icon="i-heroicons-magnifying-glass" placeholder="Search file, folder..."/>
			</form>
		</div>
		<UPopover>
			<div class="flex-center gap-3 py-2 px-3 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
				<div class="text-end text-xs">
					<p class="font-medium">{{ session.name }}</p>
					<p class="opacity-70">{{ session.email }}</p>
				</div>
				<img :src="session.avatar" :alt="session.name + '\'s avatar'" class="rounded-full h-8 w-8">
			</div>

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
	</UCard>
</template>
