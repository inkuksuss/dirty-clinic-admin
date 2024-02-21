<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import vClickOutside from 'click-outside-vue3';
import { useStore } from '@/stores/store';

export default defineComponent({
    name: 'ClinicTopBar',
    directives: {
        clickOutside: vClickOutside.directive
    },
    setup() {
        const store = useStore();

        onMounted(() => {

        });

        onUnmounted(() => {});

        return {

        };
    }
});
</script>

<template>
    <div class="bg-[--bg-color] ml-[22%] h-[72px]">로그아웃</div>
</template>
