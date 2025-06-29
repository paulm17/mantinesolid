import type { FloatingContext } from "./use-floating";
interface UseFocusOptions {
    /**
     * Whether the Hook is enabled, including all internal Effects and event
     * handlers.
     * @default true
     */
    enabled?: boolean;
    /**
     * Whether the open state only changes if the focus event is considered
     * visible (`:focus-visible` CSS selector).
     * @default true
     */
    visibleOnly?: boolean;
}
declare function useFocus(context: FloatingContext, options?: UseFocusOptions): import("solid-js").Accessor<{
    readonly reference: {
        onPointerDown?: undefined;
        onMouseLeave?: undefined;
        onFocus?: undefined;
        onBlur?: undefined;
    } | {
        onPointerDown: (event: PointerEvent) => void;
        onMouseLeave(): void;
        onFocus: (event: FocusEvent) => void;
        onBlur: (event: FocusEvent) => void;
    };
}>;
export type { UseFocusOptions };
export { useFocus };
