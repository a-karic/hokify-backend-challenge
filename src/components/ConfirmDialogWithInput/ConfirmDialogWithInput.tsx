import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Icon from '../Icon/Icon';

// Define an interface for the props of the component
interface IConfirmDialogWithInput {
  buttonLabel: string;
  buttonColor?: "error" | "inherit" | "primary" | "secondary" | "success" | "info" | "warning";
  buttonIcon?: "edit" | "delete";
  buttonSize?: "small" | "medium" | "large";
  inputFieldLabel: string;
  dialogTitle: string;
  dialogText: string;
  cancelButtonLabel: string;
  saveButtonLabel: string;
  onSave: (input: string) => void;
}

// Define a React component that renders a button and a dialog with an input field and two buttons
export default function ConfirmDialogWithInput(props: IConfirmDialogWithInput) {
  // Use React hooks to manage the state of the dialog and the input field
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState<string>("");

  // Destructure the props for convenience
  const {
    buttonLabel,
    buttonColor,
    buttonIcon,
    buttonSize,
    inputFieldLabel,
    dialogTitle,
    dialogText,
    cancelButtonLabel,
    saveButtonLabel,
    onSave,
  } = props;

  // Define a function to handle the change event of the input field
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Set the input state to the event target value
    setInput(event.target.value);
  };

  // Define a function to handle the click event of the button
  const handleClickOpen = () => {
    // Set the open state to true
    setOpen(true);
  };

  // Define a function to handle the close event of the dialog
  const handleClose = () => {
    // Set the open state to false
    setOpen(false);
  };

  // Define a function to handle the save event of the dialog
  const handleSave = () => {
    // Set the open state to false
    setOpen(false);
    // Call the onSave prop with the input value
    onSave(input);
  };

  // Try to render the component and catch any errors
  try {
    return (
      <div>
        <Button 
          variant="outlined" 
          startIcon={<Icon icon={buttonIcon} />} 
          color={buttonColor} 
          onClick={handleClickOpen} 
          size={buttonSize}
        >
          {buttonLabel}
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogText}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={inputFieldLabel}
              type="text"
              fullWidth
              variant="standard"
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>{cancelButtonLabel}</Button>
            <Button onClick={handleSave}>{saveButtonLabel}</Button>
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
