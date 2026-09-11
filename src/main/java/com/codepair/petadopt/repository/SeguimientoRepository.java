// SeguimientoRepository.java
package com.codepair.petadopt.repository;

import com.codepair.petadopt.model.Seguimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeguimientoRepository extends JpaRepository<Seguimiento, Integer> {
}