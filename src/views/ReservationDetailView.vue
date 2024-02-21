<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from '@/stores/store';
import ClinicTopBar from '@/components/common/ClinicTopbar.vue';
import { PopupType, ReservationState, ReservationType, type SelectType } from '@/utils/types';
import moment from 'moment';
import ClinicInput from '@/components/common/ClinicInput.vue';
import ClinicTextArea from '@/components/common/ClinicTextArea.vue';
import ClinicDate from '@/components/common/ClinicDate.vue';
import ClinicSelect from '@/components/common/ClinicSelect.vue';

export type ReservationDetail = {
    id: number;
    memberName: string;
    memberTel: string;
    reservationDate: Date;
    created: Date;
    memberMemo: string | null;

    reservationType: ReservationType;
    promotionId: number | null;
    serviceMemo: string | null;
    serviceOption: number | null;
    serviceOption2: number | null;

    reservationState: ReservationState;
    paidAmount: string;
    balanceAmount: string;
    totalAmount: string;
    payMemo: string | null;
    isChecked: boolean;
};

export default defineComponent({
    components: { ClinicSelect, ClinicDate, ClinicTextArea, ClinicInput, ClinicTopBar },
    setup() {
        const store = useStore();

        const reservationDetail = ref<ReservationDetail>({
            id: 1,
            memberName: '홍길동',
            memberTel: '010-2429-2499',
            reservationDate: new Date(),
            created: new Date(),
            memberMemo: null,

            reservationType: ReservationType.HOUSE,
            promotionId: 1,
            serviceMemo: '잘 부탁해요',
            serviceOption: 1,
            serviceOption2: null,

            reservationState: ReservationState.PAID,
            paidAmount: '20000',
            balanceAmount: '550000',
            totalAmount: '0',
            payMemo: null,
            isChecked: true
        });

        const serviceSelectList: Array<SelectType> = [
            { name: '주택', value: '1' },
            { name: '원룸', value: '2' }
        ];

        const promotionSelectList: Array<SelectType> = [
            { name: '프로모션1', value: '1' },
            { name: '프로모션2', value: '2' }
        ];

        const serviceCategory = ref<string>('');
        const promotion = ref<string>('');
        const option1 = ref<string>('');
        const option2 = ref<string>('');
        const checkAmount = ref<boolean>(false);

        const handleClickDelete = () => {
            window.alert('delete');
        };
        const handleClickSave = () => {
            window.alert('save');
        };

        const handleChangeReservationDate = (date: Date) => {
            reservationDetail.value.reservationDate = date;
        };

        const handleChangeBalanceInput = (e: Event) => {
            const newValue = (e.target as any).value;
            reservationDetail.value.balanceAmount = newValue;
            handleCalculate();
        };

        const handleCalculate = () => {
            if (checkAmount.value) {
                reservationDetail.value.totalAmount = String(
                    Number(reservationDetail.value.paidAmount) +
                        Number(reservationDetail.value.balanceAmount)
                );
            }
        };

        const handleFinalComplete = () => {
            if (
                reservationDetail.value.totalAmount !==
                String(
                    Number(reservationDetail.value.paidAmount) +
                        Number(reservationDetail.value.balanceAmount)
                )
            ) {
                window.alert('최종 정산 금액이 일치하지 않습니다.');
                return;
            }
            window.alert('최종 정산 완료 = ' + reservationDetail.value.totalAmount);
        };

        const handleOpenPopup = () => {
            store.setOpenPopup(PopupType.RESERVATION_PAYMENT);
        };

        return {
            reservationDetail,
            serviceCategory,
            promotion,
            option1,
            option2,
            serviceSelectList,
            promotionSelectList,
            ReservationState,
            checkAmount,
            moment,
            handleClickDelete,
            handleClickSave,
            handleChangeReservationDate,
            handleChangeBalanceInput,
            handleCalculate,
            handleFinalComplete,
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
                class="title-wrapper w-full h-[80px] px-[20px] flex justify-between items-center bg-[--color-white] rounded-[8px]"
            >
                <div class="text-[22px] font-[700] leading-[26px] text-[--color-text-black]">
                    {{
                        reservationDetail.memberName +
                        ' (' +
                        moment(reservationDetail.created).format('YY.MM.DD') +
                        ')'
                    }}
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
                        :place-holder="reservationDetail.memberName"
                    ></clinic-input>
                    <clinic-input
                        label="연락처"
                        :read-only="true"
                        :place-holder="reservationDetail.memberTel"
                    ></clinic-input>
                    <clinic-input
                        label="예약일"
                        :read-only="true"
                        :place-holder="moment(reservationDetail.created).format('YYYY-MM-DD')"
                    ></clinic-input>
                    <clinic-date
                        label="서비스 예약 날짜"
                        :value="reservationDetail.reservationDate"
                        :change-handler="handleChangeReservationDate"
                    ></clinic-date>
                </div>
                <div class="h-[155px]">
                    <clinic-text-area
                        label="예약자 관리자 메모"
                        place-holder="예약자의 특이사항을 메모로 남기세요."
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
                        label="서비스 카테고리"
                        :selected-value="serviceCategory"
                        :select-list="serviceSelectList"
                    ></clinic-select>
                    <clinic-select
                        label="프로모션"
                        :selected-value="promotion"
                        :select-list="promotionSelectList"
                    ></clinic-select>
                    <clinic-select
                        label="상세옵션"
                        :selected-value="option1"
                        :select-list="serviceSelectList"
                    ></clinic-select>
                    <clinic-select
                        label="상세옵션 2"
                        :selected-value="option1"
                        :select-list="serviceSelectList"
                    ></clinic-select>
                </div>
                <div class="h-[155px]">
                    <clinic-text-area
                        label="서비스 관리자 메모"
                        place-holder="서비스 장소에 대한 특이사항, 확인사항을 메모로 남기세요."
                    ></clinic-text-area>
                </div>
            </div>

            <div
                class="payment-wrapper bg-[--color-white] h-max mt-[20px] rounded-[8px] px-[30px] pt-[25px] py-[30px]"
            >
                <div class="payment-header flex justify-between">
                    <div
                        class="mt-[5px] text-[22px] font-[700] leading-[26px] text-[--color-text-black] mb-[10px]"
                    >
                        결제 정보
                    </div>
                    <div
                        class="w-[140px] h-[40px] text-[14px] font-[900] leading-[24px] text-[--color-white] bg-[--color-dark-blue] rounded-[8px] text-center py-[8px]"
                        @click="handleOpenPopup"
                    >
                        예약금 결정 정보 보기
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
                                    reservationDetail.reservationState === ReservationState.PAID
                                        ? 'bg-[--color-main-blue]'
                                        : 'bg-[--color-main-red]'
                                "
                            >
                                {{
                                    reservationDetail.reservationState === ReservationState.PAID
                                        ? '결제완료'
                                        : reservationDetail.reservationState ===
                                            ReservationState.FAILED
                                          ? '미완료'
                                          : '취소'
                                }}
                            </div>
                        </div>
                        <div class="relative w-full h-full">
                            <input
                                class="w-full h-[50px] bg-[--bg-color] border-0 py-[17px] pl-[20px] pr-[35px] rounded-[8px]"
                                :placeholder="reservationDetail.paidAmount"
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

                            <div class="flex flex-row-reverse w-[110px]">
                                <input
                                    id="calc"
                                    type="checkbox"
                                    class="w-[20px] h-[20px]"
                                    @change="handleCalculate"
                                    v-model="checkAmount"
                                />
                                <label for="calc"></label>
                                <span
                                    class="w-[80px] font-[900] text-[14px] leading-[20px] mr-[10px]"
                                    >잔금 금액 확정</span
                                >
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
                            잔금 금액 확정을 체크하면, 리스트에서 잔금 금액을 확인할 수 있습니다.
                        </div>
                    </div>
                </div>

                <div
                    class="input-wrapper total-amount-wrapper w-full h-full flex flex-col pt-[20px]"
                >
                    <div
                        class="text-[14px] font-[900] leading-[24px] text-[--color-text-black] mb-[10px]"
                    >
                        총 금액
                    </div>
                    <div class="flex justify-between gap-x-[15px]">
                        <div class="relative w-[683px] h-full">
                            <input
                                class="w-full h-full bg-[--bg-color] border-0 py-[17px] pl-[20px] pr-[35px] rounded-[8px]"
                                :placeholder="reservationDetail.totalAmount"
                                :readonly="true"
                            />
                            <span
                                class="absolute top-[17px] right-[16px] text-[14px] font-[500] leading-[17px]"
                                >원</span
                            >
                        </div>
                        <div
                            class="flex-center w-[140px] h-[50px] bg-[#FF2B2B] rounded-[8px]"
                            @click="handleFinalComplete"
                        >
                            <span class="font-[900] text-[16px] text-[--color-white]"
                                >최종 정산 완료</span
                            >
                        </div>
                    </div>
                    <div class="text-[14px] font-[500] leading-[17px] text-[#919EAB] mt-[5px]">
                        잔금 금액은 확정을 체크해야 총 금액으로 합산됩니다. 총 금액을 확인하고,
                        정산이 완료되면 “최종 정산 완료” 버튼을 누르세요. <br />
                        *”최종 정산 완료” 버튼을 눌러야 매출 관리에서 확인하실 수 있습니다.
                    </div>
                </div>

                <div class="h-[155px]">
                    <clinic-text-area
                        label="결제 관리자 메모"
                        place-holder="예약금 및 잔금에 대한 관리자 메모를 남기세요."
                    ></clinic-text-area>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
