package com.codepair.petadopt.controller;

import com.codepair.petadopt.model.Seguimiento;
import com.codepair.petadopt.service.SeguimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/seguimientos")
public class SeguimientoController {

    @Autowired
    private SeguimientoService seguimientoService;

    @GetMapping
    public List<Seguimiento> obtenerTodos() {
        return seguimientoService.obtenerTodos();
    }

    @PostMapping
    public Seguimiento guardar(@RequestBody Seguimiento seguimiento) {
        return seguimientoService.guardar(seguimiento);
    }

    @GetMapping("/{id}")
    public Seguimiento obtenerPorId(@PathVariable Integer id) {
        return seguimientoService.obtenerPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        seguimientoService.eliminar(id);
    }
}