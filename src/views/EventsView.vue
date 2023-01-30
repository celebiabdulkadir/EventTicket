<script setup>
	import { onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useStore } from 'vuex';
	import Service from '../service';
	import moment from 'moment';

	const events = ref([]);

	const router = useRouter();

	const store = useStore();
	const updateEventState = (key, value) => {
		store.commit('update', [key, value]);
	};

	const handleClick = (id) => {
		updateEventState('eventId', id);
		router.push(`/event-detail/${id}`);
	};

	onMounted(() => {
		Service.getEventDetails()
			.then((res) => {
				events.value = res.data.data;
			})
			.catch((error) => console.log(error));
	});
</script>

<template>
	<div class="flex flex-row p-6 m-4 flex-wrap">
		<div
			class="rounded overflow-hidden shadow-lg mb-8 mr-8"
			v-for="item in events"
		>
			<div>
				<img
					class="object-cover w-72 m-2"
					:src="item.image_url"
					alt="event-photo"
				/>
			</div>

			<div class="px-6 pt-4 pb-2 text-2xl font-bold">
				<h1>
					{{ item.title }}
				</h1>
			</div>
			<div class="px-6 pt-4 pb-2">
				<font-awesome-icon icon="fa-solid fa-map-location" />
				{{ item.venue.name }}
			</div>
			<div class="px-6 pb-2 pt-4">
				<p class="mr-4">
					<font-awesome-icon icon="fa-solid fa-calendar-days" />
					{{ moment(item.event_date).format('DD-MM-YYYY') }}
				</p>
				<p class="mr-4 inline-block pt-6">
					<font-awesome-icon icon="fa-solid fa-stopwatch" />
					<span></span>
					{{ moment(item.event_date).format('hh-mm') }}
				</p>

				<button
					class="bg-indigo-500 hover:bg-indigo-700 block text-white font-bold py-2 px-4 rounded w-full my-4"
					@click="handleClick(item.id)"
				>
					Buy a ticket
				</button>
			</div>
		</div>
	</div>
</template>

<style></style>
