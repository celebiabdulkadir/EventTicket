import axios from 'axios';

axios.defaults.baseURL =
	' https://d706d748-0586-4c2b-9d30-288f5d3b0630.mock.pstmn.io';
class Service {
	getEventDetails() {
		return axios.get('/events');
	}
	getEventDetailPage(eventId) {
		return axios.get(`/events/${eventId}`);
	}
	getSeatPlan(eventId, eventCategoryId) {
		return axios.get(`/seat-plans/${eventId}/${eventCategoryId}`);
	}

	completePayment(save) {
		return axios.post('/payment', save);
	}
}
export default new Service();
