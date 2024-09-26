<script lang="ts">
import { ref, type PropType, defineComponent, computed } from 'vue';
import Timepicker from 'vue3-timepicker';

export default defineComponent({
    name: 'ClinicTime',
    components: { Timepicker },
    props: {
        label: { type: String as PropType<string>, required: false },
        value: { type: String as PropType<string> },
        readOnly: { type: Boolean as PropType<boolean>, default: false },
        changeHandler: {
            type: Function as PropType<(v: string) => void>,
            default: () => {
                return;
            }
        }
    },
    setup(props) {
        const compLabel = computed(() => props.label);
        const date = ref<string>(props.value ? props.value : '');

        const handleChangeTime = (time: string) => {
            if (props.changeHandler) props.changeHandler(time);
        };

        return {
            date,
            compLabel,
            handleChangeTime
        };
    }
});
</script>

<template>
    <div class="time-wrapper w-full flex flex-col pt-[20px]">
        <div
            v-if="compLabel"
            class="text-[14px] font-[900] leading-[24px] text-[--color-text-black] mb-[10px]"
        >
            {{ compLabel }}
        </div>
        <div class="relative h-full flex items-center h-[50px]">
            <Timepicker
                class="w-full h-full border-[1.5px] py-[7px] border-[--color-border-blue] px-[20px] h-[50px] rounded-[8px]"
                :modelValue="date"
                :minuteInterval="30"
                :closeOnComplete="true"
                @update:modelValue="handleChangeTime"
            >
            </Timepicker>
        </div>
    </div>
</template>

<style>
.time-wrapper input {
    width: 100% !important;
    border: none !important;
    height: 100% !important;
}
</style>
