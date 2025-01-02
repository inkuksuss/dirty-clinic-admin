<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue';
import ClinicTopBar from '@/components/common/ClinicTopbar.vue';
import Datepicker from 'vue3-datepicker';
import { ko } from 'date-fns/locale';
import { type DisableDay } from '@/utils/types';
import moment from 'moment';
import router from '@/router';
import { getPageManager, removePageManager } from '@/utils/page-manager';
import { getApiInstance } from '@/utils/api';

export default defineComponent({
    components: { ClinicTopBar, Datepicker },
    setup() {
        const targetDate = ref<Date>(new Date());

        const compLocale = computed(() => ko);
        const disableDayList = ref<DisableDay[]>([]);
        const pageViewList = ref<number[]>([]);
        const currentPageIdx = ref<number>(1);

        const loadData = async () => {
            getPageManager().init('/admin/day/summary');
            await getPageManager().loadData('');
            pageViewList.value = getPageManager().pageList;
            disableDayList.value = getPageManager().contents;
            currentPageIdx.value = getPageManager().currentPage;
        };

        const handleClickDelete = (id: number) => {
            if (!id) {
                window.alert('고유번호가 존재하지 않습니다.');
                return;
            }

            if (window.confirm('정말 삭제하시겠습니까?')) {
                getApiInstance()
                    .get(`/admin/day/delete?id=${id}`)
                    .then((res) => {
                        if (res.data.code === 0) {
                            window.alert('삭제 완료하였습니다.');
                            router.go(0);
                        } else {
                            window.alert(res.data.message);
                        }
                    })
                    .catch((e) => window.alert('삭제에 실패하였습니다.'));
            }
        };

        const handleClickAdd = () => {
            if (window.confirm('예약 불가 일자를 등록하시겠습니까?')) {

                getApiInstance()
                    .post('/admin/day/add', { targetDay: moment(targetDate.value).format("YYYY-MM-DD") })
                    .then((res) => {
                        if (res.data.code === 0) {
                            window.alert('등록 완료되었습니다.');
                            router.go(0);
                        } else {
                            window.alert(res.data.message);
                        }
                    })
                    .catch((e) => {
                        window.alert('등록에 실패하였습니다.');
                    });
            }
        };

        const handleChangeDate = (_: Date | null | undefined) => {
            const today = new Date();
            if (today > targetDate.value) {
                window.alert('예약 불가 일자는 과거일 수 없습니다.');
                targetDate.value = today;
                return;
            }
        };

        const handleClickPageArrow = async (isLeft: boolean) => {
            if (isLeft) await getPageManager().goPrevChapter('');
            else await getPageManager().goNextChapter('');
            currentPageIdx.value = getPageManager().currentPage;
            pageViewList.value = getPageManager().pageList;
            disableDayList.value = getPageManager().contents;
        };

        const handleClickPageNumber = async (v: number) => {
            await getPageManager().movePage(v, '');
            pageViewList.value = getPageManager().pageList;
            disableDayList.value = getPageManager().contents;
            currentPageIdx.value = getPageManager().currentPage;
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
            disableDayList,
            targetDate,
            compLocale,
            pageViewList,
            currentPageIdx,
            moment,
            handleClickDelete,
            handleClickAdd,
            handleChangeDate,
            handleClickPageArrow,
            handleClickPageNumber,
            handleClickRow
        };
    }
});
</script>

<template>
    <clinic-top-bar></clinic-top-bar>
    <div
        class="calendar-wrapper bg-[--bg-color] ml-[22%] px-[20px] flex items-center flex-col min-h-[calc(100vh_-_72px)]"
    >
        <div class="calendar-contents min-w-[900px] w-[95%] bg-[--color-white] rounded-[8px] h-max">
            <div class="title-wrapper w-full h-[80px] px-[20px] flex justify-start items-center">
                <span class="text-[22px] font-[700] leading-[26px] text-[--color-text-black]"
                    >날짜 관리</span
                >
                <span class="text-[14px] font-[500] text-[--color-text-gray] ml-[5px]"
                    >*예약 불가한 날짜를 지정할 수 있습니다.</span
                >
            </div>
            <div
                class="search-wrapper bg-[--bg-gray-color] h-[120px] flex justify-between items-center"
            >
                <div class="date-wrapper flex flex-col py-[15px] pl-[20px] w-full">
                    <div
                        class="text-[14px] font-[400] text-[--color-text-black] leading-[17px] mb-[11px]"
                    >
                        예약 불가 일자를 선택하세요.
                    </div>
                    <div class="date-box flex justify-between items-center w-full">
                        <div class="relative w-[185px] h-[40px]">
                            <Datepicker
                                class="w-full h-[40px] border-[1px] rounded-[4px] px-[12px]"
                                v-model="targetDate"
                                :locale="compLocale"
                                @update:modelValue="handleChangeDate"
                            ></Datepicker>
                            <img
                                class="absolute w-[18px] h-[18px] top-[11px] right-[12px]"
                                src="@/assets/images/icons/calendar@1x.svg"
                            />
                        </div>
                        <div
                            class="w-[62px] h-[40px] mr-[20px] border-[1px] bg-[--color-main-blue] rounded-[4px] flex-center text-[14px] font-[600] text-[--color-white]"
                            @click="handleClickAdd"
                        >
                            + 등록
                        </div>
                    </div>
                    <div class="text-[14px] font-[500] text-[--color-text-gray] mt-[7px]">
                        *일자를 선택하면 사용자가 해당 날짜에 예약을 할 수 없습니다.
                    </div>
                </div>
            </div>
            <div class="calendar-body w-full h-max">
                <div
                    class="body-header w-full flex px-[25px] pt-[30px] h-[70px] items-center border-b-[1px] border-[#EEEEEE] mb-[10px] justify-between"
                >
                    <div class="w-full flex justify-start">
                        <div
                            class="w-[64px] mr-[60px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            번호
                        </div>
                        <div
                            class="w-[100px] mr-[25px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            예약 불가 일자
                        </div>
                        <div
                            class="w-[130px] text-center text-[14px] font-[400] text-[--color-text-white-gray] text-center"
                        >
                            삭제
                        </div>
                    </div>
                </div>
                <div v-if="disableDayList.length > 0" class="body-list w-full">
                    <div
                        v-for="(disableDay, idx) in disableDayList"
                        :key="disableDay.disableDayId"
                        class="body-content py-[14px] flex items-center cursor-pointer justify-between px-[25px]"
                    >
                        <div class="flex justify-start w-full">
                            <div
                                class="w-[64px] mr-[60px] min-w-[64px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center flex items-center justify-center"
                            >
                                <span>{{ (currentPageIdx - 1) * 7 + idx + 1 }}</span>
                            </div>
                            <div
                                class="w-[100px] mr-[25px] min-w-[89px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center flex items-center justify-center"
                            >
                                <span>{{ moment(disableDay.targetDay).format('YY.MM.DD') }}</span>
                            </div>
                            <div class="w-[130px] h-[25px] flex justify-center">
                                <div
                                    @click="() => handleClickDelete(disableDay.disableDayId)"
                                    class="w-[65px] h-[25px] bg-[--color-red] rounded-[8px] text-[--color-white] font-[700] text-[14px] text-center py-[2.5px] leading-[20px]"
                                >
                                    삭제
                                </div>
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
