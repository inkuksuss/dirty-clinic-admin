// 요청 인터셉터 추가하기
import axios from 'axios';
import { CONSTANTS } from '../../constants';
import { loadLocalStorage } from '@/utils/common';
import router from '@/router';
import { useRouter } from 'vue-router';

const axiosInstance = axios.create({
    baseURL: CONSTANTS.API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + loadLocalStorage(CONSTANTS.KEY.UT)
    }
});

// axiosInstance.defaults.withCredentials = true;

axiosInstance.interceptors.request.use(
    function (config) {
        config.headers.Authorization = 'Bearer ' + loadLocalStorage(CONSTANTS.KEY.UT);
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    async (response) => {
        if (response.data.code === 9) {
            window.alert('토큰이 만료되어 로그인 페이지로 이동합니다.');
            window.location.href = '/';
            // await useRouter().push('/');
        }
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export const getApiInstance = () => {
    return axiosInstance;
};
