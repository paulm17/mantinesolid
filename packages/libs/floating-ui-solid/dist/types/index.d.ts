export { autoPlacement, autoUpdate, detectOverflow, flip, hide, inline, limitShift, offset, platform, shift, size, } from '@floating-ui/dom';
export declare function arrow({ element, padding, }: {
    element: HTMLElement | null | undefined;
    padding?: number;
}): {
    name: string;
    options?: any;
    fn: (state: import("@floating-ui/dom").MiddlewareState) => import("@floating-ui/core").MiddlewareReturn | Promise<import("@floating-ui/core").MiddlewareReturn>;
};
export * from './types';
export { createFloating } from './hooks/createFloating';
