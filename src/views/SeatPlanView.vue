<script setup>
	import Service from '../service';
	import { onMounted, ref, computed } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import { Store, useStore } from 'vuex';

	const seatPlan = ref([]);
	const route = useRoute();
	const router = useRouter();

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
			router.push(`/payment`);
		}
	};

	console.log(seatPlan.value);
	const goHome = () => {
		router.push(`/`);
	};
	onMounted(() => {
		Service.getSeatPlan(
			route?.params?.eventId,
			route?.params?.eventCategoryId
		).then((res) => {
			for (const element of res.data.data) {
				element.Active = false;
			}
			seatPlan.value = res.data.data;
		});
	});
</script>

<template>
	<div>
		<div>PLEASE SELECT SEAT OR SEATS</div>
		<div class="flex justify-center">
			<div class="mb-3 xl:w-96"></div>
		</div>

		<ul>
			<li v-for="seat in occupiedSeats">{{ seat.seat }} {{ seat.row }}</li>
		</ul>
		<div
			class="flex flex-row flex-start align-middle justify-center m-2 p-2 h-1/2 flex-wrap"
		>
			<div v-for="item in seatPlan" class="cursor-pointer">
				<div class="flex flex-col flex-wrap m-2 p-2">
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
						{{ item.seat }}
					</button>
				</div>
			</div>
		</div>
		<div>
			<p>TOTAL PRICE</p>
			<p class="align-center font-bold">{{ calculateTotal }} TL</p>
		</div>
		<div class="flex flex-end justify-end">
			<button
				@click="goToPayment"
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>
				Pay
			</button>
			<p v-if="!occupiedSeats">Please select seats</p>
		</div>

		<!-- <input type="text" v-model="store.state.eventCategoryId" /> -->
	</div>
</template>

<style scoped>
	.circle {
		border: 2px solid white;
		border-radius: 70%;
		/* background: lightgreen; */
		opacity: 50%;
		color: white;
		width: 40px;
		height: 40px;
		text-align: center;
		/* line-height: 100px; */
	}

	.clicked {
		background-color: green;
	}

	.seat {
		width: 100px;
		height: 100px;
		display: inline-block;
		border: 1px solid black;
		text-align: center;
		padding: 30px 10px;
		margin-right: 10px;
	}

	.seat-avail {
		background-color: rgb(230, 225, 225);
	}

	.seat-unavail {
		background-color: rgb(58, 62, 60);
	}

	.seats {
		display: flex;
		flex-direction: row;
	}
	/* .circleBos {
		background-color: green;
	}
	.circleDolu {
		background-color: red;
	} */
</style>
