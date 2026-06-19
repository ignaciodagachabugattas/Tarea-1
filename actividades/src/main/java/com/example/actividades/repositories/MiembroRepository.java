package com.example.actividades.repositories;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.actividades.models.Miembro;
@Repository
public interface MiembroRepository extends JpaRepository<Miembro, Long> {
    @Query("SELECT FUNCTION('DATE', m.fechaRegistro), COUNT(m) FROM Miembro m GROUP BY FUNCTION('DATE', m.fechaRegistro)")
    List<Object[]> contarMiembrosPorFecha();
    List<Miembro> findByTipo(String tipo, Sort sort);
}