package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssignee(User assignee);
    List<Task> findByAssigneeIsNotNull();

    long countByStatus(Task.Status status);

    @Query("SELECT t FROM Task t WHERE t.dueDate < :today AND t.status != 'DONE'")
    List<Task> findAllOverdueTasks(@Param("today") LocalDate today);

    @Query("SELECT t FROM Task t WHERE t.assignee = :user AND t.dueDate < :today AND t.status != 'DONE'")
    List<Task> findOverdueTasksByUser(@Param("user") User user, @Param("today") LocalDate today);

    @Query("SELECT DISTINCT t FROM Task t JOIN t.project p LEFT JOIN p.members m WHERE (p.owner.id = :userId OR m.id = :userId) AND t.dueDate < :today AND t.status != 'DONE'")
    List<Task> findOverdueTasksForUser(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignee.id = :userId")
    long countTasksForUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignee.id = :userId AND t.status = :status")
    long countTasksByStatusForUser(@Param("userId") Long userId, @Param("status") Task.Status status);
}