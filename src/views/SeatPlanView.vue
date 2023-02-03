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

	const categoryName =
		localStorage.getItem('eventCategoryName') ?? store.state.eventCategoryName;

	const categoryPrice = localStorage.getItem('price') ?? store.state.price;

	const occupiedSeats = computed(() => {
		const seats = newSeatPlan.value.map((element) => element.seats);

		const newArray = seats.flat().filter((seat) => seat.Active);

		updateEventState('seats', newArray);

		return newArray;
	});

	const calculateTotal = computed(() => {
		const total =
			store.state.seats.length *
			(localStorage.getItem('price') ?? store.state.price);
		updateEventState('totalPrice', total);
		localStorage.setItem('totalPrice', total);
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
		return newArray;
	};

	const goToPayment = () => {
		if (store.state.seats.length > 0 && occupiedSeats.value.length > 0) {
			spinnerOpen.value = true;

			setTimeout(() => {
				spinnerOpen.value = false;
				localStorage.setItem('seats', JSON.stringify(occupiedSeats.value));

				router.push(`/payment`);
				updateEventState('step', 3);
				localStorage.setItem('step', 3);

				$toast.success('Seat selection completed!', { position: 'top-right' });
			}, 3000);
		} else {
			$toast.error('Please select seat', { position: 'top-right' });
		}
	};

	onMounted(() => {
		spinnerOpen.value = true;
		Service.getSeatPlan(
			localStorage.getItem('eventId') ?? store?.state?.eventId,
			localStorage.getItem('eventCategoryId') ?? store.state.eventCategoryId
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
	<div
		class="bg-indigo-100 min-h-[60vh] desktop:px-16 relative w-full flex desktop:flex-row mobile:flex-col align-middle items-center justify-center desktop:space-x-28"
	>
		<div
			v-if="spinnerOpen"
			class="absolute bg-indigo-200 opacity-80 w-full h-full"
		>
			<Spinner class="absolute right-1/2 top-1/2"></Spinner>
		</div>
		<div
			class="flex flex-row min-h-[30vh] w-full overflow-auto align-middle items-center bg-white rounded-md shadow-3xl"
		>
			<div class="justify-center flex flex-col w-full">
				<h1 class="text-center my-2 font-bold text-xl">Seat Selection</h1>
				<div
					v-for="item in newSeatPlan"
					v-if="newSeatPlan.length > 0"
					class="flex flex-row flex-start a m-2 p-2"
					:key="item.rows"
				>
					<div class="flex flex-row">
						<p
							class="font-bold justify-center items-center py-4 px-4 ml-2 text-xl"
						>
							{{ item.rows }}
						</p>
						<div class="flex flex-row justify-center items-center">
							<div v-for="seat in item.seats" :key="seat.id">
								<div class="cursor-pointer">
									<button
										:disabled="seat.isBooked"
										@click="seat.Active = !seat.Active"
										class="text-white font-bold py-2 px-2 rounded-full w-12 m-2"
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
		<div
			:class="[occupiedSeats.length > 0 ? 'min-h-[45vh]' : 'min-h-[32vh]']"
			class="flex flex-col align-middle justify-start min-h-[45vh] desktop:w-96 mobile:w-full bg-white rounded-md my-8 shadow-3xl"
		>
			<div class="flex flex-col justify-start mx-4">
				<h1 class="my-2 font-bold text-xl mx-4">
					Tickets
					<span v-if="occupiedSeats.length > 0"
						>({{ occupiedSeats.length }})</span
					>
				</h1>

				<div
					v-if="occupiedSeats.length > 0"
					class="flex flex-row min-h-[20vh] desktop:w-96 mobile:min-w-72 flex-wrap justify-start"
				>
					<div class="ml-2" v-for="seat in occupiedSeats">
						<button
							class="text-white bg-indigo-500 font-bold rounded p-2 m-2"
							@click="seat.Active = !seat.Active"
						>
							{{ seat.seat }}-{{ seat.row }}
						</button>
					</div>
				</div>

				<div
					v-if="occupiedSeats.length < 1"
					class="flex flex-row min-h-[20vh] desktop:w-96 mobile:min-w-72 flex-wrap justify-center align-middle items-center"
				>
					<div class="mx-4">
						<div class="justify-center flex mb-2">
							<font-awesome-icon
								style="color: #6366f1; font-size: 3rem"
								icon="fa-solid fa-ticket"
							/>
						</div>
						<p class="font-bold text-center">
							You haven't chosen any tickets yet.
						</p>
						<p class="text-sm text-center">You can choose your tickets now.</p>
					</div>
				</div>
			</div>
			<div class="mx-4" v-if="occupiedSeats.length > 0">
				<div>
					<p class="flex mx-4 flex-row justify-between font-bold">
						<span class="inline-block font-normal">Ticket Category : </span>
						<span class="inline-block"> {{ categoryName }}</span>
					</p>
				</div>
				<div class="mx-4">
					<p class="flex flex-row justify-between mb-12 font-bold">
						<span class="inline-block font-normal">Ticket Price : </span>
						<span class="inline-block"> {{ categoryPrice }} TL</span>
					</p>
				</div>
				<div class="flex flex-col justify-center align-middle mx-4 min-w-[20%]">
					<p class="underlined flex flex-row justify-between font-bold text-lg">
						<span class="inline-block">Total Price:</span>
						<span class="inline-block">{{ calculateTotal }} TL</span>
					</p>
				</div>

				<div class="flex justify-center">
					<button
						@click="goToPayment"
						class="bg-indigo-500 w-full hover:bg-indigo-700 text-white font-bold p-4 m-4 rounded"
					>
						Go to Payment
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
