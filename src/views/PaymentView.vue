<script setup>
	import { useStore } from 'vuex';
	import { computed, ref } from 'vue';
	import Service from '../service';
	import router from '../router';
	import { useToast } from 'vue-toast-notification';
	import Spinner from '../components/Spinner.vue';
	import 'vue-toast-notification/dist/theme-sugar.css';

	import moment from 'moment';
	const $toast = useToast();
	const spinnerOpen = ref(false);
	const cardNumber = ref('');

	const calculateTotalPrice = computed(() => {
		return localStorage.getItem('totalPrice') ?? store.state.totalPrice;
	});
	const emailValue = ref('');
	const cvvNum = ref('');
	const creditCardExpMonth = ref('');
	const creditCardExpYear = ref('');
	const name = ref('');
	const surname = ref('');

	const store = useStore();

	const goBack = () => {
		router.go(-1);
		localStorage.setItem('step', 2);

		localStorage.removeItem('totalPrice');
		localStorage.removeItem('seats');

		store.commit('update', ['step', 2]);
		store.commit('update', ['totalPrice', '']);
		store.commit('update', ['seats', '[]']);
	};
	const emailValid = computed(() => {
		return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/.test(
			emailValue.value
		);
	});

	const updateEventState = (key, value) => {
		store.commit('update', [key, value]);
	};

	const creditCardValid = computed(() => {
		return /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}(?:2131|1800|35\d{3})\d{11})$/.test(
			cardNumber.value
		);
	});

	const monthYear = computed(() => {

		const newResult = new Date(creditCardExpYear.value,creditCardExpMonth.value-1,1)
		return newResult
	});

	const dateValid = computed(() => {
		const currentDate = moment(new Date())
		

		const expDate = moment(monthYear.value);
		

		const difference = expDate.diff(currentDate, 'months');

		if (difference > 0) {
			return true;
		}
	});

	const securityCodeValid = computed(() => {
		return /^[0-9]{3,4}$/.test(cvvNum.value);
	});

	const isFormValid = computed(() => {
		if (
			dateValid.value &&
			creditCardValid.value &&
			emailValid.value &&
			creditCardExpMonth.value !== '' &&
			creditCardExpYear.value !== '' &&
			name.value !== '' &&
			surname.value !== '' &&
			securityCodeValid.value
		) {
			return true;
		} else false;
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

		if (!isFormValid.value) {
			return $toast.error('Please check your information', {
				position: 'top-right',
			});
		}

		spinnerOpen.value = true;
		Service.completePayment({
			eventId: store.state.eventId,
			eventCategoryId: store.state.eventCategoryId,
			seats: store.state.seats,
			customer_name: store.state.customer_name.trim(),
			customer_surname: store.state.customer_surname.trim(),
			customer_email: store.state.customer_email.trim(),
			cc_number: store.state.cc_number.trim(),
			cc_exp_month: store.state.cc_exp_month,
			cc_exp_year: store.state.cc_exp_year,
			cc_exp_cvv: store.state.cc_exp_cvv.trim(),
		})
			.then((res) => {
				setTimeout(() => {
					updateEventState('step', 4);
					localStorage.setItem('step', 4);
					updateEventState('name', name.value);
					localStorage.setItem('name', name.value);
					updateEventState('surname', surname.value);
					localStorage.setItem('surname', surname.value);
					router.push('/paymentsuccess');

					$toast.success('Payment successfully completed!', {
						position: 'top-right',
					});

					spinnerOpen.value = false;
				}, 2000);
			})
			.catch((error) => {
				$toast.error(error.message, { position: 'top-right' });
				console.log(error);
			});
	};
</script>

<template>
	<form
		@submit="submitHandler"
		class="min-w-screen min-h-screen relative bg-gray-200 flex items-center justify-center px-5 pb-10 pt-12"
	>
		<div
			v-if="spinnerOpen"
			class="absolute bg-gray-50 opacity-90 w-full h-full z-20"
		>
			<Spinner class="absolute right-1/2 top-1/2"></Spinner>
		</div>

		<div
			class="w-full mx-auto rounded-lg bg-white shadow-lg p-5 text-gray-700"
			style="max-width: 600px"
		>
			<div class="w-full pt-1 pb-5">
				<div
					class="bg-indigo-500 text-white overflow-hidden rounded-full w-16 h-16 -mt-14 mx-auto shadow-lg flex justify-center items-center"
				>
					<font-awesome-icon class="fa-2x" icon="fa-solid fa-money-check" />
				</div>
				<div class="flex flex-start justify-start">
					<button
						class="inline-block hover:scale-105 font-bold py-2 rounded"
						@click="goBack"
					>
						<font-awesome-icon style="" icon="fa-solid fa-circle-arrow-left" />
						Back
					</button>
				</div>
			</div>
			<div class="mb-4">
				<h1 class="text-center font-bold text-xl uppercase">Payment info</h1>
			</div>

			<div class="mb-3">
				<label class="font-bold text-sm mb-2 ml-1">Your name</label>
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
						v-if="!emailValid && emailValue.length > 3"
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
						maxlength="19"
						required
						onkeypress="return /^[0-9]*$/i.test(event.key)"
						@input="updateCardValue"
					/>
					<p
						class="text-red-400/100 px-3"
						v-if="!creditCardValid && cardNumber.length > 0"
					>
						Please enter valid card number
					</p>
				</div>
			</div>
			<div class="mb-3 -mx-2 flex items-end">
				<div class="px-2 w-1/2">
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
						<option value="2023">2023</option>
						<option value="2024">2024</option>
						<option value="2025">2025</option>
						<option value="2026">2026</option>
						<option value="2027">2027</option>
						<option value="2028">2028</option>
						<option value="2029">2029</option>
						<option value="2030">2030</option>
						<option value="2031">2031</option>
						<option value="2032">2032</option>
					</select>
				</div>
			</div>
			<p
				class="text-red-400/100 px-3"
				v-if="!dateValid && creditCardExpYear.length > 0"
			>
				Please enter valid date
			</p>
			<div class="mb-6">
				<label class="font-bold text-sm mb-2 ml-1">Security code</label>

				<div>
					<input
						class="w-32 px-3 py-2 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
						placeholder="000"
						type="text"
						required
						maxlength="4"
						onkeypress="return /^[0-9]*$/i.test(event.key)"
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
				<div class="flex mb-2 flex-col justify-center">
					<h1 class="mr-2 text-xs font-bold">TOTAL PRICE</h1>
					<h1>
						<strong class="text-2xl font-bold"
							>₺{{ calculateTotalPrice }}
						</strong>
					</h1>
				</div>
				<button
					type="submit"
					@click="submitHandler"
					class="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
				>
					<i class="mdi mdi-lock-outline mr-1"></i> PAY NOW
				</button>

				<p class="text-left pt-4 text-xs opacity-50">
					By making a payment, you are deemed to have accepted
					<strong class="cursor-pointer"
						><a
							href="https://www.derslig.com/kullanim-kosullari"
							target="_blank"
							>Terms of Use</a
						>
					</strong>
					and
					<strong class="cursor-pointer" target="_blank"
						><a href="https://www.derslig.com/gizlilik-sozlesmesi"
							>Privacy Policy</a
						>
					</strong>
				</p>
			</div>
		</div>
	</form>
</template>

<style scoped></style>
