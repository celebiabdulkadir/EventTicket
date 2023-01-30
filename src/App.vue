<script setup>
	import { RouterLink, RouterView } from 'vue-router';
	import HeaderComp from './components/HeaderComp.vue';
</script>

<template>
	<nav class="flex items-center justify-between flex-wrap bg-indigo-500 p-6">
		<HeaderComp></HeaderComp>
	</nav>
	<RouterView />
</template>

<style scoped>
	.logo {
		display: block;
		margin: 0 auto 2rem;
	}

	nav {
		width: 100%;
		font-size: 12px;
		text-align: center;
	}

	@media (min-width: 1024px) {
		header {
			display: flex;
			place-items: center;
			padding-right: calc(var(--section-gap) / 2);
		}

		nav {
			text-align: left;
			font-size: 1rem;
		}
	}
</style>
