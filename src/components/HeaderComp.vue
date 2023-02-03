<script setup>
	import { useRoute, useRouter } from 'vue-router';

	const router = useRouter();

	const goHomeButton = () => {
		router.push(`/`);
		localStorage.clear();
		localStorage.setItem('step', 0);
	};
</script>

<template>
	<header>
		<div class="flex items-center flex-shrink-0 text-white bg-indigo-500 p-4">
			<svg
				@click="router.push(`/`)"
				class="fill-current h-8 w-8 mr-2 cursor-pointer"
				width="54"
				height="54"
				viewBox="0 0 54 54"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"
				/>
			</svg>
			<span
				@click="goHomeButton"
				class="font-semibold text-xl tracking-tight cursor-pointer"
				>Event Ticket Platform</span
			>
		</div>
	</header>
</template>
