package com.codepair.petadopt.service;

import com.codepair.petadopt.model.Mascota;
import com.codepair.petadopt.repository.MascotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MascotaService {

    @Autowired
    private MascotaRepository mascotaRepository;

    public List<Mascota> obtenerTodas() {
        return mascotaRepository.findAll();
    }

    public Mascota guardar(Mascota mascota) {
        return mascotaRepository.save(mascota);
    }

    public Mascota obtenerPorId(Integer id) {
        return mascotaRepository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        mascotaRepository.deleteById(id);
    }
}