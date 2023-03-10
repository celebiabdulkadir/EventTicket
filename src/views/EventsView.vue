<script setup>
	import { onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useStore } from 'vuex';
	import Spinner from '../components/Spinner.vue';
	import Service from '../service';
	import moment from 'moment';
	import { useToast } from 'vue-toast-notification';
	import 'vue-toast-notification/dist/theme-sugar.css';
	const $toast = useToast();

	const events = ref([]);

	const router = useRouter();

	const spinnerOpen = ref(false);

	const store = useStore();

	// method for updating state

	const updateEventState = (key, value) => {
		store.commit('update', [key, value]);
	};
	// method for go to details page
	const handleClick = (id) => {
		updateEventState('eventId', id);

		localStorage.setItem('eventId', id);
		updateEventState('step', 1);

		localStorage.setItem('step', 1);

		if (id !== undefined || id !== null || id !== '') {
			router.push('/event-detail');
		}
	};

	onMounted(() => {
		spinnerOpen.value = true;
		Service.getEventDetails()
			.then((res) => {
				events.value = res.data.data;

				setTimeout(() => {
					spinnerOpen.value = false;
				}, 2000);
			})
			.catch((error) => $toast.error(error.message, { position: 'top-right' }));
	});
</script>

<template>
	<div
		v-if="spinnerOpen"
		class="absolute w-full h-full bg-gray-50 opacity-90 z-20"
	>
		<Spinner class="absolute left-1/2 top-1/2"></Spinner>
	</div>
	<div class="pt-8 desktop:pl-10 mobile:px-2">
		<h1 class="text-lg font-bold">ALL EVENTS</h1>
		<p class="opacity-60">
			Discover and buy tickets for your exclusive events.
		</p>
	</div>

	<div
		class="flex relative flex-row desktop:p-6 desktop:m-4 mobile:px-2 mobile:pt-6 mobile:m-0 flex-wrap"
	>
		<div
			class="rounded overflow-hidden shadow-lg desktop:mb-8 mobile:mb-2 desktop:mr-8 mobile:w-full desktop:w-72 bg-white"
			v-for="item in events"
		>
			<div>
				<img
					class="object-cover desktop:w-72 mobile:w-full"
					:src="item.image_url"
					alt="event-photo"
				/>
			</div>

			<div class="mb-6" v-if="!item?.image_url">
				<img
					class="desktop:w-72 m-2 mobile:w-full object-cover"
					src="/default_picture.png"
					alt=""
				/>
			</div>

			<div class="px-6 pt-4 pb-2 text-2xl font-bold">
				<h1>
					{{ item.title }}
				</h1>
			</div>
			<div class="px-6 pt-4 pb-2 desktop:min-h-[9.5vh]">
				<font-awesome-icon class="mr-2" icon="fa-solid fa-map-location" />
				<span>{{ item.venue.name }}</span>
			</div>
			<div class="px-6 pb-2 pt-4">
				<p class="">
					<font-awesome-icon class="mr-2" icon="fa-solid fa-calendar-days" />
					<span> {{ moment(item.event_date).format('DD-MM-YYYY') }} </span>
				</p>
				<p class="mr-4 inline-block pt-6">
					<font-awesome-icon class="mr-2" icon="fa-solid fa-stopwatch" />
					<span> {{ moment(item.event_date).format('hh:mm') }} </span>
				</p>

				<button
					class="bg-indigo-500 hover:bg-indigo-700 block text-white font-bold py-2 px-4 rounded w-full my-4"
					@click="handleClick(item.id)"
				>
					See Details
				</button>
			</div>
		</div>
	</div>
</template>

<style></style>
