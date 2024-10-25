<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';
import vClickOutside from 'click-outside-vue3';
import { useStore } from '@/stores/store';
import { removeLocalStorage } from '@/utils/common';
import { CONSTANTS } from '../../../constants';
import router from '@/router';

export default defineComponent({
    name: 'ClinicTopBar',
    directives: {
        clickOutside: vClickOutside.directive
    },
    setup() {
        const store = useStore();

        const handleClickLogout = () => {
            removeLocalStorage(CONSTANTS.KEY.UT);
            router.push("/");
        };

        onMounted(() => {});

        onUnmounted(() => {});

        return {
            handleClickLogout
        };
    }
});
</script>

<template>
    <div class="bg-[--bg-color] ml-[22%] h-[72px] flex justify-end items-center">
        <div class="flex justify-center mr-[30px]" @click="handleClickLogout">
            <img src="@/assets/images/icons/logout.svg" class="mr-[2.5px] w-[24px] h-[24px]" />
            <div class="text-[16px] font-[700]">로그아웃</div>
        </div>
    </div>
</template>
