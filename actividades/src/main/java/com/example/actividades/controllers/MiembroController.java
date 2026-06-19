package com.example.actividades.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.actividades.models.Miembro;
import com.example.actividades.repositories.MiembroRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class MiembroController {

    @Autowired
    private MiembroRepository miembroRepository;

    @GetMapping("/miembros")
    public ResponseEntity<List<Miembro>> obtenerTodosLosMiembros(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String sort) {
        
        Sort orden = Sort.by(Sort.Direction.ASC, "id"); // orden por defecto
        
        if (sort != null && !sort.isEmpty()) {
            if (sort.equals("fecha")) {
                orden = Sort.by(Sort.Direction.ASC, "fechaRegistro");
            } else {
                orden = Sort.by(Sort.Direction.ASC, sort);
            }
        }

        List<Miembro> miembros;

        if (tipo != null && !tipo.isEmpty()) {
            miembros = miembroRepository.findByTipo(tipo, orden);
        } else {
            miembros = miembroRepository.findAll(orden);
        }

        return ResponseEntity.ok(miembros);
    }

    @PostMapping("/miembros")
    public ResponseEntity<Miembro> crearMiembro(@RequestBody Miembro nuevoMiembro) {
        Miembro guardado = miembroRepository.save(nuevoMiembro);
        return ResponseEntity.ok(guardado);
    }
}