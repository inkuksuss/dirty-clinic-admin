<script lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import ClinicHeader from '@/components/common/ClinicHeader.vue';
import { useStore } from '@/stores/store';
import ClinicPopup from '@/components/common/ClinicPopup.vue';

export default defineComponent({
    name: 'App',
    components: { ClinicPopup, ClinicHeader },
    setup() {
        const store = useStore();
        const route = useRoute();
        const compOpenPopup = computed(() => store.openPopup);
        const openHeader = ref<boolean>(false);

        const handleResize = () => {
            const clientWidth = document.documentElement.clientWidth;
            store.setIsMobile(clientWidth < 768);
            store.setWidth(clientWidth);
        };

        onMounted(() => {
            window.addEventListener('resize', handleResize);
            openHeader.value = route.fullPath !== '/';
        });

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });

        watch(route, () => {
            openHeader.value = route.fullPath !== '/';
        });

        return {
            RouterLink,
            compOpenPopup,
            openHeader,
            RouterView
        };
    }
});
</script>

<template>
    <clinic-header v-if="openHeader"></clinic-header>
    <router-view />
    <clinic-popup v-if="compOpenPopup !== null"></clinic-popup>
</template>

<style scoped></style>
