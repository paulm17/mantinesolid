import { createEffect, createMemo, createSignal, For, Index, Match, Show, splitProps, Switch } from 'solid-js';
import { usePaginationContext } from '../Pagination.context';
import { PaginationIcon } from '../Pagination.icons';
import { PaginationControl } from '../PaginationControl/PaginationControl';
import { PaginationDots } from '../PaginationDots/PaginationDots';
import { Stack } from '../../Stack';

export interface PaginationItemsProps {
  /** Dots icon component */
  dotsIcon?: PaginationIcon;
}

function generatePaginationRange(active: number, total: number): (number | 'dots')[] {
  const delta = 2;                    // how many pages on each side of active
  const range: (number | 'dots')[] = [];

  if (total <= 1) {
    return [1];
  }

  // if the total number of pages is small, just show them all
  if (total <= delta * 4 + 1) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // always include the first page
  range.push(1);

  // compute the "edge" window size in pages
  const edgeWindow = delta * 2 + 1;   // for delta=2 this is 5

  let start: number;
  let end: number;

  // near the left edge?
  if (active <= edgeWindow) {
    start = 2;
    end = edgeWindow;
  }
  // near the right edge?
  else if (active >= total - edgeWindow + 1) {
    start = total - edgeWindow + 1;
    end = total - 1;
  }
  // somewhere in the middle
  else {
    start = active - delta;
    end = active + delta;
  }

  // if there's a gap before start, show dots
  if (start > 2) {
    range.push('dots');
  }

  // add the window of pages
  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  // if there's a gap after end, show dots
  if (end < total - 1) {
    range.push('dots');
  }

  // always include the last page
  range.push(total);

  return range;
}


export function PaginationItems(props: PaginationItemsProps) {
  const ctx = usePaginationContext();

  // The createMemo is perfect, it will re-run when the active page changes.
  const range = createMemo(() => {
    return generatePaginationRange(ctx.active(), ctx.total());
  });

  createEffect(() => {
    console.log('range', range());
  });

  return (
    // Use <For> instead of <Index>
    <For each={range()}>
      {(page) => (
        <Stack>
          {page === 'dots' ? (
            <PaginationDots icon={props.dotsIcon} />
          ) : (
            <PaginationControl
              active={page === ctx.active()}
              onClick={() => ctx.onChange(page as number)}
              disabled={ctx.disabled()}
            >
              {page}
            </PaginationControl>
          )}
        </Stack>
      )}
    </For>
  );
}

PaginationItems.displayName = '@mantine/core/PaginationItems';
