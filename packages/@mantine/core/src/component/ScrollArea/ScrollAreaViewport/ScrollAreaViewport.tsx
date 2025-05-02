// ScrollAreaViewport.tsx
import { splitProps, onCleanup, JSX } from "solid-js";           // splitProps & onCleanup utilities :contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5}
import { Box, BoxProps } from "../../../core";
import { useScrollAreaContext } from "../ScrollArea.context";
import { useMergedRef, PossibleRef } from "@mantine/hooks";    // our drop‑in hook

export interface ScrollAreaViewportProps
  extends BoxProps,
    Omit<JSX.HTMLAttributes<HTMLDivElement>, "style"> {}

export function ScrollAreaViewport(props: ScrollAreaViewportProps) {
  const ctx = useScrollAreaContext();                            // Solid context API :contentReference[oaicite:6]{index=6}

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
