package com.codepair.petadopt.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "mascotas")
@Data
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String especie;
    private String raza;
    private Integer edad;
    private String descripcion;
    private String estado;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
}