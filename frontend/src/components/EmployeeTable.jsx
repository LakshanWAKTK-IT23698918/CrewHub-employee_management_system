import React, { useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { colorFor, initialsFor } from '../theme/brand';

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatSalary(salary) {
  if (salary === null || salary === undefined || salary === '') return '—';
  const num = Number(salary);
  if (Number.isNaN(num)) return '—';
  return `Rs. ${numberFormatter.format(num)}`;
}

function formatHireDate(hireDate) {
  if (!hireDate) return '—';
  // hireDate arrives as an ISO date string ("YYYY-MM-DD") from the backend.
  return hireDate;
}

function EmptyState() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        color: 'text.secondary',
      }}
    >
      <PeopleOutlineIcon sx={{ fontSize: 48, mb: 1, opacity: 0.6 }} />
      <Typography variant="subtitle1">No employees found</Typography>
      <Typography variant="body2">Try adjusting your search, or add a new employee.</Typography>
    </Box>
  );
}

function EmployeeTable({
  rows = [],
  loading = false,
  rowCount = 0,
  paginationModel,
  onPaginationModelChange,
  sortModel,
  onSortModelChange,
  onEdit,
  onDelete,
  onAdd,
  onExportCsv,
  exporting = false,
}) {
  const columns = useMemo(
    () => [
      {
        field: 'firstName',
        headerName: 'Employee',
        flex: 1.6,
        minWidth: 220,
        renderCell: (params) => {
          const { firstName, lastName, email } = params.row;
          const fullName = `${firstName || ''} ${lastName || ''}`.trim();
          const { bg, fg } = colorFor(email || fullName);
          return (
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ py: 1, minWidth: 0 }}>
              <Avatar sx={{ bgcolor: bg, color: fg, width: 34, height: 34, fontSize: '0.8rem', fontWeight: 700 }}>
                {initialsFor(firstName, lastName)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                  {fullName || '—'}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                  {email}
                </Typography>
              </Box>
            </Stack>
          );
        },
      },
      {
        field: 'department',
        headerName: 'Department',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => {
          if (!params.value) return null;
          const { bg } = colorFor(params.value);
          return (
            <Chip
              label={params.value}
              size="small"
              sx={{
                bgcolor: `${bg}22`,
                color: bg,
                fontWeight: 600,
                border: `1px solid ${bg}55`,
              }}
            />
          );
        },
      },
      { field: 'role', headerName: 'Role', flex: 1, minWidth: 150 },
      {
        field: 'salary',
        headerName: 'Salary',
        width: 150,
        valueFormatter: (params) => formatSalary(params.value),
      },
      {
        field: 'hireDate',
        headerName: 'Hire Date',
        width: 130,
        valueFormatter: (params) => formatHireDate(params.value),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 110,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                aria-label={`Edit ${params.row.firstName} ${params.row.lastName}`}
                onClick={() => onEdit(params.row)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                aria-label={`Delete ${params.row.firstName} ${params.row.lastName}`}
                onClick={() => onDelete(params.row)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={onExportCsv}
          disabled={exporting}
        >
          {exporting ? 'Exporting…' : 'Export CSV'}
        </Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
          Add Employee
        </Button>
      </Box>

      <DataGrid
        autoHeight
        rowHeight={64}
        rows={rows}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[5, 10, 25, 50]}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        slots={{
          noRowsOverlay: EmptyState,
        }}
        sx={{
          '--DataGrid-overlayHeight': '300px',
          border: 'none',
        }}
      />
    </Box>
  );
}

export default EmployeeTable;
