import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Icon from './Icon';
import { JsonInput } from '../JsonInput/JsonInput';
import { IConfirmDialogProps } from './ConfirmDialog';

// Define a React component that renders a button and a dialog with an json field and two buttons
export const ConfirmDialogJsonInput = (props: IConfirmDialogProps) => {
  // Use React hooks to manage the state of the dialog and the input field
  const [open, setOpen] = React.useState(false);
  const [json, setJson] = React.useState<{}>({});

  // Destructure the props for convenience
  const {
    button,
    value,
    dialogTitle,
    dialogText,
    cancelButtonLabel,
    confirmButtonLabel,
    onConfirm,
    onCancel,
  } = props;

  const handleInputChange = (jsonObject: {}, error: boolean) => {
    if (!error) {
        setJson(jsonObject);
    }
  };

  // Define a function to handle the click event of the button
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Define a function to handle the close event of the dialog
  const handleClose = () => {
    setOpen(false);
    onCancel && onCancel();
  };

  // Define a function to handle the confirm event of the dialog
  const handleConfirm = () => {
    setOpen(false);
    onConfirm && onConfirm(json);
  };

  // Try to render the component and catch any errors
  try {
    return (
      <div>
        <Button 
          variant="outlined" 
          startIcon={<Icon icon={button.icon} />} 
          color={button.color} 
          onClick={handleClickOpen} 
          size={button.size}
        >
          {button.label}
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogText}</DialogContentText>
               <JsonInput 
                  placeholder={value || {}}
                  onChange={handleInputChange}
              />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{cancelButtonLabel}</Button>
            <Button onClick={handleConfirm}>{confirmButtonLabel}</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  } catch (error) {
    // Log the error and return a fallback UI
    console.error(error);
    return <div>Something went wrong. Please try again later.</div>;
  }
}
