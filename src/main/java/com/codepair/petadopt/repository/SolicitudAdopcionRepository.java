// SolicitudAdopcionRepository.java
package com.codepair.petadopt.repository;

import com.codepair.petadopt.model.SolicitudAdopcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SolicitudAdopcionRepository extends JpaRepository<SolicitudAdopcion, Integer> {
}