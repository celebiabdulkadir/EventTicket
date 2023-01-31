import { createRouter, createWebHistory } from 'vue-router';
import EventsView from '../views/EventsView.vue';
import PaymentSuccessView from '../views/PaymentSuccessView.vue';
import NotFoundPage from '../views/NotFoundPage.vue';
import EventDetailView from '../views/EventDetailView.vue';
import store from '../store';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: EventsView,
		},
		{
			path: '/event-detail',
			name: 'event-detail',
			component: EventDetailView,
		},
		{
			path: '/event-detail/event-seat-plan',
			name: 'seatPlan',
			component: () => import('../views/SeatPlanView.vue'),
		},
		{
			path: '/payment',
			name: 'payment',
			component: () => import('../views/PaymentView.vue'),
		},
		{
			path: '/paymentsuccess',
			name: 'paymentsuccess',
			component: PaymentSuccessView,
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'NotFound',
			component: NotFoundPage,
		},
	],
});

router.beforeEach((to, from) => {
	if (to.path === '/payment' && store.state.seats.length < 1) {
		return router.push('/');
	}

	if (to.path === '/paymentsuccess' && store.state.cc_number.length < 1) {
		return router.push('/');
	}
	if (to.name === 'event-detail' && store.state.eventId == '') {
		return router.push('/');
	}

	if (
		to.path === '/event-detail/event-seat-plan' &&
		store.state.eventCategoryId == ''
	) {
		return router.push('/');
	}
});

export default router;
