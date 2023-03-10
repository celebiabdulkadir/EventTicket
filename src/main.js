import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './style.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'vue-select/dist/vue-select.css';

import VueSelect from 'vue-select';

library.add(fas);

const app = createApp(App);

app.use(router);
app.use(store);
app.component('v-select', VueSelect);

app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
