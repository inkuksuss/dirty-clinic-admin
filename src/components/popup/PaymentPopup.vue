<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from '@/stores/store';
import moment from 'moment';

enum PaymentType {
    CARD = 'CARD'
}

enum PaymentState {
    PAID = 'PAID'
}

type PaymentInfo = {
    orderId: number;
    created: Date;
    paymentType: PaymentType;
    paymentState: PaymentState;
    paidAmount: string;
};

type CancelInfo = {
    orderId: number;
    adminId: number;
    cancelledAmount: string;
    cancelledMemo: string;
};

export default defineComponent({
    name: 'ReservationPaymentPopup',
    components: {},
    setup() {
        const store = useStore();
        const paymentInfo = ref<PaymentInfo>({
            orderId: 123213123123,
            created: new Date(),
            paymentType: PaymentType.CARD,
            paymentState: PaymentState.PAID,
            paidAmount: '20000'
        });

        const cancelInfo = ref<CancelInfo>({
            orderId: 1,
            adminId: 1,
            cancelledAmount: '0',
            cancelledMemo: ''
        });
        const isOpen = ref<boolean>(false);

        const handleClickClose = () => {
            store.setOpenPopup(null);
        };

        const handleClickCancel = () => {
            isOpen.value = true;
        };

        const handleChangeMemo = (e: InputEvent) => {
            const newMemo = (e.target as any).value;
            // cancelledAmount.value = newMemo;
            cancelInfo.value.cancelledMemo = newMemo;
        };

        const handleChangeCancelledAmount = (e: InputEvent) => {
            const newValue = (e.target as any).value;
            cancelInfo.value.cancelledAmount = newValue;
        };

        return {
            paymentInfo,
            PaymentType,
            PaymentState,
            isOpen,
            cancelInfo,
            moment,
            handleClickClose,
            handleClickCancel,
            handleChangeMemo,
            handleChangeCancelledAmount
        };
    }
});
</script>

<template>
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
            <div class="w-[36px] h-[36px]" @click="handleClickClose">
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
                        :placeholder="paymentInfo.orderId"
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
                        :placeholder="moment(paymentInfo.created).format('YY.MM.DD')"
                        :readonly="true"
                    />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-x-[10px]">
                <div class="input-wrapper order-id w-full h-full flex flex-col pt-[20px]">
                    <div class="text-[14px] font-[900] leading-[24px] text-[--color-text-black]">
                        결제 방법
                    </div>
                    <div class="relative w-full h-full">
                        <input
                            class="w-full h-[50px] bg-[--bg-color] border-0 py-[17px] pl-[20px] pr-[35px] rounded-[8px]"
                            :placeholder="
                                paymentInfo.paymentType === PaymentType.CARD
                                    ? '카드 결제'
                                    : '간편 결제'
                            "
                            :readonly="true"
                        />
                    </div>
                </div>
                <div class="input-wrapper order-id w-full h-full flex flex-col pt-[20px]">
                    <div class="text-[14px] font-[900] leading-[24px] text-[--color-text-black]">
                        결제 상태
                    </div>
                    <div class="relative w-full h-full">
                        <input
                            class="w-full h-[50px] bg-[--bg-color] border-0 py-[17px] pl-[20px] pr-[35px] rounded-[8px]"
                            :placeholder="
                                paymentInfo.paymentState === PaymentState.PAID
                                    ? '결제 완료'
                                    : '결제 실패'
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
                        :placeholder="paymentInfo.paidAmount"
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
                    class="w-[100px] h-[40px] rounded-[8px] bg-[--color-dark-blue] py-[8px] text-center text-[--color-white] font-[900] text-[14px] leading-[24px]"
                    @click="handleClickCancel"
                >
                    결제 취소하기
                </div>
            </div>
        </div>
        <div
            v-if="isOpen"
            class="border-t-[1px] w-[390px] h-[340px] bg-[--color-white] flex flex-col"
        >
            <div class="flex flex-col pt-[25px]">
                <span class="text-[14px] font-[900] leading-[24px]">결제 취소</span>
                <span class="text-[14px] font-[500] leading-[17px] text-[#919EAB]"
                    >전체 취소, 부분 취소가 가능합니다.<br />
                    부분 취소일 경우 취소 금액을 입력해주세요.</span
                >
            </div>
            <div class="w-full mt-[15px]">
                <div>
                  <span class="text-[14px] font-[900] text-[--color-text-black] leading-[24px]">취소 금액</span>
                  <span class="text-[14px] font-[900] text-[#FF2B2B] leading-[24px]">*</span>
                </div>
                <div class="flex justify-between gap-x-[15px]">
                  <div class="relative w-[284px] h-full">
                    <input
                        class="w-full h-[47px] border-[1.5px] border-[--color-border-blue] py-[17px] pl-[20px] pr-[35px] rounded-[8px]"
                        type="number"
                        :value="cancelInfo.cancelledAmount"
                        @input="handleChangeCancelledAmount"
                    />
                    <span
                        class="absolute top-[17px] right-[16px] text-[14px] font-[500] leading-[17px]"
                    >원</span
                    >
                  </div>
                  <div class="w-[95px] h-[50px] rounded-[8px] bg-[#FF2B2B] text-[14px] font-[900] leading-[24px] text-[--color-white] py-[13px] text-center">
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
                    :value="cancelInfo.cancelledMemo"
                    placeholder="서비스 장소에 대한 특이사항, 확인사항을 메모로 남기세요"
                    @input="handleChangeMemo"
                >
                </textarea>
            </div>
        </div>
    </div>
</template>
