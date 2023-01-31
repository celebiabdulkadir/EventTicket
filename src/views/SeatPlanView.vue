<script setup>
	import Service from '../service';
	import { onMounted, ref, computed } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import { Store, useStore } from 'vuex';
	import { useToast } from 'vue-toast-notification';
	import Spinner from '../components/Spinner.vue';
	import 'vue-toast-notification/dist/theme-sugar.css';
	const $toast = useToast();

	const seatPlan = ref([]);
	const route = useRoute();
	const router = useRouter();
	const spinnerOpen = ref(false);

	const store = useStore();

	const updateEventState = (key, value) => {
		store.commit('update', [key, value]);
	};

	const occupy = (id) => {
		seatPlan.value[id - 1].Active = !seatPlan.value[id - 1].Active;
	};
	const occupiedSeats = computed(() => {
		var newSeats = [];
		newSeats = seatPlan.value.filter(function (e) {
			return e.Active;
		});

		updateEventState('seats', newSeats);

		return newSeats;
	});

	const calculateTotal = computed(() => {
		const total = store.state.seats.length * store.state.price;
		updateEventState('totalPrice', total);
		return total;
	});

	const goToPayment = () => {
		if (store.state.seats.length > 0) {
			spinnerOpen.value = true;

			setTimeout(() => {
				spinnerOpen.value = false;
				router.push(`/payment`);

				$toast.success('Seat selection completed!');
			}, 3000);
		} else {
			$toast.error('Please select seat');
		}
	};

	onMounted(() => {
		spinnerOpen.value = true;
		Service.getSeatPlan(
			store?.state?.eventId,
			store.state.eventCategoryId
		).then((res) => {
			for (const element of res.data.data) {
				element.Active = false;
			}
			seatPlan.value = res.data.data;

			setTimeout(() => {
				spinnerOpen.value = false;
			}, 2000);
		});
	});
</script>

<template>
	<div class="bg-indigo-100 relative">
		<div
			v-if="spinnerOpen"
			class="absolute bg-indigo-200 opacity-80 w-full h-full"
		>
			<Spinner class="absolute right-1/2 top-1/2"></Spinner>
		</div>
		<div class="flex flex-row justify-center">
			<div
				class="flex relative flex-row flex-start align-middle items-center justify-center m-2 p-2 flex-wrap max-w-[350px]"
			>
				<div v-for="item in seatPlan" class="cursor-pointer">
					<div class="m-2 p-2">
						<button
							:disabled="item.isBooked"
							@click="occupy(item.id)"
							class="text-white font-bold py-2 px-4 rounded ml-3"
							:class="[
								!item.isBooked
									? 'bg-gray-200 contrast-125 text-stone-600'
									: 'bg-gray-600 contrast-125',
								!item.Active
									? 'bg-green-200 contrast-125 text-stone-600'
									: 'bg-green-600 contrast-125',
							]"
						>
							{{ item.seat }}-{{ item.row }}
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-col flex-start">
			<div class="flex flex-row justify-center align-middle items-center">
				<p>Seats</p>
				<p class="mr-2" v-for="seat in occupiedSeats">
					{{ seat.seat }}-{{ seat.row }},
				</p>
			</div>
			<p class="flex flex-row justify-center align-middle items-center">
				ticket price{{ store.state.price }}
			</p>
		</div>

		<div class="flex justify-center">
			<div class="flex flex-col justify-center align-middle items-center">
				<p class="underlined decoration-solid text-center">
					TOTAL PRICE : <span>{{ calculateTotal }} TL</span>
				</p>
			</div>
			<button
				@click="goToPayment"
				class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold p-4 m-4 rounded"
			>
				Go to payment
			</button>
		</div>
	</div>
</template>

<style scoped></style>
