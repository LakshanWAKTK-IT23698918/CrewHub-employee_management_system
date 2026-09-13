package com.example.employeemanagement.config;

import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;

    public DataInitializer(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public void run(String... args) {
        // Only seed if the table is completely empty. Never deletes existing rows.
        if (employeeRepository.count() == 0) {
            employeeRepository.save(Employee.builder()
                    .firstName("Sahan")
                    .lastName("Mendis")
                    .email("sahan.mendis@example.com")
                    .department("Engineering")
                    .role("Software Engineer")
                    .salary(new BigDecimal("92000.00"))
                    .hireDate(LocalDate.of(2021, 6, 15))
                    .build());

            employeeRepository.save(Employee.builder()
                    .firstName("Dilki")
                    .lastName("Senanayake")
                    .email("dilki.senanayake@example.com")
                    .department("HR")
                    .role("HR Specialist")
                    .salary(new BigDecimal("58000.00"))
                    .hireDate(LocalDate.of(2020, 2, 3))
                    .build());

            employeeRepository.save(Employee.builder()
                    .firstName("Ruwan")
                    .lastName("Dissanayake")
                    .email("ruwan.dissanayake@example.com")
                    .department("Sales")
                    .role("Sales Executive")
                    .salary(new BigDecimal("64000.00"))
                    .hireDate(LocalDate.of(2022, 9, 12))
                    .build());

            employeeRepository.save(Employee.builder()
                    .firstName("Hasini")
                    .lastName("Karunaratne")
                    .email("hasini.karunaratne@example.com")
                    .department("Finance")
                    .role("Junior Accountant")
                    .salary(new BigDecimal("51000.00"))
                    .hireDate(LocalDate.of(2023, 4, 20))
                    .build());
        }
    }
}
