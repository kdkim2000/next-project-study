// components/CustomSnackbar.tsx
"use client";

import { Snackbar, Alert, AlertColor } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
  autoHideDuration?: number;
}

export default function CustomSnackbar({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 6000,
}: CustomSnackbarProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          transition={{ duration: 0.4, ease: "backOut" }}
        >
          <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={onClose}
              severity={severity}
              variant="filled"
              sx={{
                width: '100%',
                '& .MuiAlert-message': {
                  fontWeight: 500,
                },
                boxShadow: 3,
              }}
            >
              {message}
            </Alert>
          </Snackbar>
        </motion.div>
      )}
    </AnimatePresence>
  );
}