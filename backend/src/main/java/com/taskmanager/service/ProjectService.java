package com.taskmanager.service;

import com.taskmanager.dto.DTOs.*;
import com.taskmanager.entity.Project;
import com.taskmanager.entity.User;
import com.taskmanager.repository.ProjectRepository;
import com.taskmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    @Autowired private ProjectRepository projectRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private AuthService authService;

    public List<ProjectDTO> getMyProjects(User currentUser) {
        List<Project> projects;
        if (currentUser.getRole() == User.Role.ADMIN) {
            projects = projectRepository.findAll();
        } else {
            projects = projectRepository.findAllAccessibleByUser(currentUser.getId());
        }
        return projects.stream().map(this::toProjectDTO).collect(Collectors.toList());
    }

    public ProjectDTO getProject(Long id, User currentUser) {
        Project project = findAndVerifyAccess(id, currentUser);
        return toProjectDTO(project);
    }

    public ProjectDTO createProject(ProjectRequest request, User currentUser) {
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwner(currentUser);
        project.getMembers().add(currentUser);
        return toProjectDTO(projectRepository.save(project));
    }

    public ProjectDTO updateProject(Long id, ProjectRequest request, User currentUser) {
        Project project = findAndVerifyOwner(id, currentUser);
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        return toProjectDTO(projectRepository.save(project));
    }

    public void deleteProject(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        boolean isOwner = project.getOwner().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Only admin or project owner can delete project");
        }
        project = findAndVerifyOwner(id, currentUser);
        projectRepository.delete(project);
    }

    public ProjectDTO addMember(Long projectId, Long userId, User currentUser) {
        Project project = findAndVerifyOwner(projectId, currentUser);
        User userToAdd = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!project.getMembers().contains(userToAdd)) {
            project.getMembers().add(userToAdd);
        }
        return toProjectDTO(projectRepository.save(project));
    }

    public ProjectDTO removeMember(Long projectId, Long userId, User currentUser) {
        Project project = findAndVerifyOwner(projectId, currentUser);
        project.getMembers().removeIf(m -> m.getId().equals(userId));
        return toProjectDTO(projectRepository.save(project));
    }

    private Project findAndVerifyAccess(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (currentUser.getRole() == User.Role.ADMIN) {
            return project;
        }

        boolean isOwner = project.getOwner().getId().equals(currentUser.getId());

        boolean isMember = project.getMembers().stream()
                .anyMatch(m -> m.getId().equals(currentUser.getId()));

        boolean hasAssignedTask = project.getTasks().stream()
                .anyMatch(t -> t.getAssignee() != null &&
                        t.getAssignee().getId().equals(currentUser.getId()));

        if (!isOwner && !isMember && !hasAssignedTask) {
            throw new RuntimeException("Access denied");
        }

        return project;
    }

    private Project findAndVerifyOwner(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (currentUser.getRole() == User.Role.ADMIN) return project;
        if (!project.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the project owner can perform this action");
        }
        return project;
    }

    public ProjectDTO toProjectDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setStatus(project.getStatus().name());
        dto.setOwner(authService.toUserDTO(project.getOwner()));
        dto.setMembers(project.getMembers().stream()
                .map(authService::toUserDTO).collect(Collectors.toList()));
        dto.setTaskCount(project.getTasks() != null ? project.getTasks().size() : 0);
        dto.setCreatedAt(project.getCreatedAt());
        return dto;
    }
}