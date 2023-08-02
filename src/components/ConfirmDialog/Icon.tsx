import * as React from 'react';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';

interface IIconProps {
    icon?: "edit" | "delete"
}

export default function Icon(props: IIconProps) {
    const {
        icon,
    } = props;

    // Use a switch statement to compare the buttonIcon value with different cases
    switch (icon) {
        // If the buttonIcon value is "edit", return the Edit icon component
        case "edit":
        return <Edit />;

        // If the buttonIcon value is "delete", return the Delete icon component
        case "delete":
        return <Delete />;

        // If the buttonIcon value is falsy, return null
        case null:
        case undefined:
        default: 
        return null;
    }
}