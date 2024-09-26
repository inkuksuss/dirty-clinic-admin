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
            path: '/amount',
            name: 'reservationAmount',
            component: () => import('@/views/ReservationAmountView.vue')
        },
        {
            path: '/reservation/:id',
            name: 'reservationDetail',
            component: () => import('@/views/ReservationDetailView.vue')
        },
        {
            path: '/add/reservation',
            name: 'addReservation',
            component: () => import('@/views/AddReservationView.vue')
        },
        {
            path: '/review',
            name: 'review',
            component: () => import('@/views/ReviewView.vue')
        },
        {
            path: '/add/review',
            name: 'addReview',
            component: () => import('@/views/AddReviewView.vue')
        },
        {
            path: '/review/:id',
            name: 'reviewDetail',
            component: () => import('@/views/ReviewDetailView.vue')
        }
    ]
});

// router.beforeEach((to, from, next) => {
//     getCookie('');
//     console.log('to = ' + JSON.stringify(to));
//     console.log('from = ' + JSON.stringify(from));
//     console.log('next = ' + JSON.stringify(next));
// });

export default router;
