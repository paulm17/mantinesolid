import { entry_preview_exports } from './chunk-Y3YAD3NA.mjs';
import './chunk-7P6ASYW6.mjs';
import { global } from '@storybook/global';
import { setDefaultProjectAnnotations, setProjectAnnotations as setProjectAnnotations$1 } from '@storybook/preview-api';

var { window: globalWindow } = global;
globalWindow.STORYBOOK_ENV = "solid";
function setProjectAnnotations(projectAnnotations) {
  setDefaultProjectAnnotations(entry_preview_exports);
  return setProjectAnnotations$1(projectAnnotations);
}

export { setProjectAnnotations };
