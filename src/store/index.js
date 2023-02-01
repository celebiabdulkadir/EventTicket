import { createStore } from 'vuex';

const store = createStore({
	state: {
		eventId: '',
		eventCategoryId: '',
		eventCategoryName: '',
		seats: [],
		customer_name: '',
		customer_surname: '',
		customer_email: '',
		cc_number: '',
		cc_exp_month: '',
		cc_exp_year: '',
		cc_exp_cvv: '',
		price: '',
		totalPrice: '',
	},
	mutations: {
		update(state, props) {
			state[props[0]] = props[1];
		},
		clear(state) {
			state = {
				eventId: '',
				eventCategoryId: '',
				eventCategoryName: '',
				seats: [],
				customer_name: '',
				customer_surname: '',
				customer_email: '',
				cc_number: '',
				cc_exp_month: '',
				cc_exp_year: '',
				cc_exp_cvv: '',
				price: '',
				totalPrice: '',
			};
		},
	},
});

export default store;
