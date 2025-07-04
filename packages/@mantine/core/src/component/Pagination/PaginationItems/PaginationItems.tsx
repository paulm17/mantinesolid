import { For, Match, Switch } from 'solid-js';
import { usePaginationContext } from '../Pagination.context';
import { PaginationControl } from '../PaginationControl/PaginationControl';
import { PaginationDots } from '../PaginationDots/PaginationDots';

export interface PaginationItemsProps {
  /** Dots icon component */
  dotsIcon?: any;
}

export function PaginationItems(props: PaginationItemsProps) {
  const ctx = usePaginationContext();

  // Directly use the reactive 'range' from the context.
  // Do not calculate a separate range here.
  const range = ctx.range;

  return (
    <For each={range()}>
      {(page) => (
        <Switch>
          <Match when={page === 'dots'}>
            <PaginationDots icon={props.dotsIcon} />
          </Match>
          <Match when={typeof page === 'number'}>
            <PaginationControl
              active={page === ctx.active()}
              onClick={() => ctx.onChange(page as number)}
              disabled={ctx.disabled()}
            >
              {page}
            </PaginationControl>
          </Match>
        </Switch>
      )}
    </For>
  );
}

PaginationItems.displayName = '@mantine/core/PaginationItems';
