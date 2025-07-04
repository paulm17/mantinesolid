import type { FloatingContext } from "./use-floating";
import type { ElementProps } from "./use-interactions";
interface DelayOptions {
    /**
     * Time in ms that will delay the change of the open state to true.
     * @default 0
     */
    open?: number;
    /**
     * Time in ms that will delay the change of the open state to false.
     * @default 0
     */
    close?: number;
}
interface HandleCloseFn {
    (context: FloatingContext & {
        onClose: () => void;
        leave?: boolean;
    }): (event: MouseEvent) => void;
    __options: {
        blockPointerEvents: boolean;
    };
}
interface UseHoverOptions {
    /**
     * Enables/disables the hook.
     * @default true
     */
    enabled?: boolean;
    /**
     * Only allow pointers of type mouse to trigger the hover (thus excluding pens and touchscreens).
     * @default false
     */
    mouseOnly?: boolean;
    /**
     * Time in ms that will delay the change of the open state.
     * @default 0
     */
    delay?: number | DelayOptions;
    /**
     * Time in ms that the pointer must rest on the reference element before the open state is set to true.
     * @default 0
     */
    restMs?: number;
    /**
     * Whether moving the pointer over the floating element will open it, without a regular hover event required.
     * @default true
     */
    move?: boolean;
    /**
     * Callback to handle the closing of the floating element.
     * @default null
     */
    handleClose?: HandleCloseFn | null;
}
export declare function getDelay(value: UseHoverOptions["delay"], prop: "open" | "close", pointerType?: PointerEvent["pointerType"]): number;
declare function useHover(context: () => FloatingContext, options?: () => UseHoverOptions): () => ElementProps;
export type { UseHoverOptions };
export { useHover };
