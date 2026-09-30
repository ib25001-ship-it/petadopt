package com.codepair.petadopt.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "seguimiento")
@Data
public class Seguimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate fechaSeguimiento;
    private String comentarios;
    private String estadoMascota;

    @ManyToOne
    @JoinColumn(name = "solicitud_id")
    private SolicitudAdopcion solicitudAdopcion;
}