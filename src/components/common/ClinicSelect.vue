<script lang="ts">
import { ref, type PropType, defineComponent, computed } from 'vue';
import vClickOutside from 'click-outside-vue3';
import { type SelectType } from '@/utils/types';

export default defineComponent({
    name: 'ClinicSelect',
    props: {
        label: { type: String as PropType<string>, required: false },
        placeHolder: { type: String as PropType<string>, default: '선택해주세요.' },
        selectList: { type: Array as PropType<Array<SelectType>>, required: true },
        selectedValue: { type: String as PropType<string>, required: true },
        selectHandler: {
            type: Function as PropType<(v: string | undefined) => void>,
            default: () => {
                return;
            }
        }
    },
    directives: {
        clickOutside: vClickOutside.directive
    },
    setup(props) {
        const isOpen = ref<boolean>(false);
        const inputList = ref<Array<SelectType>>(props.selectList);
        const selected = ref<string>(props.selectedValue);
        const compLabel = computed(() => props.label);

        const handleClickSelectBox = () => {
            isOpen.value = !isOpen.value;
        };

        const handleSelect = (v: SelectType) => {
            if (props.selectHandler) props.selectHandler(v.value);
            selected.value = v.name;
        };

        const handleClickOut = () => {
            isOpen.value = false;
        };

        return {
            isOpen,
            inputList,
            selected,
            compLabel,
            handleClickSelectBox,
            handleSelect,
            handleClickOut
        };
    }
});
</script>

<template>
    <div class="select-wrapper w-full h-full flex flex-col pt-[20px]">
        <div
            v-if="compLabel"
            class="text-[14px] font-[900] leading-[24px] text-[--color-text-black] mb-[10px]"
        >
            {{ compLabel }}
        </div>
        <div
            class="select-box relative w-full h-[50px] border-[1.5px] border-[--color-border-blue] py-[17px] px-[20px] flex justify-between rounded-[8px] items-center"
            @click="handleClickSelectBox"
            :class="{ active: isOpen }"
            v-click-outside="handleClickOut"
        >
            <span
                v-if="selected === ''"
                class="select-place-holder text-[14px] font-[500] leading-[17px] text-[#919EAB]"
                >{{ placeHolder }}</span
            >
            <span
                v-else
                class="select-place-holder text-[14px] font-[500] leading-[17px] text-[#919EAB]"
                >{{ selected }}</span
            >
            <img
                class="select-arrow arrow w-[20px] h-[20px]"
                src="@/assets/images/icons/arrow_down@1x.svg"
                alt="arrow"
            />
            <transition name="slide-fade" mode="out-in" class="w-full">
                <div
                    v-if="isOpen"
                    class="select-label absolute top-[100%] left-[-1.5px] border-[1.5px] border-[#96C8F6] border-solid bg-[--color-white] z-10 py-[6.5px]"
                >
                    <div
                        v-for="(item, index) in inputList"
                        :key="new Date().getTime() + '_' + index"
                        :value="item.value"
                        class="py-[12.5px] px-[20px]"
                        @click="() => handleSelect(item)"
                    >
                        <span class="text-[14px] font-[500] leading-[17px] text-[#919EAB]">{{
                            item.name
                        }}</span>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
