import React, { useEffect } from "react";
import { Alert, Snackbar, type AlertColor } from "@mui/material";

interface AlertBoxProps {
    open: boolean;
    message: string;
    severity: AlertColor;
    onClose: () => void;
    autoHideDuration?: number;
}

const AlertBox: React.FC<AlertBoxProps> = ({
    open,
    message,
    severity,
    onClose,
    autoHideDuration = 6000,
}) => {
    useEffect(() => {
        if (open && autoHideDuration) {
            const timer = setTimeout(() => {
                onClose();
            }, autoHideDuration);
            return () => clearTimeout(timer);
        }
    }, [open, autoHideDuration, onClose]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};

export default AlertBox;
