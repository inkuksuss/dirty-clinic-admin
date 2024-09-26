export const getUuid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

export const getCookie = (name: string) => {
    console.log(document.cookie);
};

export const loadLocalStorage = (key: string): any => {
    return window.localStorage.getItem(key);
};

export const saveLocalStorage = (key: string, value: string) => {
    window.localStorage.setItem(key, value);
};

export const removeLocalStorage = (key: string) => {
    window.localStorage.removeItem(key);
};

export const clearLocalStorage = () => {
    window.localStorage.clear();
};

export const getPeriodAtDate = (start: Date, end: Date) => {
    const millisecondsInOneDay = 24 * 60 * 60 * 1000;

    return Math.floor((end.getTime() - start.getTime()) / millisecondsInOneDay);
};
