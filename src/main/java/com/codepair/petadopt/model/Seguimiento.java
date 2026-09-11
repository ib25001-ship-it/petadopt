package com.codepair.petadopt.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "seguimientos")
@Data
public class Seguimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "solicitud_id")
    private SolicitudAdopcion solicitudAdopcion;
}