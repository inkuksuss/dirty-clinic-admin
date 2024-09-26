<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useStore } from '@/stores/store';
import ClinicTopBar from '@/components/common/ClinicTopbar.vue';
import { type CommonCodeType, PopupType, ReservationState, type SelectType } from '@/utils/types';
import moment from 'moment';
import ClinicInput from '@/components/common/ClinicInput.vue';
import ClinicTextArea from '@/components/common/ClinicTextArea.vue';
import ClinicDate from '@/components/common/ClinicDate.vue';
import ClinicSelect from '@/components/common/ClinicSelect.vue';
import { getApiInstance } from '@/utils/api';

export default defineComponent({
    components: { ClinicSelect, ClinicDate, ClinicTextArea, ClinicInput, ClinicTopBar },
    setup() {
        const store = useStore();
        const serviceSelectList = ref<Array<SelectType>>([]);
        const structureSelectList = ref<Array<SelectType>>([]);
        const buildingSelectList = ref<Array<SelectType>>([]);
        const expansionSelectList = ref<Array<SelectType>>([
            {
                name: '네',
                value: 'Y'
            },
            { name: '아니요', value: 'N' }
        ]);

        const serviceId = ref<string>('');
        const structureId = ref<string>('');
        const buildingId = ref<string>('');
        const footage = ref<string>();
        const toiletCount = ref<string>();
        const verandaCount = ref<string>();
        const reservationAdminMemo = ref<string>();
        const serviceAdminMemo = ref<string>();
        const paymentAdminMemo = ref<string>();

        const expansion = ref<string>('');
        const username = ref<string>();
        const phoneNumber = ref<string>();
        const targetDate = ref<Date>();
        const targetTime = ref<string>();
        const address = ref<string>();

        const handleClickSave = () => {
            if (!username.value || username.value?.trim() === '') {
                window.alert('예약자명을 입력해주세요.');
                return;
            }

            if (!phoneNumber.value || phoneNumber.value?.trim() === '') {
                window.alert('연락처를 입력해주세요.');
                return;
            }

            if (!address.value || address.value?.trim() === '') {
                window.alert('주소를 입력해주세요.');
                return;
            }

            if (!targetDate.value) {
                window.alert('예약 날짜를 입력해주세요');
                return;
            }

            if (!targetTime.value || targetTime.value?.trim() === '') {
                window.alert('예약 시간을 입력해주세요.');
                return;
            }

            if (!serviceId.value || serviceId.value.trim() === '') {
                window.alert('클리닉 서비스를 입력해주세요.');
                return;
            }

            if (!buildingId.value || buildingId.value.trim() === '') {
                window.alert('주거형태를 입력해주세요.');
                return;
            }

            if (!structureId.value || structureId.value.trim() === '') {
                window.alert('구조를 입력해주세요.');
                return;
            }

            if (!footage.value || footage.value?.trim() === '') {
                window.alert('공급면적을 입력해주세요.');
                return;
            }

            if (!Number.isInteger(parseFloat(footage.value))) {
                window.alert('공급면적은 정수만 가능합니다.');
                return;
            }

            if (!toiletCount.value || toiletCount.value?.trim() === '') {
                window.alert('화장실 수를 입력해주세요.');
                return;
            }

            if (!Number.isInteger(parseFloat(toiletCount.value))) {
                window.alert('화장실 수는 정수만 가능합니다.');
                return;
            }

            if (!expansion.value || expansion.value.trim() === '') {
                window.alert('거실 베란다를 입력해주세요.');
                return;
            }

            if (!verandaCount.value || verandaCount.value?.trim() === '') {
                window.alert('베란다 수를 입력해주세요.');
                return;
            }

            if (!Number.isInteger(parseFloat(verandaCount.value))) {
                window.alert('베란다 수는 정수만 가능합니다.');
                return;
            }

            const data = {
                username: username.value,
                phoneNumber: phoneNumber.value,
                address: address.value,
                targetDate: targetDate.value,
                targetTime: targetTime.value,
                reservationAdminMemo: reservationAdminMemo.value,
                serviceId: serviceId.value,
                buildingId: buildingId.value,
                structureId: structureId.value,
                footage: footage.value,
                toiletCount: toiletCount.value,
                expansion: expansion.value,
                verandaCount: verandaCount.value,
                serviceAdminMemo: serviceAdminMemo.value
            };
            getApiInstance()
                .post(`/admin/reservation/add`, data)
                .then((res) => {
                    console.log(res);
                    if (res.data.code === 0) {
                        window.alert('저장되었습니다.');
                    } else {
                        window.alert(res.data.message);
                    }
                })
                .catch((e) => console.log(e));
        };

        const handleChangeUsername = (v: string | undefined) => {
            username.value = v;
        };

        const handleChangePhoneNumber = (v: string | undefined) => {
            phoneNumber.value = v;
        };

        const handleChangeAddress = (v: string | undefined) => {
            address.value = v;
        };

        const handleChangeFootage = (v: string | undefined) => {
            if (v) footage.value = v;
        };

        const handleChangeToiletCount = (v: string | undefined) => {
            if (v) toiletCount.value = v;
        };

        const handleChangeTime = (v: string | undefined) => {
            targetTime.value = v;
        };

        const handleChangeVerandaCount = (v: string | undefined) => {
            if (v) verandaCount.value = v;
        };

        const handleChangeReservationDate = (date: Date) => {
            targetDate.value = date;
        };

        const handleChangeReservationMemo = (v: string | undefined) => {
            reservationAdminMemo.value = v;
        };

        const handleChangeServiceMemo = (v: string | undefined) => {
            serviceAdminMemo.value = v;
        };

        const handleChangePaymentMemo = (v: string | undefined) => {
            paymentAdminMemo.value = v;
        };

        const handleOpenPopup = () => {
            store.setOpenPopup(PopupType.RESERVATION_PAYMENT);
        };

        const setSelectService = (v: string | undefined) => {
            if (v) serviceId.value = v;
        };

        const setSelectStructure = (v: string | undefined) => {
            if (v) structureId.value = v;
        };

        const setSelectBuilding = (v: string | undefined) => {
            if (v) buildingId.value = v;
        };

        const setSelectExpansion = (v: string | undefined) => {
            if (v) expansion.value = v;
        };

        onMounted(async () => {
            try {
                const serviceRes = await getApiInstance().get('/common/summary?type=service_type');
                if (serviceRes.data.code === 0) {
                    serviceSelectList.value = serviceRes.data.data.map((v: CommonCodeType) => {
                        return { name: v.name, value: v.id.toString() };
                    });
                }

                const structureRes = await getApiInstance().get(
                    '/common/summary?type=structure_type'
                );
                if (structureRes.data.code === 0) {
                    structureSelectList.value = structureRes.data.data.map((v: CommonCodeType) => {
                        return { name: v.name, value: v.id.toString() };
                    });
                }
                const buildingRes = await getApiInstance().get(
                    '/common/summary?type=building_type'
                );
                if (buildingRes.data.code === 0) {
                    buildingSelectList.value = buildingRes.data.data.map((v: CommonCodeType) => {
                        return { name: v.name, value: v.id.toString() };
                    });
                }
            } catch (e) {
                console.error(e);
            }
        });

        return {
            serviceId,
            buildingId,
            structureId,
            serviceSelectList,
            structureSelectList,
            buildingSelectList,
            expansionSelectList,
            reservationAdminMemo,
            serviceAdminMemo,
            paymentAdminMemo,
            ReservationState,
            footage,
            toiletCount,
            verandaCount,
            targetTime,
            expansion,
            username,
            phoneNumber,
            targetDate,
            address,
            setSelectService,
            setSelectStructure,
            setSelectBuilding,
            setSelectExpansion,
            moment,
            handleChangeUsername,
            handleChangePhoneNumber,
            handleChangeAddress,
            handleChangeTime,
            handleChangeToiletCount,
            handleChangeVerandaCount,
            handleChangeFootage,
            handleChangeReservationMemo,
            handleChangeServiceMemo,
            handleChangePaymentMemo,
            handleClickSave,
            handleChangeReservationDate,
            handleOpenPopup
        };
    }
});
</script>

<template>
    <clinic-top-bar></clinic-top-bar>
    <div
        class="reservation-detail-wrapper bg-[--bg-color] ml-[22%] px-[20px] pb-[20px] h-max flex items-center flex-col"
    >
        <div class="reservation-contents max-w-[900px] w-full rounded-[8px] h-max">
            <div
                class="title-wrapper w-full h-[80px] px-[20px] flex justify-end items-center bg-[--color-white] rounded-[8px]"
            >
                <div
                    class="w-[62px] h-[40px] mr-[10px] border-[1px] bg-[--color-main-blue] rounded-[4px] flex-center text-[14px] font-[600] text-[--color-white]"
                    @click="handleClickSave"
                >
                    저장
                </div>
            </div>

            <div
                class="member-wrapper bg-[--color-white] h-max mt-[20px] rounded-[8px] px-[30px] py-[30px]"
            >
                <div
                    class="text-[22px] font-[700] leading-[26px] text-[--color-text-black] mb-[10px]"
                >
                    예약자 정보
                </div>
                <div class="grid grid-cols-2 gap-x-[40px]">
                    <clinic-input
                        label="예약자명"
                        place-holder="예약자명을 입력해주세요."
                        :value="username"
                        :change-handler="handleChangeUsername"
                    ></clinic-input>
                    <clinic-input
                        label="연락처"
                        place-holder="연락처를 입력해주세요."
                        :value="phoneNumber"
                        :change-handler="handleChangePhoneNumber"
                    ></clinic-input>

                    <clinic-date
                        label="서비스 예약 날짜"
                        :value="targetDate"
                        :change-handler="handleChangeReservationDate"
                    ></clinic-date>
                </div>
                <div class="h-[155px]">
                    <clinic-text-area
                        label="예약자 관리자 메모"
                        place-holder="예약자의 특이사항을 메모로 남기세요."
                        :value="reservationAdminMemo"
                        :change-handler="handleChangeReservationMemo"
                    ></clinic-text-area>
                </div>
            </div>

            <div
                class="service-wrapper bg-[--color-white] h-max mt-[20px] rounded-[8px] px-[30px] py-[30px]"
            >
                <div
                    class="text-[22px] font-[700] leading-[26px] text-[--color-text-black] mb-[10px]"
                >
                    예약자 서비스 정보
                </div>
                <div class="grid grid-cols-2 gap-x-[40px]">
                    <clinic-select
                        label="클리닉 서비스"
                        :selected-value="serviceId"
                        :select-handler="setSelectService"
                        :select-list="serviceSelectList"
                    ></clinic-select>
                    <clinic-select
                        label="주거형태"
                        :selected-value="buildingId"
                        :select-handler="setSelectBuilding"
                        :select-list="buildingSelectList"
                    ></clinic-select>
                    <clinic-input
                        label="공급면적"
                        type="number"
                        :value="footage"
                        :change-handler="handleChangeFootage"
                    ></clinic-input>
                    <clinic-select
                        label="구조"
                        :selected-value="structureId"
                        :select-handler="setSelectStructure"
                        :select-list="structureSelectList"
                    ></clinic-select>
                    <clinic-input
                        label="화장실 수"
                        type="number"
                        :value="toiletCount"
                        :change-handler="handleChangeToiletCount"
                    ></clinic-input>
                    <clinic-select
                        label="거실 베란다"
                        :selected-value="expansion"
                        :select-handler="setSelectExpansion"
                        :select-list="expansionSelectList"
                    ></clinic-select>
                    <clinic-input
                        label="베란다 수"
                        type="number"
                        :value="verandaCount"
                        :change-handler="handleChangeVerandaCount"
                    ></clinic-input>
                    <clinic-input
                        label="서비스 예약 시간"
                        place-holder="예약 시간을 입력해주세요."
                        :value="targetTime"
                        :change-handler="handleChangeTime"
                    ></clinic-input>
                </div>
                <div class="h-[155px]">
                    <clinic-text-area
                        label="주소"
                        place-holder="주소를 입력해주세요."
                        :value="address"
                        :change-handler="handleChangeAddress"
                    ></clinic-text-area>
                </div>
                <div class="h-[155px]">
                    <clinic-text-area
                        label="서비스 관리자 메모"
                        place-holder="서비스 장소에 대한 특이사항, 확인사항을 메모로 남기세요."
                        :value="serviceAdminMemo"
                        :change-handler="handleChangeServiceMemo"
                    ></clinic-text-area>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
