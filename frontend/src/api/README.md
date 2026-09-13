# Frontend API Layer

`employeeApi.js` wraps the backend's `/api/employees` REST resource with a single
configured Axios instance and a set of small async functions used throughout the app.

## Configuration

- **Base URL**: `process.env.REACT_APP_API_BASE_URL`, falling back to
  `http://localhost:8080/api` if the env var isn't set (see `frontend/.env`).
- **Timeout**: 10,000 ms.

## Error normalization

Every request goes through a response interceptor that converts any Axios error into a
consistent shape, regardless of whether it came from the server or the network:

```js
{
  message: string,       // human-readable message, safe to show in a snackbar
  status: number | null, // HTTP status code, or null on network failure
  fieldErrors: object | null, // { fieldName: errorMessage } for 400 validation errors
}
```

This mirrors the backend's `ErrorResponseDTO` (`timestamp, status, error, message, path,
fieldErrors`) — the interceptor just narrows it down to what the UI actually needs.

## Exported functions

| Function                                | Method | Endpoint                | Notes                                             |
|------------------------------------------|--------|--------------------------|----------------------------------------------------|
| `getEmployees({search,page,size,sortBy,sortDir})` | GET    | `/employees`             | Returns `PageResponseDTO` (`content, page, size, totalElements, totalPages, first, last`) |
| `getEmployeeById(id)`                    | GET    | `/employees/{id}`        | Returns a single `EmployeeResponseDTO`             |
| `createEmployee(payload)`                | POST   | `/employees`              | `payload` matches `EmployeeRequestDTO`             |
| `updateEmployee(id, payload)`            | PUT    | `/employees/{id}`        | `payload` matches `EmployeeRequestDTO`             |
| `deleteEmployee(id)`                     | DELETE | `/employees/{id}`        | No response body                                    |
| `getStats()`                             | GET    | `/employees/stats`        | Bonus: `{ totalEmployees, averageSalaryByDepartment }` |

## Example usage

```js
import { getEmployees, createEmployee } from '../api/employeeApi';

const page = await getEmployees({ search: 'engineering', page: 0, size: 10, sortBy: 'lastName', sortDir: 'asc' });

try {
  const created = await createEmployee({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    department: 'Engineering',
    role: 'Backend Developer',
    salary: 95000,
    hireDate: '2024-01-15',
  });
} catch (err) {
  // err is already normalized: { message, status, fieldErrors }
  console.error(err.message, err.fieldErrors);
}
```
