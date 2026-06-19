package com.example.actividades.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.actividades.repositories.ActividadRepository;
import com.example.actividades.repositories.MiembroRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class EstadisticasController {

    @Autowired
    private MiembroRepository miembroRepository;

    @Autowired
    private ActividadRepository actividadRepository;

    @GetMapping("/datos-graficos")
    public ResponseEntity<Map<String, Object>> obtenerDatosGraficos() {
        Map<String, Object> respuesta = new HashMap<>();

        List<Object[]> datosLineas = miembroRepository.contarMiembrosPorFecha();
        
        List<Object[]> datosTorta = actividadRepository.contarActividadesPorTipo();
        
        List<Object[]> datosBarras = actividadRepository.contarActividadesPorComuna();

        respuesta.put("lineas", armarEstructuraHighcharts(datosLineas));
        respuesta.put("torta", armarEstructuraHighcharts(datosTorta));
        respuesta.put("barras", armarEstructuraHighcharts(datosBarras));

        return ResponseEntity.ok(respuesta);
    }

    private Map<String, Object> armarEstructuraHighcharts(List<Object[]> resultadosBD) {
        Map<String, Object> mapa = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Long> data = new ArrayList<>();

        for (Object[] fila : resultadosBD) {
            labels.add(fila[0] != null ? fila[0].toString() : "Desconocido");
            
            data.add(((Number) fila[1]).longValue());
        }

        mapa.put("labels", labels);
        mapa.put("data", data);
        return mapa;
    }
}