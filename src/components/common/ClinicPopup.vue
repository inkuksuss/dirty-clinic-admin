<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '@/stores/store';
import { PopupType } from '@/utils/types';
import PaymentPopup from '@/components/popup/PaymentPopup.vue';

type FooterCategory = {
    title: string;
};

export default defineComponent({
    name: 'ClinicPopup',
    components: { PaymentPopup },
    setup() {
        const store = useStore();
        const compPopupType = computed(() => store.openPopup);
        const handleClickBg = () => {
            store.setOpenPopup(null);
        };

        const handleClickClose = () => {
            store.setOpenPopup(null);
        };

        return {
            compPopupType,
            PopupType,
            handleClickBg,
            handleClickClose
        };
    }
});
</script>

<template>
    <div class="popup-wrapper w-screen h-screen fixed top-0 left-0 z-40 flex-center">
        <div
            class="popup-bg flex-center bg-black opacity-55 w-full h-full"
            @click="handleClickBg"
        ></div>
        <payment-popup v-if="compPopupType === PopupType.RESERVATION_PAYMENT"></payment-popup>
    </div>
</template>
