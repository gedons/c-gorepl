import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Index.vue';

const routes = [
  { path: '/', component: Home }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;