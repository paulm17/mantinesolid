import { JSX } from 'solid-js';
import type {
  MantineBreakpoint,
  MantineColor,
  MantineFontSize,
  MantineLineHeight,
  MantineSpacing,
} from '../../MantineProvider';

export type StyleProp<Value> = Value | Partial<Record<MantineBreakpoint | (string & {}), Value>>;

export interface MantineStyleProps {
  /** Margin, theme key: theme.spacing */
  m?: StyleProp<MantineSpacing>;
  /** MarginBlock, theme key: theme.spacing */
  my?: StyleProp<MantineSpacing>;
  /** MarginInline, theme key: theme.spacing */
  mx?: StyleProp<MantineSpacing>;
  /** MarginTop, theme key: theme.spacing */
  mt?: StyleProp<MantineSpacing>;
  /** MarginBottom, theme key: theme.spacing */
  mb?: StyleProp<MantineSpacing>;
  /** MarginInlineStart, theme key: theme.spacing */
  ms?: StyleProp<MantineSpacing>;
  /** MarginInlineEnd, theme key: theme.spacing */
  me?: StyleProp<MantineSpacing>;
  /** MarginLeft, theme key: theme.spacing */
  ml?: StyleProp<MantineSpacing>;
  /** MarginRight, theme key: theme.spacing */
  mr?: StyleProp<MantineSpacing>;
  /** Padding, theme key: theme.spacing */

  p?: StyleProp<MantineSpacing>;
  /** PaddingBlock, theme key: theme.spacing */
  py?: StyleProp<MantineSpacing>;
  /** PaddingInline, theme key: theme.spacing */
  px?: StyleProp<MantineSpacing>;
  /** PaddingTop, theme key: theme.spacing */
  pt?: StyleProp<MantineSpacing>;
  /** PaddingBottom, theme key: theme.spacing */
  pb?: StyleProp<MantineSpacing>;
  /** PaddingInlineStart, theme key: theme.spacing */
  ps?: StyleProp<MantineSpacing>;
  /** PaddingInlineEnd, theme key: theme.spacing */
  pe?: StyleProp<MantineSpacing>;
  /** PaddingLeft, theme key: theme.spacing */
  pl?: StyleProp<MantineSpacing>;
  /** PaddingRight, theme key: theme.spacing */
  pr?: StyleProp<MantineSpacing>;

  /** Border */
  bd?: StyleProp<JSX.CSSProperties['border']>;
  /** Background, theme key: theme.colors */
  bg?: StyleProp<MantineColor>;
  /** Color */
  c?: StyleProp<MantineColor>;
  opacity?: StyleProp<JSX.CSSProperties['opacity']>;

  /** FontFamily */
  ff?: StyleProp<'monospace' | 'text' | 'heading' | (string & {})>;
  /** FontSize, theme key: theme.fontSizes */
  fz?: StyleProp<MantineFontSize | `h${1 | 2 | 3 | 4 | 5 | 6}` | number | (string & {})>;
  /** FontWeight */
  fw?: StyleProp<JSX.CSSProperties['font-weight']>;
  /** LetterSpacing */
  lts?: StyleProp<JSX.CSSProperties['letter-spacing']>;
  /** TextAlign */
  ta?: StyleProp<JSX.CSSProperties['text-align']>;
  /** LineHeight, theme key: lineHeights */
  lh?: StyleProp<MantineLineHeight | `h${1 | 2 | 3 | 4 | 5 | 6}` | number | (string & {})>;
  /** FontStyle */
  fs?: StyleProp<JSX.CSSProperties['font-style']>;
  /** TextTransform */
  tt?: StyleProp<JSX.CSSProperties['text-transform']>;
  /** TextDecoration */
  td?: StyleProp<JSX.CSSProperties['text-decoration']>;

  /** Width, theme key: theme.spacing */
  w?: StyleProp<JSX.CSSProperties['width'] | number>;
  /** MinWidth, theme key: theme.spacing*/
  miw?: StyleProp<JSX.CSSProperties['min-width'] | number>;
  /** MaxWidth, theme key: theme.spacing */
  maw?: StyleProp<JSX.CSSProperties['max-width'] | number>;
  /** Height, theme key: theme.spacing */
  h?: StyleProp<JSX.CSSProperties['height'] | number>;
  /** MinHeight, theme key: theme.spacing */
  mih?: StyleProp<JSX.CSSProperties['min-height'] | number>;
  /** MaxHeight, theme key: theme.spacing */
  mah?: StyleProp<JSX.CSSProperties['max-height'] | number>;

  /** BackgroundSize */
  bgsz?: StyleProp<JSX.CSSProperties['background-size']>;
  /** BackgroundPosition */
  bgp?: StyleProp<JSX.CSSProperties['background-position']>;
  /** BackgroundRepeat */
  bgr?: StyleProp<JSX.CSSProperties['background-repeat']>;
  /** BackgroundAttachment */
  bga?: StyleProp<JSX.CSSProperties['background-attachment']>;

  /** Position */
  pos?: StyleProp<JSX.CSSProperties['position']>;
  top?: StyleProp<JSX.CSSProperties['top'] | number>;
  left?: StyleProp<JSX.CSSProperties['left'] | number>;
  bottom?: StyleProp<JSX.CSSProperties['bottom'] | number>;
  right?: StyleProp<JSX.CSSProperties['right'] | number>;
  inset?: StyleProp<JSX.CSSProperties['inset'] | number>;

  display?: StyleProp<JSX.CSSProperties['display']>;
  flex?: StyleProp<JSX.CSSProperties['flex']>;
}
