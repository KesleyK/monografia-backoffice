import { useState, Fragment } from "react";
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export function ErrorAlert(props) {
    const [open, setOpen] = useState(true);

    const handleClose = (_, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const action = (
        <Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={6000}
            onClose={handleClose}
            message="Note archived"
            action={action}
        >
            <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
                {props.errorMessage}
            </Alert>
        </Snackbar>
    );
}
