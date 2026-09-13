# Backend API Test Checklist

Base URL: `http://localhost:8080/api`

Run the backend (`./mvnw spring-boot:run`) and MySQL first. The commands below assume
`DataInitializer` has already seeded a few rows (or that `schema.sql` seed data is loaded).

All `/api/employees/**` routes are JWT-protected (bonus task) — get a token first with
`#0` and export it as `$TOKEN`, then pass `-H "Authorization: Bearer $TOKEN"` on every
subsequent call.

## 0. Log in and grab a token (bonus)

```bash
curl -s -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq

TOKEN=$(curl -s -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r .token)
```

Expect `200 OK` with `{ "token": "...", "username": "admin", "expiresInMs": 86400000 }`.

## 0b. Log in — wrong password (401)

```bash
curl -s -i -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}'
```

Expect `401 Unauthorized` with a JSON body containing `"message": "Invalid username or password"`.

## 0c. Call a protected endpoint without a token (401)

```bash
curl -s -i "http://localhost:8080/api/employees"
```

Expect `401 Unauthorized` with the same `ErrorResponseDTO` shape used elsewhere in the API.

## 1. List employees (paginated)

```bash
curl -s "http://localhost:8080/api/employees?page=0&size=10&sortBy=id&sortDir=asc" \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expect `200 OK` with `{ content, page, size, totalElements, totalPages, first, last }`.

## 2. Get employee by ID — success (200)

```bash
curl -s -i "http://localhost:8080/api/employees/1" -H "Authorization: Bearer $TOKEN"
```

Expect `200 OK` with a single `EmployeeResponseDTO`.

## 3. Get employee by ID — not found (404)

```bash
curl -s -i "http://localhost:8080/api/employees/999999" -H "Authorization: Bearer $TOKEN"
```

Expect `404 Not Found` with `ErrorResponseDTO` (`status: 404`, message mentioning the id).

## 4. Create employee (201)

```bash
curl -s -i -X POST "http://localhost:8080/api/employees" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{
        "firstName": "Test",
        "lastName": "User",
        "email": "test.user@example.com",
        "department": "Engineering",
        "role": "QA Engineer",
        "salary": 70000,
        "hireDate": "2024-01-15"
      }'
```

Expect `201 Created`, a `Location` header pointing to `/api/employees/{id}`, and the
created `EmployeeResponseDTO` in the body.

## 5. Create employee — duplicate email (409)

```bash
curl -s -i -X POST "http://localhost:8080/api/employees" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{
        "firstName": "Another",
        "lastName": "Person",
        "email": "test.user@example.com",
        "department": "Engineering",
        "role": "QA Engineer",
        "salary": 70000,
        "hireDate": "2024-01-15"
      }'
```

Expect `409 Conflict` with `ErrorResponseDTO` message about the email already existing.

## 6. Create employee — validation error (400)

```bash
curl -s -i -X POST "http://localhost:8080/api/employees" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{
        "firstName": "A",
        "lastName": "",
        "email": "not-an-email",
        "salary": -100,
        "hireDate": "2099-01-01"
      }'
```

Expect `400 Bad Request` with `ErrorResponseDTO.fieldErrors` populated for `firstName`,
`lastName`, `email`, `salary`, and `hireDate`.

## 7. Update employee (200)

```bash
curl -s -i -X PUT "http://localhost:8080/api/employees/1" \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{
        "firstName": "Updated",
        "lastName": "Name",
        "email": "updated.name@example.com",
        "department": "Engineering",
        "role": "Senior Engineer",
        "salary": 105000,
        "hireDate": "2020-05-01"
      }'
```

Expect `200 OK` with the updated `EmployeeResponseDTO`.

## 8. Delete employee (204)

```bash
curl -s -i -X DELETE "http://localhost:8080/api/employees/1" -H "Authorization: Bearer $TOKEN"
```

Expect `204 No Content`.

## 9. Delete employee — already deleted / not found (404)

```bash
curl -s -i -X DELETE "http://localhost:8080/api/employees/1" -H "Authorization: Bearer $TOKEN"
```

Expect `404 Not Found`.

## 10. Search employees

```bash
curl -s "http://localhost:8080/api/employees?search=engineering&page=0&size=5" \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expect `200 OK` with results filtered by first name, last name, or department matching
"engineering" (case-insensitive).

## 10b. Dedicated search endpoint (assignment spec 5.2)

```bash
curl -s "http://localhost:8080/api/employees/search?q=engineering&page=0&size=5" \
  -H "Authorization: Bearer $TOKEN" | jq
```

Expect the same shape and behavior as #10, keyed off the `q` query param instead of
`search`.

## 11. Bonus: stats endpoint (department analytics)

```bash
curl -s "http://localhost:8080/api/employees/stats" -H "Authorization: Bearer $TOKEN" | jq
```

Expect `200 OK` with `{ "totalEmployees": N, "averageSalaryByDepartment": { "Engineering": 95000.00, ... } }`.

## 12. Bonus: CSV export

```bash
curl -s "http://localhost:8080/api/employees/export/csv" -H "Authorization: Bearer $TOKEN" -o employees.csv
cat employees.csv
```

Expect a `employees.csv` file with a header row (`ID,First Name,Last Name,Email,
Department,Role,Salary,Hire Date`) followed by one row per matching employee.
