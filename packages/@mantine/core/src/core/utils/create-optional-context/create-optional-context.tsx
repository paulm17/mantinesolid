import { createContext, JSXElement, useContext } from 'solid-js';

export function createOptionalContext<ContextValue>(initialValue: ContextValue | null = null) {
  const Context = createContext<ContextValue | null>(initialValue);

  const useOptionalContext = () => useContext(Context);

  const Provider = ({ children, value }: { value: ContextValue; children: JSXElement }) => (
    <Context.Provider value={value}>{children}</Context.Provider>
  );

  return [Provider, useOptionalContext] as const;
}
