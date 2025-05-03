import { splitProps, onCleanup, JSX } from "solid-js";
import { useMergedRef, PossibleRef } from "@mantine/hooks";
import { Box, BoxProps } from "../../../core";
import { useScrollAreaContext } from "../ScrollArea.context";

export interface ScrollAreaViewportProps
  extends BoxProps,
    Omit<JSX.HTMLAttributes<HTMLDivElement>, "style"> {}

export function ScrollAreaViewport(props: ScrollAreaViewportProps) {
  const ctx = useScrollAreaContext();

  const [local, others] = splitProps(props, ["style", "children", "ref"]);

  const rootRef = useMergedRef(
    local.ref as PossibleRef<HTMLDivElement>,
    (el) => ctx.onViewportChange(el)
  );

  onCleanup(() => ctx.onViewportChange(null));

  return (
    <Box
      {...others}
      ref={rootRef}
      style={{
        overflowX: ctx.scrollbarXEnabled ? "scroll" : "hidden",
        overflowY: ctx.scrollbarYEnabled ? "scroll" : "hidden",
        ...local.style,
      }}
    >
      <div {...ctx.getStyles("content")} ref={ctx.onContentChange}>
        {local.children}
      </div>
    </Box>
  );
}
