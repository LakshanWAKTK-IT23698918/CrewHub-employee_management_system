import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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

  // Reset to first page whenever the debounced search term changes, so a new
  // search never leaves the user stranded on a page that no longer exists.
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
        // Re-throw so EmployeeForm's `finally` re-enables the submit button;
        // the dialog stays open (per spec) and the user sees the error toast.
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

      // If we just deleted the last remaining row on a page beyond the first,
      // step back a page so the table doesn't show an empty page. Stepping
      // back updates paginationModel, which triggers fetchEmployees via the
      // effect above — so we only need to fetch explicitly in the other case.
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
    <Box>
      <AnalyticsCards refreshKey={statsRefreshKey} />

      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <SearchBar value={searchInput} onChange={setSearchInput} onClear={handleClearSearch} />
      </Paper>

      <Paper elevation={0} sx={{ p: 2 }}>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EmployeesPage;
