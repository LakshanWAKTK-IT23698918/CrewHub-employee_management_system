package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.EmployeeRequestDTO;
import com.example.employeemanagement.dto.EmployeeResponseDTO;
import com.example.employeemanagement.exception.DuplicateResourceException;
import com.example.employeemanagement.exception.ResourceNotFoundException;
import com.example.employeemanagement.model.Employee;
import com.example.employeemanagement.repository.EmployeeRepository;
import com.example.employeemanagement.service.impl.EmployeeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Bonus: JUnit 5 + Mockito unit tests for the service layer.
 */
@ExtendWith(MockitoExtension.class)
class EmployeeServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    private Employee sampleEmployee;
    private EmployeeRequestDTO sampleRequest;

    @BeforeEach
    void setUp() {
        sampleEmployee = Employee.builder()
                .id(1L)
                .firstName("Amara")
                .lastName("Wickramasinghe")
                .email("amara.wickramasinghe@example.com")
                .department("Engineering")
                .role("Senior Software Engineer")
                .salary(new BigDecimal("125000.00"))
                .hireDate(LocalDate.of(2018, 3, 14))
                .build();

        sampleRequest = new EmployeeRequestDTO(
                "Amara",
                "Wickramasinghe",
                "amara.wickramasinghe@example.com",
                "Engineering",
                "Senior Software Engineer",
                new BigDecimal("125000.00"),
                LocalDate.of(2018, 3, 14)
        );
    }

    @Test
    void createEmployee_savesAndReturnsMappedResponse_whenEmailIsUnique() {
        when(employeeRepository.existsByEmail(sampleRequest.getEmail())).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenReturn(sampleEmployee);

        EmployeeResponseDTO result = employeeService.createEmployee(sampleRequest);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getEmail()).isEqualTo("amara.wickramasinghe@example.com");
        verify(employeeRepository).save(any(Employee.class));
    }

    @Test
    void createEmployee_throwsDuplicateResourceException_whenEmailAlreadyExists() {
        when(employeeRepository.existsByEmail(sampleRequest.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> employeeService.createEmployee(sampleRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining(sampleRequest.getEmail());

        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    void getEmployeeById_returnsMappedEmployee_whenFound() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(sampleEmployee));

        EmployeeResponseDTO result = employeeService.getEmployeeById(1L);

        assertThat(result.getFirstName()).isEqualTo("Amara");
    }

    @Test
    void getEmployeeById_throwsResourceNotFoundException_whenMissing() {
        when(employeeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.getEmployeeById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void updateEmployee_updatesFieldsAndSaves_whenEmployeeExistsAndEmailUnchanged() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(sampleEmployee));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(inv -> inv.getArgument(0));

        EmployeeRequestDTO updateRequest = new EmployeeRequestDTO(
                "Amara", "Wickramasinghe", "amara.wickramasinghe@example.com",
                "Engineering", "Engineering Manager", new BigDecimal("140000.00"), LocalDate.of(2018, 3, 14));

        EmployeeResponseDTO result = employeeService.updateEmployee(1L, updateRequest);

        assertThat(result.getRole()).isEqualTo("Engineering Manager");
        assertThat(result.getSalary()).isEqualByComparingTo("140000.00");
    }

    @Test
    void updateEmployee_throwsResourceNotFoundException_whenEmployeeMissing() {
        when(employeeRepository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.updateEmployee(42L, sampleRequest))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateEmployee_throwsDuplicateResourceException_whenNewEmailBelongsToAnotherEmployee() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(sampleEmployee));
        when(employeeRepository.existsByEmail("taken@example.com")).thenReturn(true);

        EmployeeRequestDTO updateRequest = new EmployeeRequestDTO(
                "Amara", "Wickramasinghe", "taken@example.com",
                "Engineering", "Senior Software Engineer", new BigDecimal("125000.00"), LocalDate.of(2018, 3, 14));

        assertThatThrownBy(() -> employeeService.updateEmployee(1L, updateRequest))
                .isInstanceOf(DuplicateResourceException.class);

        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    void deleteEmployee_deletesById_whenEmployeeExists() {
        when(employeeRepository.existsById(1L)).thenReturn(true);

        employeeService.deleteEmployee(1L);

        verify(employeeRepository).deleteById(1L);
    }

    @Test
    void deleteEmployee_throwsResourceNotFoundException_whenEmployeeMissing() {
        when(employeeRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> employeeService.deleteEmployee(99L))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(employeeRepository, never()).deleteById(anyLong());
    }

    @Test
    void getAllEmployees_returnsMappedPage_whenSearchIsBlank() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Employee> page = new PageImpl<>(List.of(sampleEmployee), pageable, 1);

        when(employeeRepository.findAll(any(Pageable.class))).thenReturn(page);

        Page<EmployeeResponseDTO> result = employeeService.getAllEmployees("", 0, 10, "id", "asc");

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getEmail()).isEqualTo(sampleEmployee.getEmail());
    }

    @Test
    void avgSalaryByDepartment_computesAverageAndSkipsRecordsMissingDepartmentOrSalary() {
        Employee noDept = Employee.builder().id(2L).firstName("X").lastName("Y")
                .email("x@example.com").salary(new BigDecimal("50000")).build();
        Employee noSalary = Employee.builder().id(3L).firstName("A").lastName("B")
                .email("a@example.com").department("Engineering").build();
        Employee secondEngineer = Employee.builder().id(4L).firstName("C").lastName("D")
                .email("c@example.com").department("Engineering").salary(new BigDecimal("75000.00")).build();

        when(employeeRepository.findAll())
                .thenReturn(List.of(sampleEmployee, noDept, noSalary, secondEngineer));

        Map<String, BigDecimal> result = employeeService.avgSalaryByDepartment();

        // (125000.00 + 75000.00) / 2 = 100000.00
        assertThat(result.get("Engineering")).isEqualByComparingTo("100000.00");
        assertThat(result).doesNotContainKey(null);
    }

    @Test
    void avgSalaryByDepartment_returnsEmptyMap_whenNoEmployees() {
        when(employeeRepository.findAll()).thenReturn(List.of());

        Map<String, BigDecimal> result = employeeService.avgSalaryByDepartment();

        assertThat(result).isEmpty();
    }
}
