<script setup>
	import { useStore } from 'vuex';
	import { computed, ref } from 'vue';
	import Service from '../service';
	import router from '../router';
	import { useToast } from 'vue-toast-notification';
	import Spinner from '../components/Spinner.vue';
	import 'vue-toast-notification/dist/theme-sugar.css';
	const $toast = useToast();
	const spinnerOpen = ref(false);
	const cardNumber = ref('');
	const emailValue = ref('');
	const cvvNum = ref('');
	const creditCardExpMonth = ref('');
	const creditCardExpYear = ref('');
	const name = ref('');
	const surname = ref('');

	const store = useStore();

	const emailValid = computed(() => {
		return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
			emailValue.value
		);
	});

	const updateEventState = (key, value) => {
		store.commit('update', [key, value]);
	};

	const creditCardValid = computed(() => {
		return /[0-9]{16}(?:[0-9]{3})?\b/.test(cardNumber.value);
	});

	const securityCodeValid = computed(() => {
		return /^[0-9]{3,4}$/.test(cvvNum.value);
	});

	const isFormValid = computed(() => {
		if (
			creditCardValid.value &&
			emailValid.value &&
			creditCardExpMonth.value !== '' &&
			creditCardExpYear.value !== '' &&
			name.value !== '' &&
			surname.value !== '' &&
			securityCodeValid.value
		) {
			return true;
		} else {
			return false;
		}
	});

	const updateCardValue = (e) => {
		cardNumber.value = e.target.value.replace(/ /g, '');
		updateEventState('cc_number', cardNumber.value);
	};
	const formatCardNumber = computed(() => {
		return cardNumber.value ? cardNumber.value.match(/.{1,4}/g).join(' ') : '';
	});

	const submitHandler = (e) => {
		e.preventDefault();

		if (isFormValid) {
			spinnerOpen.value = true;
			Service.completePayment({
				eventId: store.state.eventId,
				eventCategoryId: store.state.eventCategoryId,
				seats: store.state.seats,
				customer_name: store.state.customer_name,
				customer_surname: store.state.customer_surname,
				customer_email: store.state.customer_email,
				cc_number: store.state.cc_number,
				cc_exp_month: store.state.cc_exp_month,
				cc_exp_year: store.state.cc_exp_year,
				cc_exp_cvv: store.state.cc_exp_cvv,
			})
				.then((res) => {
					if (res.data.message == 'Biletiniz başarıyla oluşturuldu.') {
						setTimeout(router.push('/paymentsuccess'), 3000);
						$toast.success('Payment successfully completed!');
						spinnerOpen.value = false;
					}
				})
				.catch((error) => {
					$toast.error(error.message);
					console.log(error);
				});
		}
	};
</script>

<template>
	<form
		@submit="submitHandler"
		class="min-w-screen min-h-screen relative bg-gray-200 flex items-center justify-center px-5 pb-10 pt-16"
	>
		<div
			v-if="spinnerOpen"
			class="absolute bg-indigo-100 opacity-70 w-full h-full"
		>
			<Spinner class="absolute right-1/2 top-1/2"></Spinner>
		</div>
		<div
			class="w-full mx-auto rounded-lg bg-white shadow-lg p-5 text-gray-700"
			style="max-width: 600px"
		>
			<div class="w-full pt-1 pb-5">
				<div
					class="bg-indigo-500 text-white overflow-hidden rounded-full w-24 h-24 -mt-16 mx-auto shadow-lg flex justify-center items-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						height="400px"
						width="400px"
						version="1.1"
						id="Capa_1"
						viewBox="-150 -150 860 860"
						xml:space="preserve"
					>
						<path
							style="fill: #010002"
							d="M482.797,276.924c4.53-5.824,6.73-13.331,4.724-20.988L428.05,30.521    c-3.451-13.029-16.847-20.837-29.854-17.386L18.184,113.331C5.22,116.761-2.61,130.2,0.798,143.207L60.269,368.6    c3.408,13.007,16.868,20.816,29.876,17.408l134.278-35.419v75.476c0,42.214,69.954,64.303,139.11,64.303    c69.113,0,139.153-22.089,139.153-64.302V311.61C502.685,297.869,495.157,286.307,482.797,276.924z M439.763,199.226l6.212,23.469    l-75.541,19.953l-6.169-23.512L439.763,199.226z M395.931,50.733l11.799,44.695l-118.014,31.148l-11.799-44.695L395.931,50.733z     M342.975,224.744l6.04,22.951c-27.934,1.251-55.113,6.126-76.943,14.452l-4.616-17.429L342.975,224.744z M79.984,319.224    l-6.169-23.426l75.519-19.975l6.212,23.555L79.984,319.224z M170.625,270.237l75.476-19.953l5.716,21.506    c-1.834,1.122-3.559,2.286-5.242,3.473l-69.781,18.421L170.625,270.237z M477.491,424.209c0,24.612-50.993,44.544-113.958,44.544    c-62.9,0-113.937-19.953-113.937-44.544v-27.718c0-0.928,0.539-1.769,0.69-2.653c3.602,23.34,52.654,41.847,113.247,41.847    c60.614,0,109.687-18.508,113.268-41.847c0.151,0.884,0.69,1.726,0.69,2.653V424.209z M477.491,369.678    c0,24.591-50.993,44.522-113.958,44.522c-62.9,0-113.937-19.931-113.937-44.522V341.96c0-0.906,0.539-1.769,0.69-2.653    c3.602,23.318,52.654,41.869,113.247,41.869c60.614,0,109.687-18.551,113.268-41.869c0.151,0.884,0.69,1.747,0.69,2.653V369.678z     M363.532,356.11c-62.9,0-113.937-19.931-113.937-44.501c0-24.569,51.036-44.5,113.937-44.5c62.965,0,113.958,19.931,113.958,44.5    C477.491,336.179,426.497,356.11,363.532,356.11z"
						/>
					</svg>
				</div>
			</div>
			<div class="mb-10">
				<h1 class="text-center font-bold text-xl uppercase">Payment info</h1>
			</div>
			<div class="mb-3">
				<label class="font-bold text-sm mb-2 ml-1">Your name</label>
				{{ name }}
				<div>
					<input
						class="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
						placeholder="Your name"
						type="text"
						v-model="name"
						required
						@input="updateEventState('customer_name', $event.target.value)"
					/>
				</div>
			</div>
			<div class="mb-3">
				<label class="font-bold text-sm mb-2 ml-1">Your surname</label>
				<div>
					<input
						class="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
						placeholder="Your surname"
						type="text"
						required
						v-model="surname"
						@input="updateEventState('customer_surname', $event.target.value)"
					/>
				</div>
			</div>
			<div class="mb-3">
				<label class="font-bold text-sm mb-2 ml-1">Email address</label>
				<div>
					<input
						class="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
						placeholder="Email address"
						type="email"
						required
						v-model="emailValue"
						@input="updateEventState('customer_email', $event.target.value)"
					/>
					<p
						class="text-red-400/100 px-3"
						v-if="!emailValid && emailValue.length > 4"
					>
						Please enter valid email
					</p>
				</div>
			</div>
			<div class="mb-3">
				<label class="font-bold text-sm mb-2 ml-1">Card number</label>

				<div>
					<input
						class="w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
						placeholder="0000 0000 0000 0000"
						:value="formatCardNumber"
						required
						@input="updateCardValue"
					/>
					<p
						class="text-red-400/100 px-3"
						v-if="!creditCardValid && cardNumber.length > 4"
					>
						Please enter valid card number
					</p>
				</div>
			</div>
			<div class="mb-3 -mx-2 flex items-end">
				<div class="px-2 w-1/2">
					{{ creditCardExpMonth }}
					<label class="font-bold text-sm mb-2 ml-1">Expiration date</label>
					<div>
						<select
							required
							v-model="creditCardExpMonth"
							@input="updateEventState('cc_exp_month', $event.target.value)"
							class="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
						>
							<option value="01">01 - January</option>
							<option value="02">02 - February</option>
							<option value="03">03 - March</option>
							<option value="04">04 - April</option>
							<option value="05">05 - May</option>
							<option value="06">06 - June</option>
							<option value="07">07 - July</option>
							<option value="08">08 - August</option>
							<option value="09">09 - September</option>
							<option value="10">10 - October</option>
							<option value="11">11 - November</option>
							<option value="12">12 - December</option>
						</select>
					</div>
				</div>
				<div class="px-2 w-1/2">
					<select
						required
						v-model="creditCardExpYear"
						@input="updateEventState('cc_exp_year', $event.target.value)"
						class="form-select w-full px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
					>
						<option value="2020">2023</option>
						<option value="2021">2024</option>
						<option value="2022">2025</option>
						<option value="2023">2026</option>
						<option value="2024">2027</option>
						<option value="2025">2028</option>
						<option value="2026">2029</option>
						<option value="2027">2030</option>
						<option value="2028">2031</option>
						<option value="2029">2032</option>
					</select>
				</div>
			</div>
			<div class="mb-10">
				<label class="font-bold text-sm mb-2 ml-1">Security code</label>

				<div>
					<input
						class="w-32 px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
						placeholder="000"
						type="text"
						required
						v-model="cvvNum"
						@input="updateEventState('cc_exp_cvv', $event.target.value)"
					/>
					<p
						class="text-red-400/100 px-3"
						v-if="!securityCodeValid && cvvNum.length > 0"
					>
						Please enter valid email
					</p>
				</div>
			</div>
			<div>
				<button
					type="submit"
					class="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
				>
					<i class="mdi mdi-lock-outline mr-1"></i> PAY NOW
				</button>
			</div>
		</div>
	</form>
</template>

<style scoped></style>
