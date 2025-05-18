import { useRatingContext } from '../Rating.context';
import { StarIcon } from './StarIcon';

export interface StarSymbolProps {
  type: 'empty' | 'full';
}

export function StarSymbol(props: StarSymbolProps) {
  const ctx = useRatingContext();
  return <StarIcon {...ctx.getStyles('starSymbol')} data-filled={props.type === 'full' ? true : undefined} />;
}

StarSymbol.displayName = '@mantine/core/StarSymbol';
