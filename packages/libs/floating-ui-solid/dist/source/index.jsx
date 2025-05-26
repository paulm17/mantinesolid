import { arrow as arrowInternal } from '@floating-ui/dom';
export { autoPlacement, autoUpdate, detectOverflow, flip, hide, inline, limitShift, offset, platform, shift, size, } from '@floating-ui/dom';
export function arrow({ element, padding, }) {
    return arrowInternal({ element: element, padding: padding ?? 0 });
}
export * from './types';
export { createFloating } from './hooks/createFloating';
