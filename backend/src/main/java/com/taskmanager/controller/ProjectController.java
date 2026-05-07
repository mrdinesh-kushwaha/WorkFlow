package com.taskmanager.controller;

import com.taskmanager.dto.DTOs.*;
import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;
import com.taskmanager.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired private ProjectService projectService;
    @Autowired private UserRepository userRepository;

    private User getCurrentUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getProjects(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(projectService.getMyProjects(getCurrentUser(ud)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProject(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(projectService.getProject(id, getCurrentUser(ud)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectRequest request,
                                                     @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(projectService.createProject(request, getCurrentUser(ud)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id,
                                                     @Valid @RequestBody ProjectRequest request,
                                                     @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(projectService.updateProject(id, request, getCurrentUser(ud)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        projectService.deleteProject(id, getCurrentUser(ud));
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/members/{userId}")
    public ResponseEntity<ProjectDTO> addMember(@PathVariable Long id, @PathVariable Long userId,
                                                 @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(projectService.addMember(id, userId, getCurrentUser(ud)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<ProjectDTO> removeMember(@PathVariable Long id, @PathVariable Long userId,
                                                    @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(projectService.removeMember(id, userId, getCurrentUser(ud)));
    }
}
