<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/stores/store';

export default defineComponent({
    components: {},
    setup() {
        const store = useStore();

        return {};
    }
});
</script>

<template>
  <clinic-top-bar></clinic-top-bar>
    <div>리뷰관리</div>
</template>

<style scoped></style>
