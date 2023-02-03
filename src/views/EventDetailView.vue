<script setup>
	import { onMounted, ref, watch } from 'vue';
	import Service from '../service';
	import { useStore } from 'vuex';
	import { useRoute, useRouter } from 'vue-router';
	import { useToast } from 'vue-toast-notification';
	import Spinner from '../components/Spinner.vue';
	import 'vue-toast-notification/dist/theme-sugar.css';
	import 'vue-select/dist/vue-select.css';

	import moment from 'moment';

	const $toast = useToast();

	const eventDetails = ref([]);

	const eventVenue = ref();
	const spinnerOpen = ref(false);

	const categoryId = ref([]);

	const categoryList = ref([]);

	const route = useRoute();
	const router = useRouter();
	const store = useStore();

	const updateEventState = (key, value) => {
		store.commit('update', [key, value]);
	};
	console.log(categoryId.value);
	const findPrice = () => {
		console.log(categoryId.value);
		const category = categoryList.value.find((x) => x.id == categoryId?.value);
		updateEventState('price', category.price);

		localStorage.setItem('price', category.price);
		updateEventState('eventCategoryName', category.name);
		localStorage.setItem('eventCategoryName', category.name);
		updateEventState('eventCategoryId', categoryId.value);
		localStorage.setItem('eventCategoryId', categoryId.value);
		updateEventState('step', 2);
		localStorage.setItem('step', 2);
	};
	console.log(categoryId.value);
	const goToPayment = () => {
		s;
		if (categoryId.value !== undefined || null) {
			$toast.success('Event category selected successfully', {
				position: 'top-right',
			});
			router.push('/event-detail/event-seat-plan');
		} else {
			$toast.error('please  select a category', { position: 'top-right' });
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
		class="flex relative flex-col justify-center align-middle items-center bg-indigo-100"
	>
		<div
			v-if="spinnerOpen"
			class="absolute bg-indigo-100 opacity-70 w-full h-full"
		>
			<Spinner class="absolute right-1/2 top-1/2"></Spinner>
		</div>
		<div
			class="desktop:mx-2 desktop:my-2 desktop:max-w-[500px] mobile:w-full h-full mobile:p-2 mobile:h-full"
		>
			<div>
				<h1 class="mt-2 mb-6 font-bold text-xl">{{ eventDetails?.title }}</h1>
			</div>

			<p class="mb-6">{{ eventDetails.description }}</p>
			<div><img :src="eventDetails?.image_url" alt="" class="" /></div>

			<div class="mb-6" v-if="!eventDetails?.image_url">
				<img class="object-fill w-84" src="default_picture.png" alt="" />
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
				<span> {{ moment(eventDetails.event_date).format('hh-mm') }} </span>
			</p>

			<div class="flex flex-col my-4 desktop:w-[500px] mobile:w-full">
				<!-- <label class="my-2" for="category">Select a category</label>

				<select
					name="category"
					id=""
					class="select-custom"
					v-model="categoryId"
					placeholder="Please choose an option"
					@change="findPrice"
				>
					<option
						class="option-custom"
						v-for="item in eventDetails?.event_categories"
						:value="item.id"
					>
						{{ item.name }} - {{ item.price }} TL
					</option>
				</select> -->

				<v-select
					v-model="categoryId"
					placeholder="Please Select a Category"
					:reduce="(x) => x.id"
					@click="findPrice()"
					:options="eventDetails?.event_categories"
					label="id"
				>
					<template v-slot:option="option"
						>{{ option.name }} {{ option.price }} TL</template
					>
				</v-select>
			</div>

			<div>
				<button
					@click="goToPayment"
					class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
				>
					Go to seat plan
				</button>
			</div>
		</div>
	</div>
</template>

<style></style>
