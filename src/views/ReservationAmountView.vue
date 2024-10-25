<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import ClinicTopBar from '@/components/common/ClinicTopbar.vue';
import Datepicker from 'vue3-datepicker';
import { ko } from 'date-fns/locale';
import {
    type CommonCodeType,
    ReservationState,
    ReservationType,
    type ReservationAmountSummary
} from '@/utils/types';
import moment from 'moment';
import router from '@/router';
import { getPageManager, removePageManager } from '@/utils/page-manager';
import { getApiInstance } from '@/utils/api';
import { getPeriodAtDate } from '@/utils/common';

type ReservationView = ReservationAmountSummary & { isSelect: boolean };

export default defineComponent({
    components: { ClinicTopBar, Datepicker },
    setup() {
        const today = new Date();
        const startDate = ref<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
        const endDate = ref<Date>(today);
        const tempStartDate = ref<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
        const tempEndDate = ref<Date>(today);

        const maxLimitDate = new Date();
        const compLocale = computed(() => ko);
        const reservationList = ref<ReservationView[]>([]);
        const pageViewList = ref<number[]>([]);
        const currentPageIdx = ref<number>(1);
        const totalElements = ref<number>(0);
        const serviceList = ref<CommonCodeType[]>([]);
        const totalAmount = ref<string>();
        const checkAll = ref<boolean>(false);

        const loadData = async () => {
            getPageManager().init('/admin/reservation/amount/summary');
            let query = `&startDate=${moment(startDate.value).format(
                'YYYY-MM-DD'
            )}&endDate=${moment(endDate.value).format('YYYY-MM-DD')}`;

            await getPageManager().loadData(query);
            pageViewList.value = getPageManager().pageList;
            reservationList.value = getPageManager().contents;
            currentPageIdx.value = getPageManager().currentPage;
            totalElements.value = getPageManager().totalElements;
        };

        const getServiceList = () => {
            getApiInstance()
                .get('/common/summary?type=service_type')
                .then((res) => {
                    if (res.data.code === 0) {
                        serviceList.value = res.data.data;
                    }
                })
                .catch((e) => console.error(e));
        };

        const handleClickDelete = () => {
            if (reservationList.value.filter((r) => r.isSelect).length < 1) {
                window.alert('선택된 대상이 없습니다.');
                return;
            }

            if (window.confirm('정말 삭제하시겠습니까?')) {
                getApiInstance()
                    .post('/admin/reservation/remove', {
                        idList: reservationList.value
                            .filter((r) => r.isSelect)
                            .map((r) => r.reservationId)
                    })
                    .then((res) => {
                        if (res.data.code === 0) window.alert('삭제 완료하였습니다.');
                        else window.alert(res.data.message);
                    })
                    .catch((e) => window.alert('오류가 발생하였습니다.'))
                    .finally(() => {
                        checkAll.value = false;
                        loadData();
                        getTotalAmount();
                    });
            }
        };

        const updateByDate = async (query: string) => {
            await getPageManager().loadData(query);
            pageViewList.value = getPageManager().pageList;
            reservationList.value = getPageManager().contents;
            currentPageIdx.value = getPageManager().currentPage;
            totalElements.value = getPageManager().totalElements;
            getTotalAmount();
        };

        const handleChangeStartDate = (_: any) => {
            if (startDate.value > endDate.value) {
                window.alert('시작일이 종료일보다 클 수 없습니다.');
                startDate.value = endDate.value;
                return;
            }

            if (getPeriodAtDate(startDate.value, endDate.value) > 31) {
                window.alert('검색 범위는 31일을 초과할 수 없습니다.');
                startDate.value = tempStartDate.value;
                return;
            }

            tempStartDate.value = startDate.value;
            let query = `&startDate=${moment(startDate.value).format(
                'YYYY-MM-DD'
            )}&endDate=${moment(endDate.value).format('YYYY-MM-DD')}`;
            updateByDate(query);
        };

        const handleChangeEndDate = (_: any) => {
            if (startDate.value > endDate.value) {
                window.alert('종료일이 시작일보다 작을 수 없습니다.');
                endDate.value = startDate.value;
                return;
            }

            if (getPeriodAtDate(startDate.value, endDate.value) > 31) {
                window.alert('검색 범위는 31일을 초과할 수 없습니다.');
                endDate.value = tempEndDate.value;
                return;
            }

            tempEndDate.value = endDate.value;
            let query = `&startDate=${moment(startDate.value).format(
                'YYYY-MM-DD'
            )}&endDate=${moment(endDate.value).format('YYYY-MM-DD')}`;
            updateByDate(query);
        };

        const handleClickPageArrow = async (isLeft: boolean) => {
            let query = `&startDate=${moment(startDate.value).format(
                'YYYY-MM-DD'
            )}&endDate=${moment(endDate.value).format('YYYY-MM-DD')}`;
            if (isLeft) await getPageManager().goPrevChapter(query);
            else await getPageManager().goNextChapter(query);
            currentPageIdx.value = getPageManager().currentPage;
            pageViewList.value = getPageManager().pageList;
            reservationList.value = getPageManager().contents;
            totalElements.value = getPageManager().totalElements;
        };

        const handleClickPageNumber = async (v: number) => {
            let query = `&startDate=${moment(startDate.value).format(
                'YYYY-MM-DD'
            )}&endDate=${moment(endDate.value).format('YYYY-MM-DD')}`;
            await getPageManager().movePage(v, query);
            pageViewList.value = getPageManager().pageList;
            reservationList.value = getPageManager().contents;
            currentPageIdx.value = getPageManager().currentPage;
            totalElements.value = getPageManager().totalElements;
        };

        const handleChangeCheckAll = () => {
            reservationList.value.forEach((rs) => (rs.isSelect = checkAll.value));
        };

        const handleClickRow = (id: string) => {
            router.push(`/reservation/${id}`);
        };

        const getTotalAmount = () => {
            getApiInstance()
                .get(
                    `/admin/reservation/total-amount?startDate=${moment(startDate.value).format(
                        'YYYY-MM-DD'
                    )}&endDate=${moment(endDate.value).format('YYYY-MM-DD')}`
                )
                .then((res) => {
                    console.log(res);
                    if (res.data.code === 0) {
                        totalAmount.value = res.data.data.toLocaleString();
                    } else {
                        window.alert(res.data.message);
                    }
                })
                .catch((e) => console.error(e));
        };

        onMounted(async () => {
            await getServiceList();
            await loadData();
            getTotalAmount();
        });

        onUnmounted(() => {
            removePageManager();
        });

        return {
            startDate,
            endDate,
            maxLimitDate,
            compLocale,
            checkAll,
            totalAmount,
            reservationList,
            ReservationType,
            ReservationState,
            pageViewList,
            currentPageIdx,
            serviceList,
            totalElements,
            today,
            moment,
            handleClickDelete,
            handleChangeStartDate,
            handleChangeEndDate,
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
        <div
            class="reservation-contents min-w-[900px] w-[95%] bg-[--color-white] rounded-[8px] h-max"
        >
            <div class="title-wrapper w-full h-[80px] px-[20px] flex justify-between items-center">
                <span class="text-[22px] font-[700] leading-[26px] text-[--color-text-black]"
                    >예약금 관리</span
                >
                <div class="flex">
                    <div
                        class="w-[62px] h-[40px] mr-[10px] border-[1px] border-[--color-main-blue] rounded-[4px] flex-center text-[14px] font-[600] text-[--color-main-blue]"
                        @click="handleClickDelete"
                    >
                        삭제
                    </div>
                </div>
            </div>
            <div
                class="search-wrapper bg-[--bg-gray-color] flex justify-between py-[15px] pl-[20px]"
            >
                <div class="date-wrapper flex flex-col w-[400px] h-[40px]">
                    <div class="date-box flex justify-between items-center">
                        <div class="relative w-[185px] h-[40px]">
                            <Datepicker
                                class="w-full h-[40px] border-[1px] rounded-[4px] px-[12px]"
                                v-model="startDate"
                                :upper-limit="endDate"
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
                                :upper-limit="today"
                                v-model="endDate"
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
                <div class="w-full h-[40px] flex items-center">
                    <span class="text-[14px] font-[500] text-[--color-text-gray] pl-[15px]"
                        >총 예약금 결제 금액은 온라인 결제 완료된 금액으로 노출됩니다.</span
                    >
                </div>
            </div>
            <div class="reservation-body w-full h-max">
                <div class="amount-wrapper grid grid-cols-2 px-[20px] gap-x-[10px] py-[20px]">
                    <div
                        class="amount-box px-[25px] py-[30px] h-[160px] flex flex-col justify-between rounded-[8px]"
                    >
                        <div class="flex w-full justify-between items-center">
                            <div class="text-[16px] font-[600]">예약 건</div>
                            <img src="@/assets/images/common/sharp@1x.png" class="w-[32px] h-[32px]"/>
                        </div>
                        <div class="flex justify-between items-center mt-[30px]">
                            <div class="text-[32px] font-[700]">{{ totalElements }}</div>
                            <div class="text-[22px] font-[700]">건</div>
                        </div>
                    </div>
                    <div
                        class="amount-box px-[25px] py-[30px] h-[160px] flex flex-col justify-between rounded-[8px]"
                    >
                        <div class="flex w-full justify-between items-center">
                            <div class="text-[16px] font-[600]">총 예약금 결재 금액</div>
                            <img src="@/assets/images/common/card@1x.png" class="w-[32px] h-[32px]"/>
                        </div>
                        <div class="flex justify-between items-center mt-[30px]">
                            <div class="text-[32px] font-[700] text-[#ff2b2b]">
                                {{ totalAmount }}
                            </div>
                            <div class="text-[22px] font-[700] text-[#ff2b2b]">원</div>
                        </div>
                    </div>
                </div>
                <div
                    class="body-header w-full flex px-[25px] h-[45px] items-center border-b-[1px] border-[#EEEEEE] mb-[10px] justify-between"
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
                    <div class="w-full flex justify-between">
                        <div
                            class="w-[64px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            번호
                        </div>
                        <div
                            class="w-[126px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            예약자 명
                        </div>
                        <div
                            class="w-[89px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            서비스
                        </div>
                        <div
                            class="w-[137px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            서비스 예약날짜
                        </div>
                        <div
                            class="w-[111px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            예약금
                        </div>
                        <div
                            class="w-[111px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            잔금 금액
                        </div>
                        <div
                            class="w-[111px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            예약금 결제일
                        </div>
                    </div>
                </div>
                <div v-if="reservationList.length > 0" class="body-list w-full">
                    <div
                        v-for="(reservation, idx) in reservationList"
                        :key="reservation.reservationId"
                        class="body-content py-[14px] flex items-center cursor-pointer justify-between px-[25px]"
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
                            @click="() => handleClickRow(reservation.reservationId)"
                            class="flex justify-between w-full"
                        >
                            <div
                                class="w-[64px] min-w-[64px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center"
                            >
                                {{ (currentPageIdx - 1) * 7 + idx + 1 }}
                            </div>
                            <div
                                class="w-[126px] min-w-[126px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center truncate"
                            >
                                {{ reservation.username ?? '-' }}
                            </div>
                            <div
                                class="w-[89px] min-w-[89px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center"
                            >
                                {{ reservation.serviceName ?? '-' }}
                            </div>
                            <div
                                class="w-[137px] min-w-[137px] text-[14px] font-[400] leading-[17px] text-[--color-main-blue] text-center"
                            >
                                {{ moment(reservation.targetDate).format('YY.MM.DD') }}
                            </div>
                            <div
                                class="w-[111px] min-w-[111px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] flex-center"
                            >
                                {{
                                    reservation.paidAmount
                                        ? reservation.paidAmount.toLocaleString()
                                        : '-'
                                }}
                            </div>
                            <div
                                class="flex-center w-[111px] min-w-[111px] text-[14px] font-[700] leading-[17px] text-[--color-main-blue] text-center truncate"
                            >
                                {{
                                    reservation.balanceAmount
                                        ? reservation.balanceAmount.toLocaleString()
                                        : '-'
                                }}
                            </div>
                            <div
                                class="w-[111px] min-w-[111px] text-[14px] font-[700] leading-[17px] text-[--color-main-blue] text-center"
                            >
                                {{
                                    reservation.created
                                        ? moment(reservation.created).format('YY.MM.DD')
                                        : '-'
                                }}
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="w-full py-[20px]">
                    <div
                        class="text-[14px] font-[400] leading-[17px] text-[--color-text-gray] text-center"
                    >
                        검색 결과가 없습니다.
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
                    v-for="page in pageViewList"
                    :key="page"
                    class="w-[24px] h-[24px]"
                    @click="() => handleClickPageNumber(page)"
                >
                    <span
                        class="font-[500] text-[14px] leading-[20px] flex justify-center"
                        :class="[page === currentPageIdx ? 'text-[#333333]' : 'text-[#BDBDBD]']"
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

<style scoped>
.amount-box {
    box-shadow:
        0 1px 3px rgba(0, 0, 0, 0.12),
        0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>
