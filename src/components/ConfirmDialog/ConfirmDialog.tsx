import * as React from 'react';
import { ConfirmDialogDefault } from './ConfirmDialogDefault';
import { ConfirmDialogTextInput } from './ConfirmDialogTextInput';
import { ConfirmDialogJsonInput } from './ConfirmDialogJsonInput';

// Define an enum for the different types of dialogs that can be rendered
export enum EConfirmDialogType {
  DEFAULT, // no input
  TEXT_INPUT,
  JSON_INPUT,
}

// Define an interface for the button of the component
export interface IConfirmDialogButton {
  label: string; // The label of the button that opens the dialog
  color?: "error" | "inherit" | "primary" | "secondary" | "success" | "info" | "warning"; // The color of the button that opens the dialog
  icon?: "edit" | "delete"; // The icon of the button that opens the dialog
  size?: "small" | "medium" | "large"; // The size of the button that opens the dialog
}

// Define an interface for the props of the component
export interface IConfirmDialogProps {
  type?: EConfirmDialogType; // The type of dialog to render
  button: IConfirmDialogButton;
  dialogTitle: string; // The title of the dialog
  dialogText: string; // The text of the dialog
  placeholder?: string; // The placeholder text for the input field (if applicable)
  value?: {}; // The initial value for the input field (if applicable)
  cancelButtonLabel: string; // The label of the cancel button in the dialog
  confirmButtonLabel: string; // The label of the confirm button in the dialog
  onCancel?: () => void; // The callback function to execute when the cancel button is clicked
  onConfirm: (value: string | unknown) => void; // The callback function to execute when the confirm button is clicked
}

// Define the ConfirmDialog component
export const ConfirmDialog = (props: IConfirmDialogProps) => {
  const {
    type = EConfirmDialogType.DEFAULT, // Set a default value for the type prop if it is not provided
  } = props;

  // Use a switch statement to render the appropriate type of dialog based on the value of the type prop
  switch (type) {
    case EConfirmDialogType.JSON_INPUT:
      return <ConfirmDialogJsonInput {...props} />;

    case EConfirmDialogType.TEXT_INPUT:
      return <ConfirmDialogTextInput {...props} />;

    case EConfirmDialogType.DEFAULT:
    default:
      return <ConfirmDialogDefault {...props} />;
  }
}
