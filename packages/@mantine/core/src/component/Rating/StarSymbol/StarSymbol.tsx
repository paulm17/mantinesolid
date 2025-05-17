import { useRatingStore } from '../Rating.store';
import { StarIcon } from './StarIcon';

export interface StarSymbolProps {
  type: 'empty' | 'full';
}

export function StarSymbol(props: StarSymbolProps) {
  const store = useRatingStore();
  return <StarIcon {...store.getStyles('starSymbol')} data-filled={props.type === 'full' ? true : undefined} />;
}

StarSymbol.displayName = '@mantine/core/StarSymbol';
