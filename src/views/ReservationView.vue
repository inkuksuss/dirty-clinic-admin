<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {useStore} from '@/stores/store';
import ClinicTopBar from '@/components/common/ClinicTopbar.vue';
import Datepicker from 'vue3-datepicker';
import {ko} from 'date-fns/locale';
import {type PageType, PopupType, type Reservation, ReservationState, ReservationType} from '@/utils/types';
import moment from 'moment';
import router from '@/router';

type ReservationView = Omit<Reservation, 'isSelect'> & { isSelect: boolean };

export default defineComponent({
    components: { ClinicTopBar, Datepicker },
    setup() {
        const store = useStore();
        const startDate = ref<Date>(new Date());
        const endDate = ref<Date>(new Date());
        const searchValue = ref<string>('');
        const maxLimitDate = new Date();
        const compLocale = computed(() => ko);
        const checkAll = ref<boolean>(false);
        const reservationList = ref<ReservationView[]>([
            {
                id: 1,
                memberName: '홍길동1',
                reservationType: ReservationType.ONE_ROOM,
                reservationDate: moment(new Date()).format('YY.MM.DD'),
                hasPromotion: true,
                reservationState: ReservationState.PAID,
                balanceAmount: '10,100',
                isChecked: true,
                created: moment(new Date()).format('YY.MM.DD'),
                isSelect: false
            },
            {
                id: 2,
                memberName: '홍길동2',
                reservationType: ReservationType.HOUSE,
                reservationDate: moment(new Date()).format('YY.MM.DD'),
                hasPromotion: true,
                reservationState: ReservationState.PAID,
                balanceAmount: '30,100',
                isChecked: true,
                created: moment(new Date()).format('YY.MM.DD'),
                isSelect: false
            },
            {
                id: 3,
                memberName: '홍길동3',
                reservationType: ReservationType.HOUSE,
                reservationDate: moment(new Date()).format('YY.MM.DD'),
                hasPromotion: false,
                reservationState: ReservationState.FAILED,
                balanceAmount: '20,100',
                isChecked: false,
                created: moment(new Date()).format('YY.MM.DD'),
                isSelect: false
            }
        ]);

        const pageInfo = ref<PageType>({
            currentPage: 1,
            totalElement: 318,
            hasNext: true,
            totalPage: 31,
            viewList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        });

        const handleClickDelete = () => {
            window.alert('delete');
        };
        const handleClickAdd = () => {
            window.alert('add');
        };

        const handleChangeStartDate = (date: Date) => {
            if (startDate.value > endDate.value) {
                window.alert('시작일이 종료일보다 클 수 없습니다.');
                startDate.value = endDate.value;
                return;
            }
            console.log('start', date);
        };

        const handleChangeEndDate = (date: Date) => {
            if (startDate.value > endDate.value) {
                window.alert('종료일이 시작일보다 작을 수 없습니다.');
                endDate.value = startDate.value;
                return;
            }
            console.log('end', date);
        };

        const handleChangeKeyword = (e: KeyboardEvent) => {
            searchValue.value = (e.target as any).value;
        };

        const handleEnterDown = (e: KeyboardEvent): void => {
            if (e.key === 'Enter') {
                if (e.isComposing || e.keyCode === 229) return;
                window.alert('search = ' + searchValue.value);
            }
        };

        const handleClickPageArrow = (isLeft: boolean) => {
            if (isLeft) {
                console.log('left');
            } else {
                console.log('right');
            }
        };

        const handleClickPageNumber = (v: number) => {
            console.log(v);
        };

        const handleChangeCheckAll = () => {
            reservationList.value.forEach((rs) => (rs.isSelect = checkAll.value));
        };

        const handleClickRow = (id: number) => {
            router.push('/reservation/1');
        };

        return {
            startDate,
            endDate,
            maxLimitDate,
            compLocale,
            checkAll,
            searchValue,
            reservationList,
            ReservationType,
            ReservationState,
            pageInfo,
            moment,
            handleClickDelete,
            handleClickAdd,
            handleChangeStartDate,
            handleChangeEndDate,
            handleChangeKeyword,
            handleEnterDown,
            handleClickPageArrow,
            handleClickPageNumber,
            handleChangeCheckAll,
            handleClickRow
        };
    }
});
</script>

<template>
    <clinic-top-bar></clinic-top-bar>
    <div class="reservation-wrapper bg-[--bg-color] ml-[22%] px-[20px] flex items-center flex-col">
        <div class="reservation-contents max-w-[900px] bg-[--color-white] rounded-[8px] h-max">
            <div class="title-wrapper w-full h-[80px] px-[20px] flex justify-between items-center">
                <span class="text-[22px] font-[700] leading-[26px] text-[--color-text-black]"
                    >예약 관리</span
                >
                <div class="flex justify-between">
                    <div
                        class="w-[62px] h-[40px] mr-[10px] border-[1px] border-[--color-main-blue] rounded-[4px] flex-center text-[14px] font-[600] text-[--color-main-blue]"
                        @click="handleClickDelete"
                    >
                        삭제
                    </div>
                    <div
                        class="w-[62px] h-[40px] mr-[10px] border-[1px] bg-[--color-main-blue] rounded-[4px] flex-center text-[14px] font-[600] text-[--color-white]"
                        @click="handleClickAdd"
                    >
                        + 등록
                    </div>
                </div>
            </div>
            <div class="search-wrapper bg-[--bg-gray-color] h-[98px] flex justify-between">
                <div class="date-wrapper flex flex-col py-[15px] pl-[20px] w-[400px]">
                    <div
                        class="text-[14px] font-[400] text-[--color-text-black] leading-[17px] mb-[11px]"
                    >
                        서비스 예약날짜
                    </div>
                    <div class="date-box flex justify-between items-center">
                        <div class="relative w-[185px] h-[40px]">
                            <Datepicker
                                class="w-full h-[40px] border-[1px] rounded-[4px] px-[12px]"
                                v-model="startDate"
                                :upper-limit="maxLimitDate"
                                :locale="compLocale"
                                @update:modelValue="handleChangeStartDate"
                            ></Datepicker>
                            <img
                                class="absolute w-[18px] h-[18px] top-[11px] right-[12px]"
                                src="@/assets/images/icons/calendar@1x.svg"
                            />
                        </div>
                        <span class="mx-[10px]">~</span>
                        <div class="relative w-[185px] h-[40px]">
                            <Datepicker
                                class="w-full h-[40px] border-[1px] rounded-[4px] px-[12px]"
                                v-model="endDate"
                                :upper-limit="maxLimitDate"
                                :locale="compLocale"
                                @update:modelValue="handleChangeEndDate"
                            ></Datepicker>
                            <img
                                class="absolute w-[18px] h-[18px] top-[11px] right-[12px]"
                                src="@/assets/images/icons/calendar@1x.svg"
                            />
                        </div>
                    </div>
                </div>
                <div class="search-input flex flex-col py-[15px] mx-[20px] w-[460px]">
                    <span
                        class="text-[14px] font-[400] text-[--color-text-black] leading-[17px] mb-[11px]"
                        >검색</span
                    >
                    <div class="search-input w-full relative">
                        <img
                            class="absolute w-[16px] h-[16px] top-[12px] left-[8px]"
                            src="@/assets/images/icons/search@1x.svg"
                        />
                        <input
                            :value="searchValue"
                            class="w-full h-[40px] rounded-[4px] pl-[32px]"
                            placeholder="예약자명, 연락처를 검색하세요."
                            @input="handleChangeKeyword"
                            @keydown="handleEnterDown"
                        />
                    </div>
                </div>
            </div>
            <div class="reservation-body w-full h-max">
                <div
                    class="body-header w-full flex px-[25px] h-[45px] items-center border-b-[1px] border-[#EEEEEE] mb-[10px]"
                >
                    <div class="w-[45px] flex justify-start">
                        <input
                            class="w-[20px] h-[20px]"
                            id="check_all"
                            type="checkbox"
                            v-model="checkAll"
                            @change="handleChangeCheckAll"
                        />
                        <label for="check_all"></label>
                    </div>
                    <div
                        class="w-[55px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                    >
                        번호
                    </div>
                    <div
                        class="w-[110px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                    >
                        예약자 명
                    </div>
                    <div
                        class="w-[70px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                    >
                        서비스
                    </div>
                    <div
                        class="w-[70px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                    >
                        예약 일자
                    </div>
                    <div
                        class="w-[130px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                    >
                        서비스 예약날짜
                    </div>
                    <div
                        class="w-[67px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                    >
                        프로모션
                    </div>
                    <div
                        class="w-[100px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                    >
                        예약금 결제
                    </div>
                    <div
                        class="w-[110px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                    >
                        잔금 금액
                    </div>
                    <div
                        class="w-[93px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                    >
                        최종 결산
                    </div>
                </div>
                <div class="body-list w-full px-[25px]">
                    <div
                        v-for="(reservation, idx) in reservationList"
                        :key="reservation.id"
                        class="body-content py-[14px] flex items-center cursor-pointer"
                        @click="() => handleClickRow(reservation.id)"
                    >
                        <div class="w-[45px] flex justify-start">
                            <input
                                class="w-[20px] h-[20px]"
                                :id="'check_one_' + idx"
                                type="checkbox"
                                v-model="reservation.isSelect"
                            />
                            <label :for="'check_one_' + idx"></label>
                        </div>
                        <div
                            class="w-[55px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center"
                        >
                            {{ reservation.id }}
                        </div>
                        <div
                            class="w-[110px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center"
                        >
                            {{ reservation.memberName }}
                        </div>
                        <div class="w-[70px] flex-center">
                            <div
                                v-if="reservation.reservationType === ReservationType.ONE_ROOM"
                                class="text-[14px] font-[400] leading-[17px] text-[--color-text-black]"
                            >
                                원룸
                            </div>
                            <div
                                v-else-if="reservation.reservationType === ReservationType.HOUSE"
                                class="text-[14px] font-[400] leading-[17px] text-[--color-text-black]"
                            >
                                주택
                            </div>
                        </div>
                        <div
                            class="w-[70px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center"
                        >
                            {{ reservation.created }}
                        </div>
                        <div
                            class="w-[130px] text-[14px] font-[400] leading-[17px] text-[--color-main-blue] text-center"
                        >
                            {{ reservation.reservationDate }}
                        </div>
                        <div
                            class="w-[67px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center"
                            :class="reservation.hasPromotion ? 'text-[#2C88E1] font-[600]' : ''"
                        >
                            {{ reservation.hasPromotion ? '사용' : '-' }}
                        </div>
                        <div class="flex-center w-[100px]">
                            <div
                                v-if="reservation.reservationState === ReservationState.PAID"
                                class="w-[65px] h-[25px] bg-[--color-main-blue] rounded-[8px] text-[--color-white] font-[700] text-[14px] text-center py-[2.5px] leading-[20px]"
                            >
                                결제완료
                            </div>
                            <div
                                v-else-if="reservation.reservationState === ReservationState.FAILED"
                                class="w-[65px] h-[25px] bg-[--color-red] rounded-[8px] text-[--color-white] font-[700] text-[14px] text-center py-[2.5px] leading-[20px]"
                            >
                                미완료
                            </div>
                            <div
                                v-else
                                class="w-[65px] h-[25px] bg-[--color-red] rounded-[8px] text-[--color-white] font-[700] text-[14px] text-center py-[2.5px] leading-[20px]"
                            >
                                취소
                            </div>
                        </div>
                        <div
                            class="w-[110px] text-[14px] font-[700] leading-[17px] text-[--color-main-blue] text-center"
                        >
                            {{ reservation.balanceAmount }}
                        </div>
                        <div class="w-[93px] flex-center">
                            <div
                                v-if="reservation.isChecked"
                                class="w-[65px] h-[25px] bg-[--color-main-blue] rounded-[8px] text-[--color-white] font-[700] text-[14px] text-center py-[2.5px] leading-[20px]"
                            >
                                완료
                            </div>
                            <div v-else>-</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="paging-wrapper flex justify-center mt-[20px]">
            <img
                src="@/assets/images/icons/arrow_left@1x.svg"
                class="mr-[20px] w-[24px] h-[24px]"
                @click="() => handleClickPageArrow(true)"
            />
            <div class="page-view-wrapper flex">
                <div
                    v-for="page in pageInfo.viewList"
                    :key="page"
                    class="w-[24px] h-[24px]"
                    @click="() => handleClickPageNumber(page)"
                >
                    <span
                        class="font-[500] text-[14px] text-[#BDBDBD] leading-[20px]"
                        :class="page === pageInfo.currentPage ? 'text-[#333333]' : ''"
                        >{{ page }}</span
                    >
                </div>
            </div>
            <img
                src="@/assets/images/icons/arrow_right@1x.svg"
                class="ml-[20px] w-[24px] h-[24px]"
                @click="() => handleClickPageArrow(false)"
            />
        </div>
    </div>
</template>

<style scoped></style>
