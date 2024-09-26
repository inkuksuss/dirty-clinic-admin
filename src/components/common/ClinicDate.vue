<script lang="ts">
import { ref, type PropType, defineComponent, computed } from 'vue';
import { ko } from 'date-fns/locale';
import Datepicker from 'vue3-datepicker';

export default defineComponent({
    name: 'ClinicDate',
    components: { Datepicker },
    props: {
        label: { type: String as PropType<string>, required: false },
        value: { type: Date as PropType<Date> },
        // maxValue: { type: Date as PropType<Date>, required: false },
        readOnly: { type: Boolean as PropType<boolean>, default: false },
        changeHandler: {
            type: Function as PropType<(v: Date) => void>,
            default: () => {
                return;
            }
        }
    },
    setup(props) {
        const compLabel = computed(() => props.label);
        const date = ref<Date>(props.value ? props.value : new Date());

        const compLocale = computed(() => ko);

        const handleChangeDate = (date: any) => {
            if (props.changeHandler) props.changeHandler(date);
        };

        return {
            date,
            compLocale,
            compLabel,
            handleChangeDate
        };
    }
});
</script>

<template>
    <div class="date-wrapper w-full h-full flex flex-col pt-[20px]">
        <div
            v-if="compLabel"
            class="text-[14px] font-[900] leading-[24px] text-[--color-text-black] mb-[10px]"
        >
            {{ compLabel }}
        </div>
        <div class="relative">
            <Datepicker
                class="w-full h-[50px] border-[1.5px] border-[--color-border-blue] py-[17px] px-[20px] rounded-[8px]"
                v-model="date"
                :locale="compLocale"
                @update:modelValue="handleChangeDate"
            ></Datepicker>
            <img
                class="absolute top-[17px] right-[20px] w-[18px] h-[18px]"
                src="@/assets/images/icons/calendar@1x.svg"
            />
        </div>
    </div>
</template>
