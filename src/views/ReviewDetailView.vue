<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import ClinicTopBar from '@/components/common/ClinicTopbar.vue';
import { QuillEditor } from '@vueup/vue-quill';
import moment from 'moment';
import ClinicInput from '@/components/common/ClinicInput.vue';
//@ts-ignore
import ImageUploader from 'quill-image-uploader';
import { getApiInstance } from '@/utils/api';
import router from '@/router';
import { useRoute } from 'vue-router';



export default defineComponent({
    components: { QuillEditor, ClinicTopBar, ClinicInput },
    setup() {
        const route = useRoute();
        const username = ref<string>();
        const today = ref<string>(moment(new Date()).format('YY.MM.DD'));
        const created = ref<string>();
        const title = ref<string>();
        const content = ref<string>();
        const modules = {
            name: 'imageUploader',
            module: ImageUploader,
            options: {
                upload: (file: File) => {
                    return new Promise((resolve, reject) => {
                        if (!file) {
                            window.alert('파일이 존재하지 않습니다.');
                            reject('Upload failed');
                        }

                        const fileName = file.name;
                        const ext = fileName.substring(fileName.lastIndexOf('.') + 1);
                        const MaxFileSize = 1024 * 1024 * 5;

                        if (file.size > MaxFileSize) {
                            window.alert('파일 사이즈는 5MB를 넘을 수 없습니다.');
                            reject('Upload failed');
                        }

                        if (!['jpg', 'jpeg', 'png'].includes(ext)) {
                            window.alert('jpg, jpeg, png 파일만 업로드 가능합니다.');
                            reject('Upload failed');
                        }

                        const formData = new FormData();
                        formData.append('image', file);
                        formData.append('type', 'review');

                        getApiInstance()
                            .post('/admin/file/upload/image', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            })
                            .then((res) => {
                                resolve(res.data.data);
                            })
                            .catch((err) => {
                                reject('Upload failed');
                                console.error('Error:', err);
                            });
                    });
                }
            }
        };

        const handleChangeUsername = (v: string | undefined) => {
            if (v) username.value = v;
        };

        const handleChangeTitle = (v: string | undefined) => {
            if (v) title.value = v;
        };

        const handleChangeContent = (html: string) => {
            content.value = html;
        };

        const findThumbnail = (): string | null => {
            let thumbnail = null;
            const editor = document.getElementById('ql-editor');
            if (editor) {
                const imgList = editor.getElementsByTagName('img');
                for (let i = 0; i < imgList.length; i++) {
                    if (i === 0) thumbnail = imgList[0].getAttribute('src');
                }
            }
            return thumbnail;
        };

        const doSave = () => {
            if (!username.value || username.value?.trim() === '') {
                window.alert('게시글 작성자를 입력해주세요.');
                return;
            }

            if (!title.value || title.value?.trim() === '') {
                window.alert('게시글 제목을 입력해주세요.');
                return;
            }

            if (!content.value || content.value?.trim() === '') {
                window.alert('게시글 내용을 입력해주세요.');
                return;
            }

            getApiInstance()
                .post('/admin/review/modify', {
                    id: route.params.id,
                    creatorName: username.value,
                    title: title.value,
                    content: content.value,
                    thumbnail: findThumbnail()
                })
                .then((res) => {
                    if (res.data.code === 0) {
                        window.alert('저장되었습니다.');
                        loadData();
                    } else {
                        window.alert(res.data.message);
                    }
                })
                .catch((e) => window.alert('오류가 발생하였습니다.'));
        };

        const doDelete = () => {
            if (window.confirm('정말 삭제하시겠습니까?')) {
                getApiInstance()
                    .post('/admin/review/remove', {
                        idList: [route.params.id]
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
                        router.push('/review');
                    });
            }
        };

        const loadData = () => {
            if (route.params.id) {
                getApiInstance()
                    .get(`/admin/review/detail/${route.params.id}`)
                    .then((res) => {
                        if (res.data.code === 0) {
                            const data = res.data.data;
                            username.value = data.creatorName;
                            title.value = data.title;
                            content.value = data.content;
                            created.value = moment(data.created).format('YY.MM.DD');
                        } else {
                            window.alert(res.data.message);
                            router.push('/review');
                        }
                    })
                    .catch((e) => {
                        window.alert('오류가 발생하였습니다.');
                        router.push('/review');
                    });
            }
        };

        onMounted(() => {
            loadData();
        });

        return {
            username,
            today,
            title,
            content,
            modules,
            created,
            doDelete,
            doSave,
            handleChangeUsername,
            handleChangeTitle,
            handleChangeContent
        };
    }
});
</script>

<template>
    <clinic-top-bar></clinic-top-bar>
    <div class="review-detail-wrapper bg-[--bg-color] ml-[22%] px-[20px] flex items-center flex-col">
        <div class="review-contents max-w-[900px] w-full h-max">
            <div
                class="bg-[--color-white] w-full h-[80px] rounded-[8px] flex justify-between items-center px-[20px] mb-[20px]"
            >
                <div class="text-[22px] font-[700]">후기 관리</div>
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
                class="bg-[--color-white] w-full h-[80px] rounded-[8px] flex flex-col px-[20px] py-[30px] h-max mb-[30px]"
            >
                <div class="text-[24px] font-[700] mb-[10px]">게시글</div>
                <div class="px-[10px] h-max w-full">
                    <div class="flex w-full">
                        <div class="w-[400px] mr-[40px]">
                            <clinic-input
                                label="게시글 작성자"
                                place-holder="작성자 이름을 입력하세요."
                                :value="username"
                                :change-handler="handleChangeUsername"
                            ></clinic-input>
                        </div>
                        <div class="w-[400px]">
                            <clinic-input
                                label="게시 날짜"
                                :place-holder="created"
                                :read-only="true"
                                value=""
                            ></clinic-input>
                        </div>
                    </div>
                    <div class="mb-[20px]">
                        <clinic-input
                            label="게시글 제목"
                            place-holder="게시글 제목을 입력하세요."
                            :value="title"
                            :change-handler="handleChangeTitle"
                        ></clinic-input>
                    </div>
                    <div class="editor-wrapper w-full h-max">
                        <div class="text-[14px] font-[900] mb-[10px]">게시글 내용</div>
                        <QuillEditor
                            id="ql-editor"
                            class="!h-[400px]"
                            theme="snow"
                            :content="content"
                            content-type="html"
                            @update:content="handleChangeContent"
                            :toolbar="[
                                'bold',
                                'italic',
                                'underline',
                                'image',
                                'strike',
                                { size: ['small', false, 'large', 'huge'] },
                                { list: 'ordered' },
                                { list: 'bullet' },
                                { list: 'check' },
                                { color: [] }
                            ]"
                            :modules="modules"
                        ></QuillEditor>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
