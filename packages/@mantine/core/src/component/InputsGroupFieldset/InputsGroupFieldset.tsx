import { JSX } from 'solid-js/jsx-runtime';
import { useInputWrapperContext } from '../Input';

interface InputsGroupFieldsetProps {
  children: JSX.Element;
  role: 'radiogroup' | 'group';
}

export function InputsGroupFieldset({ children, role }: InputsGroupFieldsetProps) {
  const ctx = useInputWrapperContext();

  if (!ctx) {
    return <>{children}</>;
  }

  return (
    <div role={role} aria-labelledby={ctx.labelId} aria-describedby={ctx.describedBy}>
      {children}
    </div>
  );
}
