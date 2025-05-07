import { splitProps, createSignal, onMount } from 'solid-js';
import createPreventScroll from 'solid-prevent-scroll';
export function RemoveScroll(props) {
    // split our custom props from generic div props
    const [local, others] = splitProps(props, [
        'enabled',
        'hideScrollbar',
        'preventScrollbarShift',
        'preventScrollbarShiftMode',
        'restoreScrollPosition',
        'allowPinchZoom',
        'noIsolation',
        'children',
    ]);
    const [ref, setRef] = createSignal(null);
    // map RemoveScroll API → createPreventScroll API
    createPreventScroll({
        element: ref,
        enabled: () => local.enabled ?? true,
        hideScrollbar: () => local.hideScrollbar ?? true,
        preventScrollbarShift: () => local.preventScrollbarShift ?? true,
        preventScrollbarShiftMode: () => local.preventScrollbarShiftMode ?? 'padding',
        restoreScrollPosition: () => local.restoreScrollPosition ?? true,
        allowPinchZoom: () => local.allowPinchZoom ?? false,
        // solid-prevent-scroll does not support inert directly;
        // you could manually apply `pointer-events: none` to siblings if needed
    });
    onMount(() => {
        if (!document.getElementById('remove-scroll-bar-styles')) {
            const style = document.createElement('style');
            style.id = 'remove-scroll-bar-styles';
            style.textContent = `
        /* shift fixed elements by scrollbar width */
        .${zeroRightClassName} {
          right: var(--scrollbar-width) !important;
        }
        .${fullWidthClassName} {
          margin-right: var(--scrollbar-width) !important;
        }
        /* within nested locks, reset shift */
        .${zeroRightClassName} .${zeroRightClassName} {
          right: 0 !important;
        }
        .${fullWidthClassName} .${fullWidthClassName} {
          margin-right: 0 !important;
        }
        /* optionally hide scrollbars via class */
        .${noScrollbarsClassName} {
          overflow: hidden !important;
        }
      `;
            document.head.appendChild(style);
        }
    });
    return (<div ref={setRef} {...others}>
      {local.children}
    </div>);
}
export const zeroRightClassName = 'right-scroll-bar-position';
export const fullWidthClassName = 'width-before-scroll-bar';
export const noScrollbarsClassName = 'with-scroll-bars-hidden';
RemoveScroll.classNames = {
    fullWidth: fullWidthClassName,
    zeroRight: zeroRightClassName,
    noScrollbars: noScrollbarsClassName
};
