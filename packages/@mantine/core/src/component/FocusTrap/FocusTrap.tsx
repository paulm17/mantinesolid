import { mergeRefs } from "@solid-primitives/refs";
import { type JSX, type Component, type Ref as SolidRef, splitProps } from "solid-js";
import { useFocusTrap } from "@mantine/hooks";
import { cloneElement, isElement } from "../../core";
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
  const focusTrapRef = useFocusTrap(local.active ?? true);
  const combinedRef = mergeRefs(local.innerRef as any, focusTrapRef);

  if (typeof props.children === "function") {
    return props.children({ [refProp]: combinedRef });
  }

  if (!isElement(props.children)) {
    return props.children as any;
  }

  return cloneElement(props.children as JSX.Element, { [refProp]: combinedRef });
};

export function FocusTrapInitialFocus(
  props: JSX.HTMLAttributes<HTMLSpanElement>
) {
  return <VisuallyHidden tabIndex={-1} data-autofocus {...props} />;
}
