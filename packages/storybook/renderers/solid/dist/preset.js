var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/preset.ts
var preset_exports = {};
__export(preset_exports, {
  previewAnnotations: () => previewAnnotations
});
module.exports = __toCommonJS(preset_exports);
var import_node_path = require("path");
var previewAnnotations = async (input = [], options) => {
  const docsConfig = await options.presets.apply("docs", {}, options);
  const docsEnabled = Object.keys(docsConfig).length > 0;
  const result = [];
  return result.concat(input).concat([(0, import_node_path.join)(__dirname, "entry-preview.mjs")]).concat(docsEnabled ? [(0, import_node_path.join)(__dirname, "entry-preview-docs.mjs")] : []);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  previewAnnotations
});
