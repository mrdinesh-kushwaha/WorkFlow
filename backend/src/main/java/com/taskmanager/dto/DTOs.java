package com.taskmanager.dto;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class DTOs {

    // Auth DTOs
    @Data
    public static class SignupRequest {
        @NotBlank
        private String name;
        @Email @NotBlank
        private String email;
        @NotBlank @Size(min = 6)
        private String password;
        private User.Role role = User.Role.MEMBER;
    }

    @Data
    public static class LoginRequest {
        @Email @NotBlank
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private UserDTO user;
        public AuthResponse(String token, UserDTO user) {
            this.token = token;
            this.user = user;
        }
    }

    // User DTO
    @Data
    public static class UserDTO {
        private Long id;
        private String name;
        private String email;
        private User.Role role;
        private LocalDateTime createdAt;
    }

    // Project DTOs
    @Data
    public static class ProjectRequest {
        @NotBlank
        private String name;
        private String description;
    }

    @Data
    public static class ProjectDTO {
        private Long id;
        private String name;
        private String description;
        private String status;
        private UserDTO owner;
        private List<UserDTO> members;
        private int taskCount;
        private LocalDateTime createdAt;
    }

    // Task DTOs
    @Data
    public static class TaskRequest {
        @NotBlank
        private String title;
        private String description;
        private Task.Status status;
        private Task.Priority priority;
        private LocalDate dueDate;
        private Long assigneeId;
    }

    @Data
    public static class TaskDTO {
        private Long id;
        private String title;
        private String description;
        private Task.Status status;
        private Task.Priority priority;
        private LocalDate dueDate;
        private boolean overdue;
        private UserDTO assignee;
        private UserDTO createdBy;
        private Long projectId;
        private String projectName;
        private LocalDateTime createdAt;
    }

    // Dashboard DTO
    @Data
    public static class DashboardDTO {
        private long totalProjects;
        private long totalTasks;
        private long todoTasks;
        private long inProgressTasks;
        private long doneTasks;
        private long overdueTasks;
        private List<TaskDTO> recentTasks;
        private List<ProjectDTO> recentProjects;
    }
}
