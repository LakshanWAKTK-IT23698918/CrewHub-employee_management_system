import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

function DeleteDialog({ open, employee, onCancel, onConfirm, loading = false }) {
  const firstName = employee?.firstName || '';
  const lastName = employee?.lastName || '';

  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Employee?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {firstName} {lastName}? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
