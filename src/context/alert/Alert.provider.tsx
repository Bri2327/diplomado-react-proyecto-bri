import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { AlertContext, type AlertType } from './Alert.context';
import { Alert, Snackbar, type AlertColor } from '@mui/material';

interface Props {
  children: ReactNode;
}

export const AlertProvider = ({ children }: Props) => {
  const [alert, setAlert] = useState<AlertType | null>(null);

  const showAlert = useCallback((message: string, severity: AlertColor = 'info') => {
    setAlert({ message, severity });
  }, []);

  const value = useMemo(() => ({ showAlert }), [showAlert]);
  const handleClose = (_event?: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      {alert && (
        <Snackbar
          open={!!alert}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            severity={alert.severity}
            onClose={handleClose}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      )}
    </AlertContext.Provider>
  );
};
