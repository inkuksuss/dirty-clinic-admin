<script lang="ts">
import { defineComponent, ref } from 'vue';
import ClinicInput from '@/components/common/ClinicInput.vue';
import { getApiInstance } from '@/utils/api';
import { saveLocalStorage } from '@/utils/common';
import { CONSTANTS } from '../../constants';
import router from '@/router';

export default defineComponent({
    components: { ClinicInput },
    setup() {
        const idValue = ref<string | undefined>();
        const pwValue = ref<string | undefined>();

        const handleChangeId = (v: string | undefined) => {
            idValue.value = v;
        };

        const handleChangePw = (v: string | undefined) => {
            pwValue.value = v;
        };

        const handleClickLoginBtn = () => {
            getApiInstance()
                .post('/admin/member/login-process', {
                    username: idValue.value,
                    password: pwValue.value
                })
                .then((res) => {
                    if (res.data.code === 0) {
                        saveLocalStorage(CONSTANTS.KEY.UT, res.data.data);
                        router.push('/reservation');
                    } else {
                        window.alert('아이디 혹은 비밀번호를 확인해주세요.');
                    }
                })
                .catch((e) => {
                    window.alert('아이디 혹은 비밀번호를 확인해주세요.');
                });
        };

        return {
            idValue,
            pwValue,
            handleChangeId,
            handleChangePw,
            handleClickLoginBtn
        };
    }
});
</script>

<template>
    <main class="main-wrapper w-screen h-screen flex justify-center">
        <div
            class="login-wrapper w-[400px] h-max flex justify-start flex-col items-center mt-[150px]"
        >
            <div class="w-[250px] h-[80px] mb-[35px]">
                <img class="w-full h-full" src="@/assets/images/common/home_logo@1x.png" />
            </div>
            <clinic-input
                class="pt-[15px]"
                :value="idValue"
                label="아이디"
                :change-handler="handleChangeId"
            ></clinic-input>
            <clinic-input
                class="pt-[15px]"
                :value="pwValue"
                label="비밀번호"
                :change-handler="handleChangePw"
            ></clinic-input>
            <div
                class="mt-[35px] w-full h-[60px] bg-[--color-main-blue] rounded-[8px] flex-center"
                @click="handleClickLoginBtn"
            >
                <span class="text-[--color-white] text-[16px] leading-[24px]">로그인</span>
            </div>
        </div>
    </main>
</template>

<style scoped></style>
