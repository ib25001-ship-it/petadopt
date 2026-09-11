package com.codepair.petadopt.service;

import com.codepair.petadopt.model.SolicitudAdopcion;
import com.codepair.petadopt.repository.SolicitudAdopcionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SolicitudAdopcionService {

    @Autowired
    private SolicitudAdopcionRepository solicitudRepository;

    public List<SolicitudAdopcion> obtenerTodas() {
        return solicitudRepository.findAll();
    }

    public SolicitudAdopcion guardar(SolicitudAdopcion solicitud) {
        return solicitudRepository.save(solicitud);
    }

    public SolicitudAdopcion obtenerPorId(Integer id) {
        return solicitudRepository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        solicitudRepository.deleteById(id);
    }
}