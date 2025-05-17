import { For, splitProps } from 'solid-js';
import { usePaginationStore } from '../Pagination.store';
import { PaginationIcon } from '../Pagination.icons';
import { PaginationControl } from '../PaginationControl/PaginationControl';
import { PaginationDots } from '../PaginationDots/PaginationDots';

export interface PaginationItemsProps {
  /** Dots icon component */
  dotsIcon?: PaginationIcon;
}

export function PaginationItems(props: PaginationItemsProps) {
  const store = usePaginationStore();
  const [local, _] = splitProps(props, [
    'dotsIcon',
  ]);

  return (
    <>
      <For each={store.range}>
        {(page) =>
          page === 'dots' ? (
            <PaginationDots icon={local.dotsIcon} />
          ) : (
            <PaginationControl
              active={page === store.active}
              aria-current={page === store.active ? 'page' : undefined}
              onClick={() => store.onChange(page)}
              disabled={store.disabled}
              {...store.getItemProps?.(page)}
            >
              {store.getItemProps?.(page)?.children ?? page}
            </PaginationControl>
          )
        }
      </For>
    </>
  );
}

PaginationItems.displayName = '@mantine/core/PaginationItems';
