package com.codepair.petadopt.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "solicitudes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long mascotaId;
    private String nombreAdoptante;
    private String telefono;
    private String direccion;
    private String motivoAdopcion;
    private String estado;
}