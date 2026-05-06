package com.taskmanager.service;

import com.taskmanager.dto.DTOs.*;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import com.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired private TaskRepository taskRepository;
    @Autowired private ProjectService projectService;
    @Autowired private TaskService taskService;

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
            dto.setTotalTasks(taskRepository.countTasksForUser(currentUser.getId()));
            dto.setTodoTasks(taskRepository.countTasksByStatusForUser(currentUser.getId(), Task.Status.TODO));
            dto.setInProgressTasks(taskRepository.countTasksByStatusForUser(currentUser.getId(), Task.Status.IN_PROGRESS));
            dto.setDoneTasks(taskRepository.countTasksByStatusForUser(currentUser.getId(), Task.Status.DONE));

            List<Task> overdueTasks = taskRepository.findOverdueTasksForUser(currentUser.getId(), LocalDate.now());
            dto.setOverdueTasks(overdueTasks.size());
        }

        List<TaskDTO> recentTasks = taskRepository.findByAssignee(currentUser).stream()
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