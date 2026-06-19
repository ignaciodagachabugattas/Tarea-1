package com.example.actividades.controllers;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.actividades.models.Actividad;
import com.example.actividades.models.Comentario;
import com.example.actividades.models.Miembro;
import com.example.actividades.models.Nota;
import com.example.actividades.repositories.ActividadRepository;
import com.example.actividades.repositories.ComentarioRepository;
import com.example.actividades.repositories.NotaRepository;

@CrossOrigin(origins = "*") 
@RestController
@RequestMapping("/api")
public class ActividadController {

    @Autowired
    private ActividadRepository actividadRepository;

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private com.example.actividades.repositories.MiembroRepository miembroRepository;


    private List<Map<String, Object>> mapearActividades(List<Actividad> actividades) {
        List<Map<String, Object>> resultados = new ArrayList<>();
        for (Actividad a : actividades) {
            Map<String, Object> dto = new HashMap<>();
            
            dto.put("id", a.getId());
            dto.put("nombre_actividad", a.getNombreActividad());
            dto.put("lugar", a.getLugar());
            dto.put("horario", a.getHorario());
            dto.put("tipo_actividad", a.getTipoActividad());
            dto.put("ruta_archivo", a.getRutaArchivo());
            dto.put("enlace", a.getEnlace());
            dto.put("miembro_nombre", a.getCreador() != null ? a.getCreador().getNombre() : "N/A");
            dto.put("miembro_id", a.getCreador() != null ? a.getCreador().getId() : null);
            
            Map<String, Object> creadorMap = new HashMap<>();
            if (a.getCreador() != null) {
                creadorMap.put("id", a.getCreador().getId());
                creadorMap.put("nombre", a.getCreador().getNombre());
                
                Map<String, Object> comunaMap = new HashMap<>();
                if (a.getCreador().getComuna() != null) {
                    comunaMap.put("id", a.getCreador().getComuna().getId());
                    comunaMap.put("nombre", a.getCreador().getComuna().getNombre());
                } else {
                    comunaMap.put("nombre", "Sin comuna");
                }
                creadorMap.put("comuna", comunaMap);
            }
            dto.put("creador", creadorMap);

            List<Map<String, Object>> notasLista = new ArrayList<>();
            if (a.getNotas() != null) {
                for (Nota n : a.getNotas()) {
                    Map<String, Object> notaMap = new HashMap<>();
                    notaMap.put("id", n.getId());
                    notaMap.put("valor", n.getValor());
                    notasLista.add(notaMap);
                }
            }
            dto.put("notas", notasLista);

            resultados.add(dto);
        }
        return resultados;
    }


    @GetMapping("/actividades")
    public ResponseEntity<List<Map<String, Object>>> obtenerTodasLasActividades(
            @RequestParam(value = "tipo", required = false) String tipo,
            @RequestParam(value = "sort", required = false) String sort) {
        
        List<Actividad> actividades = actividadRepository.findAll();

        if (tipo != null && !tipo.trim().isEmpty()) {
            String tipoBuscado = Normalizer.normalize(tipo.trim(), Normalizer.Form.NFD)
                    .replaceAll("\\p{M}", "")
                    .toLowerCase();

            actividades = actividades.stream()
                .filter(a -> {
                    if (a.getTipoActividad() == null) return false;
                    String tipoBD = Normalizer.normalize(a.getTipoActividad().trim(), Normalizer.Form.NFD)
                            .replaceAll("\\p{M}", "")
                            .toLowerCase();
                    return tipoBD.equals(tipoBuscado) || tipoBD.contains(tipoBuscado);
                })
                .toList();
        }

        if (sort != null && !sort.trim().isEmpty()) {
            if (sort.equalsIgnoreCase("nombre")) {
                actividades = actividades.stream()
                    .sorted((a1, a2) -> {
                        String n1 = a1.getNombreActividad() != null ? a1.getNombreActividad() : "";
                        String n2 = a2.getNombreActividad() != null ? a2.getNombreActividad() : "";
                        return n1.compareToIgnoreCase(n2);
                    })
                    .toList();
            } else if (sort.equalsIgnoreCase("tipo")) {
                actividades = actividades.stream()
                    .sorted((a1, a2) -> {
                        String t1 = a1.getTipoActividad() != null ? a1.getTipoActividad() : "";
                        String t2 = a2.getTipoActividad() != null ? a2.getTipoActividad() : "";
                        return t1.compareToIgnoreCase(t2);
                    })
                    .toList();
            }
        }

        return ResponseEntity.ok(mapearActividades(actividades));
    }


    @GetMapping("/actividades/buscar")
    public ResponseEntity<List<Map<String, Object>>> buscarActividades(@RequestParam("q") String q) {
        if (q == null || q.length() < 3) {
            return ResponseEntity.badRequest().build();
        }
        List<Actividad> resultados = actividadRepository.buscarPorNombreOComuna(q);
        return ResponseEntity.ok(mapearActividades(resultados));
    }


    @PostMapping("/actividades/{id}/evaluar")
    public ResponseEntity<?> evaluarActividad(@PathVariable Long id, @RequestParam Integer valor) {
        if (valor == null || valor < 1 || valor > 7) {
            return ResponseEntity.badRequest().body("La nota debe ser un número entero entre 1 y 7.");
        }

        Optional<Actividad> actividadOpt = actividadRepository.findById(id);
        if (actividadOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Actividad actividad = actividadOpt.get();

            Nota nuevaNota = new Nota();
            nuevaNota.setValor(valor);
            nuevaNota.setActividad(actividad); 

            if (actividad.getNotas() == null) {
                actividad.setNotas(new ArrayList<>());
            }
            actividad.getNotas().add(nuevaNota);

            notaRepository.save(nuevaNota); 
            
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("status", "success");
            respuesta.put("mensaje", "¡Nota agregada exitosamente!");
            
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.internalServerError().body("Error interno en el servidor: " + e.getMessage());
        }
    }


    @PostMapping(value = "/actividades", consumes = {"multipart/form-data"})
    public ResponseEntity<?> crearActividad(
            @RequestParam("nombreActividad") String nombreActividad,
            @RequestParam("tipoActividad") String tipoActividad,
            @RequestParam("lugar") String lugar,
            @RequestParam("enlace") String enlace,
            @RequestParam("horario") String horario,
            @RequestParam("creadorId") Long creadorId,
            @RequestParam(value = "archivo", required = false) org.springframework.web.multipart.MultipartFile archivo) {
        
        try {
            Actividad nuevaActividad = new Actividad();
            nuevaActividad.setNombreActividad(nombreActividad);
            nuevaActividad.setTipoActividad(tipoActividad);
            nuevaActividad.setLugar(lugar);
            nuevaActividad.setEnlace(enlace);
            nuevaActividad.setHorario(horario);
            
            Miembro creador = new Miembro();
            creador.setId(creadorId);
            nuevaActividad.setCreador(creador);

            if (archivo != null && !archivo.isEmpty()) {
                String nombreOriginal = org.springframework.util.StringUtils.cleanPath(archivo.getOriginalFilename());
                String nombreSeguro = java.util.UUID.randomUUID().toString() + "_" + nombreOriginal;
                
                java.nio.file.Path rutaDirectorio = java.nio.file.Paths.get("uploads");
                
                if (!java.nio.file.Files.exists(rutaDirectorio)) {
                    java.nio.file.Files.createDirectories(rutaDirectorio);
                }
                
                java.nio.file.Path rutaArchivo = rutaDirectorio.resolve(nombreSeguro);
                java.nio.file.Files.copy(archivo.getInputStream(), rutaArchivo, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                
                nuevaActividad.setRutaArchivo(nombreSeguro);
            }
            
            return ResponseEntity.ok(actividadRepository.save(nuevaActividad));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/actividades/{id}/comentarios")
    public ResponseEntity<List<Comentario>> obtenerComentarios(@PathVariable Long id) {
        return ResponseEntity.ok(comentarioRepository.findByActividadId(id));
    }

    @PostMapping("/actividades/{id}/comentarios")
    public ResponseEntity<?> agregarComentario(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Actividad> actOpt = actividadRepository.findById(id);
        if (actOpt.isEmpty()) return ResponseEntity.notFound().build();

        Comentario c = new Comentario();
        c.setNombre(payload.get("nombre"));
        c.setTexto(payload.get("texto"));
        c.setActividad(actOpt.get());
        
        comentarioRepository.save(c);
        return ResponseEntity.status(201).build();
    }


    @GetMapping("/actividades/{id}")
    public ResponseEntity<Actividad> obtenerDetalleActividad(@PathVariable Long id) {
        Optional<Actividad> actividad = actividadRepository.findById(id);
        if (actividad.isPresent()) {
            return ResponseEntity.ok(actividad.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/miembros/{id}")
    public ResponseEntity<Miembro> obtenerDetalleMiembro(@PathVariable Long id) {
        return miembroRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}