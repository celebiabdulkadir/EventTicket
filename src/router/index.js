import { createRouter, createWebHistory } from 'vue-router';
import EventsView from '../views/EventsView.vue';
import PaymentSuccessView from '../views/PaymentSuccessView.vue';
import NotFoundPage from '../views/NotFoundPage.vue';
import EventDetailView from '../views/EventDetailView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: EventsView,
		},
		{
			path: '/event-detail/:id',
			name: 'event-detail',
			props: { default: true, sidebar: false },
			component: EventDetailView,
		},
		{
			path: '/event-detail/:eventId/:eventCategoryId',
			props: { default: true, sidebar: false },
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

export default router;
