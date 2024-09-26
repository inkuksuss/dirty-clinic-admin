import './assets/scss/app.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import vClickOutside from 'click-outside-vue3';

import App from './App.vue';
import router from './router';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vClickOutside);
app.component('QuillEditor', QuillEditor);

app.mount('#app');
