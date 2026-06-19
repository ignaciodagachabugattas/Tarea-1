package com.example.actividades.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.actividades.models.Nota;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {
}