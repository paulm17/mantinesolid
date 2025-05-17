// function transformModKey(key: string) {
//   return key.startsWith('data-') ? key : `data-${key}`;
// }

// export function getMod(props: Record<string, any>) {
//   return Object.keys(props).reduce<Record<string, any>>((acc, key) => {
//     const value = props[key];

//     const resolvedValue = typeof value === 'function' ? value() : value;
//     if (resolvedValue === undefined || resolvedValue === '' || resolvedValue === false || resolvedValue === null) {
//       return acc;
//     }

//     acc[transformModKey(key)] = resolvedValue;
//     return acc;
//   }, {});
// }

// export function getBoxMod(mod?: any): Record<string, any> | null {
//   if (!mod) {
//     return null;
//   }

//   if (typeof mod === 'string') {
//     return { [transformModKey(mod)]: true };
//   }

//   if (Array.isArray(mod)) {
//     return [...mod].reduce<Record<`data-${string}`, any>>(
//       (acc, value) => ({ ...acc, ...getBoxMod(value) }),
//       {}
//     );
//   }

//   const bar =  getMod(mod);

//   return bar;
// }

// get-box-mod.ts
/** Turn `foo` → `data-foo`; preserve existing `data-` prefixes */
function transformKey(k: string) {
  // console.log('transformKey', k);

  return k.startsWith('data-') ? k : `data-${k}`;
}

/** Assume any function is an accessor: call it once, otherwise return as-is */
function unwrapValue(v: any) {
  return typeof v === 'function' ? v() : v; // accessor or normal
}

/** Resolve a single object of mods → flat data- attributes */
function resolveObject(obj: Record<string, any>) {
  // console.log('resolveObject', obj);

  return Object.entries(obj).reduce<Record<string, any>>((acc, [k, raw]) => {
    const val = unwrapValue(raw);
    if (val != null && val !== false && val !== '') {
      acc[transformKey(k)] = val;
    }
    return acc;
  }, {});
}

/** Main recursive helper: handles `string`, `object`, `array`, or ignores others */
export function getBoxMod(mod: any): Record<string, any> {
  if (!mod) return {};
  if (typeof mod === 'string') {
    return { [transformKey(mod)]: true };
  }
  if (Array.isArray(mod)) {
    return mod.reduce((acc, entry) => ({ ...acc, ...getBoxMod(entry) }), {});
  }
  if (typeof mod === 'object') {
    return resolveObject(mod);
  }
  return {};
}
