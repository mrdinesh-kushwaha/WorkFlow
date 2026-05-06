package com.taskmanager.service;

import com.taskmanager.dto.DTOs.*;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    @Autowired private TaskRepository taskRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AuthService authService;

    public List<TaskDTO> getTasksByProject(Long projectId, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        verifyProjectAccess(project, currentUser);

        return taskRepository.findByProjectId(projectId).stream()
                .filter(task ->
                        currentUser.getRole() == User.Role.ADMIN ||
                                project.getOwner().getId().equals(currentUser.getId()) ||
                                task.getCreatedBy().getId().equals(currentUser.getId()) ||
                                (task.getAssignee() != null && task.getAssignee().getId().equals(currentUser.getId()))
                )
                .map(this::toTaskDTO)
                .collect(Collectors.toList());
    }

    public TaskDTO getTask(Long taskId, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        verifyProjectAccess(task.getProject(), currentUser);
        return toTaskDTO(task);
    }

    public TaskDTO createTask(Long projectId, TaskRequest request, User currentUser) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        verifyProjectAccess(project, currentUser);

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : Task.Status.TODO);
        task.setPriority(request.getPriority() != null ? request.getPriority() : Task.Priority.MEDIUM);
        task.setDueDate(request.getDueDate());
        task.setProject(project);
        task.setCreatedBy(currentUser);

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignee(assignee);
        }

        return toTaskDTO(taskRepository.save(task));
    }

    public TaskDTO updateTask(Long taskId, TaskRequest request, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        verifyProjectAccess(task.getProject(), currentUser);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) task.setStatus(request.getStatus());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            task.setAssignee(assignee);
        } else {
            task.setAssignee(null);
        }

        return toTaskDTO(taskRepository.save(task));
    }

    public TaskDTO updateTaskStatus(Long taskId, Task.Status status, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        verifyProjectAccess(task.getProject(), currentUser);
        task.setStatus(status);
        return toTaskDTO(taskRepository.save(task));
    }

    public void deleteTask(Long taskId, User currentUser) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        boolean isCreator = task.getCreatedBy().getId().equals(currentUser.getId());

        if (!isAdmin && !isCreator) {
            throw new RuntimeException("Only admin or task creator can delete task");
        }
        task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        verifyProjectAccess(task.getProject(), currentUser);
        taskRepository.delete(task);
    }

    public List<TaskDTO> getMyTasks(User currentUser) {
        return taskRepository.findByAssignee(currentUser).stream()
                .map(this::toTaskDTO).collect(Collectors.toList());
    }

    private void verifyProjectAccess(Project project, User currentUser) {
        if (currentUser.getRole() == User.Role.ADMIN) return;
        boolean hasAccess = project.getOwner().getId().equals(currentUser.getId()) ||
                project.getMembers().stream().anyMatch(m -> m.getId().equals(currentUser.getId()));
        if (!hasAccess) throw new RuntimeException("Access denied to this project");
    }

    public TaskDTO toTaskDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        dto.setOverdue(task.getDueDate() != null && task.getDueDate().isBefore(LocalDate.now()) && task.getStatus() != Task.Status.DONE);
        dto.setAssignee(authService.toUserDTO(task.getAssignee()));
        dto.setCreatedBy(authService.toUserDTO(task.getCreatedBy()));
        dto.setProjectId(task.getProject().getId());
        dto.setProjectName(task.getProject().getName());
        dto.setCreatedAt(task.getCreatedAt());
        return dto;
    }
}
