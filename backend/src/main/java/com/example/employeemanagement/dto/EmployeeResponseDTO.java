package com.example.employeemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeResponseDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private String role;
    private BigDecimal salary;
    private LocalDate hireDate;
    private LocalDateTime createdAt;
}
