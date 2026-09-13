# Final Verification Checklist

Use this checklist to manually confirm every requirement of the assignment. Check items
off as you verify them against the running app (`backend` on :8080, `frontend` on :3000).

## Feature Requirements (1–7)

- [ ] **1. View employees** — the list loads on `http://localhost:3000` and shows all seeded employees in a grid.
- [ ] **2. Add employee** — "Add Employee" opens a dialog; submitting a valid form creates a new row and shows a success toast.
- [ ] **3. Edit employee** — the Edit (pencil) icon opens the dialog pre-filled with that employee's data; saving updates the row.
- [ ] **4. Delete employee** — the Delete (trash) icon opens a confirmation dialog; confirming removes the row and shows a success toast.
- [ ] **5. Search** — typing in the search box (name or department) filters results after a short debounce, without a full page reload.
- [ ] **6. Pagination** — the grid's page size/page controls fetch the correct page from the server (`page`, `size` query params).
- [ ] **7. Sorting** — clicking a sortable column header re-fetches data from the server sorted by that column (`sortBy`, `sortDir` query params).

## Backend — 5.2 Endpoints

- [ ] `GET /api/employees` — returns a paginated payload (`content, page, size, totalElements, totalPages, first, last`).
- [ ] `GET /api/employees/{id}` — returns 200 for an existing id, 404 for a missing id.
- [ ] `POST /api/employees` — returns 201 with a `Location` header pointing at the new resource.
- [ ] `PUT /api/employees/{id}` — returns 200 with the updated resource.
- [ ] `DELETE /api/employees/{id}` — returns 204 on success, 404 if the id doesn't exist.
- [ ] `GET /api/employees/stats` — returns `{ totalEmployees, averageSalaryByDepartment }`.
- [ ] `GET /api/employees/search?q={keyword}` — returns the same paginated shape, filtered by name/department (assignment spec 5.2).

## Backend — 5.3 Validation

- [ ] Creating/updating with a blank `firstName`/`lastName` returns 400 with a `fieldErrors` entry.
- [ ] Creating/updating with an invalid email format returns 400 with a `fieldErrors` entry.
- [ ] Creating/updating with a non-positive `salary` returns 400 with a `fieldErrors` entry.
- [ ] Creating/updating with a future `hireDate` returns 400 with a `fieldErrors` entry.
- [ ] Creating with a duplicate `email` returns 409 (not 400/500).
- [ ] Sending malformed JSON returns 400 with the message "Malformed JSON request".

## Backend — 5.4 CORS

- [ ] Requests from `http://localhost:3000` succeed in the browser (no CORS errors in the console).
- [ ] `WebConfig` global CORS and `@CrossOrigin` on the controller both resolve without conflict.

## Frontend — 6.2 Components

- [ ] `SearchBar` — controlled text field with search icon and a clear (X) button that appears only when there's text.
- [ ] `EmployeeTable` — MUI X `DataGrid` with server-side pagination/sorting, currency-formatted salary, an Actions column, and an "Add Employee" button.
- [ ] `EmployeeForm` — dialog with all seven fields, a working date picker, and a title that changes between "Add Employee" and "Edit Employee".
- [ ] `DeleteDialog` — confirmation dialog naming the employee, with disabled buttons and a spinner while deleting.

## Frontend — 6.3 Validation

- [ ] First/last name show an inline error if left blank or under 2 characters (on blur and on submit).
- [ ] Email shows an inline error for an invalid format (on blur and on submit).
- [ ] Salary shows an inline error if 0 or negative (optional field — blank is allowed).
- [ ] Hire date shows an inline error if set to a future date (optional field — blank is allowed).
- [ ] Submitting an invalid form does not call the API and surfaces all relevant field errors at once.

## Frontend — 6.4 Hooks-only State

- [ ] No class components anywhere in `src/` — every component is a function component.
- [ ] All state is managed with `useState`/`useEffect`/`useCallback`/`useMemo` — no external state library (Redux, MobX, etc.).
- [ ] Theme mode (light/dark) persists across a page refresh via `localStorage`.

## End-to-end Smoke Test

- [ ] `docker-compose up -d mysql` starts MySQL and loads `schema.sql`.
- [ ] `cd backend && ./mvnw spring-boot:run` starts the API on port 8080 with no errors.
- [ ] `cd frontend && npm install && npm start` starts the UI on port 3000 with no errors.
- [ ] A full create → edit → search → sort → paginate → delete cycle works without a page reload.

## Bonus Tasks

- [ ] **JWT Authentication** — visiting `http://localhost:3000/` while logged out redirects to `/login`; logging in with `admin`/`admin123` redirects back and shows the app; the AppBar shows the username and a logout button; logging out clears the token and redirects to `/login`; calling `/api/employees` without a token returns 401.
- [ ] **Export to CSV** — clicking "Export CSV" downloads a `employees.csv` file with a header row and one row per (currently filtered) employee.
- [ ] **Department Analytics** — summary cards above the table show the correct total employee count and a correct average salary per department, and update after add/edit/delete.
- [ ] **Unit Tests** — `cd backend && ./mvnw test` runs `EmployeeServiceImplTest` (12 tests) and all pass.
- [ ] **Docker Compose** — `docker-compose up --build` builds and starts both `mysql` and `backend` containers, and `http://localhost:8080/api/auth/login` responds once both are healthy.

