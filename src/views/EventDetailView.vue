<script setup>
	import { onMounted, ref, watch } from 'vue';
	import Service from '../service';
	import { useStore } from 'vuex';
	import { useRoute, useRouter } from 'vue-router';
	import { useToast } from 'vue-toast-notification';
	import Spinner from '../components/Spinner.vue';
	import 'vue-toast-notification/dist/theme-sugar.css';
	const $toast = useToast();

	const eventDetails = ref([]);
	const spinnerOpen = ref(false);

	const categoryId = ref();

	const categoryList = ref([]);

	const route = useRoute();
	const router = useRouter();
	const store = useStore();

	const updateEventState = (key, value) => {
		store.commit('update', [key, value]);
	};

	const findPrice = async () => {
		const category = categoryList.value.find((x) => x.id == categoryId.value);
		updateEventState('price', category.price);
		updateEventState('eventCategoryId', categoryId.value);
	};

	const handeSeatPlan = () => {
		if (categoryId.value) {
			$toast.success('Event category selected successfully');
			router.push('/event-detail/event-seat-plan');
		} else {
			console.log('select a  category');
			$toast.error('please  select a seat');
		}
	};
	onMounted(() => {
		spinnerOpen.value = true;
		Service.getEventDetailPage(store.state.eventId)
			.then((res) => {
				eventDetails.value = res?.data?.data;
				categoryList.value = res?.data?.data?.event_categories;
				setTimeout(() => {
					spinnerOpen.value = false;
				}, 1000);
			})
			.catch((error) => $toast.error(error.message));
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
				<h1 class="mt-2 mb-6 font-bold">{{ eventDetails?.title }}</h1>
			</div>

			<p class="mb-6">{{ eventDetails?.description }}</p>
			<div><img :src="eventDetails?.image_url" alt="" class="" /></div>

			<div class="flex flex-col my-4 desktop:w-[500px] mobile:w-full">
				<label class="my-2" for="category">Select a category</label>

				<select
					name="category"
					id=""
					v-model="categoryId"
					placeholder="Please choose an option"
					@change="findPrice()"
				>
					<option
						v-for="item in eventDetails?.event_categories"
						:value="item.id"
					>
						{{ item.name }} - {{ item.price }} TL
					</option>
				</select>
			</div>

			<div>
				<button
					@click="handeSeatPlan"
					class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
				>
					Go to seat plan
				</button>
			</div>
		</div>
	</div>
</template>

<style></style>
