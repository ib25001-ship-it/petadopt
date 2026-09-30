CREATE TABLE CATEGORIA (
                           id_categoria INT PRIMARY KEY AUTO_INCREMENT,
                           nombre VARCHAR(50) NOT NULL
);

CREATE TABLE MASCOTA (
                         id_mascota INT PRIMARY KEY AUTO_INCREMENT,
                         id_categoria INT,
                         nombre VARCHAR(50) NOT NULL,
                         raza VARCHAR(50),
                         edad INT,
                         sexo VARCHAR(10),
                         estado VARCHAR(20),
                         FOREIGN KEY (id_categoria) REFERENCES CATEGORIA(id_categoria)
);

CREATE TABLE USUARIO (
                         id_usuario INT PRIMARY KEY AUTO_INCREMENT,
                         nombre VARCHAR(100) NOT NULL,
                         correo VARCHAR(100) UNIQUE NOT NULL,
                         telefono VARCHAR(20),
                         direccion VARCHAR(150)
);

CREATE TABLE SOLICITUD_ADOPCION (
                                    id_solicitud INT PRIMARY KEY AUTO_INCREMENT,
                                    id_mascota INT,
                                    id_usuario INT,
                                    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
                                    motivo TEXT,
                                    estado_solicitud VARCHAR(20),
                                    FOREIGN KEY (id_mascota) REFERENCES MASCOTA(id_mascota),
                                    FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario)
);

CREATE TABLE SEGUIMIENTO (
                             id_seguimiento INT PRIMARY KEY AUTO_INCREMENT,
                             id_solicitud INT,
                             fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
                             observaciones TEXT,
                             estado_mascota VARCHAR(50),
                             FOREIGN KEY (id_solicitud) REFERENCES SOLICITUD_ADOPCION(id_solicitud)
);