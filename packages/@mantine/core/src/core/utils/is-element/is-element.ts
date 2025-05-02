import { JSXElement } from 'solid-js';

export function isElement(value: any): value is JSXElement {
  if (Array.isArray(value) || value === null) {
    return false;
  }

  if (typeof value === 'object') {
    return (
      typeof value.type === 'string' ||
      typeof value.type === 'function' ||
      value.$$typeof === Symbol.for('solid-element')
    );
  }

  return false;
}
