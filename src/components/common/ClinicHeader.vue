<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import vClickOutside from 'click-outside-vue3';
import { useStore } from '@/stores/store';

type Category = {
    title: string;
    isSelect: boolean;
    link: string;
};

export default defineComponent({
    name: 'ClinicHeader',
    directives: {
        clickOutside: vClickOutside.directive
    },
    setup() {
        const router = useRouter();
        const route = useRoute();

        const categoryList = ref<Array<Category>>([
            { title: '예약 관리', isSelect: false, link: '/reservation' },
            { title: '예약금 관리', isSelect: false, link: '/amount' },
            { title: '후기 관리', isSelect: false, link: '/review' }
        ]);

        const handleClick = (category: Category) => {
            categoryList.value.forEach((v) => (v.isSelect = false));
            category.isSelect = true;
            router.push(category.link);
        };

        const handleClickLogo = () => {
            router.push('/');
        };

        const updateSelect = () => {
            categoryList.value.forEach((category) => (category.isSelect = false));

            const findCategory = categoryList.value.find(
                (v) => window.location.href.indexOf(v.link) > -1
            );
            if (findCategory) {
                findCategory.isSelect = true;
            }
        };

        onMounted(() => {
            updateSelect();
        });

        watch(route, () => {
            updateSelect();
        });

        return {
            categoryList,
            handleClick,
            handleClickLogo
        };
    }
});
</script>

<template>
    <header class="header-wrapper bg-[--color-white] fixed left-0 top-0 w-[22%] h-screen">
        <div
            class="logo-wrapper mt-[20px] ml-[20px] mb-[40px] w-[133px] h-[42px]"
            @click="handleClickLogo"
        >
            <img class="w-full h-full" src="@/assets/images/common/header_logo@1x.jpg" />
        </div>
        <div class="header-contents px-[20px]">
            <div
                v-for="(category, idx) in categoryList"
                :key="idx"
                @click="() => handleClick(category)"
                class="header-content w-full h-[50px] mb-[10px] flex items-center rounded-[4px]"
                :class="category.isSelect ? 'active' : ''"
            >
                <div v-if="idx === 0" class="img-wrapper w-[25px] h-[25px] mx-[10px]">
                    <img
                        v-if="category.isSelect"
                        class="w-full h-full"
                        src="@/assets/images/icons/server_active@1x.svg"
                    />
                    <img v-else class="w-full h-full" src="@/assets/images/icons/server@1x.svg" />
                </div>
                <div v-else-if="idx === 1" class="img-wrapper w-[25px] h-[25px] mx-[10px]">
                    <img
                        v-if="category.isSelect"
                        class="w-full h-full"
                        src="@/assets/images/icons/credit_card_active@1x.svg"
                    />
                    <img
                        v-else
                        class="w-full h-full"
                        src="@/assets/images/icons/credit_card@1x.svg"
                    />
                </div>
                <div v-else class="img-wrapper w-[25px] h-[25px] mx-[10px]">
                    <img
                        v-if="category.isSelect"
                        class="w-full h-full"
                        src="@/assets/images/icons/chart_bar_active@1x.svg"
                    />
                    <img
                        v-else
                        class="w-full h-full"
                        src="@/assets/images/icons/chart_bar@1x.svg"
                    />
                </div>
                <div
                    class="name text-[16px] font-[600] leading-[19px] text-[--color-text-white-gray]"
                    :class="category.isSelect ? 'active' : ''"
                >
                    {{ category.title }}
                </div>
            </div>
        </div>
    </header>
</template>
