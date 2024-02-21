<script lang="ts">
import { ref, type PropType, defineComponent, computed } from 'vue';

export default defineComponent({
    name: 'ClinicTextArea',
    props: {
        label: { type: String as PropType<string>, required: false },
        value: { type: String as PropType<string | undefined> },
        placeHolder: { type: String as PropType<string>, required: false },
        length: { type: Number as PropType<number>, required: false },
        readOnly: { type: Boolean as PropType<boolean>, default: false },
        changeHandler: {
            type: Function as PropType<(v: string | undefined) => void>,
            default: () => {
                return;
            }
        },
        enterHandler: {
            type: Function as PropType<(v: string | undefined) => void>,
            default: (v: string | undefined) => {
                return;
            }
        }
    },
    setup(props) {
        const inputValue = ref<string | undefined>();
        const compLabel = computed(() => props.label);

        const handleChangeInput = (e: Event): void => {
            const newValue = (e.target as any).value;
            props.changeHandler(newValue);
            inputValue.value = newValue;
        };

        const handleKeyDown = (e: KeyboardEvent): void => {
            if (e.key === 'Enter') {
                if (e.isComposing || e.keyCode === 229) return;
                props.enterHandler(inputValue.value);
            }
        };

        return {
            compLabel,
            handleChangeInput,
            handleKeyDown
        };
    }
});
</script>

<template>
    <div class="text-area-wrapper w-full h-full flex flex-col pt-[20px]">
        <div
            v-if="compLabel"
            class="text-[14px] font-[900] leading-[24px] text-[--color-text-black] mb-[10px]"
            >{{ compLabel }}</div
        >
        <textarea
            class="w-full h-full border-[1.5px] border-[&#45;&#45;color-border-blue] py-[15px] px-[15px] rounded-[8px]"
            :class="readOnly ? 'bg-[--bg-color] border-0' : ''"
            :value="value"
            :placeholder="placeHolder"
            :maxlength="length"
            @input="handleChangeInput"
            @keydown="handleKeyDown"
            :readonly="readOnly"
        >
        </textarea>
    </div>
</template>
