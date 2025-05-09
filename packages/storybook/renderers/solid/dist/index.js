'use strict';

var global = require('@storybook/global');
var previewApi = require('@storybook/preview-api');
var web = require('solid-js/web');
var solidJs = require('solid-js');
var store$1 = require('solid-js/store');
var asyncMutex = require('async-mutex');

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var { window: globalWindow } = global.global;
globalWindow.STORYBOOK_ENV = "solid";

// src/entry-preview.tsx
var entry_preview_exports = {};
__export(entry_preview_exports, {
  decorators: () => decorators,
  parameters: () => parameters,
  render: () => render,
  renderToCanvas: () => renderToCanvas
});
var [store, setStore] = store$1.createStore({});
var solidReactivityDecorator = (Story, context) => {
  const storyId = context.canvasElement.id;
  context.args = store[storyId].args;
  return web.createComponent(Story, web.mergeProps(() => context.args));
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
    solidJs.onMount(() => {
      showMain();
    });
    return web.createComponent(solidJs.ErrorBoundary, {
      fallback: (err) => {
        showException(err);
        return err;
      },
      get children() {
        return web.createComponent(Story, storyContext);
      }
    });
  };
  return web.render(() => web.createComponent(App, {}), canvasElement);
};
var semaphore = new asyncMutex.Semaphore(1);
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
  return web.createComponent(Component, web.mergeProps(() => context.args));
};

// src/entry-preview.tsx
var parameters = {
  renderer: "solid"
};
var decorators = [solidReactivityDecorator];

// src/portable-stories.tsx
function setProjectAnnotations(projectAnnotations) {
  previewApi.setDefaultProjectAnnotations(entry_preview_exports);
  return previewApi.setProjectAnnotations(projectAnnotations);
}

exports.setProjectAnnotations = setProjectAnnotations;
