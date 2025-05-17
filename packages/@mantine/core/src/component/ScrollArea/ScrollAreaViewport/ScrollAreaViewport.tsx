import { splitProps, JSX, createEffect } from "solid-js";
import { useMergedRef } from "@mantine/hooks";
import { Box, BoxProps } from "../../../core";
import { useScrollAreaStore } from "../ScrollArea.store";

export interface ScrollAreaViewportProps
  extends BoxProps,
    Omit<JSX.HTMLAttributes<HTMLDivElement>, "style"> {}

export function ScrollAreaViewport(props: ScrollAreaViewportProps) {
  const store = useScrollAreaStore();
  const [local, others] = splitProps(props, ["style", "children", "ref"]);

  return (
    <Box
      {...others}
      ref={useMergedRef(local.ref, store.onViewportChange)}
      style={{
        'overflow-x': store.scrollbarXEnabled ? "scroll" : "hidden",
        'overflow-y': store.scrollbarYEnabled ? "scroll" : "hidden",
        ...local.style,
      }}
    >
      <div {...store.getStyles("content")} ref={store.onContentChange}>
        {local.children}
      </div>
    </Box>
  );
}
