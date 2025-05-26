import { type JSX, type Component, type Ref as SolidRef, splitProps } from "solid-js";
import { useFocusTrap, useMergedRef } from "@mantine/hooks";
import { VisuallyHidden } from "../VisuallyHidden";

export interface FocusTrapProps {
  children: JSX.Element | ((props: { [key: string]: any }) => JSX.Element);
  active?: boolean;
  refProp?: string;
  innerRef?: SolidRef<any>;
}

export const FocusTrap: Component<FocusTrapProps> = (props) => {
  const [local] = splitProps(props, [
    'children',
    'active',
    'refProp',
    'innerRef',
  ])
  const refProp = local.refProp ?? 'ref'
  const isActive = () => local.active ?? true;
  const focusTrapRef = useFocusTrap(isActive);
  const combinedRef = useMergedRef(focusTrapRef, local.innerRef as any);

  if (typeof local.children === "function") {
    return local.children({ [refProp]: combinedRef });
  }

  return (
    <div ref={el => combinedRef} style={{ display: 'contents' }}>
      {local.children}
    </div>
  );
};

export function FocusTrapInitialFocus(
  props: JSX.HTMLAttributes<HTMLSpanElement>
) {
  return <VisuallyHidden tabIndex={-1} data-autofocus {...props as any} />;
}
