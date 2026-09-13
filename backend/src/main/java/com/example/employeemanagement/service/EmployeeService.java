package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.EmployeeRequestDTO;
import com.example.employeemanagement.dto.EmployeeResponseDTO;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface EmployeeService {

    Page<EmployeeResponseDTO> getAllEmployees(String search, int page, int size, String sortBy, String sortDir);

    EmployeeResponseDTO getEmployeeById(Long id);

    EmployeeResponseDTO createEmployee(EmployeeRequestDTO dto);

    EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO dto);

    void deleteEmployee(Long id);

    /**
     * Bonus helper: total number of employees.
     */
    long count();

    /**
     * Bonus helper: average salary grouped by department.
     * Null-safe — returns an empty map if there are no employees,
     * and skips employees with a null department or null salary.
     */
    Map<String, BigDecimal> avgSalaryByDepartment();

    /**
     * Bonus: CSV export. Returns every employee matching the optional search
     * term (name or department), unpaginated, in stable id order.
     */
    List<EmployeeResponseDTO> getAllForExport(String search);
}
