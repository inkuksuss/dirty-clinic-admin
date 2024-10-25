import { getApiInstance } from '@/utils/api';

export interface PageManagerInterface<T> {
    init(defaultUrl: string, rowCount?: number): void;
    loadData(query: string): void;
    goNextChapter(query?: string): void;
    goPrevChapter(query?: string): void;
    movePage(to: number, query?: string): void;
    destroy(): void;
}

export class PageManager<T> implements PageManagerInterface<T> {
    private _rowCount = 7;
    private _url: string | undefined = undefined;
    private _currentPage: number = 1;
    private _totalElements: number = 0;
    private _hasNext: boolean = false;
    private _hasPrev: boolean = false;
    private _chapterNum: number = 1;
    private _totalPages: number = 0;
    private _pageList: Array<number> = [];
    private _contents: Array<T> = [];
    private _isReady: boolean = false;
    private _isDebug = false;

    init(defaultUrl: string, rowCount?: number): void {
        this._url = defaultUrl;
        if (rowCount) this._rowCount = rowCount ?? 7;
        this._currentPage = 1;
        this._totalElements = 0;
        this._hasNext = false;
        this._hasPrev = false;
        this._chapterNum = 1;
        this._totalPages = 0;
        this._pageList = [];
        this._contents = [];
        this._isReady = true;
    }

    async loadData(query: string): Promise<void> {
        if (!this._isReady) throw new Error('PageManager is not ready');

        try {
            const res = await getApiInstance().get(`${this._url}?page=0${query ?? ''}`);
            if (res.data.code === 0) {
                const data = res.data.data;
                this._contents = data.content;
                this._totalPages = data.totalPages;
                this._totalElements = data.totalElements;
                this._hasNext = data.totalPages > 10;
                this._currentPage = 1;

                if (this._totalElements === 0) {
                    this._pageList = [1];
                    this._currentPage = 1;
                    return;
                }

                const lastPageIdx = this._totalPages >= 10 ? 10 : this._totalPages;
                this._pageList = [];
                for (let i = 1; i <= lastPageIdx; i++) {
                    this._pageList.push(i);
                }
                console.log(res);
            } else {
                if (this._isDebug) console.log(res);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async goNextChapter(query?: string): Promise<void> {
        if (!this._isReady) throw new Error('PageManager is not ready');
        if (!this._hasNext) return;

        const nextFirstPage = this._chapterNum * 10 + 1;
        const url = `${this._url}?page=${nextFirstPage - 1}${query ?? ''}`;
        try {
            const res = await getApiInstance().get(url);
            if (res.data.code === 0) {
                const data = res.data.data;
                this._chapterNum++;
                this._totalElements = data.totalElements;
                this._totalPages = data.totalPages;
                this._contents = data.content;
                this._currentPage = nextFirstPage;
                this._hasPrev = true;

                if (this._totalPages === 0) {
                    this._pageList = [1];
                    this._currentPage = 1;
                } else {
                    const lastPageIdx =
                        this._totalPages >= 10 * this._chapterNum
                            ? 10 * this._chapterNum
                            : this._totalPages;
                    const lastPage = lastPageIdx % 10 === 0 ? 10 : lastPageIdx % 10;

                    this._hasNext = this._totalPages > 10 * this._chapterNum;

                    this._pageList = [];
                    for (let i = 1; i <= lastPage; i++) {
                        this._pageList.push(i + (this._chapterNum - 1) * 10);
                    }
                }
            } else {
                if (this._isDebug) console.log(res);
            }
        } catch (e) {
            console.log(e);
        }
    }
    async goPrevChapter(query?: string): Promise<void> {
        if (!this._isReady) throw new Error('PageManager is not ready');
        if (!this._hasPrev) return;

        const prevFirstPage = (this._chapterNum - 2) * 10 + 1;
        const url = `${this._url}?page=${prevFirstPage - 1}${query ?? ''}`;
        try {
            const res = await getApiInstance().get(url);
            if (res.data.code === 0) {
                const data = res.data.data;
                this._totalElements = data.totalElements;
                this._contents = data.content;
                this._hasNext = true;
                this._currentPage = prevFirstPage;
                this._chapterNum--;
                this._pageList = [];
                for (let i = 1; i <= 10; i++) {
                    this._pageList.push(i + (this._chapterNum - 1) * 10);
                }
            } else {
                if (this._isDebug) console.log(res);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async movePage(to: number, query?: string): Promise<void> {
        if (!this._isReady) throw new Error('PageManager is not ready');
        if (this._currentPage === to) return;

        try {
            const res = await getApiInstance().get(`${this._url}?page=${to - 1}${query}`);
            if (res.data.code === 0) {
                const data = res.data.data;
                this._totalPages = data.totalPages;
                this._totalElements = data.totalElements;
                this._contents = data.content;
                this._currentPage = to;
            } else {
                if (this._isDebug) console.log(res);
            }
        } catch (e) {
            console.log(e);
        }
    }

    destroy(): void {
        this._contents = [];
        this._pageList = [];
    }

    get contents(): Array<T> {
        return this._contents;
    }
    get pageList(): Array<number> {
        return this._pageList;
    }
    get currentPage(): number {
        return this._currentPage;
    }

    get totalElements(): number {
        return this._totalElements;
    }
}

let pm: PageManager<any> | null;

export const getPageManager = (): PageManager<any> => {
    if (pm) return pm;
    else {
        pm = new PageManager<any>();
        return pm;
    }
};

export const removePageManager = () => {
    pm?.destroy();
    pm = null;
};
