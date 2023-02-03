<script setup>
	import { useRoute, useRouter } from 'vue-router';
	import { useStore } from 'vuex';

	const store = useStore();

	const goToHomePage = () => {
		localStorage.clear();
		localStorage.setItem('step', 0);

		router.push(`/`);
	};

	const summary = () => {};

	const router = useRouter();
</script>

<template>
	<div class="bg-indigo-100">
		<div
			class="bg-indigo-100 p-6 md:mx-auto justify-center items-center align-middle"
		>
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
					Thank you for completing your online payment.
				</p>
				<p class="mb-6">Have a great day!</p>

				<div class="border-2 flex flex-col justify-center">
					<div class="flex flex-row justify-center">
						<p class="mr-6">Payment Amount:</p>
						<p class="font-bold">₺{{ store.state.totalPrice }}</p>
					</div>
					<div class="flex flex-row justify-center">
						<p class="mr-6">Category :</p>
						<p>{{ store.state.eventCategoryName }}</p>
					</div>
					<div class="flex flex-row justify-center">
						<p class="mr-6">Tickets:</p>
						<button
							class="px-2 mx-2 bg-indigo-500 rounded"
							v-for="item in store.state.seats"
						>
							{{ item.seat }}-{{ item.row }}
						</button>
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
