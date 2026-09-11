package com.codepair.petadopt.service;

import com.codepair.petadopt.model.Seguimiento;
import com.codepair.petadopt.repository.SeguimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SeguimientoService {

    @Autowired
    private SeguimientoRepository seguimientoRepository;

    public List<Seguimiento> obtenerTodos() {
        return seguimientoRepository.findAll();
    }

    public Seguimiento guardar(Seguimiento seguimiento) {
        return seguimientoRepository.save(seguimiento);
    }

    public Seguimiento obtenerPorId(Integer id) {
        return seguimientoRepository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        seguimientoRepository.deleteById(id);
    }
}