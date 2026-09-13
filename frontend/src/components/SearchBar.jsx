import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * Controlled search input. Debouncing is handled by the parent (EmployeesPage) —
 * this component simply reports every keystroke via onChange.
 */
function SearchBar({ value, onChange, onClear, disabled = false }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange('');
    }
  };

  return (
    <TextField
      fullWidth
      value={value}
      onChange={handleChange}
      label="Search by name or department"
      placeholder="e.g. Engineering, Jane, Perera"
      disabled={disabled}
      variant="outlined"
      size="medium"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="Clear search"
              onClick={handleClear}
              edge="end"
              size="small"
              disabled={disabled}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}

export default SearchBar;
