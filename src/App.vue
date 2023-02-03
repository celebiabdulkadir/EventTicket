<script setup>
	import { RouterView } from 'vue-router';
	import FooterComp from './components/FooterComp.vue';
	import HeaderComp from './components/HeaderComp.vue';
</script>

<template>
	<HeaderComp></HeaderComp>
	<div class="mobile:mb-[80px]"><RouterView class="overflow-auto" /></div>
	<FooterComp class="app-footer"></FooterComp>
</template>

<style></style>
