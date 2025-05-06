import { Component, JSX } from "solid-js";

export interface StepperCompletedProps {
  /** Label content */
  children: JSX.Element;
}

export const StepperCompleted: Component<StepperCompletedProps> = () => null;
(StepperCompleted as any).displayName = '@mantine/core/StepperCompleted';
