import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { getEmployees, createEmployee, updateEmployee, deleteEmployee, exportEmployeesCsv } from '../api/employeeApi';
import SearchBar from '../components/SearchBar';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeForm from '../components/EmployeeForm';
import DeleteDialog from '../components/DeleteDialog';
import AnalyticsCards from '../components/AnalyticsCards';

const SEARCH_DEBOUNCE_MS = 300;
const DEFAULT_SORT = { field: 'id', sort: 'asc' };

function EmployeesPage() {
  // ---- Data / pagination / sorting state ----
  const [employees, setEmployees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [sortModel, setSortModel] = useState([DEFAULT_SORT]);

  // ---- Search state (raw input + debounced value actually used for fetching) ----
  const [searchInput, setSearchInput] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  // ---- Dialog / editing state ----
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ---- Snackbar (toast) state ----
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ---- CSV export state ----
  const [exporting, setExporting] = useState(false);

  // ---- Bump this whenever data changes so AnalyticsCards refetches stats ----
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // ---- Debounce the search input by 300ms ----
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchDebounced(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Reset to first page whenever the debounced search term changes
  useEffect(() => {
    setPaginationModel((prev) => (prev.page === 0 ? prev : { ...prev, page: 0 }));
  }, [searchDebounced]);

  // ---- Fetch employees whenever page / pageSize / sort / search changes ----
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const activeSort = sortModel[0] || DEFAULT_SORT;
      const data = await getEmployees({
        search: searchDebounced,
        page: paginationModel.page,
        size: paginationModel.pageSize,
        sortBy: activeSort.field || DEFAULT_SORT.field,
        sortDir: activeSort.sort || DEFAULT_SORT.sort,
      });

      setEmployees(data.content || []);
      setTotalCount(data.totalElements || 0);
    } catch (error) {
      showSnackbar(error.message || 'Failed to load employees.', 'error');
    } finally {
      setLoading(false);
    }
  }, [paginationModel.page, paginationModel.pageSize, sortModel, searchDebounced, showSnackbar]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ---- Handlers ----
  const handleAdd = useCallback(() => {
    setEditingEmployee(null);
    setDialogOpen(true);
  }, []);

  const handleEdit = useCallback((row) => {
    setEditingEmployee(row);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingEmployee(null);
  }, []);

  const handleSave = useCallback(
    async (payload) => {
      try {
        if (editingEmployee && editingEmployee.id) {
          await updateEmployee(editingEmployee.id, payload);
          showSnackbar('Employee updated successfully.', 'success');
        } else {
          await createEmployee(payload);
          showSnackbar('Employee created successfully.', 'success');
        }
        setDialogOpen(false);
        setEditingEmployee(null);
        await fetchEmployees();
        setStatsRefreshKey((prev) => prev + 1);
      } catch (error) {
        showSnackbar(error.message || 'Failed to save employee.', 'error');
        throw error;
      }
    },
    [editingEmployee, fetchEmployees, showSnackbar]
  );

  const handleDelete = useCallback((row) => {
    setDeleteTarget(row);
  }, []);

  const handleCancelDelete = useCallback(() => {
    if (deleteLoading) return;
    setDeleteTarget(null);
  }, [deleteLoading]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);
    try {
      await deleteEmployee(deleteTarget.id);
      showSnackbar('Employee deleted successfully.', 'success');
      setStatsRefreshKey((prev) => prev + 1);

      const isLastRowOnPage = employees.length === 1;
      const isNotFirstPage = paginationModel.page > 0;

      if (isLastRowOnPage && isNotFirstPage) {
        setPaginationModel((prev) => ({ ...prev, page: prev.page - 1 }));
      } else {
        await fetchEmployees();
      }
    } catch (error) {
      showSnackbar(error.message || 'Failed to delete employee.', 'error');
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, employees.length, paginationModel.page, fetchEmployees, showSnackbar]);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
  }, []);

  const handleExportCsv = useCallback(async () => {
    setExporting(true);
    try {
      await exportEmployeesCsv(searchDebounced);
      showSnackbar('Employee data exported successfully.', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to export employees.', 'error');
    } finally {
      setExporting(false);
    }
  }, [searchDebounced, showSnackbar]);

  return (
    <Box sx={{ position: 'relative' }}>
      {/* ==================== PAGE HEADER ==================== */}
      <Box
        sx={{
          mb: 4,
          pb: 3,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '1.85rem' },
                letterSpacing: '-0.02em',
                color: '#ffffff',
                mb: 0.5,
              }}
            >
              Employee Directory
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                {totalCount} {totalCount === 1 ? 'employee' : 'employees'} in your organization
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* ==================== ANALYTICS CARDS ==================== */}
      <Box sx={{ mb: 4 }}>
        <AnalyticsCards refreshKey={statsRefreshKey} />
      </Box>

      {/* ==================== SEARCH BAR ==================== */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(232,163,61,0.2)',
          },
        }}
      >
        <SearchBar value={searchInput} onChange={setSearchInput} onClear={handleClearSearch} />
      </Paper>

      {/* ==================== EMPLOYEE TABLE ==================== */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
        }}
      >
        <EmployeeTable
          rows={employees}
          loading={loading}
          rowCount={totalCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onExportCsv={handleExportCsv}
          exporting={exporting}
        />
      </Paper>

      {/* ==================== DIALOGS ==================== */}
      <EmployeeForm
        open={dialogOpen}
        initialValues={editingEmployee}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />

      <DeleteDialog
        open={Boolean(deleteTarget)}
        employee={deleteTarget}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* ==================== SNACKBAR ==================== */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: 2,
            fontWeight: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EmployeesPage;