// src/components/AlertBox.tsx
import React, { useEffect, useState } from "react";
import { Alert, AlertColor, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AlertBoxProps {
  type: "success" | "error" | "warning";
  message: string;
  duration?: number; // optional: default 5000 ms
}

export default function AlertBox({ type, message, duration = 5000 }: AlertBoxProps) {
  const [open, setOpen] = useState(true);

  // Auto close after X milliseconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <Collapse in={open}>
      <Alert
        variant="filled"
        severity={type as AlertColor}
        sx={{
          borderRadius: "10px",
          fontSize: "1rem",
          fontWeight: 500,
          mb: 2,
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => setOpen(false)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Collapse>
  );
}
