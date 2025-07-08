import { Component, createContext, JSX } from 'solid-js';
import { ModalProps } from '@mantine/core';
import type { ConfirmModalProps } from './ConfirmModal';

export type ModalSettings = Partial<Omit<ModalProps, 'opened'>> & { modalId?: string };

export type ConfirmLabels = Record<'confirm' | 'cancel', JSX.Element>;

export interface OpenConfirmModal extends Omit<ModalSettings, 'onCancel'>, ConfirmModalProps {}
export interface OpenContextModal<CustomProps extends Record<string, any> = {}>
  extends ModalSettings {
  innerProps: CustomProps;
}

export interface ContextModalProps<T extends Record<string, any> = {}> {
  context: ModalsContextProps;
  innerProps: T;
  id: string;
}

export type ModalState =
  | { id: string; props: ModalSettings; type: 'content' }
  | { id: string; props: OpenConfirmModal; type: 'confirm' }
  | { id: string; props: OpenContextModal; type: 'context'; ctx: string };

export interface ModalsContextProps {
  modalProps: ModalSettings;
  modals: ModalState[];
  openModal: (props: ModalSettings) => string;
  openConfirmModal: (props: OpenConfirmModal) => string;
  openContextModal: <TKey extends MantineModal>(
    modal: TKey,
    props: OpenContextModal<Parameters<MantineModals[TKey]>[0]['innerProps']>
  ) => string;
  closeModal: (id: string, canceled?: boolean) => void;
  closeContextModal: <TKey extends MantineModal>(id: TKey, canceled?: boolean) => void;
  closeAll: () => void;
  updateModal: (payload: { modalId: string } & Partial<OpenConfirmModal>) => void;
  updateContextModal: (payload: { modalId: string } & Partial<OpenContextModal<any>>) => void;
}

export interface MantineModalsOverride {}

export type MantineModalsOverwritten = MantineModalsOverride extends {
  modals: Record<string, Component<ContextModalProps<any>>>;
}
  ? MantineModalsOverride
  : {
      modals: Record<string, Component<ContextModalProps<any>>>;
    };

export type MantineModals = MantineModalsOverwritten['modals'];

export type MantineModal = keyof MantineModals;

export const ModalsContext = createContext<ModalsContextProps>(null as any);
// ModalsContext.displayName = '@mantine/modals/ModalsContext';
