package com.example.employeemanagement.service.impl;

import com.example.employeemanagement.dto.EmployeeRequestDTO;
import com.example.employeemanagement.dto.EmployeeResponseDTO;
import com.example.employeemanagement.exception.DuplicateResourceException;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.service.EmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeResponseDTO> getAllEmployees(String search, int page, int size, String sortBy, String sortDir) {

        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<Employee> employeePage;

        if (search == null || search.trim().isEmpty()) {
            employeePage = employeeRepository.findAll(pageable);
        } else {
            String term = search.trim();
            employeePage = employeeRepository
                    .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
                            term, term, term, pageable);
        }

        return employeePage.map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponseDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee with id " + id + " not found"));
        return toResponse(employee);
    }

    @Override
    @Transactional
    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO dto) {
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Employee with email " + dto.getEmail() + " already exists");
        }

        Employee employee = toEntity(dto);
        Employee saved = employeeRepository.save(employee);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO dto) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee with id " + id + " not found"));

        boolean emailChanged = !existing.getEmail().equalsIgnoreCase(dto.getEmail());
        if (emailChanged && employeeRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Employee with email " + dto.getEmail() + " already exists");
        }

        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setEmail(dto.getEmail());
        existing.setDepartment(dto.getDepartment());
        existing.setRole(dto.getRole());
        existing.setSalary(dto.getSalary());
        existing.setHireDate(dto.getHireDate());

        Employee saved = employeeRepository.save(existing);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee with id " + id + " not found");
        }
        employeeRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public long count() {
        return employeeRepository.count();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, BigDecimal> avgSalaryByDepartment() {
        List<Employee> employees = employeeRepository.findAll();

        if (employees == null || employees.isEmpty()) {
            return new LinkedHashMap<>();
        }

        Map<String, List<Employee>> byDepartment = employees.stream()
                .filter(e -> e.getDepartment() != null && !e.getDepartment().trim().isEmpty())
                .filter(e -> e.getSalary() != null)
                .collect(Collectors.groupingBy(Employee::getDepartment, LinkedHashMap::new, Collectors.toList()));

        Map<String, BigDecimal> result = new LinkedHashMap<>();
        for (Map.Entry<String, List<Employee>> entry : byDepartment.entrySet()) {
            List<Employee> deptEmployees = entry.getValue();
            BigDecimal total = deptEmployees.stream()
                    .map(Employee::getSalary)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal average = total.divide(
                    BigDecimal.valueOf(deptEmployees.size()), 2, RoundingMode.HALF_UP);

            result.put(entry.getKey(), average);
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getAllForExport(String search) {
        Sort sort = Sort.by(Sort.Direction.ASC, "id");
        List<Employee> employees;

        if (search == null || search.trim().isEmpty()) {
            employees = employeeRepository.findAll(sort);
        } else {
            String term = search.trim();
            employees = employeeRepository
                    .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
                            term, term, term, sort);
        }

        return employees.stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ---------------------------------------------------------------
    // Mappers
    // ---------------------------------------------------------------

    private EmployeeResponseDTO toResponse(Employee employee) {
        return EmployeeResponseDTO.builder()
                .id(employee.getId())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .email(employee.getEmail())
                .department(employee.getDepartment())
                .role(employee.getRole())
                .salary(employee.getSalary())
                .hireDate(employee.getHireDate())
                .createdAt(employee.getCreatedAt())
                .build();
    }

    private Employee toEntity(EmployeeRequestDTO dto) {
        return Employee.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .department(dto.getDepartment())
                .role(dto.getRole())
                .salary(dto.getSalary())
                .hireDate(dto.getHireDate())
                .build();
    }
}
