<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from '@/stores/store';
import { PopupType } from '@/utils/types';

export default defineComponent({
    components: {},
    setup() {
        const store = useStore();
        const handleClickBtn = () => {
            store.setOpenPopup(PopupType.PAYMENT);
        };

        return {
            handleClickBtn
        };
    }
});
</script>

<template>
    <main class="main-wrapper"></main>
</template>

<style scoped></style>
