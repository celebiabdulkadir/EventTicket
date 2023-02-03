<script setup>
	import { useRoute, useRouter } from 'vue-router';
	import { useStore } from 'vuex';
	const store = useStore();

	const router = useRouter();

	const updateEventState = (key, value) => {
		store.commit('update', [key, value]);
	};

	const goHomeButton = () => {
		router.push(`/`);
		localStorage.clear();
		updateEventState('clear');
		localStorage.setItem('step', 0);
	};
</script>

<template>
	<header>
		<div class="flex items-center flex-shrink-0 text-white bg-indigo-500 p-4">
			<font-awesome-icon
				class="fa-2x desktop:mx-6 mobile:mx-0"
				icon="fa-solid fa-ticket"
			/>

			<span
				@click="goHomeButton"
				class="font-semibold text-2xl tracking-tight cursor-pointer"
				>Event Ticket Platform</span
			>
		</div>
	</header>
</template>
