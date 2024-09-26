<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import ClinicTopBar from '@/components/common/ClinicTopbar.vue';
import router from '@/router';
import moment from 'moment/moment';
import { getPageManager, removePageManager } from '@/utils/page-manager';
import { getApiInstance } from '@/utils/api';

type ReviewView = {
    id: number;
    creatorName: string;
    title: string;
    created: Date;
    isSelect: boolean;
};

export default defineComponent({
    components: { ClinicTopBar },
    setup() {
        const reviewList = ref<ReviewView[]>([]);
        const checkAll = ref<boolean>(false);
        const currentPageIdx = ref<number>(1);
        const searchValue = ref<string>('');
        const lastSearchValue = ref<string>('');
        const pageViewList = ref<number[]>([]);

        const handleChangeKeyword = (e: Event) => {
            searchValue.value = (e.target as any).value;
        };

        const handleEnterDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                if (e.isComposing || e.keyCode === 229) return;
                lastSearchValue.value = searchValue.value;
                loadData();
            }
        };

        const handleClickRow = (id: number) => {
            router.push(`/review/${id}`);
        };

        const handleChangeCheckAll = () => {
            reviewList.value.forEach((r) => (r.isSelect = checkAll.value));
        };

        const doSave = () => {
            router.push('/add/review');
        };

        const doDelete = () => {
            if (reviewList.value.filter((r) => r.isSelect).length < 1) {
                window.alert('선택된 대상이 없습니다.');
                return;
            }

            if (window.confirm('정말 삭제하시겠습니까?')) {
                getApiInstance()
                    .post('/admin/review/remove', {
                        idList: reviewList.value.filter((r) => r.isSelect).map((r) => r.id)
                    })
                    .then((res) => {
                        if (res.data.code === 0) {
                            window.alert('삭제 완료되었습니다.');
                        } else {
                            window.alert(res.data.message);
                        }
                    })
                    .catch((e) => window.alert('오류가 발생하였습니다.'))
                    .finally(() => {
                        checkAll.value = false;
                        loadData();
                    });
            }
        };

        const handleClickPageArrow = async (isLeft: boolean) => {
            let query = '';
            if (isLeft) await getPageManager().goPrevChapter(query);
            else await getPageManager().goNextChapter(query);
            searchValue.value = lastSearchValue.value;
            currentPageIdx.value = getPageManager().currentPage;
            pageViewList.value = getPageManager().pageList;
            reviewList.value = getPageManager().contents;
        };

        const handleClickPageNumber = async (v: number) => {
            let query = '';
            await getPageManager().movePage(v, query);
            searchValue.value = lastSearchValue.value;
            pageViewList.value = getPageManager().pageList;
            currentPageIdx.value = getPageManager().currentPage;
            reviewList.value = getPageManager().contents;
        };

        const loadData = async () => {
            getPageManager().init('/admin/review/summary');
            let query = `&searchValue=${lastSearchValue.value}`;
            await getPageManager().loadData(query);
            pageViewList.value = getPageManager().pageList;
            reviewList.value = getPageManager().contents;
            currentPageIdx.value = getPageManager().currentPage;
        };

        onMounted(async () => {
            await loadData();
        });

        onUnmounted(() => {
            removePageManager();
        });

        return {
            reviewList,
            checkAll,
            currentPageIdx,
            searchValue,
            pageViewList,
            moment,
            handleChangeKeyword,
            handleEnterDown,
            doSave,
            doDelete,
            handleClickRow,
            handleChangeCheckAll,
            handleClickPageArrow,
            handleClickPageNumber
        };
    }
});
</script>

<template>
    <clinic-top-bar></clinic-top-bar>
    <div class="review-wrapper bg-[--bg-color] ml-[22%] px-[20px] flex items-center flex-col">
        <div class="review-contents max-w-[900px] w-full bg-[--color-white] rounded-[8px]">
            <div class="title-wrapper flex w-full justify-between items-center p-[20px]">
                <div class="font-[700] text-[22px]">후기 관리</div>
                <div class="flex justify-end items-center">
                    <div
                        class="w-[62px] h-[40px] mr-[10px] border-[1px] border-[--color-main-blue] rounded-[4px] flex-center"
                        @click="doDelete"
                    >
                        <span class="text-[14px] font-[600] text-[--color-main-blue]">삭제</span>
                    </div>
                    <div
                        class="w-[62px] h-[40px] border-[1px] bg-[--color-main-blue] rounded-[4px] flex-center"
                        @click="doSave"
                    >
                        <span class="text-[14px] font-[600] text-[--color-white]">저장</span>
                    </div>
                </div>
            </div>
            <div
                class="search-wrapper p-[20px] bg-[#F7F8F9] flex flex-col items-start justify-center"
            >
                <div class="text-[14px] font-[400] mb-[10px]">검색</div>
                <div class="search-input w-full relative flex justify-between items-center">
                    <img
                        class="absolute w-[16px] h-[16px] top-[12px] left-[8px]"
                        src="@/assets/images/icons/search@1x.svg"
                    />
                    <input
                        :value="searchValue"
                        class="w-full h-[40px] rounded-[4px] pl-[32px]"
                        placeholder="게시글 제목을 입력하세요."
                        @input="handleChangeKeyword"
                        @keydown="handleEnterDown"
                    />
                </div>
            </div>

            <div class="content-body w-full h-max">
                <div
                    class="body-header w-full flex px-[25px] h-[45px] items-center border-b-[1px] border-[#EEEEEE] mb-[10px] justify-between"
                >
                    <div class="w-[45px] flex justify-start items-center">
                        <input
                            class="w-[20px] h-[20px]"
                            id="check_all"
                            type="checkbox"
                            v-model="checkAll"
                            @change="handleChangeCheckAll"
                        />
                        <label for="check_all"></label>
                    </div>
                    <div class="w-full flex justify-start items-center">
                        <div
                            class="w-[64px] text-center text-[14px] font-[400] text-[--color-text-white-gray]"
                        >
                            번호
                        </div>
                        <div
                            class="w-[500px] text-[14px] font-[400] text-[--color-text-white-gray]"
                        >
                            게시글 제목
                        </div>
                        <div
                            class="w-[126px] text-center text-[14px] font-[400] text-[--color-text-white-gray]"
                        >
                            게시일
                        </div>
                        <div
                            class="w-[126px] text-center text-[14px] font-[400] text-[--color-text-white-gray]"
                        >
                            작성자명
                        </div>
                    </div>
                </div>

                <div v-if="reviewList.length > 0" class="body-list w-full">
                    <div
                        v-for="(review, idx) in reviewList"
                        :key="review.id"
                        class="body-content py-[14px] flex items-center cursor-pointer justify-between px-[25px]"
                    >
                        <div class="w-[45px] flex justify-start items-center">
                            <input
                                class="w-[20px] h-[20px]"
                                :id="'check_one_' + idx"
                                type="checkbox"
                                v-model="review.isSelect"
                            />
                            <label :for="'check_one_' + idx"></label>
                        </div>
                        <div
                            @click="() => handleClickRow(review.id)"
                            class="flex justify-between w-full"
                        >
                            <div
                                class="w-[64px] min-w-[64px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center flex items-center justify-center"
                            >
                                <span>{{ (currentPageIdx - 1) * 7 + idx + 1 }}</span>
                            </div>
                            <div
                                class="w-[500px] max-w-[500px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center flex items-center justify-start"
                            >
                                <span class="truncate w-full">{{ review.title }}</span>
                            </div>
                            <div
                                class="w-[126px] min-w-[64px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center flex items-center justify-center"
                            >
                                <span>{{ moment(review.created).format('YY.MM.DD') }}</span>
                            </div>
                            <div
                                class="w-[126px] max-w-[126px] text-[14px] font-[400] leading-[17px] text-[--color-text-black] text-center flex items-center justify-center"
                            >
                                <span class="truncate w-full">{{ review.creatorName }}</span>
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
