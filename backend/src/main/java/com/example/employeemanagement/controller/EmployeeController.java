package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.EmployeeRequestDTO;
import com.example.employeemanagement.dto.EmployeeResponseDTO;
import com.example.employeemanagement.dto.PageResponseDTO;
import com.example.employeemanagement.service.EmployeeService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.net.URI;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<PageResponseDTO<EmployeeResponseDTO>> getAllEmployees(
            @RequestParam(name = "search", defaultValue = "") String search,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir) {

        Page<EmployeeResponseDTO> result = employeeService.getAllEmployees(search, page, size, sortBy, sortDir);
        return ResponseEntity.ok(PageResponseDTO.from(result));
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponseDTO<EmployeeResponseDTO>> searchEmployees(
            @RequestParam(name = "q", defaultValue = "") String q,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir) {

        // Delegates to the same service method as GET /, keyed off the "q" param
        // required by the assignment spec (search by name or department).
        Page<EmployeeResponseDTO> result = employeeService.getAllEmployees(q, page, size, sortBy, sortDir);
        return ResponseEntity.ok(PageResponseDTO.from(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping
    public ResponseEntity<EmployeeResponseDTO> createEmployee(@Valid @RequestBody EmployeeRequestDTO requestDTO) {
        EmployeeResponseDTO created = employeeService.createEmployee(requestDTO);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.status(HttpStatus.CREATED).location(location).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequestDTO requestDTO) {

        EmployeeResponseDTO updated = employeeService.updateEmployee(id, requestDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        long totalEmployees = employeeService.count();
        Map<String, BigDecimal> averageSalaryByDepartment = employeeService.avgSalaryByDepartment();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalEmployees", totalEmployees);
        stats.put("averageSalaryByDepartment", averageSalaryByDepartment);

        return ResponseEntity.ok(stats);
    }

    // Bonus: Export to CSV. Honors the same free-text search as the list view,
    // so "export what I'm currently looking at" works from the search bar too.
    @GetMapping("/export/csv")
    public void exportCsv(
            @RequestParam(name = "search", defaultValue = "") String search,
            HttpServletResponse response) throws IOException {

        List<EmployeeResponseDTO> employees = employeeService.getAllForExport(search);

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"employees.csv\"");

        PrintWriter writer = response.getWriter();
        writer.println("ID,First Name,Last Name,Email,Department,Role,Salary,Hire Date");

        for (EmployeeResponseDTO e : employees) {
            writer.println(String.join(",",
                    csv(e.getId()),
                    csv(e.getFirstName()),
                    csv(e.getLastName()),
                    csv(e.getEmail()),
                    csv(e.getDepartment()),
                    csv(e.getRole()),
                    csv(e.getSalary()),
                    csv(e.getHireDate())
            ));
        }

        writer.flush();
    }

    private String csv(Object value) {
        if (value == null) return "";
        String text = value.toString();
        boolean needsQuoting = text.contains(",") || text.contains("\"") || text.contains("\n");
        if (!needsQuoting) return text;
        return "\"" + text.replace("\"", "\"\"") + "\"";
    }
}
