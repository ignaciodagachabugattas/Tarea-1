package com.example.actividades.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.actividades.models.Comentario;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByActividadId(Long actividadId);
}