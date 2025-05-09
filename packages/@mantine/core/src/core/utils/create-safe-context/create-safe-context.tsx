import { createContext, JSX, useContext } from 'solid-js';

export function createSafeContext<ContextValue>(errorMessage: string) {
  const Context = createContext<ContextValue | null>(null);

  const useSafeContext = () => {
    const ctx = useContext(Context);

    if (ctx === null) {
      throw new Error(errorMessage);
    }

    return ctx;
  };

  const Provider = ({ children, value }: { value: ContextValue; children: JSX.Element }) => (
    <Context.Provider value={value}>{children}</Context.Provider>
  );

  return [Provider, useSafeContext] as const;
}
