import { createRouter, createWebHistory } from 'vue-router';
import EventsView from '../views/EventsView.vue';
import PaymentSuccessView from '../views/PaymentSuccessView.vue';
import NotFoundPage from '../views/NotFoundPage.vue';
import EventDetailView from '../views/EventDetailView.vue';
import store from '../store';

const router = createRouter({
	scrollBehavior(to, from, savedPosition) {
		// always scroll to top
		return { top: 0 };
	},
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
	if (
		to.path === '/payment' &&
		(localStorage.getItem('step') ?? store.state.step) < 3
	) {
		return router.push('/');
	}

	if (
		to.path === '/paymentsuccess' &&
		(localStorage.getItem('step') ?? store.state.step) < 4
	) {
		return router.push('/');
	}
	if (
		to.name === 'event-detail' &&
		(localStorage.getItem('step') ?? store.state.step) < 1
	) {
		return router.push('/');
	}

	if (
		to.path === '/event-detail/event-seat-plan' &&
		(localStorage.getItem('step') ?? store.state.step) < 2
	) {
		return router.push('/');
	}
});

export default router;
