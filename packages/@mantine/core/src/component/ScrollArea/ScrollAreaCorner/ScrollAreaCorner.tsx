import { createSignal, splitProps, Show, JSX } from "solid-js";
import { useScrollAreaContext } from "../ScrollArea.context";
import { useResizeObserver } from "../use-resize-observer";

interface ScrollAreaCornerProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export function Corner(props: ScrollAreaCornerProps) {
  // separate style and ref from other div‑props
  const [local, others] = splitProps(props, ["style", "ref"]);
  const ctx = useScrollAreaContext();

  // width/height signals in place of React useState
  const [width, setWidth] = createSignal(0);
  const [height, setHeight] = createSignal(0);

  // effect to attach both resize observers once
  useResizeObserver(() => ctx.scrollbarX, () => {
    const h = ctx.scrollbarX?.offsetHeight || 0;
    ctx.onCornerHeightChange(h);
    setHeight(h);
  });

  useResizeObserver(() => ctx.scrollbarY, () => {
    const w = ctx.scrollbarY?.offsetWidth || 0;
    ctx.onCornerWidthChange(w);
    setWidth(w);
  });

  const hasSize = () => width() > 0 && height() > 0;

  return (
    <Show when={hasSize()}>
      <div
        {...others}
        ref={local.ref}
        style={{
          width: `${width()}px`,
          height: `${height()}px`,
          ...(typeof local.style === "object" && local.style !== null
            ? local.style
            : {}),
        }}
      />
    </Show>
  );
}

export function ScrollAreaCorner(props: ScrollAreaCornerProps) {
  const ctx = useScrollAreaContext();
  const hasBoth = () => ctx.scrollbarX && ctx.scrollbarY;
  const hasCorner = () => ctx.type !== "scroll" && hasBoth();

  return (
    <Show when={hasCorner()}>
      <Corner {...props} />
    </Show>
  );
}
