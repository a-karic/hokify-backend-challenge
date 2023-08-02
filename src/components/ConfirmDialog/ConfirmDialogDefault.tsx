import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Icon from './Icon';
import { IConfirmDialogProps } from './ConfirmDialog';

// Define a React component that renders a button and a dialog with two buttons and some text
export const ConfirmDialogDefault = (props: IConfirmDialogProps) => {
  // Use React hooks to manage the state of the dialog
  const [open, setOpen] = React.useState(false);

  // Destructure the props for convenience
  const {
    button,
    dialogTitle,
    dialogText,
    cancelButtonLabel,
    confirmButtonLabel,
    onCancel,
    onConfirm,
  } = props;

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
    onConfirm && onConfirm(null);
  };

  // Try to render the component and catch any errors
  try {
    return (
      <div>
        <Button 
          variant="outlined" 
          color={button.color} 
          startIcon={<Icon icon={button.icon} />} 
          size={button.size} 
          onClick={handleClickOpen}>
          {button.label}
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {dialogTitle}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {dialogText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{cancelButtonLabel}</Button>
            <Button onClick={handleConfirm} autoFocus>
              {confirmButtonLabel}
            </Button>
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
