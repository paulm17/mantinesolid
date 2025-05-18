import { For, splitProps } from 'solid-js';
import { usePaginationContext } from '../Pagination.context';
import { PaginationIcon } from '../Pagination.icons';
import { PaginationControl } from '../PaginationControl/PaginationControl';
import { PaginationDots } from '../PaginationDots/PaginationDots';

export interface PaginationItemsProps {
  /** Dots icon component */
  dotsIcon?: PaginationIcon;
}

export function PaginationItems(props: PaginationItemsProps) {
  const ctx = usePaginationContext();
  const [local, _] = splitProps(props, [
    'dotsIcon',
  ]);

  return (
    <>
      <For each={ctx.range}>
        {(page) =>
          page === 'dots' ? (
            <PaginationDots icon={local.dotsIcon} />
          ) : (
            <PaginationControl
              active={page === ctx.active}
              aria-current={page === ctx.active ? 'page' : undefined}
              onClick={() => ctx.onChange(page)}
              disabled={ctx.disabled}
              {...ctx.getItemProps?.(page)}
            >
              {ctx.getItemProps?.(page)?.children ?? page}
            </PaginationControl>
          )
        }
      </For>
    </>
  );
}

PaginationItems.displayName = '@mantine/core/PaginationItems';
