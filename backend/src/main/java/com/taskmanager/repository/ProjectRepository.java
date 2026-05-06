package com.taskmanager.repository;

import com.taskmanager.entity.Project;
import com.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByOwner(User owner);

    @Query("""
       SELECT DISTINCT p FROM Project p
       LEFT JOIN p.members m
       LEFT JOIN p.tasks t
       WHERE p.owner.id = :userId
          OR m.id = :userId
          OR t.assignee.id = :userId
       """)
    List<Project> findAllAccessibleByUser(@Param("userId") Long userId);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.members m WHERE m.id = :userId")
    List<Project> findByMember(@Param("userId") Long userId);
}