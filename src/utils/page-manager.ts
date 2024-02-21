export interface PageManagerInterface {
    destroy(): void;
}

export class PageManager implements PageManagerInterface {
    destroy(): void {}
}

let pm: PageManager | null;

export const getPageManager = (): PageManager => {
    if (pm) return pm;
    else throw new Error('can not found page manager');
};

export const removePageManager = () => {
    pm?.destroy();
    pm = null;
};
