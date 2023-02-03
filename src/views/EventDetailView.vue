<script setup>
	import { onMounted, ref, watch } from 'vue';
	import Service from '../service';
	import { useStore } from 'vuex';
	import { useRoute, useRouter } from 'vue-router';
	import { useToast } from 'vue-toast-notification';

	import Spinner from '../components/Spinner.vue';
	import 'vue-toast-notification/dist/theme-sugar.css';

	import moment from 'moment';

	const $toast = useToast();

	const eventDetails = ref([]);

	const eventVenue = ref();
	const spinnerOpen = ref(false);

	const categoryId = ref('');

	const categoryList = ref([]);

	const route = useRoute();
	const router = useRouter();
	const store = useStore();

	const updateEventState = (key, value) => {
		store.commit('update', [key, value]);
	};

	const goBack = () => {
		router.go(-1);
		store.commit('clear');
		localStorage.clear();
	};

	const goToPayment = () => {
		if (
			categoryId.value === 'undefined' ||
			categoryId.value === 'null' ||
			categoryId.value === ''
		) {
			$toast.error('Please  select a category', { position: 'top-right' });
			return;
		} else {
			const category = categoryList.value.find(
				(x) => x.id == categoryId?.value
			);
			updateEventState('price', category.price);
			localStorage.setItem('price', category.price);
			updateEventState('eventCategoryName', category.name);
			localStorage.setItem('eventCategoryName', category.name);
			updateEventState('eventCategoryId', categoryId.value);
			localStorage.setItem('eventCategoryId', categoryId.value);
			updateEventState('step', 2);
			localStorage.setItem('step', 2);
			$toast.success('Event category selected successfully', {
				position: 'top-right',
			});
			router.push('/event-detail/event-seat-plan');
		}
	};
	onMounted(() => {
		spinnerOpen.value = true;
		Service.getEventDetailPage(
			localStorage.getItem('eventId') ?? store.state.eventId
		)
			.then((res) => {
				eventDetails.value = res?.data?.data;

				categoryList.value = res?.data?.data?.event_categories;
				eventVenue.value = res?.data?.data?.venue;

				setTimeout(() => {
					spinnerOpen.value = false;
				}, 1000);
			})
			.catch((error) => $toast.error(error.message, { position: 'top-right' }));
	});
</script>

<template>
	<div
		v-if="spinnerOpen"
		class="absolute bg-gray-50 opacity-90 w-full h-full z-20"
	>
		<Spinner class="absolute right-1/2 top-1/2"></Spinner>
	</div>
	<div
		class="flex relative flex-col justify-center mobile:mx-2 align-middle items-center bg-indigo-100"
	>
		<div
			class="desktop:mx-2 desktop:my-2 desktop:max-w-[500px] mobile:w-full h-full"
		>
			<div class="">
				<button
					class="inline-block hover:scale-105 font-bold py-2 rounded"
					@click="goBack"
				>
					<font-awesome-icon style="" icon="fa-solid fa-circle-arrow-left" />
					Back
				</button>
			</div>
			<div>
				<h1 class="mt-2 mb-6 font-bold text-xl">{{ eventDetails?.title }}</h1>
			</div>

			<p class="mb-6">{{ eventDetails.description }}</p>
			<div><img :src="eventDetails?.image_url" alt="" class="" /></div>

			<div class="mb-6" v-if="!eventDetails?.image_url">
				<img class="object-fill w-84" src="/default_picture.png" alt="" />
			</div>
			<div class="pt-4 pb-2">
				<font-awesome-icon class="mr-2" icon="fa-solid fa-map-location" />
				<span class="font-bold">{{ eventVenue?.name }}</span>
				<span class="ml-6 block">{{ eventVenue?.address }}</span>
			</div>
			<p class="">
				<font-awesome-icon class="mr-2" icon="fa-solid fa-calendar-days" />
				<span>
					{{ moment(eventDetails.event_date).format('DD-MM-YYYY') }}
				</span>
			</p>
			<p class="mr-4 inline-block pt-6">
				<font-awesome-icon class="mr-2" icon="fa-solid fa-stopwatch" />
				<span> {{ moment(eventDetails.event_date).format('hh:mm') }} </span>
			</p>

			<div class="flex flex-col my-4 desktop:w-[500px] mobile:w-full">
				<v-select
					class="bg-white"
					v-model="categoryId"
					placeholder="Please Select a Category"
					:reduce="(x) => x.id"
					:options="eventDetails?.event_categories"
					:get-option-label="
						(option) => option.name + '  ' + '₺' + option.price
					"
				>
				</v-select>
				<p class="text-red-300" v-if="categoryId.length < 1">
					*Please select a category
				</p>
			</div>

			<div class="flex flex-row justify-end my-2">
				<button
					@click="goToPayment"
					class="bg-indigo-500 inline-block hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
				>
					Go to seat plan <font-awesome-icon icon="fa-solid fa-circle-right" />
				</button>
			</div>
		</div>
	</div>
</template>

<style>
	@import 'vue-select/dist/vue-select.css';
</style>
