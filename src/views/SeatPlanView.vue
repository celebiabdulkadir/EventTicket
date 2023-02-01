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

	const newSeatPlan = ref([]);
	const route = useRoute();
	const router = useRouter();
	const spinnerOpen = ref(false);

	const store = useStore();

	const updateEventState = (key, value) => {
		store.commit('update', [key, value]);
	};

	const occupiedSeats = computed(() => {
		const seats = newSeatPlan.value.map((element) => element.seats);

		const newArray = seats.flat().filter((seat) => seat.Active);

		updateEventState('seats', newArray);

		return newArray;
	});

	const calculateTotal = computed(() => {
		const total = store.state.seats.length * store.state.price;
		updateEventState('totalPrice', total);
		return total;
	});

	const getRows = () => {
		const rows = seatPlan.value.map((element) => element.row);
		let uniqueRows = [...new Set(rows)];
		let newArray = [];

		for (let i = 0; i < uniqueRows.length; i++) {
			let seats = [];

			let newObj = {
				rows,
				seats: seats,
			};
			newArray.push(newObj);
			for (let j = 0; j < seatPlan.value.length; j++) {
				if (uniqueRows[i] == seatPlan.value[j].row) {
					seats.push(seatPlan.value[j]);

					newObj.rows = seatPlan.value[j].row;
				}
			}
		}
		newSeatPlan.value = newArray;
		console.log(newSeatPlan.value);
		return newArray;
	};

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
			getRows();

			setTimeout(() => {
				spinnerOpen.value = false;
			}, 2000);
		});
	});
</script>

<template>
	<div class="bg-indigo-100 relative w-full">
		<div
			v-if="spinnerOpen"
			class="absolute bg-indigo-200 opacity-80 w-full h-full"
		>
			<Spinner class="absolute right-1/2 top-1/2"></Spinner>
		</div>
		<div
			class="flex flex-row justify-center min-h-[50vh] w-full align-middle items-center"
		>
			<div class="justify-center flex flex-col w-full">
				<div
					v-for="item in newSeatPlan"
					v-if="newSeatPlan.length > 0"
					class="flex flex-row flex-start align-middle items-center justify-center m-2 p-2"
					:key="item.rows"
				>
					<div class="flex flex-row">
						<p
							class="font-bold justify-center items-center py-4 px-4 ml-2 text-2xl"
						>
							{{ item.rows }}
						</p>
						<div class="flex flex-row justify-center items-center">
							<div v-for="seat in item.seats" :key="seat.id">
								<div class="cursor-pointer">
									<button
										:disabled="seat.isBooked"
										@click="seat.Active = !seat.Active"
										class="text-white font-bold py-2 px-4 rounded-full m-2"
										:class="[
											!seat.isBooked
												? 'bg-gray-200 contrast-125 text-stone-600'
												: 'bg-gray-600 contrast-125',
											!seat.Active
												? 'bg-green-200 contrast-125 text-stone-600'
												: 'bg-green-600 contrast-125',
										]"
									>
										{{ seat.seat }}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-col justify-end">
			<div class="flex flex-col justify-end flex-wrap">
				<p class="font-bold p-2">SELECTED SEATS</p>

				<div class="flex flex-row flex-wrap min-h-[3vh]">
					<div class="mr-2" v-for="seat in occupiedSeats">
						<button class="text-white bg-indigo-500 font-bold rounded">
							{{ seat.seat }}-{{ seat.row }}
						</button>
					</div>
				</div>
			</div>
		</div>
		<div>
			<p class="flex flex-row justify-center align-middle items-center">
				ticket price{{ store.state.price }} TL
			</p>
		</div>

		<div class="flex justify-center">
			<div
				class="flex flex-col justify-center align-middle items-center min-w-[20%]"
			>
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
