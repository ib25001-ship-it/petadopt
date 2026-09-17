package com.codepair.petadopt.service;

import com.codepair.petadopt.model.Seguimiento;
import com.codepair.petadopt.repository.SeguimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeguimientoService {

    @Autowired
    private SeguimientoRepository seguimientoRepository;

    public List<Seguimiento> listarTodos() {
        return seguimientoRepository.findAll();
    }

    public Optional<Seguimiento> buscarPorId(Long id) {
        return seguimientoRepository.findById(id);
    }

    public Seguimiento guardar(Seguimiento seguimiento) {
        return seguimientoRepository.save(seguimiento);
    }

    public void eliminar(Long id) {
        seguimientoRepository.deleteById(id);
    }
}