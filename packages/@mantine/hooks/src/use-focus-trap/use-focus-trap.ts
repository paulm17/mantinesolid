import { Accessor, createEffect, onCleanup } from "solid-js";
import { scopeTab } from "./scopeTab";
import { FOCUS_SELECTOR, focusable, tabbable } from "./tabbable";

export function useFocusTrap(active: Accessor<boolean>): (el: HTMLElement | null) => void {
  let node: HTMLElement | null = null;

  const setRef = (el: HTMLElement | null) => {
    node = el;

    if (node && active()) {
      setTimeout(() => {
        if (node) focusFirst(node);
      });
    }
  };

  createEffect(() => {
    if (!active() || !node) {
      return;
    }

    setTimeout(() => {
      if (node) focusFirst(node);
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" && node) {
        scopeTab(node, event);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => document.removeEventListener("keydown", onKeyDown));
  });

  return setRef;

 function focusFirst(node: HTMLElement) {
    let focusElement: HTMLElement | null = node.querySelector("[data-autofocus]");

    if (!focusElement) {
      const children = Array.from<HTMLElement>(node.querySelectorAll(FOCUS_SELECTOR));
      focusElement = children.find(tabbable) || children.find(focusable) || null;
      if (!focusElement && focusable(node)) focusElement = node;
    }

    if (focusElement) {
      focusElement.focus({ preventScroll: true });
    } else if (process.env.NODE_ENV === "development") {
      console.warn("[useFocusTrap] no focusable element found in", node);
    }
  }
}
