# CrewHub — Employee Management System

A full-stack Employee Management System built with **Spring Boot 3** (Java 17) on the
backend and **React 18 + MUI v5** on the frontend, backed by **MySQL 8**.

**Status:** Feature-complete — all required features and all optional bonus tasks from
the assignment brief are implemented (JWT auth, CSV export, department analytics,
JUnit 5/Mockito unit tests, and a full Docker Compose stack).

---

## Project Overview

The Employee Management System lets an organization manage employee records —
creating, viewing, updating, and removing employees, along with their department,
role, salary, and hire date. It supports paginated/sortable/searchable listing,
inline validation, toast notifications, a dark/light theme, and (as bonus work) a
JWT-protected API with a login screen, CSV export, and a small analytics dashboard.

---

## Tech Stack

| Layer      | Technology                                                                 |
|------------|------------------------------------------------------------------------------|
| Backend    | Spring Boot 3.2, Spring Data JPA, Spring Web, Spring Validation, Spring Security + JWT |
| Database   | MySQL 8                                                                       |
| Frontend   | React 18, MUI v5, MUI X Data Grid, MUI X Date Pickers, React Router, Axios, Dayjs |
| Testing    | JUnit 5 + Mockito (service-layer unit tests)                                 |
| Build      | Maven (backend), npm / react-scripts (frontend)                              |
| Tooling    | Docker Compose (MySQL + Spring Boot backend)                                 |

---

## Prerequisites

- **Java 17** (JDK)
- **Node.js 18+** and npm
- **MySQL 8** (or Docker, to run MySQL — and optionally the backend — in containers)
- **Maven 3.6+** (or use the included Maven Wrapper `./mvnw`)

---

## Running the App (local, no Docker for the backend)

```bash
# 1. Start MySQL (Docker) and load the schema
docker-compose up -d mysql

# 2. Start the backend (from /backend)
cd backend && ./mvnw spring-boot:run

# 3. Start the frontend (from /frontend, in a second terminal)
cd frontend && npm install && npm start
```

- Backend: **http://localhost:8080**
- Frontend: **http://localhost:3000**
- Log in with the demo account: **admin / admin123** (see [Bonus Features](#bonus-features-all-implemented)).

## Running the App (backend + MySQL fully containerized)

```bash
docker-compose up --build
```

This builds the backend image (multi-stage Maven build) and starts it alongside
MySQL, wired together on the same Docker network. Then run the frontend separately:

```bash
cd frontend && npm install && npm start
```

---

## Database Setup

1. Start MySQL 8 locally, or run it via Docker Compose:

   ```bash
   docker-compose up -d mysql
   ```

2. If not using the Docker init script, run the schema manually:

   ```bash
   mysql -u root -p < schema.sql
   ```

   This creates the `employee_db` database, the `employees` table, and seeds it with
   15 sample employees across five departments.

   The backend also seeds a handful of rows itself on first boot if the table is
   empty (`DataInitializer`), so the app works even if you skip this step entirely
   and just let Hibernate create the schema (`spring.jpa.hibernate.ddl-auto=update`).

---

## Environment Variables / Configuration

Set via environment variables (all have sensible local defaults in
`application.properties`):

| Variable             | Default                                              | Purpose                                  |
|----------------------|-------------------------------------------------------|-------------------------------------------|
| `DB_USERNAME`        | `root`                                                 | MySQL username                            |
| `DB_PASSWORD`        | `root`                                                 | MySQL password                            |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://localhost:3306/employee_db?...`      | Full JDBC URL (overridden in Docker Compose to point at the `mysql` service) |
| `JWT_SECRET`         | (demo Base64 secret baked into `application.properties`) | HMAC signing key for JWTs — **change this for anything beyond local demo use** |
| `JWT_EXPIRATION_MS`  | `86400000` (24h)                                       | JWT lifetime in milliseconds              |
| `ADMIN_USERNAME`     | `admin`                                                | Demo login username                       |
| `ADMIN_PASSWORD`     | `admin123`                                             | Demo login password                       |

Frontend (`frontend/.env`):

| Variable                    | Default                        | Purpose                    |
|------------------------------|---------------------------------|-----------------------------|
| `REACT_APP_API_BASE_URL`     | `http://localhost:8080/api`    | Base URL the React app calls |

---

## Project Structure

```
backend/
  src/main/java/com/example/employeemanagement/
    controller/     REST controllers only — no business logic
    service/        interfaces + impl containing all business logic
    repository/     Spring Data JPA repositories
    model/          JPA entities
    dto/            request/response DTOs
    exception/      custom exceptions + GlobalExceptionHandler
    security/       Bonus: JwtUtil, JwtAuthenticationFilter, SecurityConfig
  src/test/java/... service-layer JUnit 5 + Mockito tests

frontend/
  src/
    api/            employeeApi.js (Axios + calls), authApi.js (bonus login)
    auth/           AuthContext, ProtectedRoute (bonus JWT auth)
    components/     EmployeeTable, EmployeeForm, DeleteDialog, SearchBar, AnalyticsCards
    pages/          EmployeesPage, LoginPage
    App.js          Router, ThemeProvider, AppBar, auth wiring
```

---

## API Endpoints

| Method | Endpoint                    | Description                                                  | Auth required |
|--------|------------------------------|----------------------------------------------------------------|:---:|
| POST   | `/api/auth/login`            | Bonus: exchange username/password for a JWT                    | No |
| GET    | `/api/employees`             | List employees — paginated, sortable, and searchable via `search` | Yes |
| GET    | `/api/employees/search`      | Alias searching by name/department via `q` (assignment spec 5.2) | Yes |
| GET    | `/api/employees/{id}`        | Get a single employee by ID                                     | Yes |
| POST   | `/api/employees`             | Create a new employee                                           | Yes |
| PUT    | `/api/employees/{id}`        | Update an existing employee                                     | Yes |
| DELETE | `/api/employees/{id}`        | Delete an employee                                              | Yes |
| GET    | `/api/employees/stats`       | Bonus: total headcount + average salary per department          | Yes |
| GET    | `/api/employees/export/csv`  | Bonus: download the (optionally filtered) employee list as CSV  | Yes |

All `/api/employees/**` routes require an `Authorization: Bearer <token>` header once
you obtain a token from `/api/auth/login` (see below). Unauthenticated or expired
requests get a `401` in the same JSON error shape used everywhere else in the API.

---

## API Examples (curl)

```bash
# 1. Log in to get a token
TOKEN=$(curl -s -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")

# 2. List employees (paginated, sorted, searchable)
curl -s "http://localhost:8080/api/employees?search=&page=0&size=10&sortBy=id&sortDir=asc" \
  -H "Authorization: Bearer $TOKEN"

# Get a single employee
curl -s "http://localhost:8080/api/employees/1" -H "Authorization: Bearer $TOKEN"

# Create an employee
curl -s -X POST "http://localhost:8080/api/employees" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"firstName":"Jane","lastName":"Doe","email":"jane.doe@example.com","department":"Engineering","role":"Backend Developer","salary":95000,"hireDate":"2024-01-15"}'

# Update an employee
curl -s -X PUT "http://localhost:8080/api/employees/1" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"firstName":"Jane","lastName":"Doe","email":"jane.doe@example.com","department":"Engineering","role":"Senior Backend Developer","salary":110000,"hireDate":"2024-01-15"}'

# Delete an employee
curl -s -X DELETE "http://localhost:8080/api/employees/1" -H "Authorization: Bearer $TOKEN"

# Bonus: aggregate stats
curl -s "http://localhost:8080/api/employees/stats" -H "Authorization: Bearer $TOKEN"

# Bonus: CSV export
curl -s "http://localhost:8080/api/employees/export/csv" -H "Authorization: Bearer $TOKEN" -o employees.csv

# Dedicated search endpoint (assignment spec 5.2) — searches by name or department
curl -s "http://localhost:8080/api/employees/search?q=engineering&page=0&size=10" -H "Authorization: Bearer $TOKEN"
```

See `API_TEST_CHECKLIST.md` for the full request/response checklist, including error
cases (404, 409, 400, 401).

---

## Bonus Features (all implemented)

- **JWT Authentication** — Spring Security + JWT secures every `/api/employees/**`
  endpoint; a React login page (`/login`) and `ProtectedRoute` wrapper gate access to
  the app. Demo credentials: `admin` / `admin123` (configurable via env vars — see
  above). Tokens are stored in `localStorage` and attached automatically by an Axios
  request interceptor; a `401` response clears the token and redirects to `/login`.
- **Export to CSV** — an "Export CSV" button in the employee table toolbar downloads
  the currently-searched employee list from `GET /api/employees/export/csv`.
- **Department Analytics** — summary cards above the table show total employee count
  and average salary per department, powered by `GET /api/employees/stats`.
- **Unit Tests** — `EmployeeServiceImplTest` (JUnit 5 + Mockito) covers create/update/
  delete happy paths, duplicate-email and not-found error paths, paginated search, and
  the analytics aggregation logic (12 test cases). Run with:
  ```bash
  cd backend && ./mvnw test
  ```
- **Docker Compose** — `docker-compose.yml` spins up MySQL and the Spring Boot
  backend together (`docker-compose up --build`); `backend/Dockerfile` is a
  multi-stage Maven → JRE build.

---

## Screenshots

Drop screenshots into `docs/screenshots/` using these filenames so they can be linked
from documentation:

- `docs/screenshots/login.png` — the login screen
- `docs/screenshots/employee-list.png` — the main employee list/grid view with analytics cards
- `docs/screenshots/employee-form.png` — the Add/Edit Employee dialog

```markdown
![Login](docs/screenshots/login.png)
![Employee List](docs/screenshots/employee-list.png)
![Employee Form](docs/screenshots/employee-form.png)
```

---

## Demo Video

_Add the Google Drive / Loom / YouTube (unlisted) link to your demo recording here
before submitting, per the assignment's Section 8.3._

---

## Notes on AI Tool Use

Per the assignment's rules (Section 9), AI coding assistance was used for parts of
this implementation. Before submitting, make sure you can explain every line of code
here, especially the Spring Security/JWT wiring in `backend/.../security/` and the
Axios interceptor logic in `frontend/src/api/employeeApi.js` — reviewers may ask you
to walk through them.
