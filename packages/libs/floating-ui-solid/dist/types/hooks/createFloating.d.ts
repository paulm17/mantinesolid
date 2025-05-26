import { MiddlewareData } from '@floating-ui/dom';
import { CSSProperties, createFloatingProps } from '../types';
export declare const createFloating: (props: createFloatingProps) => {
    x: () => number;
    y: () => number;
    placement: () => import("@floating-ui/utils").Placement;
    strategy: () => import("@floating-ui/utils").Strategy;
    isPositioned: () => boolean;
    floatingStyles: import("solid-js").Accessor<import("solid-js").JSX.CSSProperties>;
    setFloatingStyles: (params: CSSProperties) => import("solid-js").JSX.CSSProperties;
    middleware: () => MiddlewareData;
    elements: {
        reference: () => HTMLElement;
        floating: () => HTMLElement;
    };
    refs: {
        setReference: import("solid-js").Setter<HTMLElement>;
        setFloating: import("solid-js").Setter<HTMLElement>;
    };
    update: () => void;
};
