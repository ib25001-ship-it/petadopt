package com.codepair.petadopt.controller;

import com.codepair.petadopt.model.SolicitudAdopcion;
import com.codepair.petadopt.service.SolicitudAdopcionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudAdopcionController {

    @Autowired
    private SolicitudAdopcionService solicitudAdopcionService;

    @GetMapping
    public List<SolicitudAdopcion> listar() {
        return solicitudAdopcionService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitudAdopcion> buscarPorId(@PathVariable Long id) {
        return solicitudAdopcionService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SolicitudAdopcion guardar(@RequestBody SolicitudAdopcion solicitud) {
        return solicitudAdopcionService.guardar(solicitud);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (solicitudAdopcionService.buscarPorId(id).isPresent()) {
            solicitudAdopcionService.eliminar(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}