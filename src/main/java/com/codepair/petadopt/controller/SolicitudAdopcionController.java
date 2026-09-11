package com.codepair.petadopt.controller;

import com.codepair.petadopt.model.SolicitudAdopcion;
import com.codepair.petadopt.service.SolicitudAdopcionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudAdopcionController {

    @Autowired
    private SolicitudAdopcionService solicitudService;

    @GetMapping
    public List<SolicitudAdopcion> obtenerTodas() {
        return solicitudService.obtenerTodas();
    }

    @PostMapping
    public SolicitudAdopcion guardar(@RequestBody SolicitudAdopcion solicitud) {
        return solicitudService.guardar(solicitud);
    }

    @GetMapping("/{id}")
    public SolicitudAdopcion obtenerPorId(@PathVariable Integer id) {
        return solicitudService.obtenerPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        solicitudService.eliminar(id);
    }
}