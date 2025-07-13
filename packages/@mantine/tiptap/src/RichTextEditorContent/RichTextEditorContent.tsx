import { EditorContent } from '@empoleon/solid-tiptap';
import {
  Box,
  BoxProps,
  CompoundStylesApiProps,
  ElementProps,
  factory,
  Factory,
  TypographyStylesProvider,
  useProps,
} from '@mantine/core';
import { useRichTextEditorContext } from '../RichTextEditor.context';
import classes from '../RichTextEditor.module.css';
import { splitProps } from 'solid-js';

export type RichTextEditorContentStylesNames = 'root';
export interface RichTextEditorContentProps
  extends BoxProps,
    CompoundStylesApiProps<RichTextEditorContentFactory>,
    ElementProps<'div'> {}

export type RichTextEditorContentFactory = Factory<{
  props: RichTextEditorContentProps;
  ref: HTMLDivElement;
  stylesNames: RichTextEditorContentStylesNames;
  compound: true;
}>;

const defaultProps: Partial<RichTextEditorContentProps> = {};

export const RichTextEditorContent = factory<RichTextEditorContentFactory>(_props => {
  const props = useProps('RichTextEditorContent', defaultProps, _props);
  const [local, others] = splitProps(props, [
    'classNames',
    'className',
    'style',
    'styles',
    'vars',
    'ref'
  ]);

  const ctx = useRichTextEditorContext();

  if (ctx.withTypographyStyles) {
    return (
      <TypographyStylesProvider
        {...ctx.getStyles('typographyStylesProvider', { className: local.className, style: local.style, styles: local.styles, classNames: local.classNames })}
        unstyled={ctx.unstyled}
        ref={local.ref}
      >
        <Box
          component={EditorContent}
          editor={ctx.editor}
          {...ctx.getStyles('content', { classNames: local.classNames, styles: local.styles })}
          {...others}
        />
      </TypographyStylesProvider>
    );
  }

  return (
    <Box
      component={EditorContent}
      editor={ctx.editor}
      {...ctx.getStyles('content', { classNames: local.classNames, styles: local.styles })}
      {...others}
    />
  );
});

RichTextEditorContent.classes = classes;
RichTextEditorContent.displayName = '@mantine/tiptap/RichTextEditorContent';
