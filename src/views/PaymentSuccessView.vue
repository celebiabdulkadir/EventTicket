<script setup>
	import { computed } from '@vue/reactivity';
	import { useRoute, useRouter } from 'vue-router';
	import { useStore } from 'vuex';

	const store = useStore();

	const calculateTotalPrice = computed(() => {
		return localStorage.getItem('totalPrice') ?? store.state.totalPrice;
	});

	const selectedSeats = computed(() => {
		const seats =
			JSON.parse(localStorage.getItem('seats')) ?? store.state.seats;
		return seats;
	});

	const eventCategory = computed(() => {
		const category =
			localStorage.getItem('eventCategoryName') ??
			store.state.eventCategoryName;
		return category;
	});

	const nameSurname = computed(() => {
		const name = localStorage.getItem('name') ?? store.state.name;
		const surname = localStorage.getItem('surname') ?? store.state.surname;

		const fullName = `${name} ${surname}`;
		return fullName;
	});

	const goToHomePage = () => {
		localStorage.clear();
		localStorage.setItem('step', 0);

		router.push(`/`);
	};

	const router = useRouter();
</script>

<template>
	<div class="bg-indigo-100">
		<div class="bg-indigo-100 p-6 md:mx-auto justify-center items-center">
			<svg viewBox="0 0 24 24" class="text-green-600 w-16 h-16 mx-auto my-6">
				<path
					fill="currentColor"
					d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
				></path>
			</svg>
			<div class="text-center">
				<h3
					class="md:text-2xl text-base text-gray-900 font-semibold text-center"
				>
					Payment Done!
				</h3>
				<p class="text-gray-600 my-2">
					Thanks
					<strong>{{ nameSurname }}</strong> for completing your online payment.
				</p>
				<div class="flex align-baseline justify-center items-center">
					<p
						class="mb-6 border-b-[1px] border-indigo-300 pb-4 text-center w-72"
					>
						Have a great day!
					</p>
				</div>

				<div class="flex flex-col justify-center align-middle items-center">
					<div class="w-72">
						<p class="mb-6 border-b-[1px] pb-4 my-2 border-indigo-300">
							Payment Summary :
						</p>
						<div class="flex flex-row mobile:justify-between mb-2">
							<p class="mr-6">Payment Amount:</p>
							<p class="font-bold">₺{{ calculateTotalPrice }}</p>
						</div>
						<div class="flex flex-row mobile:justify-between mb-2">
							<p class="mr-6">Category :</p>
							<p>{{ eventCategory }}</p>
						</div>
						<div class="flex flex-row mobile:justify-between">
							<p class="mr-2">Tickets:</p>
							<p class="text-left">
								<button
									class="px-2 mx-2 my-2 bg-green-600 contrast-125 rounded"
									v-for="item in selectedSeats"
								>
									{{ item.seat }}-{{ item.row }}
								</button>
							</p>
						</div>
					</div>
				</div>
				<div class="py-10 text-center">
					<button
						@click="goToHomePage"
						class="px-12 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-2"
					>
						BUY A NEW TICKET
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
