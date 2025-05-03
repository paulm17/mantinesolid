import { createEffect, onCleanup } from "solid-js";
import { scopeTab } from "./scope-tab";
import { FOCUS_SELECTOR, focusable, tabbable } from "./tabbable";

export function useFocusTrap(active: boolean = true): (el: HTMLElement) => void {
  let node: HTMLElement | null = null;

  const setRef = (el: HTMLElement | null) => {
    node = el;
    if (active && node) {
      setTimeout(() => {
        if (node) focusNode(node);
      });
    }
  };

  createEffect(() => {
    if (!active || !node) return;

    setTimeout(() => {
      if (node) focusNode(node);
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" && node) {
        scopeTab(node, event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  return setRef;
}

function focusNode(node: HTMLElement) {
  let focusElement: HTMLElement | null = node.querySelector("[data-autofocus]");

  if (!focusElement) {
    const children = Array.from<HTMLElement>(node.querySelectorAll(FOCUS_SELECTOR));
    focusElement = children.find(tabbable) || children.find(focusable) || null;
    if (!focusElement && focusable(node)) focusElement = node;
  }

  if (focusElement) {
    focusElement.focus({ preventScroll: true });
  } else if (process.env.NODE_ENV === 'development') {
    console.warn("[useFocusTrap] no focusable element found in", node);
  }
}
