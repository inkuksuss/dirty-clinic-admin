<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { useStore } from '@/stores/store';
import { PopupType } from '@/utils/types';
import ClinicInput from '@/components/common/ClinicInput.vue';
import { getApiInstance } from '@/utils/api';
import { saveLocalStorage } from '@/utils/common';
import { CONSTANTS } from '../../constants';
import router from '@/router';

export default defineComponent({
    components: { ClinicInput },
    setup() {
        const store = useStore();
        const idValue = ref<string | undefined>();
        const pwValue = ref<string | undefined>();

        const handleChangeId = (v: string | undefined) => {
            idValue.value = v;
        };

        const handleChangePw = (v: string | undefined) => {
            pwValue.value = v;
        };

        const handleClickLoginBtn = () => {
            // getApiInstance().post("/admin/member/test").then(res =>console.log(res));
            // getApiInstance().post("/admin/member/pw").then(res =>console.log(res));
            getApiInstance()
                .post('/admin/member/login-process', {
                    username: idValue.value,
                    password: pwValue.value
                })
                .then((res) => {
                    console.log(res);
                    if (res.data.code === 0) {
                        saveLocalStorage(CONSTANTS.KEY.UT, res.data.data);
                        router.push('/reservation');
                    }
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
    <main class="main-wrapper">
        <div class="ml-[22%] flex-center h-full">
            <div class="login-wrapper w-[400px]">
                <clinic-input
                    :value="idValue"
                    label="ID"
                    :change-handler="handleChangeId"
                ></clinic-input>
                <clinic-input
                    :value="pwValue"
                    label="PW"
                    :change-handler="handleChangePw"
                ></clinic-input>
                <div @click="handleClickLoginBtn">로그인</div>
            </div>
        </div>
    </main>
</template>

<style scoped></style>
