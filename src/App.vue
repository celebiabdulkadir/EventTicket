<script setup>
	import { RouterView } from 'vue-router';
	import FooterComp from './components/FooterComp.vue';
	import HeaderComp from './components/HeaderComp.vue';
</script>

<template>
	<div class="flex flex-col min-h-[100vh]">
		<HeaderComp></HeaderComp>

		<RouterView class="overflow-auto" />

		<FooterComp class="app-footer"></FooterComp>
	</div>
</template>

<style></style>
