import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  validateRequired,
  validateMinLength,
  validateEmail,
  validatePositive,
  validateNotFuture,
} from '../utils/validators';

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  role: '',
  salary: '',
  hireDate: null, // dayjs instance or null
};

function toFormState(initialValues) {
  if (!initialValues) return { ...EMPTY_FORM };

  return {
    firstName: initialValues.firstName || '',
    lastName: initialValues.lastName || '',
    email: initialValues.email || '',
    department: initialValues.department || '',
    role: initialValues.role || '',
    salary:
      initialValues.salary === null || initialValues.salary === undefined
        ? ''
        : String(initialValues.salary),
    hireDate: initialValues.hireDate ? dayjs(initialValues.hireDate) : null,
  };
}

function validateField(name, form) {
  switch (name) {
    case 'firstName':
      if (!validateRequired(form.firstName)) return 'First name is required.';
      if (!validateMinLength(form.firstName, 2)) return 'First name must be at least 2 characters.';
      return '';
    case 'lastName':
      if (!validateRequired(form.lastName)) return 'Last name is required.';
      if (!validateMinLength(form.lastName, 2)) return 'Last name must be at least 2 characters.';
      return '';
    case 'email':
      if (!validateRequired(form.email)) return 'Email is required.';
      if (!validateEmail(form.email)) return 'Enter a valid email address.';
      return '';
    case 'salary':
      if (form.salary === '' || form.salary === null || form.salary === undefined) return '';
      if (!validatePositive(form.salary)) return 'Salary must be a positive number.';
      return '';
    case 'hireDate':
      if (!form.hireDate) return '';
      if (!form.hireDate.isValid || !form.hireDate.isValid()) return 'Enter a valid date.';
      if (!validateNotFuture(form.hireDate)) return 'Hire date cannot be in the future.';
      return '';
    default:
      return '';
  }
}

function validateAll(form) {
  const fields = ['firstName', 'lastName', 'email', 'salary', 'hireDate'];
  const errors = {};
  fields.forEach((field) => {
    const error = validateField(field, form);
    if (error) errors[field] = error;
  });
  return errors;
}

function EmployeeForm({ open, initialValues, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = Boolean(initialValues && initialValues.id);

  // Re-initialize the local form state every time the dialog opens (or the
  // record being edited changes) so stale data never leaks between opens.
  useEffect(() => {
    if (open) {
      setForm(toFormState(initialValues));
      setErrors({});
      setTouched({});
      setSubmitting(false);
    }
  }, [open, initialValues]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (value) => {
    setForm((prev) => ({ ...prev, hireDate: value }));
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, form) }));
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setTouched({});
    setSubmitting(false);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateAll(form);
    setErrors(validationErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      salary: true,
      hireDate: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      department: form.department.trim() || null,
      role: form.role.trim() || null,
      salary: form.salary === '' ? null : Number(form.salary),
      hireDate: form.hireDate ? form.hireDate.format('YYYY-MM-DD') : null,
    };

    setSubmitting(true);
    try {
      await onSave(payload);
      // Dialog stays open until the parent flips `open` to false on success;
      // if onSave throws, we fall through to `finally` and re-enable the form.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : handleCancel} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{isEditMode ? 'Edit Employee' : 'Add Employee'}</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={form.firstName}
                onChange={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName ? errors.firstName : ''}
                disabled={submitting}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={form.lastName}
                onChange={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName ? errors.lastName : ''}
                disabled={submitting}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                value={form.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email ? errors.email : ''}
                disabled={submitting}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                value={form.department}
                onChange={handleChange('department')}
                disabled={submitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Role"
                value={form.role}
                onChange={handleChange('role')}
                disabled={submitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Salary"
                value={form.salary}
                onChange={handleChange('salary')}
                onBlur={handleBlur('salary')}
                error={Boolean(touched.salary && errors.salary)}
                helperText={touched.salary ? errors.salary : ''}
                disabled={submitting}
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Hire Date"
                  value={form.hireDate}
                  onChange={handleDateChange}
                  disabled={submitting}
                  maxDate={dayjs()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      onBlur: handleBlur('hireDate'),
                      error: Boolean(touched.hireDate && errors.hireDate),
                      helperText: touched.hireDate ? errors.hireDate : '',
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isEditMode ? 'Save Changes' : 'Create Employee'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EmployeeForm;
