package com.codepair.petadopt.controller;

import com.codepair.petadopt.model.Seguimiento;
import com.codepair.petadopt.service.SeguimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/seguimientos")
public class SeguimientoController {
    @Autowired
    private SeguimientoService seguimientoService;

    @GetMapping
    public List<Seguimiento> listar() { return seguimientoService.listarTodos(); }

    @GetMapping("/{id}")
    public ResponseEntity<Seguimiento> buscarPorId(@PathVariable Long id) {
        return seguimientoService.buscarPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Seguimiento guardar(@RequestBody Seguimiento seguimiento) { return seguimientoService.guardar(seguimiento); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (seguimientoService.buscarPorId(id).isPresent()) {
            seguimientoService.eliminar(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}