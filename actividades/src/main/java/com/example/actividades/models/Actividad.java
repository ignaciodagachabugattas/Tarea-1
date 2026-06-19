package com.example.actividades.models;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;



@Entity
@Table(name = "actividad")
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_actividad", nullable = false, length = 100)
    private String nombreActividad;

    @Column(name = "tipo_actividad", nullable = false, length = 50)
    private String tipoActividad;

    @Column(nullable = false, length = 100)
    private String horario;

    @Column(nullable = false, length = 100)
    private String lugar;

    @Column(name = "ruta_archivo", nullable = false, length = 255)
    private String rutaArchivo;

    @Column(nullable = false, length = 255)
    private String enlace;

    // Relación con el Miembro creador
    @ManyToOne
    @JoinColumn(name = "miembro_id", nullable = false)
    private Miembro creador;

// Relación con las Notas (la nueva tabla)
    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL)
    private List<Nota> notas = new java.util.ArrayList<>();

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombreActividad() { return nombreActividad; }
    public void setNombreActividad(String nombreActividad) { this.nombreActividad = nombreActividad; }
    public String getTipoActividad() { return tipoActividad; }
    public void setTipoActividad(String tipoActividad) { this.tipoActividad = tipoActividad; }
    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
    public String getLugar() { return lugar; }
    public void setLugar(String lugar) { this.lugar = lugar; }
    public String getRutaArchivo() { return rutaArchivo; }
    public void setRutaArchivo(String rutaArchivo) { this.rutaArchivo = rutaArchivo; }
    public String getEnlace() { return enlace; }
    public void setEnlace(String enlace) { this.enlace = enlace; }
    public Miembro getCreador() { return creador; }
    public void setCreador(Miembro creador) { this.creador = creador; }
    public List<Nota> getNotas() { return notas; }
    public void setNotas(List<Nota> notas) { this.notas = notas; }
}