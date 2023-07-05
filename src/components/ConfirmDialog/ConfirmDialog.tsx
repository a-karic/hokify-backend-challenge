import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Icon from '../Icon/Icon';

// Define an interface for the props of the component
interface IConfirmDialogProps {
  buttonLabel: string; // The label of the button that opens the dialog
  buttonColor: "error" | "inherit" | "primary" | "secondary" | "success" | "info" | "warning"; // The color of the button that opens the dialog
  buttonIcon?: "delete"; // The icon of the button that opens the dialog
  buttonSize?: "small" | "medium" | "large"; // The size of the button that opens the dialog
  dialogTitle: string; // The title of the dialog
  dialogText: string; // The text of the dialog
  cancelButtonLabel: string; // The label of the cancel button in the dialog
  confirmButtonLabel: string; // The label of the confirm button in the dialog
  onCancel?: () => void; // The callback function to execute when the cancel button is clicked
  onConfirm: () => void; // The callback function to execute when the confirm button is clicked
}

// Define a React component that renders a button and a dialog with two buttons and some text
export default function ConfirmDialog(props: IConfirmDialogProps) {
  // Use React hooks to manage the state of the dialog
  const [open, setOpen] = React.useState(false);

  // Destructure the props for convenience
  const {
    buttonLabel,
    buttonColor,
    buttonIcon,
    buttonSize,
    dialogTitle,
    dialogText,
    cancelButtonLabel,
    confirmButtonLabel,
    onCancel,
    onConfirm,
  } = props;

  // Define a function to handle the click event of the button
  const handleClickOpen = () => {
    // Set the open state to true
    setOpen(true);
  };

  // Define a function to handle the close event of the dialog
  const handleClose = () => {
    // Set the open state to false
    setOpen(false);
    // Call the onCancel prop if it exists
    onCancel && onCancel();
  };

  // Define a function to handle the confirm event of the dialog
  const handleConfirm = () => {
    // Set the open state to false
    setOpen(false);
    // Call the onConfirm prop with no arguments
    onConfirm();
  };

  // Try to render the component and catch any errors
  try {
    return (
      <div>
        <Button 
          variant="outlined" 
          color={buttonColor} 
          startIcon={<Icon icon={buttonIcon} />} 
          size={buttonSize} 
          onClick={handleClickOpen}>
          {buttonLabel}
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
