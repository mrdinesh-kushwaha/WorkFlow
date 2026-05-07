package com.taskmanager.controller;

import com.taskmanager.dto.DTOs.*;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TaskController {

    @Autowired private TaskService taskService;
    @Autowired private UserRepository userRepository;

    private User getCurrentUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskDTO>> getTasks(@PathVariable Long projectId,
                                                   @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(taskService.getTasksByProject(projectId, getCurrentUser(ud)));
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<TaskDTO> getTask(@PathVariable Long taskId,
                                            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(taskService.getTask(taskId, getCurrentUser(ud)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskDTO> createTask(@PathVariable Long projectId,
                                               @Valid @RequestBody TaskRequest request,
                                               @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(taskService.createTask(projectId, request, getCurrentUser(ud)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long taskId,
                                               @Valid @RequestBody TaskRequest request,
                                               @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(taskService.updateTask(taskId, request, getCurrentUser(ud)));
    }

    @PatchMapping("/tasks/{taskId}/status")
    public ResponseEntity<TaskDTO> updateStatus(@PathVariable Long taskId,
                                                 @RequestBody Map<String, String> body,
                                                 @AuthenticationPrincipal UserDetails ud) {
        Task.Status status = Task.Status.valueOf(body.get("status"));
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status, getCurrentUser(ud)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId,
                                            @AuthenticationPrincipal UserDetails ud) {
        taskService.deleteTask(taskId, getCurrentUser(ud));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tasks/my")
    public ResponseEntity<List<TaskDTO>> getMyTasks(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(taskService.getMyTasks(getCurrentUser(ud)));
    }
}
