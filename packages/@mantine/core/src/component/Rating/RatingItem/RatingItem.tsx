import { JSX } from 'solid-js';
import { Box, BoxProps, ElementProps, useDirection } from '../../../core';
import { useRatingContext } from '../Rating.context';
import { StarSymbol } from '../StarSymbol/StarSymbol';

export interface RatingItemProps extends BoxProps, ElementProps<'input', 'value' | 'size'> {
  getSymbolLabel: ((value: number) => string) | undefined;
  emptyIcon?: JSX.Element | ((value: number) => JSX.Element);
  fullIcon?: JSX.Element | ((value: number) => JSX.Element);
  full: boolean;
  active: boolean;
  fractionValue: number;
  value: number;
  id: string;
  onChange: (event: Event | number) => void;
  onInputChange: (event: Event | number) => void;
}

export function RatingItem({
  getSymbolLabel,
  emptyIcon,
  fullIcon,
  full,
  active,
  value,
  readOnly,
  fractionValue,
  color,
  id,
  onBlur,
  onChange,
  onInputChange,
  style,
  ...others
}: RatingItemProps) {
  const ctx = useRatingContext();
  const _fullIcon = typeof fullIcon === 'function' ? fullIcon(value) : fullIcon;
  const _emptyIcon = typeof emptyIcon === 'function' ? emptyIcon(value) : emptyIcon;
  const { dir } = useDirection();

  return (
    <>
      {!readOnly && (
        <input
          {...ctx.getStyles('input')}
          onKeyDown={(event) => event.key === ' ' && onChange(value)}
          id={id}
          type="radio"
          data-active={active || undefined}
          aria-label={getSymbolLabel?.(value)}
          value={value}
          onBlur={onBlur}
          onChange={onInputChange}
          {...others}
        />
      )}

      <Box
        component={readOnly ? 'div' : 'label'}
        {...ctx.getStyles('label')}
        data-read-only={readOnly || undefined}
        html-for={id}
        onClick={() => onChange(value)}
        __vars={{
          '--rating-item-z-index': (fractionValue === 1 ? undefined : active ? 2 : 0)?.toString(),
        }}
      >
        <Box
          {...ctx.getStyles('symbolBody')}
          __vars={{
            '--rating-symbol-clip-path':
              fractionValue === 1
                ? undefined
                : dir === 'ltr'
                  ? `inset(0 ${active ? 100 - fractionValue * 100 : 100}% 0 0)`
                  : `inset(0 0 0 ${active ? 100 - fractionValue * 100 : 100}% )`,
          }}
        >
          {full
            ? _fullIcon || <StarSymbol type="full" />
            : _emptyIcon || <StarSymbol type="empty" />}
        </Box>
      </Box>
    </>
  );
}

RatingItem.displayName = '@mantine/core/RatingItem';
