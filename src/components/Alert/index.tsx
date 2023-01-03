import { useState, Fragment } from "react";
import { Alert as MuiAlert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export function Alert(props) {
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
            <MuiAlert onClose={handleClose} severity={props.severity ?? "success"} sx={{ width: "100%" }}>
                {props.message}
            </MuiAlert>
        </Snackbar>
    );
}
