package com.codepair.petadopt.service;

import com.codepair.petadopt.model.SolicitudAdopcion;
import com.codepair.petadopt.repository.SolicitudAdopcionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SolicitudAdopcionService {

    @Autowired
    private SolicitudAdopcionRepository solicitudAdopcionRepository;

    public List<SolicitudAdopcion> listarTodos() {
        return solicitudAdopcionRepository.findAll();
    }

    public Optional<SolicitudAdopcion> buscarPorId(Long id) {
        return solicitudAdopcionRepository.findById(id);
    }

    public SolicitudAdopcion guardar(SolicitudAdopcion solicitud) {
        return solicitudAdopcionRepository.save(solicitud);
    }

    public void eliminar(Long id) {
        solicitudAdopcionRepository.deleteById(id);
    }
}