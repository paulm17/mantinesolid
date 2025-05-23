function transformImportStatement(input: string) {
  const regex = /import (\{[^}]+\}) from 'solid-js';/g;
  const match = regex.exec(input);
  if (!match) {
    return input;
  }
  return `import ${match[1]} from 'solid-js';`;
}

export function removeReactImport(input: string) {
  const lines = input.split('\n');

  if (lines[0].includes('')) {
    lines.shift();
  } else if (lines[0].includes('import solid-js')) {
    const remainingImports = transformImportStatement(lines[0]);
    lines[0] = remainingImports;
  }

  return lines.join('\n');
}
