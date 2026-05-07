package com.taskmanager.service;

import com.taskmanager.dto.DTOs.*;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired private TaskRepository taskRepository;
    @Autowired private ProjectService projectService;
    @Autowired private TaskService taskService;

    @Transactional(readOnly = true)
    public DashboardDTO getDashboard(User currentUser) {
        DashboardDTO dto = new DashboardDTO();

        // Same logic as Projects page
        List<ProjectDTO> projects = projectService.getMyProjects(currentUser);

        dto.setTotalProjects(projects.size());

        // Task counts
        if (currentUser.getRole() == User.Role.ADMIN) {
            dto.setTotalTasks(taskRepository.count());
            dto.setTodoTasks(taskRepository.countByStatus(Task.Status.TODO));
            dto.setInProgressTasks(taskRepository.countByStatus(Task.Status.IN_PROGRESS));
            dto.setDoneTasks(taskRepository.countByStatus(Task.Status.DONE));

            List<Task> overdueTasks = taskRepository.findAllOverdueTasks(LocalDate.now());
            dto.setOverdueTasks(overdueTasks.size());
        } else {

            List<Task> userTasks = taskRepository.findByAssignee(currentUser);

            dto.setTotalTasks(userTasks.size());

            dto.setTodoTasks(
                    userTasks.stream()
                            .filter(t -> t.getStatus() == Task.Status.TODO)
                            .count()
            );

            dto.setInProgressTasks(
                    userTasks.stream()
                            .filter(t -> t.getStatus() == Task.Status.IN_PROGRESS)
                            .count()
            );

            dto.setDoneTasks(
                    userTasks.stream()
                            .filter(t -> t.getStatus() == Task.Status.DONE)
                            .count()
            );

            dto.setOverdueTasks(
                    userTasks.stream()
                            .filter(t ->
                                    t.getDueDate() != null &&
                                            t.getDueDate().isBefore(LocalDate.now()) &&
                                            t.getStatus() != Task.Status.DONE
                            )
                            .count()
            );
        }

        List<TaskDTO> recentTasks = taskRepository.findRecentTasksForUser(currentUser.getId()).stream()
                .limit(5)
                .map(taskService::toTaskDTO)
                .collect(Collectors.toList());

        dto.setRecentTasks(recentTasks);

        dto.setRecentProjects(projects.stream()
                .limit(5)
                .collect(Collectors.toList()));

        return dto;
    }
}