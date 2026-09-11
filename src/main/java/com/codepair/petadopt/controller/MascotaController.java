package com.codepair.petadopt.controller;

import com.codepair.petadopt.model.Mascota;
import com.codepair.petadopt.service.MascotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    @Autowired
    private MascotaService mascotaService;

    @GetMapping
    public List<Mascota> obtenerTodas() {
        return mascotaService.obtenerTodas();
    }

    @PostMapping
    public Mascota guardar(@RequestBody Mascota mascota) {
        return mascotaService.guardar(mascota);
    }

    @GetMapping("/{id}")
    public Mascota obtenerPorId(@PathVariable Integer id) {
        return mascotaService.obtenerPorId(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        mascotaService.eliminar(id);
    }
}