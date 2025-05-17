import { useMantineStyleNonce } from '../MantineProvider';
import { InlineStylesInput, stylesToString } from './styles-to-string/styles-to-string';

export interface InlineStylesProps extends InlineStylesInput {}

export function InlineStyles(props: InlineStylesInput) {
  const nonce = useMantineStyleNonce();
  return (
    <style
      data-mantine-styles="inline"
      nonce={nonce?.()}
      innerHTML={stylesToString(props) }
    />
  );
}
