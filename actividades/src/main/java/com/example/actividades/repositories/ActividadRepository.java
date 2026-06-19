package com.example.actividades.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.actividades.models.Actividad;

public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    @Query("SELECT a.tipoActividad, COUNT(a) FROM Actividad a GROUP BY a.tipoActividad")
    List<Object[]> contarActividadesPorTipo();
    
    @Query("SELECT a FROM Actividad a WHERE LOWER(a.nombreActividad) LIKE LOWER(CONCAT('%', :texto, '%')) OR LOWER(a.creador.comuna.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Actividad> buscarPorNombreOComuna(@Param("texto") String texto);
    @Query("SELECT a.creador.comuna.nombre, COUNT(a) FROM Actividad a GROUP BY a.creador.comuna.nombre")
    List<Object[]> contarActividadesPorComuna();
    @Query("SELECT a FROM Actividad a WHERE " +
           "LOWER(a.nombreActividad) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(a.lugar) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
           "LOWER(a.creador.comuna.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Actividad> buscarPorPatron(@Param("texto") String texto);
}