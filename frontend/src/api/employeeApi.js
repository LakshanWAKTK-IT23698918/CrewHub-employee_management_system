import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Normalizes any Axios error into a predictable shape:
 * { message, status, fieldErrors }
 *
 * - If the backend responded with an ErrorResponseDTO-shaped body, we pull
 *   message/status/fieldErrors straight from it.
 * - If the backend responded but with an unexpected shape, we fall back to
 *   a generic message built from the HTTP status.
 * - If there was no response at all (network failure, timeout, CORS, etc.),
 *   we return a network-failure fallback.
 */
function normalizeError(error) {
  if (error.response) {
    const { status, data } = error.response;

    if (data && typeof data === 'object') {
      return {
        message: data.message || `Request failed with status ${status}`,
        status,
        fieldErrors: data.fieldErrors || null,
      };
    }

    return {
      message: `Request failed with status ${status}`,
      status,
      fieldErrors: null,
    };
  }

  if (error.request) {
    return {
      message: 'Unable to reach the server. Please check your connection and try again.',
      status: null,
      fieldErrors: null,
    };
  }

  return {
    message: error.message || 'An unexpected error occurred.',
    status: null,
    fieldErrors: null,
  };
}

const TOKEN_STORAGE_KEY = 'ems-auth-token';

// Bonus: JWT auth — attach the stored token to every request.
apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token missing/expired/invalid — clear it and send the user back to login.
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(normalizeError(error));
  }
);

/**
 * Fetch a paginated, searchable, sortable list of employees.
 * @param {Object} params
 * @param {string} [params.search]
 * @param {number} [params.page]
 * @param {number} [params.size]
 * @param {string} [params.sortBy]
 * @param {string} [params.sortDir]
 */
export async function getEmployees({ search = '', page = 0, size = 10, sortBy = 'id', sortDir = 'asc' } = {}) {
  const response = await apiClient.get('/employees', {
    params: { search, page, size, sortBy, sortDir },
  });
  return response.data;
}

export async function getEmployeeById(id) {
  const response = await apiClient.get(`/employees/${id}`);
  return response.data;
}

export async function createEmployee(payload) {
  const response = await apiClient.post('/employees', payload);
  return response.data;
}

export async function updateEmployee(id, payload) {
  const response = await apiClient.put(`/employees/${id}`, payload);
  return response.data;
}

export async function deleteEmployee(id) {
  const response = await apiClient.delete(`/employees/${id}`);
  return response.data;
}

// Bonus: aggregate stats (total employees + average salary by department)
export async function getStats() {
  const response = await apiClient.get('/employees/stats');
  return response.data;
}

// Bonus: CSV export. Triggers a browser download of every employee matching
// the current search term (or the whole table if search is empty).
export async function exportEmployeesCsv(search = '') {
  const response = await apiClient.get('/employees/export/csv', {
    params: { search },
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'employees.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export { TOKEN_STORAGE_KEY };
export default apiClient;
