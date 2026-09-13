package com.example.employeemanagement.repository;

import com.example.employeemanagement.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmail(String email);

    Optional<Employee> findByEmail(String email);

    Page<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
            String firstName,
            String lastName,
            String department,
            Pageable pageable
    );

    // Bonus: CSV export — unpaginated variant of the same search, ordered by id.
    java.util.List<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
            String firstName,
            String lastName,
            String department,
            org.springframework.data.domain.Sort sort
    );
}
