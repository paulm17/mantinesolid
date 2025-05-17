import {
  filterProps,
  getBaseValue,
  getSortedBreakpoints,
  InlineStyles,
  keys,
  useMantineTheme,
} from '../../../core';
import { GridBreakpoints, useGridStore } from '../Grid.store';
import type { ColSpan, GridColProps } from './GridCol';

interface GridColVariablesProps {
  selector: string;
  span: GridColProps['span'] | undefined;
  order?: GridColProps['order'] | undefined;
  offset?: GridColProps['offset'] | undefined;
}

const getColumnFlexBasis = (colSpan: ColSpan | undefined, columns: number) => {
  if (colSpan === 'content') {
    return 'auto';
  }

  if (colSpan === 'auto') {
    return '0rem';
  }

  return colSpan ? `${100 / (columns / colSpan)}%` : undefined;
};

const getColumnMaxWidth = (
  colSpan: ColSpan | undefined,
  columns: number,
  grow: boolean | undefined
) => {
  if (grow || colSpan === 'auto') {
    return '100%';
  }

  if (colSpan === 'content') {
    return 'unset';
  }

  return getColumnFlexBasis(colSpan, columns);
};

const getColumnFlexGrow = (colSpan: ColSpan | undefined, grow: boolean | undefined) => {
  if (!colSpan) {
    return undefined;
  }

  return colSpan === 'auto' || grow ? '1' : 'auto';
};

const getColumnOffset = (offset: number | undefined, columns: number) =>
  offset === 0 ? '0' : offset ? `${100 / (columns / offset)}%` : undefined;

export function GridColVariables({ span, order, offset, selector }: GridColVariablesProps) {
  const theme = useMantineTheme();
  const store = useGridStore();
  const _breakpoints = store.breakpoints || theme.breakpoints;

  const baseValue = getBaseValue(span);
  const baseSpan = baseValue === undefined ? 12 : getBaseValue(span);

  const baseStyles: Record<string, string | undefined> = filterProps({
    '--col-order': getBaseValue(order)?.toString(),
    '--col-flex-grow': getColumnFlexGrow(baseSpan, store.grow),
    '--col-flex-basis': getColumnFlexBasis(baseSpan, store.columns),
    '--col-width': baseSpan === 'content' ? 'auto' : undefined,
    '--col-max-width': getColumnMaxWidth(baseSpan, store.columns, store.grow),
    '--col-offset': getColumnOffset(getBaseValue(offset), store.columns),
  });

  const queries = keys(_breakpoints).reduce<Record<string, Record<string, any>>>(
    (acc, breakpoint) => {
      if (!acc[breakpoint]) {
        acc[breakpoint] = {};
      }

      if (typeof order === 'object' && order[breakpoint] !== undefined) {
        acc[breakpoint]['--col-order'] = order[breakpoint]?.toString();
      }

      if (typeof span === 'object' && span[breakpoint] !== undefined) {
        acc[breakpoint]['--col-flex-grow'] = getColumnFlexGrow(span[breakpoint], store.grow);
        acc[breakpoint]['--col-flex-basis'] = getColumnFlexBasis(span[breakpoint], store.columns);
        acc[breakpoint]['--col-width'] = span[breakpoint] === 'content' ? 'auto' : undefined;
        acc[breakpoint]['--col-max-width'] = getColumnMaxWidth(
          span[breakpoint],
          store.columns,
          store.grow
        );
      }

      if (typeof offset === 'object' && offset[breakpoint] !== undefined) {
        acc[breakpoint]['--col-offset'] = getColumnOffset(offset[breakpoint], store.columns);
      }

      return acc;
    },
    {}
  );

  const sortedBreakpoints = getSortedBreakpoints(keys(queries), _breakpoints).filter(
    (breakpoint) => keys(queries[breakpoint.value]).length > 0
  );

  const values = sortedBreakpoints.map((breakpoint) => ({
    query:
      store.type === 'container'
        ? `mantine-grid (min-width: ${_breakpoints[breakpoint.value as keyof GridBreakpoints]})`
        : `(min-width: ${_breakpoints[breakpoint.value as keyof GridBreakpoints]})`,
    styles: queries[breakpoint.value],
  }));

  return (
    <InlineStyles
      styles={baseStyles}
      media={store.type === 'container' ? undefined : values}
      container={store.type === 'container' ? values : undefined}
      selector={selector}
    />
  );
}
