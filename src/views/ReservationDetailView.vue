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
import { useRoute } from 'vue-router';
import router from '@/router';

export type ReservationDetail = {
    reservationId: string;
    username: string;
    phoneNumber: string;
    targetDate: Date;
    created: Date;
    targetTime: string;
    reservationAdminMemo: string | null;

    serviceId: number;
    buildingId: number | null;
    structureId: number | null;
    footage: number;
    toiletCount: number;
    verandaCount: number;
    expansion: 'Y' | 'N';
    address: string;
    serviceAdminMemo: string | null;

    reservationStatus: string;
    paidAmount: number;
    cancelledAmount: number;
    balanceAmount: number;
    paymentCreated: Date;
    paymentAdminMemo: string | null;
    pgProvider: string;
    cancelledAdminMemo: string | null;
};

export default defineComponent({
    components: { ClinicSelect, ClinicDate, ClinicTextArea, ClinicInput, ClinicTopBar },
    setup() {
        const store = useStore();
        const route = useRoute();

        const reservationDetail = ref<ReservationDetail>();
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
        const targetTime = ref<string>();
        const expansion = ref<string>('');
        const cancelledAdminMemo = ref<string>();

        const openPopup = ref<boolean>(false);
        const openCancelPopup = ref<boolean>(false);

        const handleClickDelete = () => {
            if (window.confirm('정말 삭제하시겠습니까?')) {
                getApiInstance()
                    .post('/admin/reservation/remove', {
                        idList: [route.params.id]
                    })
                    .then((res) => {
                        if (res.data.code === 0) {
                            window.alert('삭제 완료하였습니다.');
                            router.push('/reservation');
                        } else window.alert(res.data.message);
                    })
                    .catch((e) => console.log(e));
            }
        };

        const handleClickSave = () => {
            if (footage.value && !Number.isInteger(parseFloat(footage.value))) {
                window.alert('공급면적은 정수만 가능합니다.');
                return;
            }

            if (toiletCount.value && !Number.isInteger(parseFloat(toiletCount.value))) {
                window.alert('화장실 수는 정수만 가능합니다.');
                return;
            }

            if (verandaCount.value && !Number.isInteger(parseFloat(verandaCount.value))) {
                window.alert('베란다 수는 정수만 가능합니다.');
                return;
            }

            getApiInstance()
                .post(`/admin/reservation/modify`, reservationDetail.value)
                .then((res) => {
                    if (res.data.code === 0) {
                        window.alert('저장되었습니다.');
                        // router.push(`/reservation/${reservationDetail.value?.reservationId}`);
                    } else {
                        window.alert(res.data.message);
                    }
                })
                .catch((e) => console.log(e));
        };

        const handleChangeFootage = (v: string | undefined) => {
            if (reservationDetail.value && v) {
                footage.value = v;
                reservationDetail.value.footage = v as unknown as number;
            }
        };

        const handleChangeToiletCount = (v: string | undefined) => {
            if (reservationDetail.value && v) {
                toiletCount.value = v;
                reservationDetail.value.toiletCount = v as unknown as number;
            }
        };

        const handleChangeTime = (v: string | undefined) => {
            if (reservationDetail.value && v) {
                targetTime.value = v;
                reservationDetail.value.targetTime = v as string;
            }
        };

        const handleChangeVerandaCount = (v: string | undefined) => {
            if (reservationDetail.value && v) {
                verandaCount.value = v;
                reservationDetail.value.verandaCount = v as unknown as number;
            }
        };

        const handleChangeReservationDate = (date: Date) => {
            if (reservationDetail.value) reservationDetail.value.targetDate = date;
        };

        const handleChangeBalanceInput = (e: Event) => {
            const newValue = (e.target as any).value;
            if (reservationDetail.value) reservationDetail.value.balanceAmount = newValue;
        };

        const handleChangeReservationMemo = (v: string | undefined) => {
            if (reservationDetail.value && v) {
                reservationAdminMemo.value = v;
                reservationDetail.value.reservationAdminMemo = v;
            }
        };

        const handleChangeServiceMemo = (v: string | undefined) => {
            if (reservationDetail.value && v) {
                serviceAdminMemo.value = v;
                reservationDetail.value.serviceAdminMemo = v;
            }
        };

        const handleChangePaymentMemo = (v: string | undefined) => {
            if (reservationDetail.value && v) {
                paymentAdminMemo.value = v;
                reservationDetail.value.paymentAdminMemo = v;
            }
        };

        const handleChangeAddress = (v: string | undefined) => {
            if (reservationDetail.value && v) {
                reservationDetail.value.address = v;
            }
        };

        const handleOpenPopup = () => {
            openPopup.value = true;
        };

        const setSelectService = (v: string | undefined) => {
            if (reservationDetail.value && v) {
                serviceId.value = v;
                reservationDetail.value.serviceId = parseInt(v);
            }
        };

        const setSelectStructure = (v: string | undefined) => {
            if (reservationDetail.value && v) {
                structureId.value = v;
                reservationDetail.value.structureId = parseInt(v);
            }
        };

        const setSelectBuilding = (v: string | undefined) => {
            if (reservationDetail.value && v) {
                buildingId.value = v;
                reservationDetail.value.buildingId = parseInt(v);
            }
        };

        const setSelectExpansion = (v: string | undefined) => {
            if (reservationDetail.value && v) {
                expansion.value = v;
                reservationDetail.value.expansion = v as 'Y' | 'N';
            }
        };

        const handleClickPopupClose = () => {
            openPopup.value = false;
        };

        const handleOpenCancelPopup = () => {
            openCancelPopup.value = true;
        };

        const handleClickCancel = () => {
            getApiInstance()
                .post('/admin/reservation/cancel', {
                    id: reservationDetail.value?.reservationId,
                    cancelledAdminMemo: cancelledAdminMemo.value
                })
                .then((res) => {
                    console.log(res);
                    if (res.data.code === 0) {
                        window.alert('취소 완료되었습니다.');
                        openPopup.value = false;
                    } else {
                        window.alert(res.data.message);
                    }
                })
                .catch((e) => console.log(e));
        };

        const handleChangeCancelMemo = (v: string | undefined) => {
            cancelledAdminMemo.value = v;
        };

        onMounted(async () => {
            const id = route.params.id;
            if (id) {
                try {
                    const detailRes = await getApiInstance().get(`/admin/reservation/detail/${id}`);
                    console.log(detailRes);
                    if (detailRes.data.code === 0) {
                        reservationDetail.value = detailRes.data.data;
                        if (reservationDetail.value) {
                            reservationDetail.value.targetDate = new Date(
                                reservationDetail.value?.targetDate
                            );
                            serviceId.value = reservationDetail.value?.serviceId
                                ? reservationDetail.value?.serviceId.toString()
                                : '';
                            buildingId.value = reservationDetail.value?.buildingId
                                ? reservationDetail.value?.buildingId.toString()
                                : '';
                            structureId.value = reservationDetail.value?.structureId
                                ? reservationDetail.value?.structureId.toString()
                                : '';
                            footage.value = reservationDetail.value?.footage
                                ? reservationDetail.value?.footage.toString()
                                : '';
                            toiletCount.value = reservationDetail.value?.toiletCount
                                ? reservationDetail.value?.toiletCount.toString()
                                : '';
                            verandaCount.value = reservationDetail.value?.verandaCount
                                ? reservationDetail.value?.verandaCount.toString()
                                : '';
                            reservationAdminMemo.value =
                                reservationDetail.value?.reservationAdminMemo ?? undefined;
                            serviceAdminMemo.value =
                                reservationDetail.value?.serviceAdminMemo ?? undefined;
                            paymentAdminMemo.value =
                                reservationDetail.value?.paymentAdminMemo ?? undefined;
                            targetTime.value = reservationDetail.value?.targetTime;
                            expansion.value = reservationDetail.value?.expansion ?? '';
                            cancelledAdminMemo.value =
                                reservationDetail.value?.cancelledAdminMemo ?? undefined;
                        }

                        const serviceRes = await getApiInstance().get(
                            '/common/summary?type=service_type'
                        );
                        if (serviceRes.data.code === 0) {
                            console.log(serviceRes);
                            serviceSelectList.value = serviceRes.data.data.map(
                                (v: CommonCodeType) => {
                                    return { name: v.name, value: v.id.toString() };
                                }
                            );
                        }

                        const structureRes = await getApiInstance().get(
                            '/common/summary?type=structure_type'
                        );
                        if (structureRes.data.code === 0) {
                            structureSelectList.value = structureRes.data.data.map(
                                (v: CommonCodeType) => {
                                    return { name: v.name, value: v.id.toString() };
                                }
                            );
                        }
                        const buildingRes = await getApiInstance().get(
                            '/common/summary?type=building_type'
                        );
                        if (buildingRes.data.code === 0) {
                            buildingSelectList.value = buildingRes.data.data.map(
                                (v: CommonCodeType) => {
                                    return { name: v.name, value: v.id.toString() };
                                }
                            );
                        }
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        });

        return {
            reservationDetail,
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
            openPopup,
            footage,
            toiletCount,
            verandaCount,
            targetTime,
            expansion,
            openCancelPopup,
            cancelledAdminMemo,
            handleClickPopupClose,
            setSelectService,
            setSelectStructure,
            setSelectBuilding,
            setSelectExpansion,
            moment,
            handleChangeTime,
            handleChangeToiletCount,
            handleChangeVerandaCount,
            handleChangeFootage,
            handleChangeReservationMemo,
            handleChangeServiceMemo,
            handleChangePaymentMemo,
            handleChangeAddress,
            handleClickDelete,
            handleClickSave,
            handleChangeReservationDate,
            handleChangeBalanceInput,
            handleOpenPopup,
            handleClickCancel,
            handleChangeCancelMemo,
            handleOpenCancelPopup
        };
    }
});
</script>

<template>
    <clinic-top-bar></clinic-top-bar>
    <div
        class="reservation-detail-wrapper bg-[--bg-color] ml-[22%] px-[20px] pb-[20px] h-max flex items-center flex-col"
    >
        <div
            v-if="reservationDetail"
            class="reservation-contents max-w-[900px] w-full rounded-[8px] h-max"
        >
            <div
                class="title-wrapper w-full h-[80px] px-[20px] flex justify-between items-center bg-[--color-white] rounded-[8px]"
            >
                <div class="flex">
                    <div class="text-[22px] font-[700] leading-[26px] text-[#FF2B2B] mr-[5px]">
                        {{ reservationDetail.paymentCreated ? '예약)' : '견적 요청)' }}
                    </div>
                    <div class="text-[22px] font-[700] leading-[26px] text-[--color-text-black]">
                        {{
                            reservationDetail.username +
                            ' (' +
                            moment(reservationDetail.created).format('YY.MM.DD') +
                            ')'
                        }}
                    </div>
                </div>
                <div class="flex justify-between">
                    <div
                        class="w-[62px] h-[40px] mr-[10px] border-[1px] border-[--color-main-blue] rounded-[4px] flex-center text-[14px] font-[600] text-[--color-main-blue]"
                        @click="handleClickDelete"
                    >
                        삭제
                    </div>
                    <div
                        class="w-[62px] h-[40px] mr-[10px] border-[1px] bg-[--color-main-blue] rounded-[4px] flex-center text-[14px] font-[600] text-[--color-white]"
                        @click="handleClickSave"
                    >
                        저장
                    </div>
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
                        :read-only="true"
                        :place-holder="reservationDetail.username"
                    ></clinic-input>
                    <clinic-input
                        label="연락처"
                        :read-only="true"
                        :place-holder="reservationDetail.phoneNumber"
                    ></clinic-input>
                    <clinic-input
                        label="예약일"
                        :read-only="true"
                        :place-holder="moment(reservationDetail.created).format('YYYY-MM-DD')"
                    ></clinic-input>
                    <clinic-date
                        label="서비스 예약 날짜"
                        :value="reservationDetail.targetDate"
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
                        :value="targetTime"
                        :change-handler="handleChangeTime"
                    ></clinic-input>
                </div>
                <div class="h-[155px]">
                    <clinic-text-area
                        label="주소"
                        :value="reservationDetail.address"
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

            <div
                v-if="reservationDetail.paymentCreated"
                class="payment-wrapper bg-[--color-white] h-max mt-[20px] rounded-[8px] px-[30px] pt-[25px] py-[30px]"
            >
                <div class="payment-header flex justify-between">
                    <div
                        class="mt-[5px] text-[22px] font-[700] leading-[26px] text-[--color-text-black] mb-[10px]"
                    >
                        결제 정보
                    </div>
                    <div
                        class="w-[145px] h-[40px] text-[14px] font-[900] leading-[24px] text-[--color-white] bg-[--color-dark-blue] rounded-[8px] text-center py-[8px]"
                        @click="handleOpenPopup"
                    >
                        예약금 결제 정보 보기
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-x-[40px]">
                    <div
                        class="input-wrapper paid-amount-wrapper w-full h-full flex flex-col pt-[20px]"
                    >
                        <div class="flex justify-between">
                            <div
                                class="text-[14px] font-[900] leading-[24px] text-[--color-text-black] mb-[10px]"
                            >
                                예약금 결제 금액
                            </div>

                            <div
                                class="bg-[--color-main-blue] text-[14px] font-[700] leading-[20px] text-[--color-white] py-[2.5px] w-[65px] h-[25px] rounded-[8px] text-center"
                                :class="
                                    reservationDetail?.reservationStatus === ReservationState.PAID
                                        ? 'bg-[--color-main-blue]'
                                        : 'bg-[--color-red]'
                                "
                            >
                                {{
                                    reservationDetail?.reservationStatus === ReservationState.PAID
                                        ? '결제완료'
                                        : reservationDetail.reservationStatus ===
                                            ReservationState.FAILED
                                          ? '미완료'
                                          : '취소'
                                }}
                            </div>
                        </div>
                        <div class="relative w-full h-full">
                            <input
                                class="w-full h-[50px] bg-[--bg-color] border-0 py-[17px] pl-[20px] pr-[35px] rounded-[8px]"
                                :placeholder="reservationDetail?.paidAmount.toString()"
                                :readonly="true"
                            />
                            <span
                                class="absolute top-[17px] right-[16px] text-[14px] font-[500] leading-[17px]"
                                >원</span
                            >
                        </div>
                    </div>
                    <div
                        class="input-wrapper balance-amount-wrapper w-full h-full flex flex-col pt-[20px]"
                    >
                        <div class="flex justify-between">
                            <div
                                class="text-[14px] font-[900] leading-[24px] text-[--color-text-black] mb-[10px]"
                            >
                                잔금 금액
                            </div>
                        </div>
                        <div class="relative w-full h-full">
                            <input
                                class="w-full h-[47px] border-[1.5px] border-[--color-border-blue] py-[17px] pl-[20px] pr-[35px] rounded-[8px]"
                                type="number"
                                :value="reservationDetail.balanceAmount"
                                @input="handleChangeBalanceInput"
                            />
                            <span
                                class="absolute top-[17px] right-[16px] text-[14px] font-[500] leading-[17px]"
                                >원</span
                            >
                        </div>
                        <div class="text-[14px] font-[500] leading-[17px] text-[#919EAB] mt-[5px]">
                            예약자가 예약한 서비스에 대한 예상 잔금입니다.
                        </div>
                    </div>
                </div>

                <div class="h-[155px]">
                    <clinic-text-area
                        label="결제 관리자 메모"
                        place-holder="예약금 및 잔금에 대한 관리자 메모를 남기세요."
                        :value="paymentAdminMemo"
                        :change-handler="handleChangePaymentMemo"
                    ></clinic-text-area>
                </div>
            </div>
        </div>
    </div>
    <div
        v-if="openPopup && reservationDetail"
        class="w-screen h-screen fixed top-0 left-0 z-40 flex-center"
    >
        <div class="popup-bg flex-center bg-black opacity-55 w-full h-full"></div>
        <div
            class="popup-payment absolute w-[460px] h-max bg-white z-50 px-[15px] py-[20px] flex flex-col items-center"
        >
            <div class="title-wrapper w-full flex justify-between">
                <div class="flex flex-col ml-[20px]">
                    <span
                        class="text-[30px] font-[700] text-[--color-text-black] leading-[36px] mb-[5px]"
                        >예약금 결제 정보</span
                    >
                    <span class="text-[14px] font-[500] text-[#919EAB] leading-[17px]"
                        >결제된 예약금을 관리합니다.</span
                    >
                </div>
                <div class="w-[36px] h-[36px]" @click="handleClickPopupClose">
                    <img src="@/assets/images/icons/x-btn@1x.svg" />
                </div>
            </div>
            <div class="body-wrapper w-[390px]">
                <div class="input-wrapper order-id w-full h-full flex flex-col pt-[20px]">
                    <div class="text-[14px] font-[900] leading-[24px] text-[--color-text-black]">
                        결제된 주문 번호
                    </div>
                    <div class="relative w-full h-full">
                        <input
                            class="w-full h-[50px] bg-[--bg-color] border-0 py-[17px] pl-[20px] pr-[35px] rounded-[8px]"
                            :placeholder="reservationDetail.reservationId"
                            :readonly="true"
                        />
                    </div>
                </div>
                <div class="input-wrapper order-id w-full h-full flex flex-col pt-[20px]">
                    <div class="text-[14px] font-[900] leading-[24px] text-[--color-text-black]">
                        결제 날짜
                    </div>
                    <div class="relative w-full h-full">
                        <input
                            class="w-full h-[50px] bg-[--bg-color] border-0 py-[17px] pl-[20px] pr-[35px] rounded-[8px]"
                            :placeholder="
                                moment(reservationDetail.paymentCreated).format('YY.MM.DD')
                            "
                            :readonly="true"
                        />
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-x-[10px]">
                    <div class="input-wrapper order-id w-full h-full flex flex-col pt-[20px]">
                        <div
                            class="text-[14px] font-[900] leading-[24px] text-[--color-text-black]"
                        >
                            결제 방법
                        </div>
                        <div class="relative w-full h-full">
                            <input
                                class="w-full h-[50px] bg-[--bg-color] border-0 py-[17px] pl-[20px] pr-[35px] rounded-[8px]"
                                :placeholder="
                                    reservationDetail.pgProvider === 'html5_inicis'
                                        ? '카드 결제'
                                        : '간편 결제'
                                "
                                :readonly="true"
                            />
                        </div>
                    </div>
                    <div class="input-wrapper order-id w-full h-full flex flex-col pt-[20px]">
                        <div
                            class="text-[14px] font-[900] leading-[24px] text-[--color-text-black]"
                        >
                            결제 상태
                        </div>
                        <div class="relative w-full h-full">
                            <input
                                class="w-full h-[50px] bg-[--bg-color] border-0 py-[17px] pl-[20px] pr-[35px] rounded-[8px]"
                                :placeholder="
                                    reservationDetail.reservationStatus === ReservationState.PAID
                                        ? '결제 완료'
                                        : reservationDetail.reservationStatus ===
                                            ReservationState.CANCELLED
                                          ? `결제 취소`
                                          : `결제 실패`
                                "
                                :readonly="true"
                            />
                        </div>
                    </div>
                </div>
                <div class="input-wrapper order-id w-full h-full flex flex-col pt-[20px]">
                    <div class="text-[14px] font-[900] leading-[24px] text-[--color-text-black]">
                        결제 금액
                    </div>
                    <div class="relative w-full h-full">
                        <input
                            class="w-full h-[50px] bg-[--bg-color] border-0 py-[17px] pl-[20px] pr-[35px] rounded-[8px]"
                            :value="reservationDetail.paidAmount"
                            :readonly="true"
                        />
                        <span
                            class="absolute top-[17px] right-[16px] text-[14px] font-[500] leading-[17px]"
                            >원</span
                        >
                    </div>
                </div>
                <div class="flex justify-end mt-[20px]">
                    <div
                        class="w-[100px] h-[40px] rounded-[8px] bg-[--color-dark-blue] py-[8px] text-center text-[--color-white] font-[900] text-[14px] leading-[24px] mb-[20px]"
                        @click="handleOpenCancelPopup"
                    >
                        결제 취소하기
                    </div>
                </div>
            </div>
            <div
                v-if="openCancelPopup"
                class="border-t-[1px] w-[390px] h-[340px] bg-[--color-white] flex flex-col"
            >
                <div class="w-full mt-[15px]">
                    <div>
                        <span
                            class="text-[14px] font-[900] text-[--color-text-black] leading-[24px]"
                            >취소 금액
                        </span>
                        <span class="text-[14px] font-[900] text-[#FF2B2B] leading-[24px]">*</span>
                    </div>
                    <div class="text-[14px] font-[500] text-[--color-text-gray] mb-[5px]">
                        예약자가 결제한 금액을 취소할 수 있습니다.
                    </div>
                    <div class="flex justify-between gap-x-[15px]">
                        <div class="relative w-[284px] h-full">
                            <input
                                class="w-full h-[50px] border-[1.5px] border-[--color-border-blue] py-[17px] pl-[20px] pr-[35px] rounded-[8px]"
                                type="number"
                                :readonly="true"
                                :value="reservationDetail.paidAmount"
                            />
                            <span
                                class="absolute top-[17px] right-[16px] text-[14px] font-[500] leading-[17px]"
                                >원</span
                            >
                        </div>
                        <div
                            class="w-[95px] h-[50px] rounded-[8px] bg-[#FF2B2B] text-[14px] font-[900] leading-[24px] text-[--color-white] py-[13px] text-center"
                            @click="handleClickCancel"
                        >
                            취소하기
                        </div>
                    </div>
                </div>

                <div class="h-max mt-[20px]">
                    <div class="text-[14px] font-[900] leading-[24px] text-[--color-text-black]">
                        취소 사유 관리자 메모
                    </div>
                    <textarea
                        class="w-full h-[100px] border-[1.5px] border-[&#45;&#45;color-border-blue] py-[15px] px-[15px] rounded-[8px]"
                        v-model="cancelledAdminMemo"
                        placeholder="서비스 장소에 대한 특이사항, 확인사항을 메모로 남기세요"
                    >
                    </textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
