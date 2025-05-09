'use strict';

var docsTools = require('@storybook/docs-tools');
var previewApi = require('@storybook/preview-api');
var Babel = require('@babel/standalone');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var Babel__namespace = /*#__PURE__*/_interopNamespace(Babel);

// src/entry-preview-docs.tsx
var parser = Babel__namespace.packages.parser;
var generate = Babel__namespace.packages.generator.default;
var t = Babel__namespace.packages.types;
function skipSourceRender(context) {
  const sourceParams = context?.parameters.docs?.source;
  const isArgsStory = context?.parameters.__isArgsStory;
  if (sourceParams?.type === docsTools.SourceType.DYNAMIC) {
    return false;
  }
  return !isArgsStory || sourceParams?.code || sourceParams?.type === docsTools.SourceType.CODE;
}
var sourceDecorator = (storyFn, ctx) => {
  const channel = previewApi.addons.getChannel();
  const story = storyFn();
  const skip = skipSourceRender(ctx);
  let source = null;
  previewApi.useEffect(() => {
    if (!skip && source) {
      const {
        id,
        unmappedArgs
      } = ctx;
      channel.emit(docsTools.SNIPPET_RENDERED, {
        id,
        args: unmappedArgs,
        source
      });
    }
  });
  if (skip) return story;
  const docs = ctx?.parameters?.docs;
  const src = docs?.source?.originalSource;
  const name = ctx.title.split("/").at(-1);
  try {
    source = generateSolidSource(name, src);
  } catch (e) {
    console.error(e);
  }
  return story;
};
function generateSolidSource(name, src) {
  const ast = parser.parseExpression(src, {
    plugins: ["jsx", "typescript"]
  });
  const {
    attributes,
    children,
    original
  } = parseArgs(ast);
  const render = parseRender(ast);
  if (render) {
    const {
      body,
      params
    } = render;
    let newSrc = "";
    if (params[0]) {
      const args = original ?? {
        type: "ObjectExpression",
        properties: []
      };
      const argsStatement = {
        type: "VariableDeclaration",
        kind: "const",
        declarations: [{
          type: "VariableDeclarator",
          id: {
            type: "Identifier",
            name: params[0]
          },
          init: args
        }]
      };
      newSrc += generate(argsStatement, {
        compact: false
      }).code + "\n\n";
    }
    if (params[1]) {
      const ctxStatement = {
        type: "VariableDeclaration",
        kind: "var",
        declarations: [{
          type: "VariableDeclarator",
          id: {
            type: "Identifier",
            name: params[1]
          }
        }]
      };
      newSrc += generate(ctxStatement, {
        compact: false
      }).code + "\n\n";
    }
    newSrc += generate(body, {
      compact: false
    }).code;
    return newSrc;
  }
  const selfClosing = children == null || children.length == 0;
  const component = {
    type: "JSXElement",
    openingElement: {
      type: "JSXOpeningElement",
      name: {
        type: "JSXIdentifier",
        name
      },
      attributes,
      selfClosing
    },
    children: children ?? [],
    closingElement: selfClosing ? void 0 : {
      type: "JSXClosingElement",
      name: {
        type: "JSXIdentifier",
        name
      }
    }
  };
  return generate(component, {
    compact: false
  }).code;
}
function toJSXChild(node) {
  if (t.isJSXElement(node) || t.isJSXText(node) || t.isJSXExpressionContainer(node) || t.isJSXSpreadChild(node) || t.isJSXFragment(node)) {
    return node;
  }
  if (t.isStringLiteral(node)) {
    return {
      type: "JSXText",
      value: node.value
    };
  }
  if (t.isExpression(node)) {
    return {
      type: "JSXExpressionContainer",
      expression: node
    };
  }
  return {
    type: "JSXExpressionContainer",
    expression: t.jsxEmptyExpression()
  };
}
function parseRender(ast) {
  if (ast.type != "ObjectExpression") throw "Expected `ObjectExpression` type";
  const renderProp = ast.properties.find((v) => {
    if (v.type != "ObjectProperty") return false;
    if (v.key.type != "Identifier") return false;
    return v.key.name == "render";
  });
  if (!renderProp) return null;
  const renderFn = renderProp.value;
  if (renderFn.type != "ArrowFunctionExpression" && renderFn.type != "FunctionExpression") {
    console.warn("`render` property is not a function, skipping...");
    return null;
  }
  return {
    body: renderFn.body,
    params: renderFn.params.map((x) => x.name)
  };
}
function parseArgs(ast) {
  if (ast.type != "ObjectExpression") throw "Expected `ObjectExpression` type";
  const argsProp = ast.properties.find((v) => {
    if (v.type != "ObjectProperty") return false;
    if (v.key.type != "Identifier") return false;
    return v.key.name == "args";
  });
  if (!argsProp) return {
    attributes: [],
    children: null,
    original: null
  };
  const original = argsProp.value;
  if (original.type != "ObjectExpression") throw "Expected `ObjectExpression` type";
  const attributes = [];
  let children = null;
  for (const el of original.properties) {
    let attr = null;
    switch (el.type) {
      case "ObjectProperty":
        if (el.key.type != "Identifier") {
          console.warn("Encountered computed key, skipping...");
          continue;
        }
        if (el.key.name == "children") {
          children = [toJSXChild(el.value)];
          continue;
        }
        attr = parseProperty(el);
        break;
      case "ObjectMethod":
        attr = parseMethod(el);
        break;
      case "SpreadElement":
        console.warn("Encountered spread element, skipping...");
        continue;
    }
    if (attr) {
      attributes.push(attr);
    }
  }
  return {
    attributes,
    children,
    original
  };
}
function parseProperty(el) {
  let value = {
    type: "JSXExpressionContainer",
    expression: el.value
  };
  if (el.value.type == "BooleanLiteral" && el.value.value == true) {
    value = void 0;
  }
  return {
    type: "JSXAttribute",
    name: {
      type: "JSXIdentifier",
      name: el.key.name
    },
    value
  };
}
function parseMethod(el) {
  if (el.kind != "method") {
    console.warn("Encountered getter or setter, skipping...");
    return null;
  }
  if (el.key.type != "Identifier") {
    console.warn("Encountered computed key, skipping...");
    return null;
  }
  const {
    params,
    body,
    async,
    returnType,
    typeParameters
  } = el;
  return {
    type: "JSXAttribute",
    name: {
      type: "JSXIdentifier",
      name: el.key.name
    },
    value: {
      type: "JSXExpressionContainer",
      expression: {
        type: "ArrowFunctionExpression",
        params,
        body,
        async,
        expression: false,
        returnType,
        typeParameters
      }
    }
  };
}

// src/entry-preview-docs.tsx
var parameters = {
  docs: {
    story: {
      inline: true
    },
    extractComponentDescription: docsTools.extractComponentDescription
    //TODO solid-docgen plugin needs to be created.
  }
};
var decorators = [sourceDecorator];
var argTypesEnhancers = [docsTools.enhanceArgTypes];

exports.argTypesEnhancers = argTypesEnhancers;
exports.decorators = decorators;
exports.parameters = parameters;
