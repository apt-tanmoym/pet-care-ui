import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

import styles from './styles.module.scss';

interface CommonDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  submitLabel?: string;
  cancelLabel?: string;
  showActions?: boolean;
  hideDefaultButtons?: boolean; 
}

const CummonDialog = ({
  open,
  title,
  onClose,
  onSubmit,
  children,
  maxWidth = 'sm',
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  showActions = true,
  hideDefaultButtons = false, 
}: CommonDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle className={styles.commonDialogHeader}>{title}</DialogTitle>
      <DialogContent dividers>{children}</DialogContent>

      {showActions && !hideDefaultButtons && (
        <DialogActions>
          {onSubmit && (
            <Button onClick={onSubmit} color="success" variant="contained">
              {submitLabel}
            </Button>
          )}
          <Button onClick={onClose} color="primary" variant="contained">
            {cancelLabel}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CummonDialog;
