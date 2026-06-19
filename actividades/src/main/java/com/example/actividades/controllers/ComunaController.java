package com.example.actividades.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.actividades.models.Comuna;
import com.example.actividades.repositories.ComunaRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") 
public class ComunaController {

    @Autowired
    private ComunaRepository comunaRepository;

    @GetMapping("/comunas")
    public ResponseEntity<List<Comuna>> obtenerComunas() {
        List<Comuna> comunas = comunaRepository.findAll();
        return ResponseEntity.ok(comunas);
    }
}