import { createSignal, createEffect, onCleanup } from 'solid-js';
import { randomId } from '../utils';

function getHeadingsData(
  headings: HTMLElement[],
  getDepth: (element: HTMLElement) => number,
  getValue: (element: HTMLElement) => string
): UseScrollSpyHeadingData[] {
  const result: UseScrollSpyHeadingData[] = [];

  for (let i = 0; i < headings.length; i += 1) {
    const heading = headings[i];
    result.push({
      depth: getDepth(heading),
      value: getValue(heading),
      id: heading.id || randomId(),
      getNode: () => (heading.id ? document.getElementById(heading.id)! : heading),
    });
  }

  return result;
}

function getActiveElement(rects: DOMRect[]) {
  if (rects.length === 0) {
    return -1;
  }

  const closest = rects.reduce(
    (acc, item, index) => {
      if (Math.abs(acc.position) < Math.abs(item.y)) {
        return acc;
      }

      return {
        index,
        position: item.y,
      };
    },
    { index: 0, position: rects[0].y }
  );

  return closest.index;
}

function getDefaultDepth(element: HTMLElement) {
  return Number(element.tagName[1]);
}

function getDefaultValue(element: HTMLElement) {
  return element.textContent || '';
}

export interface UseScrollSpyHeadingData {
  /** Heading depth, 1-6 */
  depth: number;

  /** Heading text content value */
  value: string;

  /** Heading id */
  id: string;

  /** Function to get heading node */
  getNode: () => HTMLElement;
}

export interface UseScrollSpyOptions {
  /** Selector to get headings, `'h1, h2, h3, h4, h5, h6'` by default */
  selector?: string;

  /** A function to retrieve depth of heading, by default depth is calculated based on tag name */
  getDepth?: (element: HTMLElement) => number;

  /** A function to retrieve heading value, by default `element.textContent` is used */
  getValue?: (element: HTMLElement) => string;
}

export interface UseScrollSpyReturnType {
  /** Index of the active heading in the `data` array */
  active: number;

  /** Headings data. If not initialize, data is represented by an empty array. */
  data: UseScrollSpyHeadingData[];

  /** True if headings value have been retrieved from the DOM. */
  initialized: boolean;

  /** Function to update headings values after the parent component has mounted. */
  reinitialize: () => void;
}

export function useScrollSpy({
  selector = 'h1, h2, h3, h4, h5, h6',
  getDepth = getDefaultDepth,
  getValue = getDefaultValue,
}: UseScrollSpyOptions = {}): UseScrollSpyReturnType {
  const [active, setActive] = createSignal(-1);
  const [initialized, setInitialized] = createSignal(false);
  const [data, setData] = createSignal<UseScrollSpyHeadingData[]>([]);
  let headingsRef: UseScrollSpyHeadingData[] = [];

  const handleScroll = () => {
    setActive(
      getActiveElement(headingsRef.map((d) => d.getNode().getBoundingClientRect()))
    );
  };

  const initialize = () => {
    const headings = getHeadingsData(
      Array.from(document.querySelectorAll(selector)),
      getDepth,
      getValue
    );
    headingsRef = headings;
    setInitialized(true);
    setData(headings);
    setActive(getActiveElement(headings.map((d) => d.getNode().getBoundingClientRect())));
  };

  createEffect(() => {
    initialize();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return {
    reinitialize: initialize,
    active: active(),
    initialized: initialized(),
    data: data(),
  };
}
