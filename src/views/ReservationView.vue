<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import ClinicTopBar from '@/components/common/ClinicTopbar.vue';
import Datepicker from 'vue3-datepicker';
import { ko } from 'date-fns/locale';
import { ReservationState, ReservationType, type ReservationSummary } from '@/utils/types';
import moment from 'moment';
import router from '@/router';
import { getPageManager, removePageManager } from '@/utils/page-manager';
import { getApiInstance } from '@/utils/api';
import { getPeriodAtDate } from '@/utils/common';

type ReservationView = ReservationSummary & { isSelect: boolean };

export default defineComponent({
    components: { ClinicTopBar, Datepicker },
    setup() {
        const today = new Date();
        const startDate = ref<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
        const endDate = ref<Date>(today);
        const tempStartDate = ref<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
        const tempEndDate = ref<Date>(today);

        const searchValue = ref<string>('');
        const lastSearchValue = ref<string>('');
        const maxLimitDate = new Date();
        const compLocale = computed(() => ko);
        const checkAll = ref<boolean>(false);
        const reservationList = ref<ReservationView[]>([]);
        const pageViewList = ref<number[]>([]);
        const currentPageIdx = ref<number>(1);

        const loadData = async () => {
            getPageManager().init('/admin/reservation/summary');
            let query = `&startDate=${moment(startDate.value).format(
                'YYYY-MM-DD'
            )}&endDate=${moment(endDate.value).format('YYYY-MM-DD')}`;
            if (lastSearchValue.value && lastSearchValue.value.trim() !== '') {
                query = `&searchValue=${lastSearchValue.value}`;
            }
            await getPageManager().loadData(query);
            searchValue.value = lastSearchValue.value;
            pageViewList.value = getPageManager().pageList;
            reservationList.value = getPageManager().contents;
            currentPageIdx.value = getPageManager().currentPage;
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
                    });
            }
        };

        const handleClickAdd = () => {
            router.push('/add/reservation');
        };

        const updateByDate = async (query: string) => {
            await getPageManager().loadData(query);
            lastSearchValue.value = searchValue.value;
            pageViewList.value = getPageManager().pageList;
            reservationList.value = getPageManager().contents;
            currentPageIdx.value = getPageManager().currentPage;
        };

        const handleChangeStartDate = (_: Date | null | undefined) => {
            if (startDate.value > endDate.value) {
                window.alert('시작일이 종료일보다 클 수 없습니다.');
                startDate.value = endDate.value;
                return;
            }

            if (getPeriodAtDate(startDate.value, endDate.value) > 60) {
                window.alert('검색 범위는 60일을 초과할 수 없습니다.');
                startDate.value = tempStartDate.value;
                return;
            }

            tempStartDate.value = startDate.value;
            let query = `&startDate=${moment(startDate.value).format(
                'YYYY-MM-DD'
            )}&endDate=${moment(endDate.value).format('YYYY-MM-DD')}`;
            if (searchValue.value && searchValue.value.trim() !== '') {
                query += `&searchValue=${searchValue.value}`;
            }

            updateByDate(query);
        };

        const handleChangeEndDate = (_: Date | null | undefined) => {
            if (startDate.value > endDate.value) {
                window.alert('종료일이 시작일보다 작을 수 없습니다.');
                endDate.value = startDate.value;
                return;
            }

            if (getPeriodAtDate(startDate.value, endDate.value) > 60) {
                window.alert('검색 범위는 60일을 초과할 수 없습니다.');
                endDate.value = tempEndDate.value;
                return;
            }

            tempEndDate.value = endDate.value;
            let query = `&startDate=${moment(startDate.value).format(
                'YYYY-MM-DD'
            )}&endDate=${moment(endDate.value).format('YYYY-MM-DD')}`;
            if (searchValue.value && searchValue.value.trim() !== '') {
                query += `&searchValue=${searchValue.value}`;
            }

            updateByDate(query);
        };

        const handleChangeKeyword = (e: Event) => {
            searchValue.value = (e.target as any).value;
        };

        const doSearchByKeyword = async () => {
            const query = `&searchValue=${searchValue.value}&startDate=${moment(
                startDate.value
            ).format('YYYY-MM-DD')}&endDate=${moment(endDate.value).format('YYYY-MM-DD')}`;
            lastSearchValue.value = searchValue.value;
            await getPageManager().loadData(query);
            pageViewList.value = getPageManager().pageList;
            reservationList.value = getPageManager().contents;
            currentPageIdx.value = getPageManager().currentPage;
        };

        const handleEnterDown = (e: KeyboardEvent): void => {
            if (e.key === 'Enter') {
                if (e.isComposing || e.keyCode === 229) return;
                doSearchByKeyword();
            }
        };

        const handleClickPageArrow = async (isLeft: boolean) => {
            let query = `&startDate=${moment(startDate.value).format(
                'YYYY-MM-DD'
            )}&endDate=${moment(endDate.value).format('YYYY-MM-DD')}`;
            if (lastSearchValue.value && lastSearchValue.value.trim() !== '') {
                query += `&searchValue=${lastSearchValue.value}`;
            }
            searchValue.value = lastSearchValue.value;
            if (isLeft) await getPageManager().goPrevChapter(query);
            else await getPageManager().goNextChapter(query);
            currentPageIdx.value = getPageManager().currentPage;
            pageViewList.value = getPageManager().pageList;
            reservationList.value = getPageManager().contents;
        };

        const handleClickPageNumber = async (v: number) => {
            let query = `&startDate=${moment(startDate.value).format(
                'YYYY-MM-DD'
            )}&endDate=${moment(endDate.value).format('YYYY-MM-DD')}`;
            if (lastSearchValue.value && lastSearchValue.value.trim() !== '') {
                query += `&searchValue=${lastSearchValue.value}`;
            }
            searchValue.value = lastSearchValue.value;
            await getPageManager().movePage(v, query);
            pageViewList.value = getPageManager().pageList;
            reservationList.value = getPageManager().contents;
            currentPageIdx.value = getPageManager().currentPage;
        };

        const handleChangeCheckAll = () => {
            reservationList.value.forEach((rs) => (rs.isSelect = checkAll.value));
        };

        const handleClickRow = (id: string) => {
            router.push(`/reservation/${id}`);
        };

        onMounted(() => {
            loadData();
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
            searchValue,
            reservationList,
            ReservationType,
            ReservationState,
            pageViewList,
            currentPageIdx,
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
        <div class="reservation-contents min-w-[900px] w-[95%] bg-[--color-white] rounded-[8px] h-max">
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
            <div class="search-wrapper bg-[--bg-gray-color] h-[98px] flex justify-start">
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
                <div class="search-input flex flex-col items-start py-[15px] mx-[20px] w-[460px]">
                    <span
                        class="text-[14px] font-[400] text-[--color-text-black] leading-[17px] mb-[11px]"
                        >검색</span
                    >
                    <div class="search-input w-full relative flex justify-between items-center">
                        <img
                            class="absolute w-[16px] h-[16px] top-[12px] left-[8px]"
                            src="@/assets/images/icons/search@1x.svg"
                        />
                        <input
                            :value="searchValue"
                            class="w-full h-[40px] rounded-[4px] pl-[32px]"
                            placeholder="예약자명을 검색하세요."
                            @input="handleChangeKeyword"
                            @keydown="handleEnterDown"
                        />
                    </div>
                </div>
            </div>
            <div class="reservation-body w-full h-max">
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
                            class="w-[64px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            구분
                        </div>
                        <div
                            class="w-[126px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            예약자 명
                        </div>
                        <div
                            class="w-[89px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            예약 일자
                        </div>
                        <div
                            class="w-[137px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            서비스 예약날짜
                        </div>
                        <div
                            class="w-[128px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            예약금 결제
                        </div>
                        <div
                            class="w-[111px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            잔금 금액
                        </div>
                        <div
                            class="w-[62px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            메모 여부
                        </div>
                    </div>
                </div>
                <div v-if="reservationList.length > 0" class="body-list w-full">
                    <div
                        v-for="(reservation, idx) in reservationList"
                        :key="reservation.reservationId"
                        class="body-content py-[14px] flex items-center cursor-pointer justify-between px-[25px]"
                    >
                        <div class="w-[45px] flex justify-start items-center">
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
                                class="w-[64px] min-w-[64px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center flex items-center justify-center"
                            >
                                <span>{{ (currentPageIdx - 1) * 7 + idx + 1 }}</span>
                            </div>
                            <div
                                class="w-[64px] min-w-[64px] text-[14px] font-[700] leading-[17px] text-[--color-text-black] text-center flex items-center justify-center"
                            >
                                <span>{{
                                    reservation.reservationPaymentId ? '예약' : '견적'
                                }}</span>
                            </div>
                            <div
                                class="w-[126px] min-w-[126px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center truncate flex items-center justify-center"
                            >
                                <span>{{ reservation.username ?? '' }}</span>
                            </div>
                            <div
                                class="w-[89px] min-w-[89px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center flex items-center justify-center"
                            >
                                <span>{{ moment(reservation.created).format('YY.MM.DD') }}</span>
                            </div>
                            <div
                                class="w-[137px] min-w-[137px] text-[14px] font-[400] leading-[17px] text-[--color-main-blue] text-center flex items-center justify-center"
                            >
                                <span>{{ moment(reservation.targetDate).format('YY.MM.DD') }}</span>
                            </div>
                            <div
                                class="w-[128px] min-w-[128px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] flex-center"
                            >
                                <div
                                    v-if="reservation.status === ReservationState.PAID"
                                    class="w-[65px] h-[25px] bg-[--color-main-blue] rounded-[8px] text-[--color-white] font-[700] text-[14px] text-center py-[2.5px] leading-[20px]"
                                >
                                    결제완료
                                </div>
                                <div
                                    v-else-if="reservation.status === ReservationState.CANCELLED"
                                    class="w-[65px] h-[25px] bg-[--color-red] rounded-[8px] text-[--color-white] font-[700] text-[14px] text-center py-[2.5px] leading-[20px]"
                                >
                                    취소
                                </div>
                                <div
                                    v-else-if="!reservation.status"
                                    class="w-[65px] h-[25px] text-[--color-text-gray] font-[700] text-[14px] text-center py-[2.5px] leading-[20px]"
                                >
                                    -
                                </div>
                                <div
                                    v-else
                                    class="w-[65px] h-[25px] bg-[--color-red] rounded-[8px] text-[--color-white] font-[700] text-[14px] text-center py-[2.5px] leading-[20px]"
                                >
                                    미완료
                                </div>
                            </div>
                            <div
                                class="flex-center w-[111px] min-w-[111px] text-[14px] font-[700] text-center truncate"
                                :class="
                                    reservation.balanceAmount
                                        ? 'text-[--color-main-blue]'
                                        : 'text-[--color-text-gray]'
                                "
                            >
                                {{
                                    reservation.balanceAmount
                                        ? reservation.balanceAmount.toLocaleString()
                                        : '-'
                                }}
                            </div>
                            <div
                                class="w-[62px] min-w-[62px] text-[14px] font-[400] leading-[25px] text-center"
                                :class="
                                    reservation.reservationAdminMemo ||
                                    reservation.paymentAdminMemo ||
                                    reservation.serviceAdminMemo
                                        ? 'text-[--color-main-blue]'
                                        : 'text-[--color-text-gray]'
                                "
                            >
                                {{
                                    reservation.reservationAdminMemo ||
                                    reservation.paymentAdminMemo ||
                                    reservation.serviceAdminMemo
                                        ? '사용'
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

<style scoped></style>
