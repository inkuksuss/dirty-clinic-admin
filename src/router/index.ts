import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/HomeView.vue')
        },
        {
            path: '/reservation',
            name: 'reservation',
            component: () => import('@/views/ReservationView.vue')
        },
        {
            path: '/reservation/:id',
            name: 'reservationDetail',
            component: () => import('@/views/ReservationDetailView.vue')
        },
        {
            path: '/sale',
            name: 'sale',
            component: () => import('@/views/SaleView.vue')
        },
        {
            path: '/review',
            name: 'review',
            component: () => import('@/views/ReviewView.vue')
        }
    ]
});

export default router;
