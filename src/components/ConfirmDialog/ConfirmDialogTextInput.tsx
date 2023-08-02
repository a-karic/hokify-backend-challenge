import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Icon from './Icon';
import { IConfirmDialogProps } from './ConfirmDialog';

// Define a React component that renders a button and a dialog with an input field and two buttons
export const ConfirmDialogTextInput = (props: IConfirmDialogProps) => {
  // Use React hooks to manage the state of the dialog and the input field
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState<string>("");

  // Destructure the props for convenience
  const {
    button,
    dialogTitle,
    dialogText,
    placeholder,
    cancelButtonLabel,
    confirmButtonLabel,
    onCancel,
    onConfirm,
  } = props;

  // Define a function to handle the change event of the input field
  const handleInputChange = (input: string) => {
    setText(input);
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
    onConfirm && onConfirm(text);
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
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label={placeholder}
                type="text"
                fullWidth
                variant="standard"
                onChange={event => handleInputChange(event.target.value)}
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
