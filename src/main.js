import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './style.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
// import './assets/main.css';

// const $toast = useToast();
// let instance = $toast.success('You did it!');
library.add(fas);

const app = createApp(App);

app.use(router);
app.use(store);

app.component('font-awesome-icon', FontAwesomeIcon).mount('#app');
