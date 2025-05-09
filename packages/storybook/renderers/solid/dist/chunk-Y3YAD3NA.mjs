import { __export } from './chunk-7P6ASYW6.mjs';
import { createComponent, mergeProps, render as render$1 } from 'solid-js/web';
import { onMount, ErrorBoundary } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Semaphore } from 'async-mutex';

// src/entry-preview.tsx
var entry_preview_exports = {};
__export(entry_preview_exports, {
  decorators: () => decorators,
  parameters: () => parameters,
  render: () => render,
  renderToCanvas: () => renderToCanvas
});
var [store, setStore] = createStore({});
var solidReactivityDecorator = (Story, context) => {
  const storyId = context.canvasElement.id;
  context.args = store[storyId].args;
  return createComponent(Story, mergeProps(() => context.args));
};
var cleanStoryStore = (storeId) => {
  setStore({
    [storeId]: {
      args: {},
      rendered: false,
      disposeFn: () => {
      }
    }
  });
};
var disposeStory = (storeId) => {
  store[storeId]?.disposeFn?.();
};
var remountStory = (storyId) => {
  disposeStory(storyId);
  cleanStoryStore(storyId);
};
var storyIsRendered = (storyId) => Boolean(store[storyId]?.rendered);
var renderSolidApp = (storyId, renderContext, canvasElement) => {
  const {
    storyContext,
    storyFn,
    showMain,
    showException
  } = renderContext;
  setStore(storyId, "rendered", true);
  const App = () => {
    const Story = storyFn;
    onMount(() => {
      showMain();
    });
    return createComponent(ErrorBoundary, {
      fallback: (err) => {
        showException(err);
        return err;
      },
      get children() {
        return createComponent(Story, storyContext);
      }
    });
  };
  return render$1(() => createComponent(App, {}), canvasElement);
};
var semaphore = new Semaphore(1);
async function renderToCanvas(renderContext, canvasElement) {
  const {
    storyContext,
    forceRemount
  } = renderContext;
  const storyId = storyContext.canvasElement.id;
  if (forceRemount) {
    remountStory(storyId);
  }
  setStore(storyId, "args", storyContext.args);
  if (storyIsRendered(storyId) === false) {
    await semaphore.runExclusive(async () => {
      const disposeFn = renderSolidApp(storyId, renderContext, canvasElement);
      setStore(storyId, (prev) => ({
        ...prev,
        disposeFn
      }));
    });
  }
}
var render = (_, context) => {
  const {
    id,
    component: Component
  } = context;
  if (!Component) {
    throw new Error(`Unable to render story ${id} as the component annotation is missing from the default export`);
  }
  return createComponent(Component, mergeProps(() => context.args));
};

// src/entry-preview.tsx
var parameters = {
  renderer: "solid"
};
var decorators = [solidReactivityDecorator];

export { decorators, entry_preview_exports, parameters, render, renderToCanvas };
